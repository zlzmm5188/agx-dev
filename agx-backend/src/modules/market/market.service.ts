import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetTicker } from '../../entities';

/**
 * 行情服务
 * 提供多资产行情数据（加密货币、外汇、股票、债券等）
 */
@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    @InjectRepository(AssetTicker)
    private tickerRepository: Repository<AssetTicker>,
  ) {}

  /**
   * 获取资产列表
   */
  async getAssets(assetType?: string) {
    const query = this.assetRepository.createQueryBuilder('asset')
      .where('asset.status = :status', { status: 1 })
      .orderBy('asset.sortOrder', 'ASC');
    
    if (assetType) {
      query.andWhere('asset.assetType = :assetType', { assetType });
    }
    
    return await query.getMany();
  }

  /**
   * 获取行情列表
   * @param assetType 资产类型: crypto, forex, stocks, bonds, metal
   * @param subTab 子分类: all, hot, gainers, losers, volume
   */
  async getTickers(assetType: string, subTab: string = 'all') {
    // 先从缓存表获取
    let query = this.tickerRepository.createQueryBuilder('ticker')
      .where('ticker.assetType = :assetType', { assetType });
    
    let list = await query.getMany();
    
    // 如果缓存为空，返回mock数据
    if (list.length === 0) {
      list = this.getMockTickers(assetType);
    }
    
    // 按子分类排序
    switch (subTab) {
      case 'hot':
        return list.slice(0, 10);
      case 'gainers':
        return list.filter(x => parseFloat(x.priceChangePercent) > 0)
          .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent));
      case 'losers':
        return list.filter(x => parseFloat(x.priceChangePercent) < 0)
          .sort((a, b) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent));
      case 'volume':
        return list.sort((a, b) => parseFloat(b.quoteVolume || '0') - parseFloat(a.quoteVolume || '0'));
      default:
        return list;
    }
  }

  /**
   * 获取单个行情
   */
  async getTicker(symbol: string) {
    const ticker = await this.tickerRepository.findOne({ where: { symbol } });
    if (ticker) return ticker;
    
    // 返回mock
    return this.getMockTicker(symbol);
  }

  /**
   * 获取K线数据
   */
  async getKlines(symbol: string, interval: string = '1h', limit: number = 100) {
    // TODO: 从数据源获取K线数据
    // 暂时返回mock数据
    return this.getMockKlines(symbol, limit);
  }

  // ===== Mock 数据 =====
  
  private getMockTickers(assetType: string): AssetTicker[] {
    const mockData: Record<string, any[]> = {
      crypto: [
        { symbol: 'BTCUSDT', lastPrice: '98062.63', priceChangePercent: '0.56', volume: '12345678900' },
        { symbol: 'ETHUSDT', lastPrice: '3522.47', priceChangePercent: '2.10', volume: '8765432100' },
        { symbol: 'BNBUSDT', lastPrice: '685.32', priceChangePercent: '1.25', volume: '2345678900' },
        { symbol: 'SOLUSDT', lastPrice: '193.92', priceChangePercent: '3.15', volume: '3456789000' },
        { symbol: 'XRPUSDT', lastPrice: '2.34', priceChangePercent: '-1.20', volume: '5678901200' },
        { symbol: 'DOGEUSDT', lastPrice: '0.3856', priceChangePercent: '5.67', volume: '6789012300' },
        { symbol: 'ADAUSDT', lastPrice: '0.9823', priceChangePercent: '0.89', volume: '1234567800' },
        { symbol: 'AVAXUSDT', lastPrice: '42.56', priceChangePercent: '-2.34', volume: '987654320' },
        { symbol: 'DOTUSDT', lastPrice: '7.89', priceChangePercent: '1.56', volume: '876543210' },
        { symbol: 'MATICUSDT', lastPrice: '0.5234', priceChangePercent: '-0.78', volume: '765432100' },
        { symbol: 'LINKUSDT', lastPrice: '23.45', priceChangePercent: '4.32', volume: '654321000' },
        { symbol: 'LTCUSDT', lastPrice: '105.67', priceChangePercent: '0.12', volume: '543210000' },
      ],
      forex: [
        { symbol: 'EUR/USD', lastPrice: '1.0523', priceChangePercent: '0.15' },
        { symbol: 'GBP/USD', lastPrice: '1.2534', priceChangePercent: '-0.23' },
        { symbol: 'USD/JPY', lastPrice: '157.34', priceChangePercent: '0.45' },
        { symbol: 'USD/CHF', lastPrice: '0.9012', priceChangePercent: '-0.12' },
        { symbol: 'AUD/USD', lastPrice: '0.6234', priceChangePercent: '0.32' },
        { symbol: 'USD/CAD', lastPrice: '1.4356', priceChangePercent: '-0.18' },
        { symbol: 'NZD/USD', lastPrice: '0.5678', priceChangePercent: '0.56' },
        { symbol: 'EUR/GBP', lastPrice: '0.8397', priceChangePercent: '0.08' },
        { symbol: 'EUR/JPY', lastPrice: '165.67', priceChangePercent: '0.67' },
        { symbol: 'GBP/JPY', lastPrice: '197.23', priceChangePercent: '0.23' },
        { symbol: 'USD/CNY', lastPrice: '7.2987', priceChangePercent: '0.05' },
        { symbol: 'USD/HKD', lastPrice: '7.7856', priceChangePercent: '0.01' },
      ],
      stocks: [
        { symbol: 'AAPL', lastPrice: '252.34', priceChangePercent: '1.23' },
        { symbol: 'MSFT', lastPrice: '428.56', priceChangePercent: '0.89' },
        { symbol: 'GOOGL', lastPrice: '192.78', priceChangePercent: '1.56' },
        { symbol: 'AMZN', lastPrice: '225.45', priceChangePercent: '2.34' },
        { symbol: 'NVDA', lastPrice: '137.89', priceChangePercent: '3.45' },
        { symbol: 'META', lastPrice: '612.34', priceChangePercent: '1.78' },
        { symbol: 'TSLA', lastPrice: '421.56', priceChangePercent: '-2.12' },
        { symbol: 'BRK.B', lastPrice: '456.78', priceChangePercent: '0.45' },
      ],
      bonds: [
        { symbol: 'US10Y', lastPrice: '4.55', priceChangePercent: '0.02' },
        { symbol: 'US2Y', lastPrice: '4.25', priceChangePercent: '-0.03' },
        { symbol: 'US30Y', lastPrice: '4.75', priceChangePercent: '0.05' },
        { symbol: 'DE10Y', lastPrice: '2.35', priceChangePercent: '0.01' },
        { symbol: 'GB10Y', lastPrice: '4.52', priceChangePercent: '-0.02' },
        { symbol: 'JP10Y', lastPrice: '1.08', priceChangePercent: '0.01' },
        { symbol: 'CN10Y', lastPrice: '1.72', priceChangePercent: '-0.01' },
        { symbol: 'AU10Y', lastPrice: '4.42', priceChangePercent: '0.03' },
      ],
      // 基金资产
      fund: [
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF', lastPrice: '598.56', priceChangePercent: '0.89', volume: '45678900' },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', lastPrice: '528.34', priceChangePercent: '1.23', volume: '34567890' },
        { symbol: 'IWM', name: 'iShares Russell 2000', lastPrice: '223.45', priceChangePercent: '0.56', volume: '23456789' },
        { symbol: 'VTI', name: 'Vanguard Total Stock Market', lastPrice: '285.67', priceChangePercent: '0.78', volume: '12345678' },
        { symbol: 'GLD', name: 'SPDR Gold Shares', lastPrice: '245.89', priceChangePercent: '0.34', volume: '9876543' },
        { symbol: 'SLV', name: 'iShares Silver Trust', lastPrice: '28.45', priceChangePercent: '0.67', volume: '8765432' },
        { symbol: 'USO', name: 'United States Oil Fund', lastPrice: '72.34', priceChangePercent: '-0.45', volume: '7654321' },
        { symbol: 'TLT', name: 'iShares 20+ Year Treasury', lastPrice: '89.56', priceChangePercent: '-0.23', volume: '6543210' },
        { symbol: 'EEM', name: 'iShares MSCI Emerging Markets', lastPrice: '42.78', priceChangePercent: '0.45', volume: '5432109' },
        { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets', lastPrice: '52.34', priceChangePercent: '0.34', volume: '4321098' },
        { symbol: 'BND', name: 'Vanguard Total Bond Market', lastPrice: '72.89', priceChangePercent: '0.12', volume: '3210987' },
        { symbol: 'VNQ', name: 'Vanguard Real Estate', lastPrice: '98.45', priceChangePercent: '0.56', volume: '2109876' },
      ],
      // 贵金属资产
      metal: [
        { symbol: 'XAU/USD', name: '黄金', lastPrice: '2656.71', priceChangePercent: '0.45', volume: '12345678' },
        { symbol: 'XAG/USD', name: '白银', lastPrice: '30.25', priceChangePercent: '0.67', volume: '9876543' },
        { symbol: 'XPT/USD', name: '铂金', lastPrice: '985.50', priceChangePercent: '-0.23', volume: '5432109' },
        { symbol: 'XPD/USD', name: '钯金', lastPrice: '1023.45', priceChangePercent: '0.89', volume: '4321098' },
        { symbol: 'CU/USD', name: '铜', lastPrice: '4.25', priceChangePercent: '0.34', volume: '3210987' },
      ],
    };
    
    return (mockData[assetType] || []).map(item => ({
      ...item,
      assetType,
      priceChange: '0',
      quoteVolume: item.volume || '0',
    } as AssetTicker));
  }

  private getMockTicker(symbol: string): AssetTicker {
    return {
      symbol,
      assetType: 'crypto',
      lastPrice: '100.00',
      priceChange: '0',
      priceChangePercent: '0',
    } as AssetTicker;
  }

  private getMockKlines(symbol: string, limit: number): number[][] {
    const klines: number[][] = [];
    const now = Date.now();
    let price = 100;
    
    for (let i = limit; i > 0; i--) {
      const open = price;
      const change = (Math.random() - 0.5) * 2;
      price = price * (1 + change / 100);
      const high = Math.max(open, price) * (1 + Math.random() * 0.01);
      const low = Math.min(open, price) * (1 - Math.random() * 0.01);
      const volume = Math.random() * 1000000;
      
      klines.push([
        now - i * 3600000, // timestamp
        open,               // open
        high,               // high
        low,                // low
        price,              // close
        volume,             // volume
      ]);
    }
    
    return klines;
  }
}
