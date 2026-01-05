import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('agx_commission')
export class Commission {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '获得返佣的用户' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint', unsigned: true, name: 'from_user_id', comment: '产生返佣的下级用户' })
  fromUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User;

  @Column({ type: 'smallint', default: 1, comment: '返佣层级: 1一级 2二级' })
  level: number;

  @Column({ type: 'varchar', length: 50, comment: '来源类型: pool/contract' })
  source: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'source_id', comment: '来源订单ID' })
  sourceId: number;

  @Column({ type: 'varchar', length: 20, comment: '币种' })
  coin: string;

  @Column({ type: 'decimal', precision: 30, scale: 8, comment: '返佣金额' })
  amount: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, comment: '返佣比例' })
  rate: string;

  @Column({ type: 'smallint', default: 0, comment: '状态: 0待发放 1已发放' })
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
