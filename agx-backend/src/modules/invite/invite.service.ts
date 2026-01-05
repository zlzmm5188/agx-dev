import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserInvite, UserLevel, InviteReward, Commission, Rank } from '../../entities';

/**
 * 邀请与等级服务
 */
@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserInvite)
    private userInviteRepository: Repository<UserInvite>,
    @InjectRepository(UserLevel)
    private userLevelRepository: Repository<UserLevel>,
    @InjectRepository(InviteReward)
    private inviteRewardRepository: Repository<InviteReward>,
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
    @InjectRepository(Rank)
    private rankRepository: Repository<Rank>,
  ) {}

  /**
   * 获取用户邀请信息
   */
  async getInviteInfo(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }

    // 获取邀请统计
    const inviteCount = user.inviteCount || 0;
    const teamCount = user.teamCount || 0;
    const totalCommission = user.totalCommission || '0';

    // 获取邀请码和链接
    const inviteCode = user.inviteCode;
    const inviteLink = `https://agx.bi/register?ref=${inviteCode}`;

    // 获取等级信息
    const levelInfo = await this.getUserLevel(user.level);

    return {
      inviteCode,
      inviteLink,
      inviteCount,
      teamCount,
      totalCommission,
      level: user.level,
      levelInfo,
      rewards: {
        signup: 10,  // 注册奖励 USDT
        trade: 20,   // 交易返佣比例 %
        lifetime: true // 终身返佣
      }
    };
  }

  /**
   * 计算返佣金额
   */
  async calculateCommission(userId: number, fromUserId: number, amount: string, sourceType: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BusinessException(9001, '用户不存在');
    }

    // 检查KYC状态
    if (user.kycStatus !== 2) {
      throw new BusinessException(9002, '用户未完成实名认证，无法获得返佣');
    }

    // 获取用户等级
    const levelInfo = await this.getUserLevel(user.level);
    if (!levelInfo) {
      throw new BusinessException(9003, '用户等级信息不存在');
    }

    // 根据等级获取返佣比例
    let commissionRate1 = parseFloat(levelInfo.commissionRate1) || 0.20;
    let commissionRate2 = parseFloat(levelInfo.commissionRate2) || 0.10;

    // 获取邀请关系
    const invite1 = await this.userInviteRepository.findOne({
      where: { userId: fromUserId, inviterId: userId, level: 1 },
    });

    const invite2 = await this.userInviteRepository.findOne({
      where: { userId: fromUserId, inviterId: userId, level: 2 },
    });

    let commissionAmount = '0';
    let commissionLevel = 0;

    if (invite1) {
      // 一级返佣
      commissionAmount = (parseFloat(amount) * commissionRate1).toFixed(8);
      commissionLevel = 1;
    } else if (invite2) {
      // 二级返佣
      commissionAmount = (parseFloat(amount) * commissionRate2).toFixed(8);
      commissionLevel = 2;
    } else {
      // 不是邀请关系，不返佣
      return { commissionAmount, commissionLevel };
    }

    // 创建返佣记录
    const commission = this.commissionRepository.create({
      userId,
      fromUserId,
      level: commissionLevel,
      source: sourceType,
      coin: 'USDT', // 默认币种，可根据需求调整
      amount: commissionAmount,
      rate: commissionLevel === 1 ? commissionRate1.toString() : commissionRate2.toString(),
      status: 0, // 0: 待发放
    });
    await this.commissionRepository.save(commission);

    // 更新用户总返佣
    user.totalCommission = (parseFloat(user.totalCommission) + parseFloat(commissionAmount)).toFixed(8);
    await this.userRepository.save(user);

    return { commissionAmount, commissionLevel, commissionId: commission.id };
  }

  /**
   * 获取用户等级信息
   */
  async getUserLevel(level: number) {
    const levelInfo = await this.userLevelRepository.findOne({ where: { level } });
    if (levelInfo) return levelInfo;

    // 返回默认等级配置
    return this.getDefaultLevel(level);
  }

  /**
   * 获取所有等级配置
   */
  async getAllLevels() {
    const levels = await this.userLevelRepository.find({
      where: { status: 1 },
      order: { level: 'ASC' }
    });

    if (levels.length === 0) {
      return this.getMockLevels();
    }

    return levels;
  }

  /**
   * 获取邀请记录
   */
  async getInviteRecords(userId: number, page: number = 1, pageSize: number = 20) {
    const [list, total] = await this.userInviteRepository.findAndCount({
      where: { inviterId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 填充用户信息
    const records = await Promise.all(list.map(async (invite) => {
      const user = await this.userRepository.findOne({ 
        where: { id: invite.userId },
        select: ['id', 'uid', 'username', 'nickname', 'avatar', 'kycStatus', 'createdAt']
      });
      return {
        ...invite,
        user,
        status: user?.kycStatus >= 2 ? 'active' : 'pending',
      };
    }));

    // 如果没有数据，返回mock
    if (records.length === 0) {
      return { list: this.getMockInviteRecords(), total: 3 };
    }

    return { list: records, total };
  }

  /**
   * 获取返佣记录
   */
  async getCommissionRecords(userId: number, page: number = 1, pageSize: number = 20) {
    const [list, total] = await this.commissionRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (list.length === 0) {
      return { list: this.getMockCommissions(), total: 5 };
    }

    return { list, total };
  }

  /**
   * 获取排行榜
   */
  async getRankList(rankType: string = 'profit', timeRange: string = 'week', page: number = 1, pageSize: number = 50) {
    const ranks = await this.rankRepository.find({
      where: { rankType, timeRange },
      order: { position: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (ranks.length === 0) {
      return this.getMockRankList(rankType);
    }

    // 填充用户信息
    const list = await Promise.all(ranks.map(async (rank) => {
      const user = await this.userRepository.findOne({
        where: { id: rank.userId },
        select: ['id', 'uid', 'nickname', 'avatar', 'level', 'isVerified']
      });
      return { ...rank, user };
    }));

    return list;
  }

  /**
   * 获取用户在排行榜的位置
   */
  async getUserRank(userId: number, rankType: string = 'profit', timeRange: string = 'week') {
    const rank = await this.rankRepository.findOne({
      where: { userId, rankType, timeRange }
    });

    if (!rank) {
      return { position: 999, value: '0' };
    }

    return rank;
  }

  // ===== Mock 数据 =====

  private getDefaultLevel(level: number) {
    const levels: Record<number, any> = {
      1: { level: 1, name: '普通会员', icon: '🥉', color: '#848E9C', commissionRate1: '0.20', commissionRate2: '0.10' },
      2: { level: 2, name: '银牌会员', icon: '🥈', color: '#C0C0C0', commissionRate1: '0.22', commissionRate2: '0.11' },
      3: { level: 3, name: '金牌会员', icon: '🥇', color: '#D4B872', commissionRate1: '0.25', commissionRate2: '0.12' },
      4: { level: 4, name: '钻石会员', icon: '💎', color: '#00D1FF', commissionRate1: '0.28', commissionRate2: '0.14' },
      5: { level: 5, name: '黑金会员', icon: '👑', color: '#1E1E1E', commissionRate1: '0.30', commissionRate2: '0.15' },
    };
    return levels[level] || levels[1];
  }

  private getMockLevels() {
    return [
      { level: 1, name: '普通会员', nameEn: 'Basic', icon: '🥉', color: '#848E9C', minAssets: '0', minInvites: 0, commissionRate1: '0.20', commissionRate2: '0.10', feeDiscount: '1.00' },
      { level: 2, name: '银牌会员', nameEn: 'Silver', icon: '🥈', color: '#C0C0C0', minAssets: '1000', minInvites: 5, commissionRate1: '0.22', commissionRate2: '0.11', feeDiscount: '0.95' },
      { level: 3, name: '金牌会员', nameEn: 'Gold', icon: '🥇', color: '#D4B872', minAssets: '10000', minInvites: 20, commissionRate1: '0.25', commissionRate2: '0.12', feeDiscount: '0.90' },
      { level: 4, name: '钻石会员', nameEn: 'Diamond', icon: '💎', color: '#00D1FF', minAssets: '50000', minInvites: 50, commissionRate1: '0.28', commissionRate2: '0.14', feeDiscount: '0.85' },
      { level: 5, name: '黑金会员', nameEn: 'Platinum', icon: '👑', color: '#1E1E1E', minAssets: '200000', minInvites: 100, commissionRate1: '0.30', commissionRate2: '0.15', feeDiscount: '0.80' },
    ];
  }

  private getMockInviteRecords() {
    return [
      { id: 1, userId: 101, user: { nickname: 'user***888', avatar: null }, createdAt: new Date(Date.now() - 86400000), status: 'active' },
      { id: 2, userId: 102, user: { nickname: 'trader***999', avatar: null }, createdAt: new Date(Date.now() - 2 * 86400000), status: 'active' },
      { id: 3, userId: 103, user: { nickname: 'crypto***666', avatar: null }, createdAt: new Date(Date.now() - 3 * 86400000), status: 'pending' },
    ];
  }

  private getMockCommissions() {
    return [
      { id: 1, fromUserId: 101, level: 1, sourceType: 'contract', amount: '25.60', rate: '0.20', createdAt: new Date(Date.now() - 3600000) },
      { id: 2, fromUserId: 102, level: 1, sourceType: 'pool', amount: '12.80', rate: '0.20', createdAt: new Date(Date.now() - 7200000) },
      { id: 3, fromUserId: 103, level: 2, sourceType: 'contract', amount: '8.50', rate: '0.10', createdAt: new Date(Date.now() - 86400000) },
      { id: 4, fromUserId: 104, level: 1, sourceType: 'otc', amount: '5.20', rate: '0.20', createdAt: new Date(Date.now() - 2 * 86400000) },
      { id: 5, fromUserId: 105, level: 2, sourceType: 'pool', amount: '3.00', rate: '0.10', createdAt: new Date(Date.now() - 3 * 86400000) },
    ];
  }

  private getMockRankList(rankType: string) {
    const mockUsers = [
      { position: 1, nickname: '王者归来', value: rankType === 'invite' ? '256' : '128560.00', change: '+15.2%' },
      { position: 2, nickname: '币圈老韭菜', value: rankType === 'invite' ? '198' : '96780.00', change: '+12.8%' },
      { position: 3, nickname: '交易达人', value: rankType === 'invite' ? '156' : '85420.00', change: '+8.5%' },
      { position: 4, nickname: '量化策略师', value: rankType === 'invite' ? '128' : '72350.00', change: '+6.2%' },
      { position: 5, nickname: '稳健投资者', value: rankType === 'invite' ? '96' : '65280.00', change: '+5.8%' },
      { position: 6, nickname: '期货大神', value: rankType === 'invite' ? '85' : '58960.00', change: '+4.5%' },
      { position: 7, nickname: '合约高手', value: rankType === 'invite' ? '72' : '52340.00', change: '+3.2%' },
      { position: 8, nickname: '价值投资', value: rankType === 'invite' ? '65' : '48650.00', change: '+2.8%' },
      { position: 9, nickname: '技术分析', value: rankType === 'invite' ? '58' : '42180.00', change: '+2.1%' },
      { position: 10, nickname: '趋势交易', value: rankType === 'invite' ? '52' : '38560.00', change: '+1.5%' },
    ];

    return mockUsers.map((u, i) => ({
      position: u.position,
      value: u.value,
      changePercent: u.change,
      user: { id: i + 1, nickname: u.nickname, avatar: null, level: Math.min(5, Math.ceil((10 - i) / 2)), isVerified: i < 5 ? 1 : 0 }
    }));
  }
}
