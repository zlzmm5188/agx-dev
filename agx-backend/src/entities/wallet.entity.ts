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
import { Coin } from './coin.entity';

@Entity('agx_wallet')
@Index('idx_user_coin', ['userId', 'coinId'], { unique: true })
export class Wallet {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id' })
  @Index('idx_user_id')
  userId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'coin_id' })
  coinId: number;

  @ManyToOne(() => Coin)
  @JoinColumn({ name: 'coin_id' })
  coin: Coin;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0, comment: '可用余额' })
  balance: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0, comment: '冻结余额' })
  frozen: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
