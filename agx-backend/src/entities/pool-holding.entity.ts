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
import { PoolProduct } from './pool-product.entity';
import { User } from './user.entity';

@Entity('agx_pool_holding')
export class PoolHolding {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id' })
  @Index('idx_user_id')
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint', unsigned: true, name: 'product_id' })
  @Index('idx_product_id')
  productId: number;

  @ManyToOne(() => PoolProduct)
  @JoinColumn({ name: 'product_id' })
  product: PoolProduct;

  @Column({ type: 'decimal', precision: 20, scale: 8, comment: '持仓数量' })
  amount: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'total_income', default: 0, comment: '累计收益' })
  totalIncome: string;

  @Column({ type: 'timestamp', name: 'start_at', comment: '开始计息时间' })
  startAt: Date;

  @Column({ type: 'timestamp', name: 'end_at', nullable: true, comment: '到期时间' })
  endAt: Date;

  @Column({ type: 'smallint', default: 1, comment: '状态：0已赎回 1持仓中' })
  @Index('idx_status')
  status: number;

  @Column({ type: 'timestamp', name: 'redeemed_at', nullable: true, comment: '赎回时间' })
  redeemedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
