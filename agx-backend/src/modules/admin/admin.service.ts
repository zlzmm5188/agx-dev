import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin, Coin, CoinChain, User, UserInvite, PoolProduct, ContractConfig, PoolHolding, ContractOrder, Kyc, Recharge, Withdraw, AssetLog, Config, Wallet, Notice, Commission, AdminLog } from '../../entities';
import { BusinessException } from '../../common';
import {
  AdminLoginDto,
  CurrencyListDto,
  CreateCurrencyDto,
  UpdateCurrencyDto,
  UserListDto,
  UpdateUserStatusDto,
  PoolProductListDto,
  CreatePoolProductDto,
  UpdatePoolProductDto,
  ContractConfigListDto,
  CreateContractConfigDto,
  UpdateContractConfigDto,
} from './admin.dto';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Coin)
    private readonly coinRepo: Repository<Coin>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PoolProduct)
    private readonly poolProductRepo: Repository<PoolProduct>,
    @InjectRepository(ContractConfig)
    private readonly contractConfigRepo: Repository<ContractConfig>,
    @InjectRepository(PoolHolding)
    private readonly poolHoldingRepo: Repository<PoolHolding>,
    @InjectRepository(ContractOrder)
    private readonly contractOrderRepo: Repository<ContractOrder>,
    @InjectRepository(Kyc)
    private readonly kycRepo: Repository<Kyc>,
    @InjectRepository(Recharge)
    private readonly rechargeRepo: Repository<Recharge>,
    @InjectRepository(Withdraw)
    private readonly withdrawRepo: Repository<Withdraw>,
    @InjectRepository(AssetLog)
    private readonly assetLogRepo: Repository<AssetLog>,
    @InjectRepository(Config)
    private readonly configRepo: Repository<Config>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Notice)
    private readonly noticeRepo: Repository<Notice>,
    @InjectRepository(CoinChain)
    private readonly coinChainRepo: Repository<CoinChain>,
    @InjectRepository(UserInvite)
    private readonly userInviteRepo: Repository<UserInvite>,
    @InjectRepository(Commission)
    private readonly commissionRepo: Repository<Commission>,
    @InjectRepository(AdminLog)
    private readonly adminLogRepo: Repository<AdminLog>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 格式化日期为 YYYY-MM-DD HH:mm:ss
   */
  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  /**
   * 管理员登录
   */
  async login(dto: AdminLoginDto, ip?: string) {
    const admin = await this.adminRepo.findOne({
      where: { username: dto.username },
    });
    if (!admin) {
      throw BusinessException.adminNotFound();
    }

    if (admin.status !== 1) {
      throw new BusinessException(1001, '账号已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw BusinessException.adminPasswordError();
    }

    // 更新最后登录时间和 IP
    admin.lastLoginAt = new Date();
    admin.lastLoginIp = ip || null;
    await this.adminRepo.save(admin);

    // 生成 JWT
    const payload: JwtPayload = {
      sub: admin.id,
      uid: String(admin.id),
      username: admin.username,
      type: 'admin',
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        lastLoginAt: this.formatDate(admin.lastLoginAt),
      },
    };
  }

  /**
   * 获取币种列表
   */
  async getCurrencyList(dto: CurrencyListDto) {
    const { page = 1, pageSize = 20, keyword, status } = dto;

    const where: FindOptionsWhere<Coin> = {};

    if (status !== undefined) {
      where.status = status;
    }

    const query = this.coinRepo.createQueryBuilder('coin');

    if (keyword) {
      query.andWhere(
        '(coin.name ILIKE :keyword OR coin.symbol ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (status !== undefined) {
      query.andWhere('coin.status = :status', { status });
    }

    query
      .orderBy('coin.sortOrder', 'ASC')
      .addOrderBy('coin.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        icon: coin.icon,
        status: coin.status,
        sort: coin.sortOrder,
        createdAt: this.formatDate(coin.createdAt),
      })),
      total,
    };
  }

  /**
   * 创建币种
   */
  async createCurrency(dto: CreateCurrencyDto) {
    // 检查 symbol 是否已存在
    const existing = await this.coinRepo.findOne({
      where: { symbol: dto.symbol },
    });
    if (existing) {
      throw BusinessException.currencyExists();
    }

    const coin = this.coinRepo.create({
      name: dto.name,
      symbol: dto.symbol,
      icon: dto.icon || null,
      status: dto.status ?? 1,
      sortOrder: dto.sort ?? 0,
    });
    await this.coinRepo.save(coin);

    return { id: coin.id };
  }

  /**
   * 更新币种
   */
  async updateCurrency(id: number, dto: UpdateCurrencyDto) {
    const coin = await this.coinRepo.findOne({ where: { id } });
    if (!coin) {
      throw BusinessException.currencyNotFound();
    }

    // 如果要修改 symbol，检查是否与其他币种冲突
    if (dto.symbol && dto.symbol !== coin.symbol) {
      const existing = await this.coinRepo.findOne({
        where: { symbol: dto.symbol },
      });
      if (existing) {
        throw BusinessException.currencyExists();
      }
    }

    if (dto.name !== undefined) coin.name = dto.name;
    if (dto.symbol !== undefined) coin.symbol = dto.symbol;
    if (dto.icon !== undefined) coin.icon = dto.icon;
    if (dto.status !== undefined) coin.status = dto.status;
    if (dto.sort !== undefined) coin.sortOrder = dto.sort;

    await this.coinRepo.save(coin);
    return {};
  }

  /**
   * 删除币种
   */
  async deleteCurrency(id: number) {
    const coin = await this.coinRepo.findOne({ where: { id } });
    if (!coin) {
      throw BusinessException.currencyNotFound();
    }

    await this.coinRepo.remove(coin);
    return {};
  }

  // ==================== 用户管理 ====================

  async getUserList(dto: UserListDto) {
    const { page = 1, pageSize = 20, keyword, status } = dto;

    const query = this.userRepo.createQueryBuilder('user')
      .where('user.deletedAt IS NULL');

    if (keyword) {
      query.andWhere(
        '(user.username ILIKE :keyword OR user.uid ILIKE :keyword OR user.nickname ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (status !== undefined) {
      query.andWhere('user.status = :status', { status });
    }

    query
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((u) => ({
        id: u.id,
        uid: u.uid,
        username: u.username,
        nickname: u.nickname,
        avatar: u.avatar,
        inviteCode: u.inviteCode,
        kycStatus: u.kycStatus,
        status: u.status,
        winRate: u.winRate ?? 50,
        lastLoginAt: this.formatDate(u.lastLoginAt),
        createdAt: this.formatDate(u.createdAt),
      })),
      total,
    };
  }

  async updateUserStatus(id: number, dto: any) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw BusinessException.userNotFound();
    }
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.winRate !== undefined) user.winRate = dto.winRate;
    await this.userRepo.save(user);
    return {};
  }

  // ==================== 矿池产品管理 ====================

  async getPoolProductList(dto: PoolProductListDto) {
    const { page = 1, pageSize = 20, type, status } = dto;

    const query = this.poolProductRepo.createQueryBuilder('p');

    if (type) {
      query.andWhere('p.type = :type', { type });
    }
    if (status !== undefined) {
      query.andWhere('p.status = :status', { status });
    }

    query
      .orderBy('p.sortOrder', 'ASC')
      .addOrderBy('p.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((p) => ({
        id: p.id,
        name: p.name,
        coinId: p.coinId,
        type: p.type,
        lockDays: p.lockDays,
        dailyRate: p.dailyRate,
        minAmount: p.minAmount,
        maxAmount: p.maxAmount,
        totalQuota: p.totalQuota,
        soldAmount: p.soldAmount,
        payCurrencies: p.payCurrencies,
        isHot: p.isHot,
        sortOrder: p.sortOrder,
        status: p.status,
        createdAt: this.formatDate(p.createdAt),
      })),
      total,
    };
  }

  async createPoolProduct(dto: CreatePoolProductDto) {
    const product = this.poolProductRepo.create({
      name: dto.name,
      coinId: dto.coinId,
      type: dto.type,
      lockDays: dto.lockDays,
      dailyRate: dto.dailyRate,
      minAmount: dto.minAmount,
      maxAmount: dto.maxAmount || null,
      totalQuota: dto.totalQuota || null,
      soldAmount: '0',
      payCurrencies: dto.payCurrencies || 'USDT',
      isHot: dto.isHot ?? 0,
      sortOrder: dto.sortOrder ?? 0,
      status: dto.status ?? 1,
    });
    await this.poolProductRepo.save(product);
    return { id: product.id };
  }

  async updatePoolProduct(id: number, dto: UpdatePoolProductDto) {
    const product = await this.poolProductRepo.findOne({ where: { id } });
    if (!product) {
      throw new BusinessException(3001, '矿池产品不存在');
    }

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.dailyRate !== undefined) product.dailyRate = dto.dailyRate;
    if (dto.minAmount !== undefined) product.minAmount = dto.minAmount;
    if (dto.maxAmount !== undefined) product.maxAmount = dto.maxAmount;
    if (dto.totalQuota !== undefined) product.totalQuota = dto.totalQuota;
    if (dto.payCurrencies !== undefined) product.payCurrencies = dto.payCurrencies;
    if (dto.isHot !== undefined) product.isHot = dto.isHot;
    if (dto.sortOrder !== undefined) product.sortOrder = dto.sortOrder;
    if (dto.status !== undefined) product.status = dto.status;

    await this.poolProductRepo.save(product);
    return {};
  }

  async deletePoolProduct(id: number) {
    const product = await this.poolProductRepo.findOne({ where: { id } });
    if (!product) {
      throw new BusinessException(3001, '矿池产品不存在');
    }
    await this.poolProductRepo.remove(product);
    return {};
  }

  // ==================== 秒合约配置管理 ====================

  async getContractConfigList(dto: ContractConfigListDto) {
    const { page = 1, pageSize = 20, symbol, status } = dto;

    const query = this.contractConfigRepo.createQueryBuilder('c');

    if (symbol) {
      query.andWhere('c.symbol = :symbol', { symbol });
    }
    if (status !== undefined) {
      query.andWhere('c.status = :status', { status });
    }

    query
      .orderBy('c.symbol', 'ASC')
      .addOrderBy('c.duration', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((c) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        duration: c.duration,
        profitRate: c.profitRate,
        minAmount: c.minAmount,
        maxAmount: c.maxAmount,
        payCurrencies: c.payCurrencies,
        status: c.status,
        createdAt: this.formatDate(c.createdAt),
      })),
      total,
    };
  }

  async createContractConfig(dto: CreateContractConfigDto) {
    const config = this.contractConfigRepo.create({
      symbol: dto.symbol,
      name: dto.name,
      duration: dto.duration,
      profitRate: dto.profitRate,
      minAmount: dto.minAmount,
      maxAmount: dto.maxAmount,
      payCurrencies: dto.payCurrencies || 'USDT',
      status: dto.status ?? 1,
    });
    await this.contractConfigRepo.save(config);
    return { id: config.id };
  }

  async updateContractConfig(id: number, dto: UpdateContractConfigDto) {
    const config = await this.contractConfigRepo.findOne({ where: { id } });
    if (!config) {
      throw new BusinessException(4001, '合约配置不存在');
    }

    if (dto.name !== undefined) config.name = dto.name;
    if (dto.profitRate !== undefined) config.profitRate = dto.profitRate;
    if (dto.minAmount !== undefined) config.minAmount = dto.minAmount;
    if (dto.maxAmount !== undefined) config.maxAmount = dto.maxAmount;
    if (dto.payCurrencies !== undefined) config.payCurrencies = dto.payCurrencies;
    if (dto.status !== undefined) config.status = dto.status;

    await this.contractConfigRepo.save(config);
    return {};
  }

  async deleteContractConfig(id: number) {
    const config = await this.contractConfigRepo.findOne({ where: { id } });
    if (!config) {
      throw new BusinessException(4001, '合约配置不存在');
    }
    await this.contractConfigRepo.remove(config);
    return {};
  }

  // ==================== 仪表盘统计 ====================

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 本周开始
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    // 用户统计
    const totalUsers = await this.userRepo.count();
    const todayUsers = await this.userRepo
      .createQueryBuilder('u')
      .where('u.createdAt >= :today', { today })
      .getCount();
    const weekUsers = await this.userRepo
      .createQueryBuilder('u')
      .where('u.createdAt >= :weekStart', { weekStart })
      .getCount();

    // 充值统计
    const totalRechargeStats = await this.rechargeRepo
      .createQueryBuilder('r')
      .select('SUM(CAST(r.amount AS DECIMAL))', 'total')
      .where('r.status = :status', { status: 1 })
      .getRawOne();

    const todayRechargeStats = await this.rechargeRepo
      .createQueryBuilder('r')
      .select('SUM(CAST(r.amount AS DECIMAL))', 'total')
      .where('r.createdAt >= :today', { today })
      .andWhere('r.status = :status', { status: 1 })
      .getRawOne();

    // 提现统计
    const totalWithdrawStats = await this.withdrawRepo
      .createQueryBuilder('w')
      .select('SUM(CAST(w.amount AS DECIMAL))', 'total')
      .where('w.status IN (:...statuses)', { statuses: [1, 2] })
      .getRawOne();

    const pendingWithdraw = await this.withdrawRepo.count({ where: { status: 0 } });

    // 合约订单统计
    const totalOrders = await this.contractOrderRepo.count();
    const todayOrders = await this.contractOrderRepo
      .createQueryBuilder('o')
      .where('o.createdAt >= :today', { today })
      .getCount();

    // 平台总资产(用户钱包余额总和)
    const assetStats = await this.walletRepo
      .createQueryBuilder('w')
      .select('SUM(CAST(w.balance AS DECIMAL) + CAST(w.frozen AS DECIMAL))', 'total')
      .getRawOne();

    // 矿池统计
    const poolStats = await this.poolHoldingRepo
      .createQueryBuilder('h')
      .select('SUM(CAST(h.amount AS DECIMAL))', 'total')
      .where('h.status = :status', { status: 1 })
      .getRawOne();

    // KYC待审核
    const pendingKyc = await this.kycRepo.count({ where: { status: 0 } });

    return {
      totalUsers,
      todayUsers,
      weekUsers,
      totalRecharge: parseFloat(totalRechargeStats?.total || '0').toFixed(2),
      todayRecharge: parseFloat(todayRechargeStats?.total || '0').toFixed(2),
      totalWithdraw: parseFloat(totalWithdrawStats?.total || '0').toFixed(2),
      pendingWithdraw,
      totalOrders,
      todayOrders,
      totalAssets: parseFloat(assetStats?.total || '0').toFixed(2),
      poolTotal: parseFloat(poolStats?.total || '0').toFixed(2),
      pendingKyc,
    };
  }

  // 获取待审核列表(仪表盘用)
  async getPendingList() {
    // 待审核KYC
    const kycList = await this.kycRepo.find({
      where: { status: 0 },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    // 待审核提现
    const withdrawList = await this.withdrawRepo.find({
      where: { status: 0 },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      pendingKyc: kycList.map(k => ({
        id: k.id,
        userId: k.userId,
        username: k.user?.username || '-',
        realName: k.realName,
        createdAt: this.formatDate(k.createdAt),
      })),
      pendingWithdraw: withdrawList.map(w => ({
        id: w.id,
        userId: w.userId,
        username: w.user?.username || '-',
        amount: w.amount,
        coin: w.coin,
        createdAt: this.formatDate(w.createdAt),
      })),
    };
  }

  // ==================== 矿池持仓列表 ====================

  async getPoolHoldingList(dto: any) {
    const { page = 1, pageSize = 20, status } = dto;

    const query = this.poolHoldingRepo
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.user', 'user')
      .leftJoinAndSelect('h.product', 'product');

    if (status) {
      query.andWhere('h.status = :status', { status });
    }

    query
      .orderBy('h.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((h) => ({
        id: h.id,
        username: h.user?.username || '-',
        productName: h.product?.name || '-',
        coin: 'USDT',
        principal: h.amount,
        profit: h.totalIncome,
        dailyRate: h.product?.dailyRate || '0',
        status: h.status === 1 ? 'holding' : 'redeemed',
        createdAt: this.formatDate(h.createdAt),
      })),
      total,
    };
  }

  // ==================== 合约订单列表 ====================

  async getContractOrderList(dto: any) {
    const { page = 1, pageSize = 20, symbol, result, userId } = dto;

    const query = this.contractOrderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.user', 'user');

    if (symbol) {
      query.andWhere('o.symbol = :symbol', { symbol });
    }
    if (result) {
      query.andWhere('o.result = :result', { result });
    }
    if (userId) {
      query.andWhere('o.userId = :userId', { userId: parseInt(userId) });
    }

    query
      .orderBy('o.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((o) => ({
        id: o.id,
        username: o.user?.username || '-',
        symbol: o.symbol,
        direction: o.direction === 1 ? 'up' : 'down',
        amount: o.amount,
        duration: o.duration,
        openPrice: o.openPrice,
        closePrice: o.closePrice,
        profit: o.profitLoss || '0',
        result: o.result === 1 ? 'win' : o.result === 2 ? 'lose' : 'pending',
        createdAt: this.formatDate(o.createdAt),
      })),
      total,
    };
  }

  // 手动结算合约订单
  async settleContractOrder(id: number, dto: any, adminId?: number, ip?: string) {
    const order = await this.contractOrderRepo.findOne({ where: { id }, relations: ['user'] });
    if (!order) {
      throw new BusinessException(6001, '订单不存在');
    }
    if (order.result !== 0) {
      throw new BusinessException(6002, '订单已结算');
    }

    const result = dto.result; // 1=win, 2=lose
    const closePrice = dto.closePrice || order.openPrice;
    const profitRate = parseFloat(order.profitRate || '0.85');
    const amount = parseFloat(order.amount);
    let profitLoss = '0';

    if (result === 1) {
      // 用户赢，返还本金+收益
      profitLoss = (amount * profitRate).toFixed(8);
      // 给用户加钱
      const wallet = await this.walletRepo.findOne({ where: { userId: order.userId, coinId: 1 } });
      if (wallet) {
        wallet.balance = (parseFloat(wallet.balance) + amount + parseFloat(profitLoss)).toFixed(8);
        await this.walletRepo.save(wallet);
      }
    } else {
      // 用户输，本金已扣除
      profitLoss = (-amount).toFixed(8);
    }

    order.result = result;
    order.closePrice = closePrice;
    order.profitLoss = profitLoss;
    order.closeAt = new Date();
    await this.contractOrderRepo.save(order);

    // 记录操作日志
    if (adminId) {
      const resultText = result === 1 ? '设赢' : '设输';
      await this.logAdminAction(
        adminId,
        '合约订单',
        resultText,
        `订单ID:${id}, 用户:${order.user?.username}, 金额:${amount}, 盈亏:${profitLoss}`,
        ip
      );
    }

    return {};
  }

  // ==================== KYC管理 ====================

  async getKycList(dto: any) {
    const { page = 1, pageSize = 20, status } = dto;

    const query = this.kycRepo
      .createQueryBuilder('k')
      .leftJoinAndSelect('k.user', 'user');

    if (status !== undefined && status !== '') {
      query.andWhere('k.status = :status', { status: parseInt(status) });
    }

    query
      .orderBy('k.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((k) => ({
        id: k.id,
        userId: k.userId,
        username: k.user?.username || '-',
        realName: k.realName,
        idNumber: k.idNumber,
        idType: k.idType,
        frontImage: k.frontImage,
        backImage: k.backImage,
        holdImage: k.holdImage,
        status: k.status,
        remark: k.remark,
        reviewedAt: this.formatDate(k.reviewedAt),
        createdAt: this.formatDate(k.createdAt),
      })),
      total,
    };
  }

  async reviewKyc(id: number, dto: any, adminId?: number, ip?: string) {
    const kyc = await this.kycRepo.findOne({ where: { id } });
    if (!kyc) {
      throw new BusinessException(5001, 'KYC记录不存在');
    }

    kyc.status = dto.status;
    kyc.remark = dto.remark || '';
    kyc.reviewedAt = new Date();
    await this.kycRepo.save(kyc);

    // 同步更新用户KYC状态
    if (dto.status === 1) {
      await this.userRepo.update(kyc.userId, { kycStatus: 2 });
    } else if (dto.status === 2) {
      await this.userRepo.update(kyc.userId, { kycStatus: 3 });
    }

    // 记录操作日志
    if (adminId) {
      const statusText = dto.status === 1 ? '通过' : '拒绝';
      await this.logAdminAction(
        adminId,
        'KYC审核',
        statusText,
        `KYC ID:${id}, 用户ID:${kyc.userId}, 原因:${dto.remark || '无'}`,
        ip
      );
    }

    return {};
  }

  // ==================== 充值记录 ====================

  async getRechargeList(dto: any) {
    const { page = 1, pageSize = 20, status, keyword, userId } = dto;

    const query = this.rechargeRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'user');

    if (status !== undefined && status !== '') {
      query.andWhere('r.status = :status', { status: parseInt(status) });
    }
    if (keyword) {
      query.andWhere(
        '(user.username ILIKE :keyword OR r.orderNo ILIKE :keyword OR r.txHash ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    if (userId) {
      query.andWhere('r.userId = :userId', { userId: parseInt(userId) });
    }

    query
      .orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((r) => ({
        id: r.id,
        orderNo: r.orderNo,
        userId: r.userId,
        username: r.user?.username || '-',
        coin: r.coin,
        chain: r.chain,
        amount: r.amount,
        txHash: r.txHash,
        fromAddress: r.fromAddress,
        toAddress: r.toAddress,
        status: r.status,
        confirmations: r.confirmations,
        createdAt: this.formatDate(r.createdAt),
      })),
      total,
    };
  }

  // 手动充值
  async manualRecharge(dto: any, adminId?: number, ip?: string) {
    const { userId, coin, amount, remark } = dto;
    
    // 查找用户
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new BusinessException(7001, '用户不存在');
    }

    // 查找币种
    const coinEntity = await this.coinRepo.findOne({ where: { symbol: coin } });
    if (!coinEntity) {
      throw new BusinessException(7002, '币种不存在');
    }

    // 查找或创建钱包
    let wallet = await this.walletRepo.findOne({ where: { userId, coinId: coinEntity.id } });
    if (!wallet) {
      wallet = this.walletRepo.create({
        userId,
        coinId: coinEntity.id,
        balance: '0',
        frozen: '0',
      });
    }
    wallet.balance = (parseFloat(wallet.balance) + parseFloat(amount)).toFixed(8);
    await this.walletRepo.save(wallet);

    // 创建充值记录
    const orderNo = 'MR' + Date.now() + Math.floor(Math.random() * 1000);
    const recharge = this.rechargeRepo.create({
      userId,
      orderNo,
      coin,
      chain: 'MANUAL',
      amount,
      txHash: 'MANUAL_' + orderNo,
      fromAddress: 'admin',
      toAddress: 'user_' + userId,
      status: 1,
      confirmations: 999,
    });
    await this.rechargeRepo.save(recharge);

    // 记录操作日志
    if (adminId) {
      await this.logAdminAction(
        adminId,
        '手动充值',
        '充值',
        `用户:${user.username}(ID:${userId}), 币种:${coin}, 金额:${amount}, 备注:${remark || '无'}`,
        ip
      );
    }

    return { id: recharge.id };
  }

  // ==================== 提现管理 ====================

  async getWithdrawList(dto: any) {
    const { page = 1, pageSize = 20, status, keyword, userId } = dto;

    const query = this.withdrawRepo
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.user', 'user');

    if (status !== undefined && status !== '') {
      query.andWhere('w.status = :status', { status: parseInt(status) });
    }
    if (keyword) {
      query.andWhere(
        '(user.username ILIKE :keyword OR w.orderNo ILIKE :keyword OR w.toAddress ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    if (userId) {
      query.andWhere('w.userId = :userId', { userId: parseInt(userId) });
    }

    query
      .orderBy('w.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map((w) => ({
        id: w.id,
        orderNo: w.orderNo,
        userId: w.userId,
        username: w.user?.username || '-',
        coin: w.coin,
        chain: w.chain,
        amount: w.amount,
        fee: w.fee,
        actualAmount: w.actualAmount,
        toAddress: w.toAddress,
        txHash: w.txHash,
        status: w.status,
        remark: w.remark,
        reviewedAt: this.formatDate(w.reviewedAt),
        createdAt: this.formatDate(w.createdAt),
      })),
      total,
    };
  }

  async reviewWithdraw(id: number, dto: any, adminId?: number, ip?: string) {
    const withdraw = await this.withdrawRepo.findOne({ where: { id }, relations: ['user'] });
    if (!withdraw) {
      throw new BusinessException(6001, '提现记录不存在');
    }

    if (withdraw.status !== 0) {
      throw new BusinessException(6002, '该提现订单已处理');
    }

    const oldStatus = withdraw.status;
    withdraw.status = dto.status;
    withdraw.remark = dto.remark || '';
    withdraw.reviewedAt = new Date();
    if (dto.txHash) {
      withdraw.txHash = dto.txHash;
    }
    await this.withdrawRepo.save(withdraw);

    // 如果拒绝，退还用户冻结金额
    if (dto.status === 2) {
      const coinEntity = await this.coinRepo.findOne({ where: { symbol: withdraw.coin } });
      if (coinEntity) {
        const wallet = await this.walletRepo.findOne({ where: { userId: withdraw.userId, coinId: coinEntity.id } });
        if (wallet) {
          const frozenAmount = parseFloat(wallet.frozen || '0');
          const returnAmount = parseFloat(withdraw.amount);
          // 解冻并退还到余额
          wallet.frozen = Math.max(0, frozenAmount - returnAmount).toFixed(8);
          wallet.balance = (parseFloat(wallet.balance) + returnAmount).toFixed(8);
          await this.walletRepo.save(wallet);

          // 记录资产流水
          const log = this.assetLogRepo.create({
            userId: withdraw.userId,
            coin: withdraw.coin,
            type: 'withdraw_refund',
            amount: returnAmount.toFixed(8),
            balanceBefore: (parseFloat(wallet.balance) - returnAmount).toFixed(8),
            balanceAfter: wallet.balance,
            refNo: withdraw.orderNo,
            remark: '提现拒绝退款:' + (dto.remark || ''),
          });
          await this.assetLogRepo.save(log);
        }
      }
    }

    // 记录操作日志
    if (adminId) {
      const statusText = dto.status === 1 ? '通过' : dto.status === 2 ? '拒绝' : '其他';
      await this.logAdminAction(
        adminId,
        '提现审核',
        statusText,
        `订单:${withdraw.orderNo}, 用户:${withdraw.user?.username}, 金额:${withdraw.amount}, 原因:${dto.remark || '无'}`,
        ip
      );
    }

    return {};
  }

  /**
   * 创建默认管理员（如果不存在）
   */
  async ensureDefaultAdmin() {
    const admin = await this.adminRepo.findOne({ where: { username: 'admin' } });
    if (!admin) {
      const passwordHash = await bcrypt.hash('Admin123', 10);
      const newAdmin = this.adminRepo.create({
        username: 'admin',
        passwordHash,
        nickname: '超级管理员',
        role: 'super',
        status: 1,
      });
      await this.adminRepo.save(newAdmin);
      console.log('Default admin created: admin / Admin123');
    }
  }

  // ==================== 用户资产管理 ====================

  async getUserAssets(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw BusinessException.userNotFound();
    }

    const wallets = await this.walletRepo.find({
      where: { userId },
      relations: ['coin'],
    });

    return {
      user: {
        id: user.id,
        uid: user.uid,
        username: user.username,
      },
      assets: wallets.map(w => ({
        coinId: w.coinId,
        coin: w.coin?.symbol || '-',
        balance: w.balance,
        frozen: w.frozen,
      })),
    };
  }

  async adjustUserAsset(userId: number, dto: any) {
    const { coinId, amount, type, remark } = dto;

    const wallet = await this.walletRepo.findOne({
      where: { userId, coinId },
      relations: ['coin'],
    });

    if (!wallet) {
      throw new BusinessException(7001, '用户钱包不存在');
    }

    const balanceBefore = wallet.balance;
    const adjustAmount = parseFloat(amount);
    let newBalance: number;

    if (type === 'add') {
      newBalance = parseFloat(wallet.balance) + adjustAmount;
    } else {
      newBalance = parseFloat(wallet.balance) - adjustAmount;
      if (newBalance < 0) {
        throw new BusinessException(7002, '余额不足');
      }
    }

    wallet.balance = newBalance.toFixed(8);
    await this.walletRepo.save(wallet);

    // 记录资产流水
    const log = this.assetLogRepo.create({
      userId,
      coin: wallet.coin?.symbol || 'UNKNOWN',
      type: type === 'add' ? 'admin_add' : 'admin_sub',
      amount: (type === 'add' ? adjustAmount : -adjustAmount).toFixed(8),
      balanceBefore,
      balanceAfter: wallet.balance,
      remark: remark || '管理员调整',
    });
    await this.assetLogRepo.save(log);

    return {
      balanceBefore,
      balanceAfter: wallet.balance,
    };
  }

  async getAssetLogs(dto: any) {
    const { page = 1, pageSize = 20, userId, type } = dto;

    const query = this.assetLogRepo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.user', 'user');

    if (userId) {
      query.andWhere('l.userId = :userId', { userId: parseInt(userId) });
    }
    if (type) {
      query.andWhere('l.type = :type', { type });
    }

    query
      .orderBy('l.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map(l => ({
        id: l.id,
        userId: l.userId,
        username: l.user?.username || '-',
        coin: l.coin,
        type: l.type,
        amount: l.amount,
        balanceBefore: l.balanceBefore,
        balanceAfter: l.balanceAfter,
        refNo: l.refNo,
        remark: l.remark,
        createdAt: this.formatDate(l.createdAt),
      })),
      total,
    };
  }

  // ==================== 系统配置 ====================

  async getConfigList(dto: any) {
    const { group } = dto;

    const query = this.configRepo.createQueryBuilder('c');

    if (group) {
      query.andWhere('c.configGroup = :group', { group });
    }

    query.orderBy('c.configGroup', 'ASC').addOrderBy('c.id', 'ASC');

    const list = await query.getMany();

    return {
      list: list.map(c => ({
        id: c.id,
        key: c.configKey,
        value: c.configValue,
        description: c.description,
        configGroup: c.configGroup,
        updatedAt: this.formatDate(c.updatedAt),
      })),
    };
  }

  async updateConfig(key: string, dto: any) {
    let config = await this.configRepo.findOne({ where: { configKey: key } });

    if (!config) {
      config = this.configRepo.create({
        configKey: key,
        configValue: dto.value,
        description: dto.description,
        configGroup: dto.configGroup || dto.group || 'basic',
      });
    } else {
      config.configValue = dto.value;
      if (dto.description !== undefined) config.description = dto.description;
      if (dto.configGroup !== undefined) config.configGroup = dto.configGroup;
    }

    await this.configRepo.save(config);
    return {};
  }

  async batchUpdateConfigs(configs: Array<{ key: string; value: string }>) {
    for (const item of configs) {
      await this.updateConfig(item.key, { value: item.value });
    }
    return {};
  }

  // ============ 公告管理 ============

  async getNoticeList(dto: any) {
    const { page = 1, pageSize = 20, status, type } = dto;

    const query = this.noticeRepo.createQueryBuilder('n');

    if (status !== undefined) {
      query.andWhere('n.status = :status', { status });
    }
    if (type) {
      query.andWhere('n.type = :type', { type });
    }

    query.orderBy('n.sortOrder', 'ASC').addOrderBy('n.id', 'DESC');
    query.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map(n => ({
        id: n.id,
        title: n.title,
        content: n.content,
        type: n.type,
        status: n.status,
        sortOrder: n.sortOrder,
        startAt: this.formatDate(n.startAt),
        endAt: this.formatDate(n.endAt),
        createdAt: this.formatDate(n.createdAt),
      })),
      total,
    };
  }

  async createNotice(dto: any) {
    const notice = this.noticeRepo.create({
      title: dto.title,
      content: dto.content,
      type: dto.type || 'notice',
      status: dto.status ?? 1,
      sortOrder: dto.sortOrder ?? 0,
      startAt: dto.startAt ? new Date(dto.startAt) : null,
      endAt: dto.endAt ? new Date(dto.endAt) : null,
    });
    await this.noticeRepo.save(notice);
    return { id: notice.id };
  }

  async updateNotice(id: number, dto: any) {
    const notice = await this.noticeRepo.findOne({ where: { id } });
    if (!notice) {
      throw new BusinessException(1001, '公告不存在');
    }

    if (dto.title !== undefined) notice.title = dto.title;
    if (dto.content !== undefined) notice.content = dto.content;
    if (dto.type !== undefined) notice.type = dto.type;
    if (dto.status !== undefined) notice.status = dto.status;
    if (dto.sortOrder !== undefined) notice.sortOrder = dto.sortOrder;
    if (dto.startAt !== undefined) notice.startAt = dto.startAt ? new Date(dto.startAt) : null;
    if (dto.endAt !== undefined) notice.endAt = dto.endAt ? new Date(dto.endAt) : null;

    await this.noticeRepo.save(notice);
    return {};
  }

  async deleteNotice(id: number) {
    const notice = await this.noticeRepo.findOne({ where: { id } });
    if (!notice) {
      throw new BusinessException(1001, '公告不存在');
    }
    await this.noticeRepo.remove(notice);
    return {};
  }

  // 用户端获取有效公告
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

  // ============ 币种链管理 ============

  async getCoinChainList(coinId?: number) {
    const query = this.coinChainRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.coin', 'coin');

    if (coinId) {
      query.andWhere('c.coinId = :coinId', { coinId });
    }

    query.orderBy('c.coinId', 'ASC').addOrderBy('c.sortOrder', 'ASC');

    const list = await query.getMany();

    return {
      list: list.map(c => ({
        id: c.id,
        coinId: c.coinId,
        coinSymbol: c.coin?.symbol,
        chain: c.chain,
        chainSymbol: c.chainSymbol,
        contractAddress: c.contractAddress,
        withdrawFee: c.withdrawFee,
        minWithdraw: c.minWithdraw,
        maxWithdraw: c.maxWithdraw,
        confirmations: c.confirmations,
        status: c.status,
        sortOrder: c.sortOrder,
      })),
    };
  }

  async createCoinChain(dto: any) {
    const chain = this.coinChainRepo.create({
      coinId: dto.coinId,
      chain: dto.chain,
      chainSymbol: dto.chainSymbol,
      contractAddress: dto.contractAddress,
      withdrawFee: dto.withdrawFee || '0',
      minWithdraw: dto.minWithdraw || '0',
      maxWithdraw: dto.maxWithdraw || '0',
      confirmations: dto.confirmations || 6,
      status: dto.status ?? 1,
      sortOrder: dto.sortOrder ?? 0,
    });
    await this.coinChainRepo.save(chain);
    return { id: chain.id };
  }

  async updateCoinChain(id: number, dto: any) {
    const chain = await this.coinChainRepo.findOne({ where: { id } });
    if (!chain) {
      throw new BusinessException(1001, '链配置不存在');
    }

    if (dto.chain !== undefined) chain.chain = dto.chain;
    if (dto.chainSymbol !== undefined) chain.chainSymbol = dto.chainSymbol;
    if (dto.contractAddress !== undefined) chain.contractAddress = dto.contractAddress;
    if (dto.withdrawFee !== undefined) chain.withdrawFee = dto.withdrawFee;
    if (dto.minWithdraw !== undefined) chain.minWithdraw = dto.minWithdraw;
    if (dto.maxWithdraw !== undefined) chain.maxWithdraw = dto.maxWithdraw;
    if (dto.confirmations !== undefined) chain.confirmations = dto.confirmations;
    if (dto.status !== undefined) chain.status = dto.status;
    if (dto.sortOrder !== undefined) chain.sortOrder = dto.sortOrder;

    await this.coinChainRepo.save(chain);
    return {};
  }

  async deleteCoinChain(id: number) {
    const chain = await this.coinChainRepo.findOne({ where: { id } });
    if (!chain) {
      throw new BusinessException(1001, '链配置不存在');
    }
    await this.coinChainRepo.remove(chain);
    return {};
  }

  // ============ 邀请管理 ============

  async getInviteList(dto: any) {
    const { page = 1, pageSize = 20, userId, inviterId } = dto;

    const query = this.userInviteRepo.createQueryBuilder('i')
      .leftJoinAndSelect('i.user', 'user')
      .leftJoinAndSelect('i.inviter', 'inviter');

    if (userId) {
      query.andWhere('i.userId = :userId', { userId });
    }
    if (inviterId) {
      query.andWhere('i.inviterId = :inviterId', { inviterId });
    }

    query.orderBy('i.id', 'DESC');
    query.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map(i => ({
        id: i.id,
        userId: i.userId,
        username: i.user?.username,
        inviterId: i.inviterId,
        inviterName: i.inviter?.username,
        level: i.level,
        createdAt: this.formatDate(i.createdAt),
      })),
      total,
    };
  }

  // ============ 返佣管理 ============

  async getCommissionList(dto: any) {
    const { page = 1, pageSize = 20, userId, status } = dto;

    const query = this.commissionRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user')
      .leftJoinAndSelect('c.fromUser', 'fromUser');

    if (userId) {
      query.andWhere('c.userId = :userId', { userId });
    }
    if (status !== undefined) {
      query.andWhere('c.status = :status', { status });
    }

    query.orderBy('c.id', 'DESC');
    query.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map(c => ({
        id: c.id,
        userId: c.userId,
        username: c.user?.username,
        fromUserId: c.fromUserId,
        fromUsername: c.fromUser?.username,
        level: c.level,
        source: c.source,
        coin: c.coin,
        amount: c.amount,
        rate: c.rate,
        status: c.status,
        createdAt: this.formatDate(c.createdAt),
      })),
      total,
    };
  }

  // ============ 操作日志 ============

  async getAdminLogList(dto: any) {
    const { page = 1, pageSize = 20, adminId, module } = dto;

    const query = this.adminLogRepo.createQueryBuilder('l')
      .leftJoinAndSelect('l.admin', 'admin');

    if (adminId) {
      query.andWhere('l.adminId = :adminId', { adminId });
    }
    if (module) {
      query.andWhere('l.module = :module', { module });
    }

    query.orderBy('l.id', 'DESC');
    query.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      list: list.map(l => ({
        id: l.id,
        adminId: l.adminId,
        adminName: l.admin?.username,
        module: l.module,
        action: l.action,
        detail: l.detail,
        ip: l.ip,
        createdAt: this.formatDate(l.createdAt),
      })),
      total,
    };
  }

  async logAdminAction(adminId: number, module: string, action: string, detail?: string, ip?: string) {
    const log = this.adminLogRepo.create({
      adminId,
      module,
      action,
      detail,
      ip,
    });
    await this.adminLogRepo.save(log);
  }
}
