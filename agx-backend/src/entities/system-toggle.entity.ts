import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 系统功能开关表
 * 控制全局功能的开启/关闭，实时生效
 */
@Entity('agx_system_toggle')
export class SystemToggle {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '开关键名' })
  @Index('idx_toggle_key', { unique: true })
  key: string;

  @Column({ type: 'varchar', length: 100, comment: '开关名称' })
  name: string;

  @Column({ type: 'varchar', length: 50, comment: '所属模块：social, trade, content, asset, user' })
  @Index('idx_toggle_module')
  module: string;

  @Column({ type: 'smallint', default: 1, comment: '是否开启：0关闭 1开启' })
  enabled: number;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '描述说明' })
  description: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'updated_by', comment: '最后修改人ID' })
  updatedBy: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
