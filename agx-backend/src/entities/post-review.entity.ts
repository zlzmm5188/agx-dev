import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

/**
 * 帖子审核记录表
 */
@Entity('agx_post_review')
export class PostReview {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'post_id', type: 'bigint', comment: '帖子ID' })
  postId: number;

  @Column({ name: 'reviewer_id', type: 'bigint', comment: '审核人ID' })
  reviewerId: number;

  @Column({ length: 20, comment: '操作: approve-通过, reject-拒绝, modify-修改' })
  action: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '审核原因' })
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // 关联帖子
  @ManyToOne(() => Post, post => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
