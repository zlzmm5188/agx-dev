import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContractConfig } from './contract-config.entity';
import { User } from './user.entity';

@Entity('agx_contract_order')
export class ContractOrder {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 32, name: 'order_no', unique: true, comment: '订单号' })
  @Index('idx_order_no', { unique: true })
  orderNo: string;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id' })
  @Index('idx_user_id')
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint', unsigned: true, name: 'config_id' })
  configId: number;

  @ManyToOne(() => ContractConfig)
  @JoinColumn({ name: 'config_id' })
  config: ContractConfig;

  @Column({ type: 'varchar', length: 20, comment: '交易对' })
  symbol: string;

  @Column({ type: 'int', comment: '周期秒数' })
  duration: number;

  @Column({ type: 'smallint', comment: '方向：1看涨 2看跌' })
  direction: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, comment: '下单金额' })
  amount: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'open_price', comment: '开仓价' })
  openPrice: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'close_price', nullable: true, comment: '平仓价' })
  closePrice: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'profit_rate', comment: '收益率' })
  profitRate: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'profit_loss', nullable: true, comment: '盈亏金额' })
  profitLoss: string;

  @Column({ type: 'smallint', nullable: true, comment: '结果：1盈 2亏 3平' })
  result: number;

  @Column({ type: 'smallint', default: 0, comment: '状态：0进行中 1已结算' })
  @Index('idx_status')
  status: number;

  @Column({ type: 'timestamp', name: 'open_at', comment: '开仓时间' })
  openAt: Date;

  @Column({ type: 'timestamp', name: 'close_at', nullable: true, comment: '平仓时间' })
  closeAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
