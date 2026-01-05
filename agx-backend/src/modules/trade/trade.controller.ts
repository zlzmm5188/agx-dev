import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TradeService } from './trade.service';
import { CreateOrderDto, CancelOrderDto, CreateTradingPairDto, UpdateTradingPairDto, CreateCoinIssueDto, SubscribeCoinDto } from './trade.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

/**
 * 交易接口 - 前台用户
 */
@Controller('api/trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  /**
   * 获取交易对列表
   * GET /api/trade/pairs
   */
  @Get('pairs')
  async getTradingPairs(@Query('status') status?: number) {
    const list = await this.tradeService.getTradingPairs(status);
    return { code: 0, msg: 'ok', data: { list } };
  }

  /**
   * 获取交易对详情
   * GET /api/trade/pair/:symbol
   */
  @Get('pair/:symbol')
  async getTradingPair(@Param('symbol') symbol: string) {
    const pair = await this.tradeService.getTradingPair(symbol);
    return { code: 0, msg: 'ok', data: pair };
  }

  /**
   * 创建订单
   * POST /api/trade/order
   */
  @Post('order')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateOrderDto,
  ) {
    const order = await this.tradeService.createOrder(userId, dto);
    return { code: 0, msg: '订单创建成功', data: order };
  }

  /**
   * 取消订单
   * POST /api/trade/order/:orderNo/cancel
   */
  @Post('order/:orderNo/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @CurrentUser('id') userId: number,
    @Param('orderNo') orderNo: string,
  ) {
    const order = await this.tradeService.cancelOrder(userId, orderNo);
    return { code: 0, msg: '订单已取消', data: order };
  }

  /**
   * 获取订单列表
   * GET /api/trade/orders?status=0&page=1&pageSize=20
   */
  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getOrders(
    @CurrentUser('id') userId: number,
    @Query('status') status?: number,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    const result = await this.tradeService.getOrders(userId, status, page, pageSize);
    return { code: 0, msg: 'ok', data: result };
  }

  /**
   * 获取订单详情
   * GET /api/trade/order/:orderNo
   */
  @Get('order/:orderNo')
  @UseGuards(JwtAuthGuard)
  async getOrder(
    @CurrentUser('id') userId: number,
    @Param('orderNo') orderNo: string,
  ) {
    const order = await this.tradeService.getOrder(userId, orderNo);
    return { code: 0, msg: 'ok', data: order };
  }

  // ========== 新币发行与申购 ==========

  /**
   * 获取新币发行列表
   * GET /api/trade/ieo/list?status=1
   */
  @Get('ieo/list')
  async getCoinIssues(@Query('status') status?: number) {
    const list = await this.tradeService.getCoinIssues(status);
    return { code: 0, msg: 'ok', data: { list } };
  }

  /**
   * 获取新币发行详情
   * GET /api/trade/ieo/:id
   */
  @Get('ieo/:id')
  async getCoinIssue(@Param('id', ParseIntPipe) id: number) {
    const issue = await this.tradeService.getCoinIssue(id);
    return { code: 0, msg: 'ok', data: issue };
  }

  /**
   * 申购新币
   * POST /api/trade/ieo/subscribe
   */
  @Post('ieo/subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribeCoin(
    @CurrentUser('id') userId: number,
    @Body() dto: SubscribeCoinDto,
  ) {
    const subscription = await this.tradeService.subscribeCoin(userId, dto);
    return { code: 0, msg: '申购成功', data: subscription };
  }

  /**
   * 获取我的申购记录
   * GET /api/trade/ieo/my-subscriptions
   */
  @Get('ieo/my-subscriptions')
  @UseGuards(JwtAuthGuard)
  async getMySubscriptions(@CurrentUser('id') userId: number) {
    const list = await this.tradeService.getMySubscriptions(userId);
    return { code: 0, msg: 'ok', data: { list } };
  }
}

/**
 * 交易管理接口 - 管理后台
 */
@Controller('api/admin/trade')
@UseGuards(JwtAuthGuard)
export class TradeAdminController {
  constructor(private readonly tradeService: TradeService) {}

  /**
   * 创建交易对
   * POST /api/admin/trade/pair
   */
  @Post('pair')
  async createTradingPair(@Body() dto: CreateTradingPairDto) {
    const pair = await this.tradeService.createTradingPair(dto);
    return { code: 0, msg: '创建成功', data: pair };
  }

  /**
   * 更新交易对
   * PUT /api/admin/trade/pair/:id
   */
  @Put('pair/:id')
  async updateTradingPair(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTradingPairDto,
  ) {
    const pair = await this.tradeService.updateTradingPair(id, dto);
    return { code: 0, msg: '更新成功', data: pair };
  }

  /**
   * 删除交易对
   * DELETE /api/admin/trade/pair/:id
   */
  @Delete('pair/:id')
  async deleteTradingPair(@Param('id', ParseIntPipe) id: number) {
    const result = await this.tradeService.deleteTradingPair(id);
    return { code: 0, msg: '删除成功', data: result };
  }

  /**
   * 创建新币发行
   * POST /api/admin/trade/ieo
   */
  @Post('ieo')
  async createCoinIssue(@Body() dto: CreateCoinIssueDto) {
    const issue = await this.tradeService.createCoinIssue(dto);
    return { code: 0, msg: '创建成功', data: issue };
  }

  /**
   * 获取所有订单（管理后台）
   * GET /api/admin/trade/orders?page=1&pageSize=50
   */
  @Get('orders')
  async getAllOrders(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 50,
  ) {
    // TODO: 实现管理后台订单查询
    return { code: 0, msg: 'ok', data: { list: [], total: 0 } };
  }
}
