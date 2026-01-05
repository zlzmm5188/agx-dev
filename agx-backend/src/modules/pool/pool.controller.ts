import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PoolService } from './pool.service';
import { SubscribePoolDto, RedeemPoolDto } from './pool.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  /**
   * 获取矿池产品列表
   */
  @Get('products')
  async getProducts() {
    return this.poolService.getProducts();
  }

  /**
   * 获取用户持仓
   */
  @UseGuards(JwtAuthGuard)
  @Get('holdings')
  async getHoldings(@CurrentUser() user: { id: number }) {
    return this.poolService.getHoldings(user.id);
  }

  /**
   * 申购矿池
   */
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(
    @CurrentUser() user: { id: number },
    @Body() dto: SubscribePoolDto,
  ) {
    return this.poolService.subscribe(user.id, dto);
  }

  /**
   * 赎回矿池
   */
  @UseGuards(JwtAuthGuard)
  @Post('redeem')
  async redeem(
    @CurrentUser() user: { id: number },
    @Body() dto: RedeemPoolDto,
  ) {
    return this.poolService.redeem(user.id, dto);
  }
}
