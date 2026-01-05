import { Controller, Get, Post, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { SquareService } from './square.service';
import { SensitiveWordService } from './sensitive-word.service';
import { ReviewService } from './review.service';
import { PrivateMessageService } from './private-message.service';
import { CreateSensitiveWordDto, UpdateSensitiveWordDto, PostReviewDto } from './dto/sensitive-word.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * 广场接口
 * 提供帖子、评论、点赞、关注等功能
 */
@Controller('api/square')
export class SquareController {
  constructor(
    private readonly squareService: SquareService,
    private readonly sensitiveWordService: SensitiveWordService,
    private readonly reviewService: ReviewService,
    private readonly privateMessageService: PrivateMessageService,
  ) {}

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
    @Body() body: { content: string; images?: string[]; topic?: string; type?: string; videoUrl?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 1002, msg: '请先登录', data: null };
    }
    const post = await this.squareService.createPost(
      userId, 
      body.content, 
      body.images, 
      body.topic, 
      body.type,
      body.videoUrl
    );
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

  // ===== 敏感词管理接口（管理后台） =====

  /**
   * 获取敏感词列表
   * GET /api/square/sensitive-words
   */
  @Get('sensitive-words')
  @UseGuards(JwtAuthGuard)
  async getSensitiveWords(@Query('status') status?: number) {
    const where: any = {};
    if (status !== undefined) {
      where.status = status;
    }
    const words = await this.sensitiveWordService.getSensitiveWords({ where, order: { id: 'DESC' } });
    return { code: 0, msg: 'ok', data: { list: words } };
  }

  /**
   * 创建敏感词
   * POST /api/square/sensitive-words
   */
  @Post('sensitive-words')
  @UseGuards(JwtAuthGuard)
  async createSensitiveWord(@Body() dto: CreateSensitiveWordDto) {
    const word = await this.sensitiveWordService.createSensitiveWord(dto);
    return { code: 0, msg: '创建成功', data: word };
  }

  /**
   * 更新敏感词
   * PUT /api/square/sensitive-words/:id
   */
  @Post('sensitive-words/:id')
  @UseGuards(JwtAuthGuard)
  async updateSensitiveWord(@Param('id') id: number, @Body() dto: UpdateSensitiveWordDto) {
    const word = await this.sensitiveWordService.updateSensitiveWord(id, dto);
    return { code: 0, msg: '更新成功', data: word };
  }

  /**
   * 删除敏感词
   * DELETE /api/square/sensitive-words/:id
   */
  @Post('sensitive-words/:id/delete')
  @UseGuards(JwtAuthGuard)
  async deleteSensitiveWord(@Param('id') id: number) {
    await this.sensitiveWordService.deleteSensitiveWord(id);
    return { code: 0, msg: '删除成功', data: null };
  }

  // ===== 帖子审核接口（管理后台） =====

  /**
   * 审核帖子
   * POST /api/square/review
   */
  @Post('review')
  @UseGuards(JwtAuthGuard)
  async reviewPost(@Body() dto: PostReviewDto, @Request() req: any) {
    const userId = req.user?.id;
    try {
      const result = await this.reviewService.reviewPost(userId, dto);
      return { code: 0, msg: '审核成功', data: result };
    } catch (error) {
      return { code: 1001, msg: error.message, data: null };
    }
  }

  /**
   * 获取待审核帖子
   * GET /api/square/pending-posts
   */
  @Get('pending-posts')
  @UseGuards(JwtAuthGuard)
  async getPendingPosts(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const result = await this.reviewService.getPendingPosts(page, pageSize);
    return { code: 0, msg: 'ok', data: result };
  }

  /**
   * 获取帖子审核记录
   * GET /api/square/review-history/:postId
   */
  @Get('review-history/:postId')
  @UseGuards(JwtAuthGuard)
  async getReviewHistory(@Param('postId') postId: number) {
    const history = await this.reviewService.getReviewHistory(postId);
    return { code: 0, msg: 'ok', data: { list: history } };
  }

  /**
   * 批量审核帖子
   * POST /api/square/batch-review
   */
  @Post('batch-review')
  @UseGuards(JwtAuthGuard)
  async batchReviewPosts(
    @Body() body: { postIds: number[]; action: 'approve' | 'reject'; reason?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    try {
      const result = await this.reviewService.batchReviewPosts(userId, body.postIds, body.action, body.reason);
      return { code: 0, msg: '批量审核成功', data: result };
    } catch (error) {
      return { code: 1001, msg: error.message, data: null };
    }
  }

  // ===== 私信查看接口（管理后台） =====

  /**
   * 获取用户间私信记录
   * GET /api/square/messages/:userId1/:userId2
   */
  @Get('messages/:userId1/:userId2')
  @UseGuards(JwtAuthGuard)
  async getUserMessages(
    @Param('userId1') userId1: number,
    @Param('userId2') userId2: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const result = await this.privateMessageService.getUserMessages(userId1, userId2, page, pageSize);
    return { code: 0, msg: 'ok', data: result };
  }

  /**
   * 获取所有私信记录（管理后台）
   * GET /api/square/all-messages
   */
  @Get('all-messages')
  @UseGuards(JwtAuthGuard)
  async getAllMessages(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const result = await this.privateMessageService.getAllMessages(page, pageSize, startDate, endDate);
    return { code: 0, msg: 'ok', data: result };
  }
}
