import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 私聊消息表
 */
@Entity('agx_message')
export class Message {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'conversation_id', comment: '会话ID' })
  @Index('idx_msg_conv')
  conversationId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'sender_id', comment: '发送者ID' })
  @Index('idx_msg_sender')
  senderId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'receiver_id', comment: '接收者ID' })
  @Index('idx_msg_receiver')
  receiverId: number;

  @Column({ type: 'smallint', name: 'msg_type', default: 1, comment: '消息类型：1文本 2图片 3语音 4系统消息' })
  msgType: number;

  @Column({ type: 'text', comment: '消息内容' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '附件URL（图片/语音等）' })
  attachment: string;

  @Column({ type: 'smallint', name: 'is_read', default: 0, comment: '是否已读：0未读 1已读' })
  isRead: number;

  @Column({ type: 'timestamp', nullable: true, name: 'read_at', comment: '已读时间' })
  readAt: Date;

  @Column({ type: 'smallint', default: 1, comment: '状态：1正常 0已撤回 -1已删除' })
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Index('idx_msg_created')
  createdAt: Date;
}
