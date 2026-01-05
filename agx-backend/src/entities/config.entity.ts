import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('agx_config')
export class Config {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'config_key', comment: '配置键' })
  configKey: string;

  @Column({ type: 'text', name: 'config_value', comment: '配置值' })
  configValue: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '配置描述' })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'config_group', comment: '分组' })
  configGroup: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
