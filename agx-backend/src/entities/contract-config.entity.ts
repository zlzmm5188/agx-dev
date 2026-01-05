import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('agx_contract_config')
export class ContractConfig {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, comment: '交易对，如 XAU/USD' })
  @Index('idx_symbol')
  symbol: string;

  @Column({ type: 'varchar', length: 50, comment: '名称' })
  name: string;

  @Column({ type: 'int', comment: '周期秒数：30/60/120/300' })
  @Index('idx_duration')
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'profit_rate', comment: '盈利收益率' })
  profitRate: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'min_amount', comment: '最小下单' })
  minAmount: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'max_amount', comment: '最大下单' })
  maxAmount: string;

  @Column({ type: 'varchar', length: 50, name: 'pay_currencies', default: 'USDT', comment: '支付币种: USDT,CNY' })
  payCurrencies: string;

  @Column({ type: 'smallint', default: 1, comment: '状态' })
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
