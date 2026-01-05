import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 热门话题表
 */
@Entity('agx_topic')
export class Topic {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, comment: '话题标签，如 BTC突破10万' })
  @Index('idx_tag', { unique: true })
  tag: string;

  @Column({ type: 'varchar', length: 10, nullable: true, comment: '话题图标emoji' })
  icon: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '话题描述' })
  description: string;

  @Column({ type: 'int', name: 'post_count', default: 0, comment: '帖子数量' })
  postCount: number;

  @Column({ type: 'int', name: 'view_count', default: 0, comment: '浏览数' })
  viewCount: number;

  @Column({ type: 'smallint', name: 'is_hot', default: 0, comment: '是否热门: 0否 1是' })
  isHot: number;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序值' })
  sortOrder: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0禁用 1启用' })
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
