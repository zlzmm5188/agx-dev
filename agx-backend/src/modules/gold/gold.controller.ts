import { Controller, Get, Query, Param } from '@nestjs/common';
import { GoldService } from './gold.service';

/**
 * 黄金模块接口
 * 提供黄金价格、贵金属行情、黄金玩法产品等数据
 */
@Controller('api/gold')
export class GoldController {
  constructor(private readonly goldService: GoldService) {}

  /**
   * 获取贵金属价格
   * GET /api/gold/prices
   */
  @Get('prices')
  async getGoldPrices() {
    const data = await this.goldService.getGoldPrices();
    return { code: 0, msg: 'ok', data };
  }

  /**
   * 获取黄金详情（包含AGX与黄金关系）
   * GET /api/gold/detail
   */
  @Get('detail')
  async getGoldDetail() {
    const data = await this.goldService.getGoldDetail();
    return { code: 0, msg: 'ok', data };
  }

  /**
   * 获取黄金K线数据
   * GET /api/gold/klines?symbol=XAU&interval=1h&limit=100
   */
  @Get('klines')
  async getGoldKlines(
    @Query('symbol') symbol: string = 'XAU',
    @Query('interval') interval: string = '1h',
    @Query('limit') limit: number = 100,
  ) {
    const klines = await this.goldService.getGoldKlines(symbol, interval, limit);
    return { code: 0, msg: 'ok', data: { klines } };
  }

  // ===== 黄金玩法接口 =====

  /**
   * 获取黄金玩法分类列表
   * GET /api/gold/categories
   */
  @Get('categories')
  async getProductCategories() {
    const data = await this.goldService.getProductCategories();
    return { code: 0, msg: 'ok', data };
  }

  /**
   * 获取黄金玩法产品列表
   * GET /api/gold/products?type=spot
   * @param type 玩法类型: spot, contract, finance, agx
   */
  @Get('products')
  async getProducts(@Query('type') type?: string) {
    const data = await this.goldService.getProducts(type);
    return { code: 0, msg: 'ok', data };
  }

  /**
   * 获取黄金玩法产品详情
   * GET /api/gold/product/:id
   */
  @Get('product/:id')
  async getProductDetail(@Param('id') id: number) {
    const data = await this.goldService.getProductDetail(id);
    return { code: 0, msg: 'ok', data };
  }

  /**
   * 获取现货黄金信息
   * GET /api/gold/spot
   */
  @Get('spot')
  async getSpotInfo() {
    const products = await this.goldService.getProducts('spot');
    const prices = await this.goldService.getGoldPrices();
    return { 
      code: 0, 
      msg: 'ok', 
      data: {
        products,
        goldPrice: prices.gold,
      }
    };
  }

  /**
   * 获取黄金秒合约配置
   * GET /api/gold/contract
   */
  @Get('contract')
  async getContractConfig() {
    const data = await this.goldService.getContractConfig();
    return { code: 0, msg: 'ok', data };
  }

  /**
   * 获取黄金理财产品列表
   * GET /api/gold/finance
   */
  @Get('finance')
  async getFinanceProducts() {
    const data = await this.goldService.getFinanceProducts();
    return { code: 0, msg: 'ok', data };
  }

  /**
   * 获取AGX首发信息
   * GET /api/gold/agx
   */
  @Get('agx')
  async getAgxLaunch() {
    const data = await this.goldService.getAgxLaunch();
    return { code: 0, msg: 'ok', data };
  }
}
