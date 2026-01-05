import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 新币发行配置表
 */
@Entity('agx_coin_issue')
export class CoinIssue {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'coin_symbol', length: 20, unique: true, comment: '币种符号' })
  coinSymbol: string;

  @Column({ name: 'coin_name', length: 50, comment: '币种名称' })
  coinName: string;

  @Column({ name: 'total_supply', type: 'decimal', precision: 20, scale: 8, comment: '总发行量' })
  totalSupply: number;

  @Column({ name: 'issue_price', type: 'decimal', precision: 20, scale: 8, comment: '发行价格' })
  issuePrice: number;

  @Column({ name: 'issue_amount', type: 'decimal', precision: 20, scale: 8, comment: '本次发行量' })
  issueAmount: number;

  @Column({ name: 'min_buy_amount', type: 'decimal', precision: 20, scale: 8, comment: '最小申购数量' })
  minBuyAmount: number;

  @Column({ name: 'max_buy_amount', type: 'decimal', precision: 20, scale: 8, comment: '最大申购数量' })
  maxBuyAmount: number;

  @Column({ name: 'start_time', type: 'timestamp', comment: '申购开始时间' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', comment: '申购结束时间' })
  endTime: Date;

  @Column({ name: 'lottery_time', type: 'timestamp', comment: '开奖时间' })
  lotteryTime: Date;

  @Column({ name: 'unlock_time', type: 'timestamp', comment: '解锁时间' })
  unlockTime: Date;

  @Column({ name: 'total_subscribed', type: 'decimal', precision: 20, scale: 8, default: 0, comment: '总申购数量' })
  totalSubscribed: number;

  @Column({ name: 'subscriber_count', type: 'int', default: 0, comment: '申购人数' })
  subscriberCount: number;

  @Column({ name: 'win_rate', type: 'decimal', precision: 10, scale: 4, nullable: true, comment: '中签率' })
  winRate: number;

  @Column({ type: 'smallint', default: 0, comment: '状态: 0-未开始, 1-进行中, 2-已结束, 3-已开奖' })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
