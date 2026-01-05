import { Controller, Get, Query, Request } from '@nestjs/common';
import { InviteService } from './invite.service';

/**
 * 邀请与等级接口
 */
@Controller('api/invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  /**
   * 获取邀请信息
   * GET /api/invite/info
   */
  @Get('info')
  async getInviteInfo(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 1002, msg: '请先登录', data: null };
    }
    const info = await this.inviteService.getInviteInfo(userId);
    return { code: 0, msg: 'ok', data: info };
  }

  /**
   * 获取邀请记录
   * GET /api/invite/records?page=1&pageSize=20
   */
  @Get('records')
  async getInviteRecords(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 1002, msg: '请先登录', data: null };
    }
    const result = await this.inviteService.getInviteRecords(userId, page, pageSize);
    return { code: 0, msg: 'ok', data: result };
  }

  /**
   * 获取返佣记录
   * GET /api/invite/commissions?page=1&pageSize=20
   */
  @Get('commissions')
  async getCommissionRecords(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 1002, msg: '请先登录', data: null };
    }
    const result = await this.inviteService.getCommissionRecords(userId, page, pageSize);
    return { code: 0, msg: 'ok', data: result };
  }

  /**
   * 获取等级配置
   * GET /api/invite/levels
   */
  @Get('levels')
  async getLevels() {
    const levels = await this.inviteService.getAllLevels();
    return { code: 0, msg: 'ok', data: { list: levels } };
  }

  /**
   * 获取排行榜
   * GET /api/invite/rank?type=profit&range=week&page=1&pageSize=50
   */
  @Get('rank')
  async getRankList(
    @Query('type') rankType: string = 'profit',
    @Query('range') timeRange: string = 'week',
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 50,
  ) {
    const list = await this.inviteService.getRankList(rankType, timeRange, page, pageSize);
    return { code: 0, msg: 'ok', data: { list } };
  }

  /**
   * 获取我的排名
   * GET /api/invite/myrank?type=profit&range=week
   */
  @Get('myrank')
  async getMyRank(
    @Request() req: any,
    @Query('type') rankType: string = 'profit',
    @Query('range') timeRange: string = 'week',
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { code: 0, msg: 'ok', data: { position: 999, value: '0' } };
    }
    const rank = await this.inviteService.getUserRank(userId, rankType, timeRange);
    return { code: 0, msg: 'ok', data: rank };
  }
}
