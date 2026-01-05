import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coin } from './coin.entity';

@Entity('agx_coin_chain')
export class CoinChain {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'coin_id' })
  coinId: number;

  @ManyToOne(() => Coin)
  @JoinColumn({ name: 'coin_id' })
  coin: Coin;

  @Column({ type: 'varchar', length: 50, comment: '链名称' })
  chain: string;

  @Column({ type: 'varchar', length: 20, name: 'chain_symbol', comment: '链标识如TRC20/ERC20' })
  chainSymbol: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'contract_address', comment: '合约地址' })
  contractAddress: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, default: '0', name: 'withdraw_fee', comment: '提现手续费' })
  withdrawFee: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, default: '0', name: 'min_withdraw', comment: '最小提现金额' })
  minWithdraw: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, default: '0', name: 'max_withdraw', comment: '最大提现金额' })
  maxWithdraw: string;

  @Column({ type: 'int', default: 6, comment: '确认数' })
  confirmations: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0禁用 1启用' })
  status: number;

  @Column({ type: 'int', default: 0, name: 'sort_order', comment: '排序' })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
