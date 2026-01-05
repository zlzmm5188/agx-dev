import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 贵金属价格表
 * 专门存储黄金、白银、铂金等贵金属价格
 */
@Entity('agx_gold_price')
export class GoldPrice {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, comment: '品种代码: XAU=黄金, XAG=白银, XPT=铂金, XPD=钯金' })
  @Index('idx_symbol')
  symbol: string;

  @Column({ type: 'varchar', length: 50, comment: '品种名称' })
  name: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, comment: '当前价格(USD/盎司)' })
  price: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'price_per_gram', comment: '每克价格(USD)' })
  pricePerGram: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'open_price', nullable: true, comment: '开盘价' })
  openPrice: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'high_24h', nullable: true, comment: '24H最高' })
  high24h: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'low_24h', nullable: true, comment: '24H最低' })
  low24h: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'prev_close', nullable: true, comment: '昨收' })
  prevClose: string;

  @Column({ type: 'decimal', precision: 20, scale: 4, name: 'price_change', default: '0', comment: '价格变动' })
  priceChange: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'change_percent', default: '0', comment: '涨跌幅%' })
  changePercent: string;

  @Column({ type: 'text', nullable: true, name: 'kline_data', comment: 'K线数据JSON' })
  klineData: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'data_source', comment: '数据源' })
  dataSource: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
