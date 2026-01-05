import { Controller, Get, Post, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { SquareService } from './square.service';

/**
 * 广场接口
 * 提供帖子、评论、点赞、关注等功能
 */
@Controller('api/square')
export class SquareController {
  constructor(private readonly squareService: SquareService) {}

  /**
   * 获取帖子列表
   * GET /api/square/posts?tab=recommend&page=1&pageSize=20
   */
  @Get('posts')
  async getPosts(
    @Query('tab') tab: string = 'recommend',
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    const result = await this.squareService.getPosts(tab, userId, page, pageSize);
    return { code: 0, msg: 'ok', data: result };
  }

  /**
   * 获取帖子详情
   * GET /api/square/post/:id
   */
  @Get('post/:id')
  async getPost(@Param('id') id: number, @Request() req: any) {
    const userId = req.user?.id;
    const post = await this.squareService.getPost(id, userId);
    if (!post) {
      return { code: 1001, msg: '帖子不存在', data: null };
    }
    return { code: 0, msg: 'ok', data: post };
  }

  /**
   * 发布帖子
   * POST /api/square/post
   */
  @Post('post')
  async createPost(
    @Body() body: { content: string; images?: string[]; topic?: string; type?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 1002, msg: '请先登录', data: null };
    }
    const post = await this.squareService.createPost(userId, body.content, body.images, body.topic, body.type);
    return { code: 0, msg: 'ok', data: post };
  }

  /**
   * 点赞/取消点赞
   * POST /api/square/like
   */
  @Post('like')
  async toggleLike(
    @Body() body: { targetType: 'post' | 'comment'; targetId: number },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 1002, msg: '请先登录', data: null };
    }
    const result = await this.squareService.toggleLike(userId, body.targetType, body.targetId);
    return { code: 0, msg: 'ok', data: result };
  }

  /**
   * 发表评论
   * POST /api/square/comment
   */
  @Post('comment')
  async createComment(
    @Body() body: { postId: number; content: string; parentId?: number; replyToUserId?: number },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 1002, msg: '请先登录', data: null };
    }
    const comment = await this.squareService.createComment(
      userId, body.postId, body.content, body.parentId, body.replyToUserId
    );
    return { code: 0, msg: 'ok', data: comment };
  }

  /**
   * 获取评论列表
   * GET /api/square/comments?postId=1&page=1&pageSize=20
   */
  @Get('comments')
  async getComments(
    @Query('postId') postId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const result = await this.squareService.getComments(postId, page, pageSize);
    return { code: 0, msg: 'ok', data: result };
  }

  /**
   * 关注/取消关注
   * POST /api/square/follow
   */
  @Post('follow')
  async toggleFollow(
    @Body() body: { targetUserId: number },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 1002, msg: '请先登录', data: null };
    }
    try {
      const result = await this.squareService.toggleFollow(userId, body.targetUserId);
      return { code: 0, msg: 'ok', data: result };
    } catch (e) {
      return { code: 1001, msg: e.message, data: null };
    }
  }

  /**
   * 获取热门话题
   * GET /api/square/topics?limit=10
   */
  @Get('topics')
  async getHotTopics(@Query('limit') limit: number = 10) {
    const topics = await this.squareService.getHotTopics(limit);
    return { code: 0, msg: 'ok', data: { list: topics } };
  }
}
