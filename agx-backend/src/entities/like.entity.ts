import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 点赞表
 * 支持帖子点赞和评论点赞
 */
@Entity('agx_like')
export class Like {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '点赞用户ID' })
  @Index('idx_user_id')
  userId: number;

  @Column({ type: 'varchar', length: 20, name: 'target_type', comment: '目标类型: post=帖子, comment=评论' })
  targetType: string;

  @Column({ type: 'bigint', unsigned: true, name: 'target_id', comment: '目标ID' })
  targetId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}

// 创建联合唯一索引，防止重复点赞
// 在数据库层面需要创建: UNIQUE INDEX idx_user_target (user_id, target_type, target_id)
