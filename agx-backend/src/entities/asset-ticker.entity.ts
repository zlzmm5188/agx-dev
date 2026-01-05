import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 行情数据缓存表
 * 缓存各类资产的实时/历史行情数据
 */
@Entity('agx_asset_ticker')
export class AssetTicker {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 32, comment: '资产代码' })
  @Index('idx_symbol')
  symbol: string;

  @Column({ type: 'varchar', length: 20, name: 'asset_type', comment: '资产类型: crypto/forex/stock/metal/fund/index/bond' })
  @Index('idx_asset_type')
  assetType: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'last_price', comment: '最新价格' })
  lastPrice: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'open_price', nullable: true, comment: '开盘价' })
  openPrice: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'high_price', nullable: true, comment: '24H最高价' })
  highPrice: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'low_price', nullable: true, comment: '24H最低价' })
  lowPrice: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'prev_close', nullable: true, comment: '前收盘价' })
  prevClose: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'price_change', default: '0', comment: '价格变动' })
  priceChange: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'price_change_percent', default: '0', comment: '价格变动百分比' })
  priceChangePercent: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, nullable: true, comment: '24H成交量' })
  volume: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, name: 'quote_volume', nullable: true, comment: '24H成交额' })
  quoteVolume: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'data_source', comment: '数据源' })
  dataSource: string;

  @Column({ type: 'text', nullable: true, comment: '扩展数据JSON，如K线数据' })
  extra: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
