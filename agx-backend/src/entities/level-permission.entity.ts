import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 等级权限矩阵表
 * 定义不同等级用户的功能权限和限制
 */
@Entity('agx_level_permission')
@Index('idx_level_perm', ['level', 'permissionKey'], { unique: true })
export class LevelPermission {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', comment: '用户等级: 1=普通, 2=银牌, 3=金牌, 4=钻石, 5=黑金' })
  @Index('idx_lp_level')
  level: number;

  @Column({ type: 'varchar', length: 50, name: 'permission_key', comment: '权限键名' })
  @Index('idx_lp_key')
  permissionKey: string;

  @Column({ type: 'varchar', length: 100, name: 'permission_name', comment: '权限名称' })
  permissionName: string;

  @Column({ type: 'smallint', default: 1, comment: '是否允许：0不允许 1允许' })
  allowed: number;

  @Column({ type: 'int', name: 'limit_value', nullable: true, comment: '限制值（如每日发帖数、好友上限等）' })
  limitValue: number;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '备注说明' })
  remark: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
