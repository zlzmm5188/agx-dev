import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('agx_admin')
export class Admin {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '用户名' })
  @Index('idx_username', { unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash', comment: '密码哈希' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ type: 'varchar', length: 32, default: 'admin', comment: '角色' })
  role: string;

  @Column({ type: 'text', nullable: true, comment: '权限列表，JSON' })
  permissions: string;

  @Column({ type: 'smallint', default: 1, comment: '状态' })
  status: number;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'last_login_ip' })
  lastLoginIp: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
