import { Controller, Get, Query, Request } from '@nestjs/common';
import { InviteService } from './invite.service';

/**
 * 邀请关系树形图接口
 */
@Controller('api/invite/tree')
export class InviteTreeController {
  constructor(private readonly inviteService: InviteService) {}

  /**
   * 获取邀请关系树形图数据
   * GET /api/invite/tree/data?userId=1&maxDepth=5
   */
  @Get('data')
  async getInviteTree(
    @Request() req: any,
    @Query('userId') userId: number,
    @Query('maxDepth') maxDepth: number = 3,
  ) {
    // 检查用户权限 - 只有管理员可以查看完整关系树
    const requesterId = req.user?.id;
    if (!requesterId) {
      return { code: 1002, msg: '请先登录', data: null };
    }

    // 在实际应用中，这里应该检查用户是否为管理员
    // 为演示目的，我们允许查看自己的邀请树
    if (requesterId !== userId) {
      // 在实际应用中，可能需要管理员权限才能查看其他用户的邀请树
      // 这里简化处理，只允许查看自己的树
      userId = requesterId;
    }

    try {
      const treeData = await this.inviteService.getInviteTreeData(userId, maxDepth);
      return { code: 0, msg: 'ok', data: treeData };
    } catch (error) {
      return { code: 1001, msg: error.message, data: null };
    }
  }

  /**
   * 搜索用户
   * GET /api/invite/tree/search?keyword=xxx
   */
  @Get('search')
  async searchUsers(
    @Request() req: any,
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const requesterId = req.user?.id;
    if (!requesterId) {
      return { code: 1002, msg: '请先登录', data: null };
    }

    // 检查权限，这里简化处理
    if (requesterId !== 1) { // 假设只有ID为1的用户是管理员
      return { code: 1004, msg: '无权限', data: null };
    }

    if (!keyword) {
      return { code: 1001, msg: '关键词不能为空', data: null };
    }

    try {
      const users = await this.inviteService.searchUsers(keyword, page, pageSize);
      return { code: 0, msg: 'ok', data: users };
    } catch (error) {
      return { code: 1001, msg: error.message, data: null };
    }
  }

  /**
   * 获取邀请统计
   * GET /api/invite/tree/stats?userId=1
   */
  @Get('stats')
  async getInviteStats(
    @Request() req: any,
    @Query('userId') userId: number,
  ) {
    const requesterId = req.user?.id;
    if (!requesterId) {
      return { code: 1002, msg: '请先登录', data: null };
    }

    // 允许用户查看自己的统计信息
    if (requesterId !== userId) {
      // 在实际应用中，可能需要管理员权限
      return { code: 1004, msg: '无权限', data: null };
    }

    try {
      const stats = await this.inviteService.getInviteStats(userId);
      return { code: 0, msg: 'ok', data: stats };
    } catch (error) {
      return { code: 1001, msg: error.message, data: null };
    }
  }
}