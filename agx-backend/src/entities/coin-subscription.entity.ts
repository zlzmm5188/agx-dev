import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 新币申购记录表
 */
@Entity('agx_coin_subscription')
export class CoinSubscription {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', comment: '用户ID' })
  userId: number;

  @Column({ name: 'issue_id', type: 'bigint', comment: '发行ID' })
  issueId: number;

  @Column({ name: 'buy_amount', type: 'decimal', precision: 20, scale: 8, comment: '申购数量' })
  buyAmount: number;

  @Column({ name: 'pay_amount', type: 'decimal', precision: 20, scale: 8, comment: '支付金额' })
  payAmount: number;

  @Column({ name: 'win_amount', type: 'decimal', precision: 20, scale: 8, default: 0, comment: '中签数量' })
  winAmount: number;

  @Column({ name: 'refund_amount', type: 'decimal', precision: 20, scale: 8, default: 0, comment: '退款金额' })
  refundAmount: number;

  @Column({ type: 'smallint', default: 0, comment: '状态: 0-待开奖, 1-已中签, 2-未中签' })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
