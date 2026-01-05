import { Controller, Get, Query, Param } from '@nestjs/common';
import { MarketService } from './market.service';

/**
 * 行情接口
 * 提供多资产行情数据
 */
@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  /**
   * 获取行情列表
   * GET /api/market/tickers?type=crypto&tab=all
   */
  @Get('tickers')
  async getTickers(
    @Query('type') type: string = 'crypto',
    @Query('tab') tab: string = 'all',
  ) {
    const list = await this.marketService.getTickers(type, tab);
    return { code: 0, msg: 'ok', data: { list } };
  }

  /**
   * 获取单个行情
   * GET /api/market/ticker/:symbol
   */
  @Get('ticker/:symbol')
  async getTicker(@Param('symbol') symbol: string) {
    const ticker = await this.marketService.getTicker(symbol);
    return { code: 0, msg: 'ok', data: ticker };
  }

  /**
   * 获取K线数据
   * GET /api/market/klines?symbol=BTCUSDT&interval=1h&limit=100
   */
  @Get('klines')
  async getKlines(
    @Query('symbol') symbol: string,
    @Query('interval') interval: string = '1h',
    @Query('limit') limit: number = 100,
  ) {
    const klines = await this.marketService.getKlines(symbol, interval, limit);
    return { code: 0, msg: 'ok', data: { klines } };
  }

  /**
   * 获取资产配置列表
   * GET /api/market/assets?type=crypto
   */
  @Get('assets')
  async getAssets(@Query('type') type?: string) {
    const list = await this.marketService.getAssets(type);
    return { code: 0, msg: 'ok', data: { list } };
  }
}
