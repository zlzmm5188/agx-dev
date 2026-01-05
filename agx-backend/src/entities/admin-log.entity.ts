import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Admin } from './admin.entity';

@Entity('agx_admin_log')
export class AdminLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'admin_id' })
  adminId: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({ type: 'varchar', length: 100, comment: '操作模块' })
  module: string;

  @Column({ type: 'varchar', length: 100, comment: '操作动作' })
  action: string;

  @Column({ type: 'text', nullable: true, comment: '操作详情' })
  detail: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'IP地址' })
  ip: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'user_agent', comment: '用户代理' })
  userAgent: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
