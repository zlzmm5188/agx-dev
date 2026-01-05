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

@Entity('agx_withdraw')
export class Withdraw {
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

  @Column({ type: 'decimal', precision: 30, scale: 8, comment: '提现金额' })
  amount: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, default: '0', comment: '手续费' })
  fee: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, name: 'actual_amount', comment: '实际到账' })
  actualAmount: string;

  @Column({ type: 'varchar', length: 128, name: 'to_address', comment: '提现地址' })
  toAddress: string;

  @Column({ type: 'varchar', length: 128, nullable: true, name: 'tx_hash', comment: '交易哈希' })
  txHash: string;

  @Column({ type: 'smallint', default: 0, comment: '状态: 0待审核 1处理中 2已完成 3拒绝' })
  status: number;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '审核备注' })
  remark: string;

  @Column({ type: 'timestamp', nullable: true, name: 'reviewed_at', comment: '审核时间' })
  reviewedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
