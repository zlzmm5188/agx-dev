import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

/**
 * 评论表
 */
@Entity('agx_comment')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'post_id', comment: '帖子ID' })
  @Index('idx_post_id')
  postId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '评论用户ID' })
  @Index('idx_user_id')
  userId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'parent_id', comment: '父评论ID，回复评论时使用' })
  @Index('idx_parent_id')
  parentId: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'reply_to_user_id', comment: '回复目标用户ID' })
  replyToUserId: number;

  @Column({ type: 'varchar', length: 1000, comment: '评论内容' })
  content: string;

  @Column({ type: 'int', name: 'like_count', default: 0, comment: '点赞数' })
  likeCount: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0隐藏 1正常' })
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;
}
