import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('agx_asset_log')
export class AssetLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id' })
  @Index('idx_user_id')
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 20, comment: '币种' })
  coin: string;

  @Column({ type: 'varchar', length: 20, comment: '类型: recharge/withdraw/pool_in/pool_out/contract/commission' })
  type: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, comment: '变动金额' })
  amount: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, name: 'balance_before', comment: '变动前余额' })
  balanceBefore: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, name: 'balance_after', comment: '变动后余额' })
  balanceAfter: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'ref_no', comment: '关联单号' })
  refNo: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '备注' })
  remark: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
