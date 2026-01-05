import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ContractConfig, ContractOrder, Wallet, Coin } from '../../entities';
import { BusinessException } from '../../common';
import { CreateOrderDto } from './contract.dto';
import Decimal from 'decimal.js';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractConfig)
    private readonly configRepo: Repository<ContractConfig>,
    @InjectRepository(ContractOrder)
    private readonly orderRepo: Repository<ContractOrder>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Coin)
    private readonly coinRepo: Repository<Coin>,
    private readonly dataSource: DataSource,
  ) {}

  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  private generateOrderNo(): string {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const timePart = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `C${datePart}${timePart}${random}`;
  }

  /**
   * 获取秒合约配置列表
   */
  async getConfigs() {
    const configs = await this.configRepo.find({
      where: { status: 1 },
      order: { symbol: 'ASC', duration: 'ASC' },
    });

    return {
      list: configs.map((c) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        duration: c.duration,
        durationText: this.getDurationText(c.duration),
        profitRate: c.profitRate,
        profitRatePercent: new Decimal(c.profitRate).mul(100).toFixed(0) + '%',
        minAmount: c.minAmount,
        maxAmount: c.maxAmount,
      })),
    };
  }

  private getDurationText(seconds: number): string {
    if (seconds < 60) return `${seconds}秒`;
    return `${seconds / 60}分钟`;
  }

  /**
   * 创建订单（下单）
   */
  async createOrder(userId: number, dto: CreateOrderDto) {
    const config = await this.configRepo.findOne({
      where: { id: dto.configId, status: 1 },
    });

    if (!config) {
      throw new BusinessException(4001, '合约配置不存在');
    }

    const amount = new Decimal(dto.amount);

    if (amount.lt(config.minAmount)) {
      throw new BusinessException(4002, `最小下单金额 ${config.minAmount}`);
    }

    if (amount.gt(config.maxAmount)) {
      throw new BusinessException(4003, `最大下单金额 ${config.maxAmount}`);
    }

    // 获取AGX币种
    const agxCoin = await this.coinRepo.findOne({ where: { symbol: 'AGX' } });
    if (!agxCoin) {
      throw new BusinessException(4004, 'AGX币种未配置');
    }

    // 检查余额
    const wallet = await this.walletRepo.findOne({
      where: { userId, coinId: agxCoin.id },
    });

    if (!wallet || new Decimal(wallet.balance).lt(amount)) {
      throw new BusinessException(4005, 'AGX余额不足');
    }

    // 模拟获取当前价格（实际应从外部API获取）
    const currentPrice = this.getMockPrice(config.symbol);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 扣减余额
      const newBalance = new Decimal(wallet.balance).minus(amount).toString();
      await queryRunner.manager.update(Wallet, wallet.id, { balance: newBalance });

      // 创建订单
      const now = new Date();
      const closeAt = new Date(now.getTime() + config.duration * 1000);

      const order = this.orderRepo.create({
        orderNo: this.generateOrderNo(),
        userId,
        configId: config.id,
        symbol: config.symbol,
        duration: config.duration,
        direction: dto.direction,
        amount: amount.toString(),
        openPrice: currentPrice.toString(),
        profitRate: config.profitRate,
        status: 0,
        openAt: now,
      });

      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      // 设置定时结算（简化处理，实际应用消息队列）
      setTimeout(() => {
        this.settleOrder(order.id);
      }, config.duration * 1000);

      return {
        orderId: order.id,
        orderNo: order.orderNo,
        symbol: order.symbol,
        direction: order.direction,
        directionText: order.direction === 1 ? '看涨' : '看跌',
        amount: order.amount,
        openPrice: order.openPrice,
        duration: order.duration,
        profitRate: config.profitRate,
        openAt: this.formatDate(now),
        closeAt: this.formatDate(closeAt),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 结算订单 - 使用用户胜率控制结果
   */
  async settleOrder(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, status: 0 },
      relations: ['user'],
    });

    if (!order) return;

    // 获取用户胜率
    const user = await this.dataSource.getRepository('User').findOne({ where: { id: order.userId } });
    const winRate = user?.winRate ?? 50;

    const amount = new Decimal(order.amount);
    const profitRate = new Decimal(order.profitRate);

    // 根据用户胜率随机决定结果
    const random = Math.random() * 100;
    let result: number;
    let profitLoss: Decimal;

    if (random < winRate) {
      // 赢
      result = 1;
      profitLoss = amount.mul(profitRate);
    } else {
      // 输
      result = 2;
      profitLoss = amount.neg();
    }

    // 生成一个符合结果的收盘价
    const openPrice = new Decimal(order.openPrice);
    let closePrice: Decimal;
    const priceChange = openPrice.mul(0.001 + Math.random() * 0.005); // 0.1%-0.5%波动

    if (result === 1) {
      // 赢: 让价格向有利方向变动
      closePrice = order.direction === 1
        ? openPrice.plus(priceChange)  // 看涨 -> 价格上涨
        : openPrice.minus(priceChange); // 看跌 -> 价格下跌
    } else {
      // 输: 让价格向不利方向变动
      closePrice = order.direction === 1
        ? openPrice.minus(priceChange) // 看涨 -> 价格下跌
        : openPrice.plus(priceChange);  // 看跌 -> 价格上涨
    }

    // 更新订单
    await this.orderRepo.update(orderId, {
      closePrice: closePrice.toString(),
      profitLoss: profitLoss.toString(),
      result,
      status: 1,
      closeAt: new Date(),
    });

    // 返还本金 + 盈亏
    if (result === 1) {
      const agxCoin = await this.coinRepo.findOne({ where: { symbol: 'AGX' } });
      const wallet = await this.walletRepo.findOne({
        where: { userId: order.userId, coinId: agxCoin.id },
      });

      const returnAmount = amount.plus(profitLoss);
      const newBalance = new Decimal(wallet.balance).plus(returnAmount).toString();
      await this.walletRepo.update(wallet.id, { balance: newBalance });
    }
  }

  /**
   * 获取用户订单列表
   */
  async getOrders(userId: number, status?: number) {
    const where: any = { userId };
    if (status !== undefined) {
      where.status = status;
    }

    const orders = await this.orderRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return {
      list: orders.map((o) => ({
        id: o.id,
        orderNo: o.orderNo,
        symbol: o.symbol,
        direction: o.direction,
        directionText: o.direction === 1 ? '看涨' : '看跌',
        amount: o.amount,
        openPrice: o.openPrice,
        closePrice: o.closePrice,
        profitLoss: o.profitLoss,
        result: o.result,
        resultText: o.result === 1 ? '盈' : o.result === 2 ? '亏' : o.result === 3 ? '平' : '进行中',
        status: o.status,
        openAt: this.formatDate(o.openAt),
        closeAt: o.closeAt ? this.formatDate(o.closeAt) : null,
      })),
    };
  }

  /**
   * 模拟价格（实际应从外部API获取）
   */
  private getMockPrice(symbol: string): Decimal {
    const basePrices: Record<string, number> = {
      'XAU/USD': 2050,
      'XAG/USD': 24,
    };
    const basePrice = basePrices[symbol] || 100;
    // 随机波动 ±0.5%
    const fluctuation = 1 + (Math.random() - 0.5) * 0.01;
    return new Decimal(basePrice * fluctuation).toDecimalPlaces(2);
  }
}
