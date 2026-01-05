import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 好友关系表 - 互关即为好友
 * 采用双向记录：A关注B且B关注A时，双方都是好友
 */
@Entity('agx_friend')
@Index('idx_friend_users', ['userId', 'friendId'], { unique: true })
export class Friend {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '用户ID' })
  @Index('idx_friend_user')
  userId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'friend_id', comment: '好友ID' })
  @Index('idx_friend_friend')
  friendId: number;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '好友备注名' })
  remark: string;

  @Column({ type: 'smallint', default: 1, comment: '状态：1正常 0已解除' })
  status: number;

  @Column({ type: 'smallint', name: 'is_blocked', default: 0, comment: '是否屏蔽：0否 1是' })
  isBlocked: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', comment: '成为好友时间' })
  createdAt: Date;
}
