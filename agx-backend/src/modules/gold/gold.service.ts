import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoldPrice, Config, GoldProduct } from '../../entities';

/**
 * 黄金模块服务
 * 提供黄金价格、贵金属行情、AGX与黄金关系等数据
 */
@Injectable()
export class GoldService {
  constructor(
    @InjectRepository(GoldPrice)
    private goldPriceRepository: Repository<GoldPrice>,
    @InjectRepository(Config)
    private configRepository: Repository<Config>,
    @InjectRepository(GoldProduct)
    private goldProductRepository: Repository<GoldProduct>,
  ) {}

  // AGX 配置
  private readonly agxConfig = {
    totalSupply: 100000000,    // 1亿枚总量
    price: 0.10,               // 首发价格 USD
    goldBacking: 100,          // 100% 黄金储备支撑
  };

  // 美联储黄金储备数据（公开数据）
  private readonly fedReserve = {
    goldTons: 8133.46,         // 吨
    bookValue: 692,            // 十亿美元（账面价值）
  };

  /**
   * 获取贵金属价格
   */
  async getGoldPrices() {
    // 尝试从数据库获取
    const prices = await this.goldPriceRepository.find();
    
    if (prices.length > 0) {
      const gold = prices.find(p => p.symbol === 'XAU');
      const silver = prices.find(p => p.symbol === 'XAG');
      const platinum = prices.find(p => p.symbol === 'XPT');
      
      return {
        gold: gold ? this.formatPriceData(gold) : this.getMockGoldPrice(),
        silver: silver ? this.formatPriceData(silver) : this.getMockSilverPrice(),
        platinum: platinum ? this.formatPriceData(platinum) : this.getMockPlatinumPrice(),
        updateTime: new Date().toISOString(),
      };
    }

    // 返回mock数据
    return {
      gold: this.getMockGoldPrice(),
      silver: this.getMockSilverPrice(),
      platinum: this.getMockPlatinumPrice(),
      updateTime: new Date().toISOString(),
    };
  }

  /**
   * 获取黄金详情
   */
  async getGoldDetail() {
    const prices = await this.getGoldPrices();
    const goldPrice = parseFloat(prices.gold.price);
    const pricePerGram = goldPrice / 31.1035; // 盎司转克

    // AGX 与黄金的关系
    const agxGoldGrams = (this.agxConfig.price / pricePerGram).toFixed(6);

    // 美联储储备当前市值
    const fedCurrentValue = (this.fedReserve.goldTons * 1000 * 1000 / 31.1035 * goldPrice) / 1e9;

    return {
      // 金价信息
      gold: prices.gold,
      silver: prices.silver,
      platinum: prices.platinum,

      // AGX 信息
      agx: {
        price: this.agxConfig.price,
        totalSupply: this.agxConfig.totalSupply,
        goldBacking: this.agxConfig.goldBacking,
        goldGrams: agxGoldGrams,           // 每个AGX对应的黄金克数
        pricePerGram: pricePerGram.toFixed(2),
      },

      // 美联储储备信息
      fedReserve: {
        goldTons: this.fedReserve.goldTons,
        bookValue: this.fedReserve.bookValue,
        currentValue: fedCurrentValue.toFixed(0),  // 当前市值（十亿美元）
      },

      updateTime: new Date().toISOString(),
    };
  }

  /**
   * 获取黄金K线数据
   */
  async getGoldKlines(symbol: string = 'XAU', interval: string = '1h', limit: number = 100) {
    // TODO: 从外部数据源获取真实K线数据
    return this.getMockKlines(limit);
  }

  // ===== 辅助方法 =====

  private formatPriceData(price: GoldPrice) {
    return {
      symbol: price.symbol,
      name: price.name,
      price: price.price,
      pricePerGram: price.pricePerGram,
      openPrice: price.openPrice,
      high24h: price.high24h,
      low24h: price.low24h,
      prevClose: price.prevClose,
      priceChange: price.priceChange,
      changePercent: price.changePercent,
    };
  }

  // ===== Mock 数据 =====

  private getMockGoldPrice() {
    const basePrice = 2656.71;
    const change = (Math.random() - 0.5) * 10;
    const price = basePrice + change;
    const pricePerGram = price / 31.1035;
    
    return {
      symbol: 'XAU',
      name: '黄金',
      price: price.toFixed(2),
      pricePerGram: pricePerGram.toFixed(2),
      openPrice: (basePrice - 5).toFixed(2),
      high24h: (basePrice + 15).toFixed(2),
      low24h: (basePrice - 12).toFixed(2),
      prevClose: (basePrice - 3).toFixed(2),
      priceChange: change.toFixed(2),
      changePercent: ((change / basePrice) * 100).toFixed(2),
    };
  }

  private getMockSilverPrice() {
    const basePrice = 30.25;
    const change = (Math.random() - 0.5) * 0.5;
    const price = basePrice + change;
    
    return {
      symbol: 'XAG',
      name: '白银',
      price: price.toFixed(2),
      pricePerGram: (price / 31.1035).toFixed(4),
      openPrice: (basePrice - 0.1).toFixed(2),
      high24h: (basePrice + 0.3).toFixed(2),
      low24h: (basePrice - 0.25).toFixed(2),
      prevClose: (basePrice - 0.05).toFixed(2),
      priceChange: change.toFixed(2),
      changePercent: ((change / basePrice) * 100).toFixed(2),
    };
  }

  private getMockPlatinumPrice() {
    const basePrice = 985.50;
    const change = (Math.random() - 0.5) * 5;
    const price = basePrice + change;
    
    return {
      symbol: 'XPT',
      name: '铂金',
      price: price.toFixed(2),
      pricePerGram: (price / 31.1035).toFixed(2),
      openPrice: (basePrice - 2).toFixed(2),
      high24h: (basePrice + 8).toFixed(2),
      low24h: (basePrice - 6).toFixed(2),
      prevClose: (basePrice - 1).toFixed(2),
      priceChange: change.toFixed(2),
      changePercent: ((change / basePrice) * 100).toFixed(2),
    };
  }

  private getMockKlines(limit: number): number[][] {
    const klines: number[][] = [];
    const now = Date.now();
    let price = 2650;

    for (let i = limit; i > 0; i--) {
      const open = price;
      const change = (Math.random() - 0.5) * 5;
      price = price + change;
      const high = Math.max(open, price) * (1 + Math.random() * 0.002);
      const low = Math.min(open, price) * (1 - Math.random() * 0.002);
      const volume = Math.random() * 10000;

      klines.push([
        now - i * 3600000,  // timestamp
        open,                // open
        high,                // high
        low,                 // low
        price,               // close
        volume,              // volume
      ]);
    }

    return klines;
  }

  // ===== 黄金玩法接口 =====

  /**
   * 获取黄金玩法分类列表
   */
  async getProductCategories() {
    return [
      { type: 'spot', name: '现货黄金', nameEn: 'Spot Gold', icon: '🥇', desc: '实时金价交易，买入即持有', color: '#FFD700' },
      { type: 'contract', name: '黄金秒合约', nameEn: 'Gold Contract', icon: '⚡', desc: '短周期合约，快速交易', color: '#FF6B6B' },
      { type: 'finance', name: '黄金理财', nameEn: 'Gold Finance', icon: '💰', desc: '稳定收益，灵活存取', color: '#4ECDC4' },
      { type: 'agx', name: 'AGX首发', nameEn: 'AGX Launch', icon: '🚀', desc: '黄金储备支撑，限时认购', color: '#9B59B6' },
    ];
  }

  /**
   * 获取黄金玩法产品列表
   * @param productType 玩法类型: spot, contract, finance, agx
   */
  async getProducts(productType?: string) {
    const query = this.goldProductRepository.createQueryBuilder('product')
      .where('product.status = :status', { status: 1 })
      .orderBy('product.sortOrder', 'ASC');
    
    if (productType) {
      query.andWhere('product.productType = :productType', { productType });
    }
    
    const list = await query.getMany();
    
    // 如果数据库为空，返回mock数据
    if (list.length === 0) {
      return this.getMockProducts(productType);
    }
    
    return list;
  }

  /**
   * 获取黄金玩法产品详情
   */
  async getProductDetail(productId: number) {
    const product = await this.goldProductRepository.findOne({ where: { id: productId } });
    
    if (!product) {
      // 返回mock详情
      return this.getMockProductDetail(productId);
    }
    
    // 添加当前金价信息
    const prices = await this.getGoldPrices();
    
    return {
      ...product,
      currentGoldPrice: prices.gold,
    };
  }

  /**
   * 获取黄金理财产品列表（包含可用额度）
   */
  async getFinanceProducts() {
    const products = await this.getProducts('finance');
    const goldPrice = await this.getGoldPrices();
    
    return {
      products,
      goldPrice: goldPrice.gold,
    };
  }

  /**
   * 获取黄金秒合约配置
   */
  async getContractConfig() {
    const products = await this.getProducts('contract');
    const goldPrice = await this.getGoldPrices();
    
    return {
      products,
      goldPrice: goldPrice.gold,
      // 默认配置
      defaultConfig: {
        periods: [30, 60, 120, 300],  // 秒
        amounts: [10, 50, 100, 500, 1000],  // USDT
        profitRate: 0.85,  // 85%盈利率
      },
    };
  }

  /**
   * 获取AGX首发信息
   */
  async getAgxLaunch() {
    const products = await this.getProducts('agx');
    const goldPrice = await this.getGoldPrices();
    const pricePerGram = parseFloat(goldPrice.gold.price) / 31.1035;
    
    const agxProduct = products[0] || {
      agxPrice: '0.10',
      agxTotalSupply: '100000000',
      agxSold: '0',
      agxGoldBacking: 100,
      agxStartTime: new Date(),
      agxEndTime: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    };
    
    const agxPrice = parseFloat(agxProduct.agxPrice || '0.10');
    const agxGoldGrams = (agxPrice / pricePerGram).toFixed(6);
    
    return {
      product: agxProduct,
      goldPrice: goldPrice.gold,
      agx: {
        price: agxPrice,
        totalSupply: parseFloat(agxProduct.agxTotalSupply || '100000000'),
        sold: parseFloat(agxProduct.agxSold || '0'),
        remaining: parseFloat(agxProduct.agxTotalSupply || '100000000') - parseFloat(agxProduct.agxSold || '0'),
        goldBacking: agxProduct.agxGoldBacking || 100,
        goldGrams: agxGoldGrams,
        pricePerGram: pricePerGram.toFixed(2),
        startTime: agxProduct.agxStartTime,
        endTime: agxProduct.agxEndTime,
        isActive: true,
      },
      fedReserve: this.fedReserve,
    };
  }

  // ===== Mock 产品数据 =====

  private getMockProducts(productType?: string): any[] {
    const allProducts = [
      // 现货黄金
      {
        id: 1, code: 'GOLD_SPOT', name: '现货黄金', productType: 'spot',
        description: '实时跟踪国际金价，随时买卖，交易灵活',
        minAmount: '0.01', maxAmount: '10000', feeRate: '0.001',
        isHot: 1, isRecommend: 1, tag: '热门', status: 1, sortOrder: 1,
      },
      // 黄金秒合约
      {
        id: 2, code: 'GOLD_30S', name: '黄金30秒合约', productType: 'contract',
        description: '30秒快速交易，预测涨跌，盈利率高达85%',
        contractPeriods: '[30]', contractProfitRate: '0.85', contractAmounts: '[10,50,100,500]',
        isHot: 1, isRecommend: 1, tag: '新上线', status: 1, sortOrder: 1,
      },
      {
        id: 3, code: 'GOLD_60S', name: '黄金60秒合约', productType: 'contract',
        description: '60秒交易，稳健之选，盈利率高达85%',
        contractPeriods: '[60]', contractProfitRate: '0.85', contractAmounts: '[10,50,100,500,1000]',
        isHot: 0, isRecommend: 1, status: 1, sortOrder: 2,
      },
      {
        id: 4, code: 'GOLD_300S', name: '黄金5分钟合约', productType: 'contract',
        description: '5分钟交易，专业之选，盈利率高达85%',
        contractPeriods: '[300]', contractProfitRate: '0.85', contractAmounts: '[50,100,500,1000,5000]',
        isHot: 0, isRecommend: 0, status: 1, sortOrder: 3,
      },
      // 黄金理财
      {
        id: 5, code: 'GOLD_FLEX', name: '黄金活期宝', productType: 'finance',
        description: '灵活存取，每日计息，随存随取',
        financePeriodDays: 0, financeApy: '0.0365', financeMinAmount: '100',
        financeTotalAmount: '10000000', financeSoldAmount: '5234567',
        isHot: 1, isRecommend: 1, tag: '推荐', status: 1, sortOrder: 1,
      },
      {
        id: 6, code: 'GOLD_7D', name: '黄金7天宝', productType: 'finance',
        description: '7天定期，较高收益，到期自动到账',
        financePeriodDays: 7, financeApy: '0.0520', financeMinAmount: '500',
        financeTotalAmount: '5000000', financeSoldAmount: '2345678',
        isHot: 0, isRecommend: 1, status: 1, sortOrder: 2,
      },
      {
        id: 7, code: 'GOLD_30D', name: '黄金30天宝', productType: 'finance',
        description: '30天定期，高收益，稳定增值',
        financePeriodDays: 30, financeApy: '0.0680', financeMinAmount: '1000',
        financeTotalAmount: '8000000', financeSoldAmount: '4567890',
        isHot: 0, isRecommend: 0, status: 1, sortOrder: 3,
      },
      // AGX首发
      {
        id: 8, code: 'AGX_LAUNCH', name: 'AGX升达金指币', productType: 'agx',
        description: '100%黄金储备支撑，首发价$0.10，限时限量',
        agxPrice: '0.10', agxTotalSupply: '100000000', agxSold: '12345678',
        agxGoldBacking: 100,
        agxStartTime: new Date('2026-01-01'),
        agxEndTime: new Date('2026-03-01'),
        isHot: 1, isRecommend: 1, tag: '限时', status: 1, sortOrder: 1,
      },
    ];
    
    if (productType) {
      return allProducts.filter(p => p.productType === productType);
    }
    return allProducts;
  }

  private getMockProductDetail(productId: number): any {
    const products = this.getMockProducts();
    return products.find(p => p.id === productId) || products[0];
  }
}
