import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Friend,
  FriendRequest,
  Conversation,
  Message,
  Follow,
  User,
  SystemToggle,
  LevelPermission,
} from '../../entities';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepo: Repository<Friend>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SystemToggle)
    private readonly toggleRepo: Repository<SystemToggle>,
    @InjectRepository(LevelPermission)
    private readonly permissionRepo: Repository<LevelPermission>,
  ) {}

  // ========== 功能开关检查 ==========
  async checkToggle(key: string): Promise<boolean> {
    const toggle = await this.toggleRepo.findOne({ where: { key } });
    return toggle?.enabled === 1;
  }

  async checkPermission(userId: number, permissionKey: string): Promise<{ allowed: boolean; limit?: number }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('用户不存在');

    const perm = await this.permissionRepo.findOne({
      where: { level: user.level, permissionKey },
    });

    return {
      allowed: perm?.allowed === 1,
      limit: perm?.limitValue,
    };
  }

  // ========== 关注功能 ==========
  async follow(userId: number, targetId: number): Promise<any> {
    if (userId === targetId) throw new BadRequestException('不能关注自己');

    const existing = await this.followRepo.findOne({
      where: { userId: userId, followUserId: targetId },
    });
    if (existing) throw new BadRequestException('已经关注');

    const follow = this.followRepo.create({
      userId: userId,
      followUserId: targetId,
    });
    await this.followRepo.save(follow);

    // 更新用户计数
    await this.userRepo.increment({ id: userId }, 'followingCount', 1);
    await this.userRepo.increment({ id: targetId }, 'followerCount', 1);

    // 检查是否互相关注（成为好友）
    const mutual = await this.followRepo.findOne({
      where: { userId: targetId, followUserId: userId },
    });
    if (mutual) {
      await this.createFriendship(userId, targetId);
    }

    return { success: true, isMutual: !!mutual };
  }

  async unfollow(userId: number, targetId: number): Promise<any> {
    const follow = await this.followRepo.findOne({
      where: { userId: userId, followUserId: targetId },
    });
    if (!follow) throw new BadRequestException('未关注');

    await this.followRepo.remove(follow);

    // 更新用户计数
    await this.userRepo.decrement({ id: userId }, 'followingCount', 1);
    await this.userRepo.decrement({ id: targetId }, 'followerCount', 1);

    // 解除好友关系
    await this.removeFriendship(userId, targetId);

    return { success: true };
  }

  // ========== 好友功能 ==========
  private async createFriendship(userAId: number, userBId: number): Promise<void> {
    const [smallerId, largerId] = userAId < userBId ? [userAId, userBId] : [userBId, userAId];

    const existing = await this.friendRepo.findOne({
      where: { userId: smallerId, friendId: largerId },
    });
    if (existing) return;

    const friend = this.friendRepo.create({
      userId: smallerId,
      friendId: largerId,
      status: 1,
    });
    await this.friendRepo.save(friend);

    // 更新好友计数
    await this.userRepo.increment({ id: userAId }, 'friendCount', 1);
    await this.userRepo.increment({ id: userBId }, 'friendCount', 1);
  }

  private async removeFriendship(userAId: number, userBId: number): Promise<void> {
    const [smallerId, largerId] = userAId < userBId ? [userAId, userBId] : [userBId, userAId];

    const friend = await this.friendRepo.findOne({
      where: { userId: smallerId, friendId: largerId },
    });
    if (!friend) return;

    await this.friendRepo.remove(friend);

    // 更新好友计数
    await this.userRepo.decrement({ id: userAId }, 'friendCount', 1);
    await this.userRepo.decrement({ id: userBId }, 'friendCount', 1);
  }

  async getFriends(userId: number, page = 1, limit = 20): Promise<any> {
    const qb = this.friendRepo.createQueryBuilder('f')
      .where('(f.userId = :userId OR f.friendId = :userId)', { userId })
      .andWhere('f.status = 1')
      .skip((page - 1) * limit)
      .take(limit);

    const [list, total] = await qb.getManyAndCount();

    // 获取好友用户信息
    const friendIds = list.map((f) =>
      f.userId === userId ? f.friendId : f.userId
    );
    const friends = friendIds.length
      ? await this.userRepo.findByIds(friendIds)
      : [];

    return {
      list: friends.map((u) => ({
        id: u.id,
        uid: u.uid,
        nickname: u.nickname,
        avatar: u.avatar,
        bio: u.bio,
      })),
      total,
      page,
      limit,
    };
  }

  // ========== 好友请求 ==========
  async sendFriendRequest(userId: number, targetId: number, message?: string): Promise<any> {
    // 检查全局开关
    const canAddFriend = await this.checkToggle('allow_add_friend');
    if (!canAddFriend) throw new ForbiddenException('加好友功能已关闭');

    // 检查目标用户是否允许被加好友
    const targetUser = await this.userRepo.findOne({ where: { id: targetId } });
    if (!targetUser) throw new BadRequestException('用户不存在');
    if (targetUser.canBeFriended === 0) throw new ForbiddenException('对方不接受好友请求');

    // 检查发起方权限
    const currentUser = await this.userRepo.findOne({ where: { id: userId } });
    if (currentUser.canSendFriendRequest === 0) throw new ForbiddenException('您已被禁止发起好友请求');

    // 检查是否已是好友
    const [smallerId, largerId] = userId < targetId ? [userId, targetId] : [targetId, userId];
    const existingFriend = await this.friendRepo.findOne({
      where: { userId: smallerId, friendId: largerId, status: 1 },
    });
    if (existingFriend) throw new BadRequestException('已经是好友');

    // 检查是否有待处理请求
    const pendingRequest = await this.friendRequestRepo.findOne({
      where: { fromUserId: userId, toUserId: targetId, status: 0 },
    });
    if (pendingRequest) throw new BadRequestException('已发送过请求，等待对方处理');

    const request = this.friendRequestRepo.create({
      fromUserId: userId,
      toUserId: targetId,
      message,
      status: 0,
    });
    await this.friendRequestRepo.save(request);

    return { success: true, requestId: request.id };
  }

  async handleFriendRequest(userId: number, requestId: number, accept: boolean): Promise<any> {
    const request = await this.friendRequestRepo.findOne({
      where: { id: requestId, toUserId: userId, status: 0 },
    });
    if (!request) throw new BadRequestException('请求不存在或已处理');

    request.status = accept ? 1 : 2;
    request.handledAt = new Date();
    await this.friendRequestRepo.save(request);

    if (accept) {
      // 互相关注
      await this.ensureMutualFollow(request.fromUserId, request.toUserId);
    }

    return { success: true };
  }

  private async ensureMutualFollow(userA: number, userB: number): Promise<void> {
    // 确保双向关注
    for (const [follower, following] of [[userA, userB], [userB, userA]]) {
      const existing = await this.followRepo.findOne({
        where: { userId: follower, followUserId: following },
      });
      if (!existing) {
        const follow = this.followRepo.create({ userId: follower, followUserId: following });
        await this.followRepo.save(follow);
        await this.userRepo.increment({ id: follower }, 'followingCount', 1);
        await this.userRepo.increment({ id: following }, 'followerCount', 1);
      }
    }
    await this.createFriendship(userA, userB);
  }

  // ========== 私聊功能 ==========
  async getConversations(userId: number, page = 1, limit = 20): Promise<any> {
    const qb = this.conversationRepo.createQueryBuilder('c')
      .where('(c.userAId = :userId OR c.userBId = :userId)', { userId })
      .andWhere('c.status = 1')
      .orderBy('c.lastMessageAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [list, total] = await qb.getManyAndCount();

    // 获取对方用户信息
    const otherUserIds = list.map((c) =>
      c.userAId === userId ? c.userBId : c.userAId
    );
    const users = otherUserIds.length
      ? await this.userRepo.findByIds(otherUserIds)
      : [];
    const userMap = new Map(users.map((u) => [u.id, u]));

    return {
      list: list.map((c) => {
        const otherId = c.userAId === userId ? c.userBId : c.userAId;
        const otherUser = userMap.get(otherId);
        const unread = c.userAId === userId ? c.unreadA : c.unreadB;
        return {
          id: c.id,
          otherUser: otherUser ? {
            id: otherUser.id,
            nickname: otherUser.nickname,
            avatar: otherUser.avatar,
          } : null,
          lastMessage: c.lastMessageText,
          lastMessageAt: c.lastMessageAt,
          unread,
        };
      }),
      total,
      page,
      limit,
    };
  }

  async getMessages(userId: number, conversationId: number, page = 1, limit = 50): Promise<any> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new BadRequestException('会话不存在');
    if (conversation.userAId !== userId && conversation.userBId !== userId) {
      throw new ForbiddenException('无权访问此会话');
    }

    const [list, total] = await this.messageRepo.findAndCount({
      where: { conversationId, status: 1 },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 标记已读
    await this.messageRepo.update(
      { conversationId, receiverId: userId, isRead: 0 },
      { isRead: 1, readAt: new Date() }
    );

    // 重置未读数
    if (conversation.userAId === userId) {
      conversation.unreadA = 0;
    } else {
      conversation.unreadB = 0;
    }
    await this.conversationRepo.save(conversation);

    return { list: list.reverse(), total, page, limit };
  }

  async sendMessage(senderId: number, receiverId: number, content: string, msgType = 1): Promise<any> {
    // 检查全局开关
    const canChat = await this.checkToggle('allow_chat');
    if (!canChat) throw new ForbiddenException('私聊功能已关闭');

    // 检查发送方权限
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    if (sender.canChat === 0) throw new ForbiddenException('您已被禁止私聊');

    // 检查是否是好友
    const [smallerId, largerId] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];
    const friend = await this.friendRepo.findOne({
      where: { userId: smallerId, friendId: largerId, status: 1 },
    });
    if (!friend) throw new ForbiddenException('只能给好友发消息');

    // 获取或创建会话
    let conversation = await this.conversationRepo.findOne({
      where: { userAId: smallerId, userBId: largerId },
    });
    if (!conversation) {
      conversation = this.conversationRepo.create({
        userAId: smallerId,
        userBId: largerId,
        status: 1,
      });
      await this.conversationRepo.save(conversation);
    }

    // 创建消息
    const message = this.messageRepo.create({
      conversationId: conversation.id,
      senderId,
      receiverId,
      msgType,
      content,
      isRead: 0,
      status: 1,
    });
    await this.messageRepo.save(message);

    // 更新会话
    conversation.lastMessageId = message.id;
    conversation.lastMessageText = content.substring(0, 100);
    conversation.lastMessageAt = new Date();
    if (conversation.userAId === receiverId) {
      conversation.unreadA += 1;
    } else {
      conversation.unreadB += 1;
    }
    await this.conversationRepo.save(conversation);

    return { success: true, messageId: message.id };
  }

  // ========== 管理端接口 ==========
  async adminGetFriendRelations(query: any): Promise<any> {
    const { userId, page = 1, limit = 20 } = query;
    const qb = this.friendRepo.createQueryBuilder('f');

    if (userId) {
      qb.where('(f.userId = :userId OR f.friendId = :userId)', { userId });
    }

    const [list, total] = await qb
      .orderBy('f.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { list, total, page, limit };
  }

  async adminRemoveFriend(userAId: number, userBId: number): Promise<any> {
    await this.removeFriendship(userAId, userBId);
    // 同时移除双向关注
    await this.followRepo.delete({ userId: userAId, followUserId: userBId });
    await this.followRepo.delete({ userId: userBId, followUserId: userAId });
    return { success: true };
  }

  async adminSetUserSocialStatus(userId: number, status: number): Promise<any> {
    await this.userRepo.update({ id: userId }, { socialStatus: status });
    return { success: true };
  }

  async adminMuteUser(userId: number, until: Date): Promise<any> {
    await this.userRepo.update({ id: userId }, { socialStatus: 0, muteUntil: until });
    return { success: true };
  }

  async adminSetUserCanBeFriended(userId: number, canBeFriended: number): Promise<any> {
    await this.userRepo.update({ id: userId }, { canBeFriended });
    return { success: true };
  }

  async adminSetUserCanChat(userId: number, canChat: number): Promise<any> {
    await this.userRepo.update({ id: userId }, { canChat });
    return { success: true };
  }
}
