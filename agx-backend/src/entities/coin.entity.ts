import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('agx_coin')
export class Coin {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true, comment: '币种符号' })
  @Index('idx_symbol', { unique: true })
  symbol: string;

  @Column({ type: 'varchar', length: 50, comment: '币种名称' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '图标URL' })
  icon: string;

  @Column({ type: 'smallint', default: 8, comment: '小数位数' })
  decimals: number;

  @Column({ type: 'smallint', name: 'is_deposit', default: 1, comment: '是否可充值' })
  isDeposit: number;

  @Column({ type: 'smallint', name: 'is_withdraw', default: 1, comment: '是否可提现' })
  isWithdraw: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'min_withdraw', default: 0, comment: '最小提现' })
  minWithdraw: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'withdraw_fee', default: 0, comment: '提现手续费' })
  withdrawFee: string;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序' })
  sortOrder: number;

  @Column({ type: 'smallint', default: 1, comment: '状态' })
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
