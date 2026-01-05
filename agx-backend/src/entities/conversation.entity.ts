import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 会话表 - 私聊会话
 * 每对好友只有一个会话，双方共用
 */
@Entity('agx_conversation')
@Index('idx_conv_users', ['userAId', 'userBId'], { unique: true })
export class Conversation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_a_id', comment: '用户A ID（较小的ID）' })
  @Index('idx_conv_user_a')
  userAId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_b_id', comment: '用户B ID（较大的ID）' })
  @Index('idx_conv_user_b')
  userBId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'last_message_id', comment: '最后一条消息ID' })
  lastMessageId: number;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'last_message_text', comment: '最后一条消息内容（冗余）' })
  lastMessageText: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_message_at', comment: '最后消息时间' })
  lastMessageAt: Date;

  @Column({ type: 'int', name: 'unread_a', default: 0, comment: '用户A未读数' })
  unreadA: number;

  @Column({ type: 'int', name: 'unread_b', default: 0, comment: '用户B未读数' })
  unreadB: number;

  @Column({ type: 'smallint', default: 1, comment: '会话状态：1正常 0关闭' })
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
