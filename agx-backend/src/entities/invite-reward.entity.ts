import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * 邀请奖励记录表
 */
@Entity('agx_invite_reward')
export class InviteReward {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '获得奖励的用户ID' })
  @Index('idx_user_id')
  userId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'invited_user_id', comment: '被邀请用户ID' })
  @Index('idx_invited_user_id')
  invitedUserId: number;

  @Column({ type: 'varchar', length: 50, name: 'reward_type', comment: '奖励类型: signup=注册奖励, kyc=实名奖励, first_trade=首笔交易, first_deposit=首充' })
  rewardType: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, comment: '奖励金额' })
  amount: string;

  @Column({ type: 'varchar', length: 20, name: 'coin_symbol', default: 'USDT', comment: '奖励币种' })
  coinSymbol: string;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0待发放 1已发放 2已过期' })
  status: number;

  @Column({ type: 'timestamp', nullable: true, name: 'issued_at', comment: '发放时间' })
  issuedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
