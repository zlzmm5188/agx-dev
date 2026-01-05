import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post, PostReview, User } from '../../entities';
import { PostReviewDto } from './dto/sensitive-word.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostReview)
    private postReviewRepository: Repository<PostReview>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 审核帖子
   */
  async reviewPost(userId: number, dto: PostReviewDto) {
    // 检查用户权限（是否为管理员）
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== 'admin' && user.role !== 'moderator') {
      throw new Error('权限不足，无法审核帖子');
    }

    // 获取帖子
    const post = await this.postRepository.findOne({ where: { id: dto.postId } });
    if (!post) {
      throw new Error('帖子不存在');
    }

    // 根据审核操作更新帖子状态
    switch (dto.action) {
      case 'approve':
        post.status = 1; // 正常
        post.reviewRemark = '审核通过';
        break;
      case 'reject':
        post.status = -1; // 已下架
        post.reviewRemark = dto.reason || '审核拒绝';
        break;
      case 'modify':
        post.status = 0; // 重新审核
        post.reviewRemark = dto.reason || '需要修改';
        break;
      default:
        throw new Error('无效的审核操作');
    }

    post.reviewedBy = userId;
    post.reviewedAt = new Date();

    // 保存审核记录
    const reviewRecord = this.postReviewRepository.create({
      postId: dto.postId,
      reviewerId: userId,
      action: dto.action,
      reason: dto.reason
    });

    await this.postRepository.save(post);
    await this.postReviewRepository.save(reviewRecord);

    return { success: true, post };
  }

  /**
   * 获取待审核帖子列表
   */
  async getPendingPosts(page: number = 1, pageSize: number = 20) {
    const [list, total] = await this.postRepository.findAndCount({
      where: { status: 0 }, // 审核中
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 获取审核记录
   */
  async getReviewHistory(postId: number) {
    return await this.postReviewRepository.find({
      where: { postId },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * 批量审核帖子
   */
  async batchReviewPosts(userId: number, postIds: number[], action: 'approve' | 'reject', reason?: string) {
    // 检查用户权限
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== 'admin' && user.role !== 'moderator') {
      throw new Error('权限不足，无法审核帖子');
    }

    // 获取需要审核的帖子
    const posts = await this.postRepository.find({
      where: { id: In(postIds) }
    });

    const results = [];
    for (const post of posts) {
      // 更新帖子状态
      switch (action) {
        case 'approve':
          post.status = 1; // 正常
          post.reviewRemark = '批量审核通过';
          break;
        case 'reject':
          post.status = -1; // 已下架
          post.reviewRemark = reason || '批量审核拒绝';
          break;
      }

      post.reviewedBy = userId;
      post.reviewedAt = new Date();

      await this.postRepository.save(post);

      // 保存审核记录
      const reviewRecord = this.postReviewRepository.create({
        postId: post.id,
        reviewerId: userId,
        action,
        reason
      });

      await this.postReviewRepository.save(reviewRecord);
      results.push({ postId: post.id, status: post.status });
    }

    return { success: true, results };
  }
}
