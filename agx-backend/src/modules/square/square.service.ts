import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Post, Comment, Like, Follow, Topic, User } from '../../entities';

/**
 * 广场服务
 * 提供帖子、评论、点赞、关注等功能
 */
@Injectable()
export class SquareService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 获取帖子列表
   */
  async getPosts(tab: string = 'recommend', userId?: number, page: number = 1, pageSize: number = 20) {
    const query = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.userId', 'user')
      .where('post.status = :status', { status: 1 })
      .andWhere('post.deletedAt IS NULL');

    // 根据tab筛选
    switch (tab) {
      case 'hot':
        query.orderBy('post.likeCount', 'DESC');
        break;
      case 'following':
        if (userId) {
          // 获取用户关注的人
          const followingIds = await this.getFollowingIds(userId);
          if (followingIds.length > 0) {
            query.andWhere('post.userId IN (:...followingIds)', { followingIds });
          } else {
            return { list: [], total: 0 };
          }
        }
        query.orderBy('post.createdAt', 'DESC');
        break;
      case 'news':
        query.andWhere('post.type = :type', { type: 'news' });
        query.orderBy('post.createdAt', 'DESC');
        break;
      default:
        // 推荐：置顶优先，然后按热度+时间混合排序
        query.orderBy('post.isTop', 'DESC')
          .addOrderBy('post.isHot', 'DESC')
          .addOrderBy('post.createdAt', 'DESC');
    }

    const total = await query.getCount();
    const list = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    // 如果数据库为空，返回mock数据
    if (list.length === 0) {
      return { list: this.getMockPosts(), total: 10 };
    }

    return { list, total };
  }

  /**
   * 获取帖子详情
   */
  async getPost(postId: number, userId?: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      return null;
    }

    // 增加浏览量
    await this.postRepository.increment({ id: postId }, 'viewCount', 1);

    // 检查当前用户是否点赞
    let isLiked = false;
    if (userId) {
      const like = await this.likeRepository.findOne({
        where: { userId, targetType: 'post', targetId: postId }
      });
      isLiked = !!like;
    }

    return { ...post, isLiked };
  }

  /**
   * 发布帖子
   */
  async createPost(userId: number, content: string, images?: string[], topic?: string, type?: string) {
    const post = this.postRepository.create({
      userId,
      content,
      images: images ? JSON.stringify(images) : null,
      topic,
      type: type || 'normal',
      status: 1,
    });

    await this.postRepository.save(post);

    // 更新用户帖子数
    await this.userRepository.increment({ id: userId }, 'postCount', 1);

    // 更新话题帖子数
    if (topic) {
      await this.updateTopicCount(topic);
    }

    return post;
  }

  /**
   * 点赞/取消点赞
   */
  async toggleLike(userId: number, targetType: 'post' | 'comment', targetId: number) {
    const existing = await this.likeRepository.findOne({
      where: { userId, targetType, targetId }
    });

    if (existing) {
      // 取消点赞
      await this.likeRepository.remove(existing);
      
      if (targetType === 'post') {
        await this.postRepository.decrement({ id: targetId }, 'likeCount', 1);
      } else {
        await this.commentRepository.decrement({ id: targetId }, 'likeCount', 1);
      }
      
      return { liked: false };
    } else {
      // 添加点赞
      const like = this.likeRepository.create({ userId, targetType, targetId });
      await this.likeRepository.save(like);
      
      if (targetType === 'post') {
        await this.postRepository.increment({ id: targetId }, 'likeCount', 1);
      } else {
        await this.commentRepository.increment({ id: targetId }, 'likeCount', 1);
      }
      
      return { liked: true };
    }
  }

  /**
   * 发表评论
   */
  async createComment(userId: number, postId: number, content: string, parentId?: number, replyToUserId?: number) {
    const comment = this.commentRepository.create({
      postId,
      userId,
      content,
      parentId: parentId || null,
      replyToUserId: replyToUserId || null,
      status: 1,
    });

    await this.commentRepository.save(comment);

    // 更新帖子评论数
    await this.postRepository.increment({ id: postId }, 'commentCount', 1);

    return comment;
  }

  /**
   * 获取评论列表
   */
  async getComments(postId: number, page: number = 1, pageSize: number = 20) {
    const [list, total] = await this.commentRepository.findAndCount({
      where: { postId, status: 1, parentId: IsNull() },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total };
  }

  /**
   * 关注/取消关注
   */
  async toggleFollow(userId: number, targetUserId: number) {
    if (userId === targetUserId) {
      throw new Error('不能关注自己');
    }

    const existing = await this.followRepository.findOne({
      where: { userId, followUserId: targetUserId }
    });

    if (existing) {
      // 取消关注
      await this.followRepository.remove(existing);
      await this.userRepository.decrement({ id: userId }, 'followingCount', 1);
      await this.userRepository.decrement({ id: targetUserId }, 'followerCount', 1);
      return { followed: false };
    } else {
      // 添加关注
      const follow = this.followRepository.create({ userId, followUserId: targetUserId });
      await this.followRepository.save(follow);
      await this.userRepository.increment({ id: userId }, 'followingCount', 1);
      await this.userRepository.increment({ id: targetUserId }, 'followerCount', 1);
      return { followed: true };
    }
  }

  /**
   * 获取热门话题
   */
  async getHotTopics(limit: number = 10) {
    const topics = await this.topicRepository.find({
      where: { status: 1 },
      order: { isHot: 'DESC', postCount: 'DESC', sortOrder: 'ASC' },
      take: limit,
    });

    if (topics.length === 0) {
      return this.getMockTopics();
    }

    return topics;
  }

  // ===== 辅助方法 =====

  private async getFollowingIds(userId: number): Promise<number[]> {
    const follows = await this.followRepository.find({
      where: { userId },
      select: ['followUserId'],
    });
    return follows.map(f => f.followUserId);
  }

  private async updateTopicCount(tag: string) {
    const topic = await this.topicRepository.findOne({ where: { tag } });
    if (topic) {
      await this.topicRepository.increment({ id: topic.id }, 'postCount', 1);
    } else {
      // 创建新话题
      const newTopic = this.topicRepository.create({ tag, postCount: 1, status: 1 });
      await this.topicRepository.save(newTopic);
    }
  }

  // ===== Mock 数据 =====

  private getMockPosts() {
    return [
      {
        id: 1,
        userId: 1,
        content: 'BTC突破10万美元大关！牛市正式开启，下一个目标15万。建议大家持有现货，不要轻易追高。注意风险控制，合理分配仓位。',
        images: null,
        topic: 'BTC',
        type: 'normal',
        viewCount: 12580,
        likeCount: 2568,
        commentCount: 386,
        shareCount: 128,
        isTop: 0,
        isHot: 1,
        isOfficial: 0,
        status: 1,
        createdAt: new Date(Date.now() - 2 * 3600000),
        author: { id: 1, nickname: '币圈大V', avatar: null, isVerified: 1, userTag: '大V' }
      },
      {
        id: 2,
        userId: 2,
        content: '【重磅公告】AGX 升达金指币即将开启首发认购！100% 黄金储备支撑，首发价 $0.10，限时限量，先到先得！',
        images: null,
        topic: 'AGX',
        type: 'news',
        viewCount: 25600,
        likeCount: 1256,
        commentCount: 234,
        shareCount: 89,
        isTop: 1,
        isHot: 1,
        isOfficial: 1,
        status: 1,
        createdAt: new Date(Date.now() - 30 * 60000),
        author: { id: 2, nickname: 'AGX官方', avatar: null, isVerified: 1, userTag: '官方' }
      },
      {
        id: 3,
        userId: 3,
        content: '今日交易策略：苹果回调至175-178区间可以考虑建仓，止损设在170，目标看到190。仅供参考，投资有风险。',
        images: null,
        topic: null,
        type: 'analysis',
        viewCount: 5680,
        likeCount: 1235,
        commentCount: 89,
        shareCount: 45,
        isTop: 0,
        isHot: 0,
        isOfficial: 0,
        status: 1,
        createdAt: new Date(Date.now() - 5 * 3600000),
        author: { id: 3, nickname: '量化策略', avatar: null, isVerified: 1, userTag: '策略' }
      }
    ];
  }

  private getMockTopics() {
    return [
      { id: 1, tag: 'BTC突破10万', icon: '🔥', postCount: 125000, isHot: 1 },
      { id: 2, tag: 'ETH生态', icon: '💎', postCount: 82000, isHot: 1 },
      { id: 3, tag: '美股全线上涨', icon: '📈', postCount: 68000, isHot: 1 },
      { id: 4, tag: '原油期货', icon: '⛽', postCount: 51000, isHot: 0 },
      { id: 5, tag: '黄金新高', icon: '🥇', postCount: 43000, isHot: 1 },
    ];
  }
}
