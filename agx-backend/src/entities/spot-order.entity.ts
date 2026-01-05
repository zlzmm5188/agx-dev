import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 现货订单表
 */
@Entity('agx_spot_order')
export class SpotOrder {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'order_no', length: 32, unique: true, comment: '订单编号' })
  orderNo: string;

  @Column({ name: 'user_id', type: 'bigint', comment: '用户ID' })
  userId: number;

  @Column({ name: 'pair_id', type: 'bigint', comment: '交易对ID' })
  pairId: number;

  @Column({ length: 20, comment: '交易对符号' })
  symbol: string;

  @Column({ length: 10, comment: '买卖方向: buy-买入, sell-卖出' })
  side: string;

  @Column({ length: 10, comment: '订单类型: limit-限价, market-市价' })
  type: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true, comment: '委托价格' })
  price: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, comment: '委托数量' })
  quantity: number;

  @Column({ name: 'executed_qty', type: 'decimal', precision: 20, scale: 8, default: 0, comment: '已成交数量' })
  executedQty: number;

  @Column({ name: 'avg_price', type: 'decimal', precision: 20, scale: 8, nullable: true, comment: '平均成交价' })
  avgPrice: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0, comment: '手续费' })
  fee: number;

  @Column({ name: 'fee_coin', length: 10, nullable: true, comment: '手续费币种' })
  feeCoin: string;

  @Column({ type: 'smallint', default: 0, comment: '订单状态: 0-待成交, 1-部分成交, 2-全部成交, 3-已取消, 4-失败' })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
