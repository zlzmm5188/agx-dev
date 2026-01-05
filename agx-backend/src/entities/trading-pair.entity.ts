import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 交易对配置表
 */
@Entity('agx_trading_pair')
export class TradingPair {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 20, unique: true, comment: '交易对符号，如 BTCUSDT' })
  symbol: string;

  @Column({ name: 'base_coin', length: 20, comment: '基础货币，如 BTC' })
  baseCoin: string;

  @Column({ name: 'quote_coin', length: 20, comment: '计价货币，如 USDT' })
  quoteCoin: string;

  @Column({ name: 'min_qty', type: 'decimal', precision: 20, scale: 8, default: 0.00000001, comment: '最小交易量' })
  minQty: number;

  @Column({ name: 'max_qty', type: 'decimal', precision: 20, scale: 8, nullable: true, comment: '最大交易量' })
  maxQty: number;

  @Column({ name: 'price_precision', type: 'int', default: 8, comment: '价格精度' })
  pricePrecision: number;

  @Column({ name: 'qty_precision', type: 'int', default: 8, comment: '数量精度' })
  qtyPrecision: number;

  @Column({ name: 'trade_fee', type: 'decimal', precision: 10, scale: 6, default: 0.002, comment: '交易手续费率' })
  tradeFee: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0-禁用, 1-启用' })
  status: number;

  @Column({ name: 'sort_order', type: 'int', default: 0, comment: '排序顺序' })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
