import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * 私信表
 */
@Entity('agx_private_message')
export class PrivateMessage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'sender_id', type: 'bigint', comment: '发送者ID' })
  @Index('idx_private_message_sender')
  senderId: number;

  @Column({ name: 'receiver_id', type: 'bigint', comment: '接收者ID' })
  @Index('idx_private_message_receiver')
  receiverId: number;

  @Column({ type: 'text', comment: '消息内容' })
  content: string;

  @Column({ name: 'media_type', length: 20, default: 'text', comment: '媒体类型: text, image, video, file' })
  mediaType: string;

  @Column({ name: 'media_url', length: 500, nullable: true, comment: '媒体URL' })
  mediaUrl: string;

  @Column({ type: 'smallint', name: 'is_read', default: 0, comment: '是否已读: 0-未读, 1-已读' })
  isRead: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: -1-删除, 0-撤回, 1-正常' })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  @Index('idx_private_message_created_at')
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
