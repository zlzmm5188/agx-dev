import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('agx_user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, comment: '用户UID' })
  @Index('idx_uid', { unique: true })
  uid: string;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '用户名' })
  @Index('idx_username', { unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash', comment: '密码哈希' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({ type: 'varchar', length: 16, name: 'invite_code', unique: true, comment: '我的邀请码' })
  @Index('idx_invite_code', { unique: true })
  inviteCode: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true, name: 'inviter_id', comment: '邀请人ID' })
  @Index('idx_inviter_id')
  inviterId: number;

  @Column({ type: 'smallint', name: 'kyc_status', default: 0, comment: 'KYC状态：0未认证 1认证中 2已认证 3失败' })
  kycStatus: number;

  @Column({ type: 'smallint', default: 1, comment: '账户状态：0禁用 1正常' })
  status: number;

  @Column({ type: 'int', name: 'win_rate', default: 50, comment: '合约胜率控制: 0-100' })
  winRate: number;

  // ===== 等级与邀请扩展字段 =====
  @Column({ type: 'int', default: 1, comment: '用户等级: 1=普通, 2=银牌, 3=金牌, 4=钻石, 5=黑金' })
  level: number;

  @Column({ type: 'smallint', name: 'is_verified', default: 0, comment: '是否认证用户: 0否 1是（大V标识）' })
  isVerified: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'user_tag', comment: '用户标签: 大V/策略/分析师等' })
  userTag: string;

  @Column({ type: 'int', name: 'invite_count', default: 0, comment: '直接邀请人数' })
  inviteCount: number;

  @Column({ type: 'int', name: 'team_count', default: 0, comment: '团队总人数' })
  teamCount: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'total_commission', default: '0', comment: '累计返佣' })
  totalCommission: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'total_trade_volume', default: '0', comment: '累计交易额' })
  totalTradeVolume: string;

  @Column({ type: 'int', name: 'follower_count', default: 0, comment: '粉丝数' })
  followerCount: number;

  @Column({ type: 'int', name: 'following_count', default: 0, comment: '关注数' })
  followingCount: number;

  @Column({ type: 'int', name: 'post_count', default: 0, comment: '帖子数' })
  postCount: number;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '个人简介' })
  bio: string;

  // ===== 社交状态控制字段 =====
  @Column({ type: 'smallint', name: 'social_status', default: 1, comment: '社交状态：1正常 0禁言 -1社交封禁' })
  socialStatus: number;

  @Column({ type: 'smallint', name: 'can_be_friended', default: 1, comment: '是否允许被加好友：0否 1是' })
  canBeFriended: number;

  @Column({ type: 'smallint', name: 'can_send_friend_request', default: 1, comment: '是否允许发起好友请求：0否 1是' })
  canSendFriendRequest: number;

  @Column({ type: 'smallint', name: 'can_chat', default: 1, comment: '是否允许私聊：0否 1是' })
  canChat: number;

  @Column({ type: 'int', name: 'friend_count', default: 0, comment: '好友数' })
  friendCount: number;

  @Column({ type: 'timestamp', nullable: true, name: 'mute_until', comment: '禁言截止时间' })
  muteUntil: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at', comment: '最后登录时间' })
  lastLoginAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'last_login_ip', comment: '最后登录IP' })
  lastLoginIp: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;
}
