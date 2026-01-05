import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('agx_pool_product')
export class PoolProduct {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, comment: '产品名称' })
  name: string;

  @Column({ type: 'bigint', unsigned: true, name: 'coin_id', comment: '投入币种' })
  coinId: number;

  @Column({ type: 'varchar', length: 20, comment: '类型：flexible(活期) / fixed(定期)' })
  @Index('idx_type')
  type: string;

  @Column({ type: 'int', name: 'lock_days', default: 0, comment: '锁定天数，0为活期' })
  lockDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, name: 'daily_rate', comment: '日收益率' })
  dailyRate: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'min_amount', comment: '最低申购' })
  minAmount: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'max_amount', nullable: true, comment: '最高申购' })
  maxAmount: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'total_quota', nullable: true, comment: '总额度' })
  totalQuota: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'sold_amount', default: 0, comment: '已售额度' })
  soldAmount: string;

  @Column({ type: 'smallint', name: 'is_hot', default: 0, comment: '是否热门' })
  isHot: number;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序' })
  sortOrder: number;

  @Column({ type: 'varchar', length: 50, name: 'pay_currencies', default: 'USDT', comment: '支付币种: USDT,CNY' })
  payCurrencies: string;

  @Column({ type: 'smallint', default: 1, comment: '状态：0下架 1上架' })
  @Index('idx_status')
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
