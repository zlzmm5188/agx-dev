import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SocialService } from './social.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, Conversation } from '../../entities';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*', // 生产环境应配置具体域名
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private readonly socialService: SocialService,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Chat Gateway 初始化完成');
  }

  handleConnection(client: Socket) {
    this.logger.log(`客户端连接: ${client.id}`);
    // 验证用户身份（这里简化处理，实际应验证token）
    const userId = client.handshake.auth?.userId;
    if (userId) {
      client.data.userId = userId;
      client.join(`user_${userId}`);
      this.logger.log(`用户 ${userId} 加入聊天`);
    } else {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`客户端断开连接: ${client.id}`);
    const userId = client.data.userId;
    if (userId) {
      client.leave(`user_${userId}`);
      this.logger.log(`用户 ${userId} 离开聊天`);
    }
  }

  @SubscribeMessage('private_message')
  async handlePrivateMessage(
    @MessageBody() data: { receiverId: number; content: string; conversationId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.userId;
    if (!senderId) {
      client.emit('error', { message: '未认证的用户' });
      return;
    }

    try {
      // 调用现有服务发送消息
      const result = await this.socialService.sendMessage(
        senderId,
        data.receiverId,
        data.content,
        1, // 文本消息
      );

      if (result.success) {
        // 获取完整消息信息
        const message = await this.messageRepo.findOne({
          where: { id: result.messageId },
          relations: ['sender'],
        });

        // 发送给发送方确认
        client.emit('message_sent', {
          success: true,
          message: {
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
            createdAt: message.createdAt,
          },
        });

        // 发送给接收方新消息通知
        this.server.to(`user_${data.receiverId}`).emit('new_message', {
          conversationId: message.conversationId,
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          createdAt: message.createdAt,
          sender: {
            id: message.sender.id,
            nickname: message.sender.nickname,
            avatar: message.sender.avatar,
          },
        });
      } else {
        client.emit('message_error', { message: result.message || '发送失败' });
      }
    } catch (error) {
      this.logger.error(`发送消息失败: ${error.message}`);
      client.emit('message_error', { message: error.message || '发送失败' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { receiverId: number; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.userId;
    if (!senderId) return;

    // 发送正在输入状态给接收方
    this.server.to(`user_${data.receiverId}`).emit('user_typing', {
      senderId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('read_message')
  async handleReadMessage(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    try {
      // 标记消息为已读
      await this.messageRepo.update(
        { conversationId: data.conversationId, receiverId: userId, isRead: 0 },
        { isRead: 1, readAt: new Date() },
      );

      // 更新会话未读数
      const conversation = await this.conversationRepo.findOne({
        where: { id: data.conversationId },
      });

      if (conversation) {
        if (conversation.userAId === userId) {
          conversation.unreadA = 0;
        } else {
          conversation.unreadB = 0;
        }
        await this.conversationRepo.save(conversation);
      }

      client.emit('message_read_ack', { success: true });
    } catch (error) {
      this.logger.error(`标记已读失败: ${error.message}`);
    }
  }

  // 发送系统消息
  sendSystemMessage(conversationId: number, content: string) {
    this.server.to(`conversation_${conversationId}`).emit('system_message', {
      conversationId,
      content,
      timestamp: new Date(),
    });
  }

  // 通知用户上线/下线
  notifyUserStatus(userId: number, isOnline: boolean) {
    this.server.to(`user_${userId}`).emit('user_status', {
      userId,
      isOnline,
      timestamp: new Date(),
    });
  }
}