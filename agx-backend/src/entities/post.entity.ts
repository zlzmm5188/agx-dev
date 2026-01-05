import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

/**
 * 广场帖子表
 */
@Entity('agx_post')
export class Post {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '发帖用户ID' })
  @Index('idx_user_id')
  userId: number;

  @Column({ type: 'text', comment: '帖子内容' })
  content: string;

  @Column({ type: 'varchar', length: 2000, nullable: true, comment: '图片URL数组JSON' })
  images: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '话题标签，如 #BTC' })
  topic: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '帖子类型: normal=普通, news=快讯, analysis=分析' })
  type: string;

  @Column({ type: 'int', name: 'view_count', default: 0, comment: '浏览数' })
  viewCount: number;

  @Column({ type: 'int', name: 'like_count', default: 0, comment: '点赞数' })
  likeCount: number;

  @Column({ type: 'int', name: 'comment_count', default: 0, comment: '评论数' })
  commentCount: number;

  @Column({ type: 'int', name: 'share_count', default: 0, comment: '分享数' })
  shareCount: number;

  @Column({ type: 'smallint', name: 'is_top', default: 0, comment: '是否置顶: 0否 1是' })
  isTop: number;

  @Column({ type: 'smallint', name: 'is_hot', default: 0, comment: '是否热门: 0否 1是' })
  isHot: number;

  @Column({ type: 'smallint', name: 'is_official', default: 0, comment: '是否官方: 0否 1是' })
  isOfficial: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: -1已下架 0审核中 1正常' })
  status: number;

  @Column({ type: 'int', default: 0, comment: '权重分值（推荐/热度控制）' })
  weight: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'review_remark', comment: '审核备注' })
  reviewRemark: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'reviewed_by', comment: '审核人' })
  reviewedBy: number;

  @Column({ type: 'timestamp', nullable: true, name: 'reviewed_at', comment: '审核时间' })
  reviewedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;
}
