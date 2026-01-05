import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, Wallet, UserInvite, Coin, Kyc, Recharge, Withdraw, Notice } from '../../entities';
import { BusinessException } from '../../common';
import { RegisterDto, LoginDto, ChangePasswordDto, UpdateProfileDto, SubmitKycDto, WithdrawDto, GetDepositAddressDto } from './account.dto';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(UserInvite)
    private readonly userInviteRepo: Repository<UserInvite>,
    @InjectRepository(Coin)
    private readonly coinRepo: Repository<Coin>,
    @InjectRepository(Kyc)
    private readonly kycRepo: Repository<Kyc>,
    @InjectRepository(Recharge)
    private readonly rechargeRepo: Repository<Recharge>,
    @InjectRepository(Withdraw)
    private readonly withdrawRepo: Repository<Withdraw>,
    @InjectRepository(Notice)
    private readonly noticeRepo: Repository<Notice>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 生成 UID（8位数字）
   */
  private generateUid(): string {
    const base = 10000000;
    const random = Math.floor(Math.random() * 90000000);
    return String(base + random);
  }

  /**
   * 生成邀请码（6位大写字母数字）
   */
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * 格式化日期为 YYYY-MM-DD HH:mm:ss
   */
  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  /**
   * 用户注册
   */
  async register(dto: RegisterDto) {
    // 检查用户名是否已存在
    const existUser = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existUser) {
      throw BusinessException.userExists();
    }

    // 检查邀请码是否有效
    const inviter = await this.userRepo.findOne({
      where: { inviteCode: dto.inviteCode },
    });
    if (!inviter) {
      throw BusinessException.inviteCodeInvalid();
    }

    // 生成唯一的 UID 和邀请码
    let uid = this.generateUid();
    let inviteCode = this.generateInviteCode();

    // 确保唯一性
    while (await this.userRepo.findOne({ where: { uid } })) {
      uid = this.generateUid();
    }
    while (await this.userRepo.findOne({ where: { inviteCode } })) {
      inviteCode = this.generateInviteCode();
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 创建用户
    const user = this.userRepo.create({
      uid,
      username: dto.username,
      passwordHash,
      nickname: '新用户',
      inviteCode,
      inviterId: inviter.id,
      kycStatus: 0,
      status: 1,
    });
    await this.userRepo.save(user);

    // 创建邀请关系（一级）
    const invite1 = this.userInviteRepo.create({
      userId: user.id,
      inviterId: inviter.id,
      level: 1,
    });
    await this.userInviteRepo.save(invite1);

    // 如果邀请人也有邀请人，创建二级邀请关系
    if (inviter.inviterId) {
      const invite2 = this.userInviteRepo.create({
        userId: user.id,
        inviterId: inviter.inviterId,
        level: 2,
      });
      await this.userInviteRepo.save(invite2);
    }

    // 为用户创建默认钱包（所有启用的币种）
    const coins = await this.coinRepo.find({ where: { status: 1 } });
    for (const coin of coins) {
      const wallet = this.walletRepo.create({
        userId: user.id,
        coinId: coin.id,
        balance: '0',
        frozen: '0',
      });
      await this.walletRepo.save(wallet);
    }

    return {
      user: {
        id: user.id,
        uid: user.uid,
        username: user.username,
        nickname: user.nickname,
        inviteCode: user.inviteCode,
        inviterId: user.inviterId,
        createdAt: this.formatDate(user.createdAt),
      },
    };
  }

  /**
   * 用户登录
   */
  async login(dto: LoginDto, ip?: string) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username, deletedAt: null },
    });
    if (!user) {
      throw BusinessException.userNotFound();
    }

    if (user.status !== 1) {
      throw new BusinessException(1001, '账号已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw BusinessException.passwordError();
    }

    // 更新最后登录时间和 IP
    user.lastLoginAt = new Date();
    user.lastLoginIp = ip || null;
    await this.userRepo.save(user);

    // 生成 JWT
    const payload: JwtPayload = {
      sub: user.id,
      uid: user.uid,
      username: user.username,
      type: 'user',
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        uid: user.uid,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        inviteCode: user.inviteCode,
        createdAt: this.formatDate(user.createdAt),
      },
    };
  }

  /**
   * 获取用户信息
   */
  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw BusinessException.userNotFound();
    }

    // 统计邀请人数
    const inviteCount = await this.userInviteRepo.count({
      where: { inviterId: userId, level: 1 },
    });

    // 统计总返佣（暂时返回 0，后续实现返佣功能后再统计）
    const totalCommission = '0.00';

    return {
      id: user.id,
      uid: user.uid,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      inviteCode: user.inviteCode,
      inviteCount,
      totalCommission,
      createdAt: this.formatDate(user.createdAt),
    };
  }

  /**
   * 获取用户余额
   */
  async getBalance(userId: number) {
    const wallets = await this.walletRepo.find({
      where: { userId },
      relations: ['coin'],
    });

    const assets = wallets.map((wallet) => ({
      asset: wallet.coin.symbol,
      name: wallet.coin.name,
      free: wallet.balance,
      locked: wallet.frozen,
      usdValue: wallet.balance, // 暂时按 1:1 计算，后续可加入价格转换
      icon: wallet.coin.icon,
    }));

    return { assets };
  }

  /**
   * 修改密码
   */
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw BusinessException.userNotFound();
    }

    const isValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isValid) {
      throw new BusinessException(1002, '旧密码错误');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);
    return {};
  }

  /**
   * 更新用户信息
   */
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw BusinessException.userNotFound();
    }

    if (dto.nickname !== undefined) user.nickname = dto.nickname;
    if (dto.avatar !== undefined) user.avatar = dto.avatar;
    await this.userRepo.save(user);

    return {
      nickname: user.nickname,
      avatar: user.avatar,
    };
  }

  /**
   * 提交KYC认证
   */
  async submitKyc(userId: number, dto: SubmitKycDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw BusinessException.userNotFound();
    }

    // 检查是否已有待审核的KYC
    const pending = await this.kycRepo.findOne({
      where: { userId, status: 0 },
    });
    if (pending) {
      throw new BusinessException(5002, '您已有待审核的认证申请');
    }

    // 检查是否已认证通过
    if (user.kycStatus === 2) {
      throw new BusinessException(5003, '您已完成实名认证');
    }

    // 数据验证
    if (!dto.realName || dto.realName.trim().length < 2 || dto.realName.trim().length > 50) {
      throw new BusinessException(5004, '真实姓名长度必须在2-50个字符之间');
    }

    // 简单的身份证号码格式验证（可根据需求调整）
    if (!dto.idNumber || dto.idNumber.trim().length < 15 || dto.idNumber.trim().length > 18) {
      throw new BusinessException(5005, '证件号码长度不正确');
    }

    const kyc = this.kycRepo.create({
      userId,
      realName: dto.realName.trim(),
      idNumber: dto.idNumber.trim(),
      idType: dto.idType,
      frontImage: dto.frontImage,
      backImage: dto.backImage,
      holdImage: dto.holdImage,
      status: 0, // 0: 待审核
    });
    await this.kycRepo.save(kyc);

    // 更新用户KYC状态为认证中
    user.kycStatus = 1;
    await this.userRepo.save(user);

    return { id: kyc.id };
  }

  /**
   * 获取KYC状态
   */
  async getKycStatus(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw BusinessException.userNotFound();
    }

    const kyc = await this.kycRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return {
      kycStatus: user.kycStatus,
      kyc: kyc ? {
        id: kyc.id,
        realName: kyc.realName,
        idNumber: kyc.idNumber.replace(/^(.{4}).*(.{4})$/, '$1****$2'),
        idType: kyc.idType,
        status: kyc.status,
        remark: kyc.remark,
        createdAt: this.formatDate(kyc.createdAt),
      } : null,
    };
  }

  /**
   * 获取充值地址
   */
  async getDepositAddress(userId: number, dto: GetDepositAddressDto) {
    // 根据币种和链网络生成/获取充值地址
    // 这里简化处理，返回一个模拟地址
    const addressMap: Record<string, string> = {
      'USDT-TRC20': 'TN3W4H6rK7qj6bX7d9bR3j6bX7d9bR3j6bX7',
      'USDT-ERC20': '0x742d35Cc6634C0532925a3b844Bc454e423b5aE2',
      'BTC-Bitcoin': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      'ETH-ERC20': '0x742d35Cc6634C0532925a3b844Bc454e423b5aE2',
    };

    const key = `${dto.coin}-${dto.chain}`;
    const address = addressMap[key] || `AGX${userId}${dto.coin}${dto.chain}`.toUpperCase();

    return {
      coin: dto.coin,
      chain: dto.chain,
      address,
      minDeposit: '10',
      confirmations: dto.chain === 'TRC20' ? 20 : 12,
    };
  }

  /**
   * 获取充值记录
   */
  async getDepositHistory(userId: number, query: any) {
    const { page = 1, pageSize = 20, coin } = query;

    const qb = this.rechargeRepo.createQueryBuilder('r')
      .where('r.userId = :userId', { userId });

    if (coin) {
      qb.andWhere('r.coin = :coin', { coin });
    }

    qb.orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    return {
      list: list.map(r => ({
        id: r.id,
        orderNo: r.orderNo,
        coin: r.coin,
        chain: r.chain,
        amount: r.amount,
        status: r.status,
        txHash: r.txHash,
        createdAt: this.formatDate(r.createdAt),
      })),
      total,
    };
  }

  /**
   * 申请提现
   */
  async withdraw(userId: number, dto: WithdrawDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw BusinessException.userNotFound();
    }

    // 检查KYC
    if (user.kycStatus !== 2) {
      throw new BusinessException(6002, '请先完成实名认证');
    }

    // 检查余额
    const wallet = await this.walletRepo.findOne({
      where: { userId },
      relations: ['coin'],
    });

    if (!wallet) {
      throw new BusinessException(6003, '钱包不存在');
    }

    const amount = parseFloat(dto.amount);
    const balance = parseFloat(wallet.balance);
    const fee = amount * 0.01; // 1%手续费
    const actualAmount = amount - fee;

    if (balance < amount) {
      throw new BusinessException(6004, '余额不足');
    }

    // 生成订单号
    const orderNo = `W${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // 创建提现记录
    const withdraw = this.withdrawRepo.create({
      orderNo,
      userId,
      coin: dto.coin,
      chain: dto.chain,
      amount: dto.amount,
      fee: fee.toFixed(8),
      actualAmount: actualAmount.toFixed(8),
      toAddress: dto.address,
      status: 0,
    });
    await this.withdrawRepo.save(withdraw);

    // 冻结余额
    wallet.balance = (balance - amount).toFixed(8);
    wallet.frozen = (parseFloat(wallet.frozen) + amount).toFixed(8);
    await this.walletRepo.save(wallet);

    return {
      id: withdraw.id,
      orderNo: withdraw.orderNo,
      amount: withdraw.amount,
      fee: withdraw.fee,
      actualAmount: withdraw.actualAmount,
    };
  }

  /**
   * 获取提现记录
   */
  async getWithdrawHistory(userId: number, query: any) {
    const { page = 1, pageSize = 20, coin } = query;

    const qb = this.withdrawRepo.createQueryBuilder('w')
      .where('w.userId = :userId', { userId });

    if (coin) {
      qb.andWhere('w.coin = :coin', { coin });
    }

    qb.orderBy('w.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    return {
      list: list.map(w => ({
        id: w.id,
        orderNo: w.orderNo,
        coin: w.coin,
        chain: w.chain,
        amount: w.amount,
        fee: w.fee,
        actualAmount: w.actualAmount,
        toAddress: w.toAddress,
        status: w.status,
        txHash: w.txHash,
        createdAt: this.formatDate(w.createdAt),
      })),
      total,
    };
  }

  /**
   * 获取邀请列表
   */
  async getInviteList(userId: number, query: any) {
    const { page = 1, pageSize = 20, level = 1 } = query;

    const qb = this.userInviteRepo.createQueryBuilder('i')
      .leftJoinAndSelect('i.user', 'user')
      .where('i.inviterId = :userId', { userId })
      .andWhere('i.level = :level', { level: parseInt(level) });

    qb.orderBy('i.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    return {
      list: list.map(i => ({
        id: i.id,
        userId: i.userId,
        username: i.user?.username || '-',
        nickname: i.user?.nickname || '-',
        level: i.level,
        createdAt: this.formatDate(i.createdAt),
      })),
      total,
    };
  }

  /**
   * 获取邀请统计
   */
  async getInviteStats(userId: number) {
    const level1 = await this.userInviteRepo.count({
      where: { inviterId: userId, level: 1 },
    });
    const level2 = await this.userInviteRepo.count({
      where: { inviterId: userId, level: 2 },
    });

    // 统计返佣（暂返回0）
    const totalCommission = '0.00';
    const todayCommission = '0.00';

    return {
      level1Count: level1,
      level2Count: level2,
      totalCount: level1 + level2,
      totalCommission,
      todayCommission,
    };
  }

  /**
   * 获取有效公告
   */
  async getActiveNotices() {
    const now = new Date();
    const list = await this.noticeRepo.createQueryBuilder('n')
      .where('n.status = 1')
      .andWhere('(n.startAt IS NULL OR n.startAt <= :now)', { now })
      .andWhere('(n.endAt IS NULL OR n.endAt >= :now)', { now })
      .orderBy('n.sortOrder', 'ASC')
      .addOrderBy('n.id', 'DESC')
      .getMany();

    return list.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
    }));
  }
}
