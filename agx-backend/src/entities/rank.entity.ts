import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 排行榜缓存表
 * 缓存各类排行榜数据，定时更新
 */
@Entity('agx_rank')
export class Rank {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'rank_type', comment: '排行榜类型: profit=收益榜, volume=交易量榜, invite=邀请榜' })
  @Index('idx_rank_type')
  rankType: string;

  @Column({ type: 'varchar', length: 20, name: 'time_range', comment: '时间范围: day=日榜, week=周榜, month=月榜, all=总榜' })
  @Index('idx_time_range')
  timeRange: string;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '用户ID' })
  @Index('idx_user_id')
  userId: number;

  @Column({ type: 'int', comment: '排名' })
  @Index('idx_position')
  position: number;

  @Column({ type: 'decimal', precision: 30, scale: 8, comment: '数值（收益/交易量/邀请数）' })
  value: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true, name: 'change_percent', comment: '变动百分比' })
  changePercent: string;

  @Column({ type: 'text', nullable: true, comment: '扩展数据JSON' })
  extra: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
