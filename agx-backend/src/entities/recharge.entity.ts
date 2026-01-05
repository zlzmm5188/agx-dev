import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('agx_recharge')
export class Recharge {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, name: 'order_no', comment: '订单号' })
  orderNo: string;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 20, comment: '币种' })
  coin: string;

  @Column({ type: 'varchar', length: 20, comment: '链网络' })
  chain: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, comment: '充值金额' })
  amount: string;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'tx_hash', comment: '交易哈希' })
  txHash: string;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'from_address', comment: '来源地址' })
  fromAddress: string;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'to_address', comment: '目标地址' })
  toAddress: string;

  @Column({ type: 'smallint', default: 0, comment: '状态: 0待确认 1已完成 2失败' })
  status: number;

  @Column({ type: 'int', default: 0, comment: '确认数' })
  confirmations: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
