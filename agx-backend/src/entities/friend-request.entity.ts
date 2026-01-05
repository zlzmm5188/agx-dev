import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 好友请求表
 */
@Entity('agx_friend_request')
@Index('idx_friend_req_users', ['fromUserId', 'toUserId'])
export class FriendRequest {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'from_user_id', comment: '发起方用户ID' })
  @Index('idx_friend_req_from')
  fromUserId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'to_user_id', comment: '接收方用户ID' })
  @Index('idx_friend_req_to')
  toUserId: number;

  @Column({ type: 'varchar', length: 200, nullable: true, comment: '请求留言' })
  message: string;

  @Column({ type: 'smallint', default: 0, comment: '状态：0待处理 1已同意 2已拒绝 3已取消' })
  @Index('idx_friend_req_status')
  status: number;

  @Column({ type: 'timestamp', nullable: true, name: 'handled_at', comment: '处理时间' })
  handledAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
