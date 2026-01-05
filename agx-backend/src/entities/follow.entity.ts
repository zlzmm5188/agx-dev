import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 用户关注表
 */
@Entity('agx_follow')
export class Follow {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '关注者用户ID' })
  @Index('idx_user_id')
  userId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'follow_user_id', comment: '被关注用户ID' })
  @Index('idx_follow_user_id')
  followUserId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}

// 联合唯一索引: UNIQUE INDEX idx_user_follow (user_id, follow_user_id)
