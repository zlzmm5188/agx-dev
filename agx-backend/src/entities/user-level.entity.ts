import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 用户等级配置表
 */
@Entity('agx_user_level')
export class UserLevel {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'int', unique: true, comment: '等级数值: 1, 2, 3...' })
  @Index('idx_level', { unique: true })
  level: number;

  @Column({ type: 'varchar', length: 50, comment: '等级名称: 普通会员, 银牌会员, 金牌会员...' })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'name_en', nullable: true, comment: '英文名称' })
  nameEn: string;

  @Column({ type: 'varchar', length: 10, nullable: true, comment: '等级图标emoji' })
  icon: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '等级颜色' })
  color: string;

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'min_assets', default: '0', comment: '最低资产要求(USDT)' })
  minAssets: string;

  @Column({ type: 'int', name: 'min_invites', default: 0, comment: '最低邀请人数' })
  minInvites: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'min_trade_volume', default: '0', comment: '最低交易量要求' })
  minTradeVolume: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, name: 'commission_rate_1', default: '0.20', comment: '一级返佣比例' })
  commissionRate1: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, name: 'commission_rate_2', default: '0.10', comment: '二级返佣比例' })
  commissionRate2: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, name: 'fee_discount', default: '1.00', comment: '手续费折扣: 0.9=9折' })
  feeDiscount: string;

  @Column({ type: 'text', nullable: true, comment: '等级权益描述JSON' })
  benefits: string;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序' })
  sortOrder: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0禁用 1启用' })
  status: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
