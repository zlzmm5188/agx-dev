import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PoolProduct, PoolHolding, Wallet, Coin } from '../../entities';
import { BusinessException } from '../../common';
import { SubscribePoolDto, RedeemPoolDto } from './pool.dto';
import Decimal from 'decimal.js';

@Injectable()
export class PoolService {
  constructor(
    @InjectRepository(PoolProduct)
    private readonly productRepo: Repository<PoolProduct>,
    @InjectRepository(PoolHolding)
    private readonly holdingRepo: Repository<PoolHolding>,
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

  /**
   * 获取矿池产品列表
   */
  async getProducts() {
    const products = await this.productRepo.find({
      where: { status: 1 },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });

    return {
      list: products.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        lockDays: p.lockDays,
        dailyRate: p.dailyRate,
        annualRate: new Decimal(p.dailyRate).mul(365).mul(100).toFixed(2) + '%',
        minAmount: p.minAmount,
        maxAmount: p.maxAmount,
        totalQuota: p.totalQuota,
        soldAmount: p.soldAmount,
        remainQuota: p.totalQuota ? new Decimal(p.totalQuota).minus(p.soldAmount).toString() : null,
        isHot: p.isHot === 1,
      })),
    };
  }

  /**
   * 获取用户矿池持仓
   */
  async getHoldings(userId: number) {
    const holdings = await this.holdingRepo.find({
      where: { userId, status: 1 },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    let totalAmount = new Decimal(0);
    let totalIncome = new Decimal(0);

    const list = holdings.map((h) => {
      totalAmount = totalAmount.plus(h.amount);
      totalIncome = totalIncome.plus(h.totalIncome);

      return {
        id: h.id,
        productName: h.product.name,
        productType: h.product.type,
        amount: h.amount,
        totalIncome: h.totalIncome,
        dailyRate: h.product.dailyRate,
        startAt: this.formatDate(h.startAt),
        endAt: h.endAt ? this.formatDate(h.endAt) : null,
        canRedeem: h.product.type === 'flexible' || (h.endAt && new Date() >= h.endAt),
        // 计算预计日收益
        dailyIncome: h.product.dailyRate ? new Decimal(h.amount).mul(h.product.dailyRate).toFixed(8) : '0',
        // 计算预计年收益
        annualIncome: h.product.dailyRate ? new Decimal(h.amount).mul(h.product.dailyRate).mul(365).toFixed(8) : '0',
      };
    });

    return {
      totalAmount: totalAmount.toString(),
      totalIncome: totalIncome.toString(),
      list,
    };
  }

  /**
   * 计算矿池收益
   */
  private calculatePoolIncome(amount: string, dailyRate: string, days: number): string {
    const decimalAmount = new Decimal(amount);
    const decimalRate = new Decimal(dailyRate);
    return decimalAmount.mul(decimalRate).mul(days).toFixed(8);
  }

  /**
   * 申购矿池
   */
  async subscribe(userId: number, dto: SubscribePoolDto) {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId, status: 1 },
    });

    if (!product) {
      throw new BusinessException(3001, '矿池产品不存在或已下架');
    }

    const amount = new Decimal(dto.amount);

    // 检查最小申购
    if (amount.lt(product.minAmount)) {
      throw new BusinessException(3002, `最低申购 ${product.minAmount}`);
    }

    // 检查最大申购
    if (product.maxAmount && amount.gt(product.maxAmount)) {
      throw new BusinessException(3003, `最高申购 ${product.maxAmount}`);
    }

    // 检查额度
    if (product.totalQuota) {
      const remain = new Decimal(product.totalQuota).minus(product.soldAmount);
      if (amount.gt(remain)) {
        throw new BusinessException(3004, `剩余额度不足，仅剩 ${remain.toString()}`);
      }
    }

    // 获取用户钱包
    const wallet = await this.walletRepo.findOne({
      where: { userId, coinId: product.coinId },
    });

    if (!wallet || new Decimal(wallet.balance).lt(amount)) {
      throw new BusinessException(3005, '余额不足');
    }

    // 开始事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 扣减余额
      const newBalance = new Decimal(wallet.balance).minus(amount).toString();
      await queryRunner.manager.update(Wallet, wallet.id, { balance: newBalance });

      // 更新已售额度
      const newSoldAmount = new Decimal(product.soldAmount).plus(amount).toString();
      await queryRunner.manager.update(PoolProduct, product.id, { soldAmount: newSoldAmount });

      // 创建持仓
      const now = new Date();
      const endAt = product.lockDays > 0
        ? new Date(now.getTime() + product.lockDays * 24 * 60 * 60 * 1000)
        : null;

      const holding = this.holdingRepo.create({
        userId,
        productId: product.id,
        amount: amount.toString(),
        totalIncome: '0',
        startAt: now,
        endAt,
        status: 1,
      });

      await queryRunner.manager.save(holding);
      await queryRunner.commitTransaction();

      return {
        holdingId: holding.id,
        amount: holding.amount,
        startAt: this.formatDate(now),
        endAt: endAt ? this.formatDate(endAt) : null,
        // 返回预计收益信息
        dailyIncome: product.dailyRate ? new Decimal(amount).mul(product.dailyRate).toFixed(8) : '0',
        annualIncome: product.dailyRate ? new Decimal(amount).mul(product.dailyRate).mul(365).toFixed(8) : '0',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 赎回矿池
   */
  async redeem(userId: number, dto: RedeemPoolDto) {
    const holding = await this.holdingRepo.findOne({
      where: { id: dto.holdingId, userId, status: 1 },
      relations: ['product'],
    });

    if (!holding) {
      throw new BusinessException(3006, '持仓不存在');
    }

    // 检查是否可赎回
    if (holding.product.type === 'fixed' && holding.endAt && new Date() < holding.endAt) {
      throw new BusinessException(3007, '定期产品未到期，无法赎回');
    }

    // 计算实际收益
    let actualIncome = holding.totalIncome;
    if (holding.product.dailyRate && holding.startAt) {
      const daysHeld = Math.floor((new Date().getTime() - holding.startAt.getTime()) / (24 * 60 * 60 * 1000));
      if (daysHeld > 0) {
        actualIncome = this.calculatePoolIncome(holding.amount, holding.product.dailyRate, daysHeld);
      }
    }

    // 开始事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 返还本金 + 收益
      const returnAmount = new Decimal(holding.amount).plus(actualIncome);
      
      const wallet = await this.walletRepo.findOne({
        where: { userId, coinId: holding.product.coinId },
      });

      const newBalance = new Decimal(wallet.balance).plus(returnAmount).toString();
      await queryRunner.manager.update(Wallet, wallet.id, { balance: newBalance });

      // 更新持仓状态
      await queryRunner.manager.update(PoolHolding, holding.id, {
        status: 0,
        redeemedAt: new Date(),
        totalIncome: actualIncome, // 更新实际收益
      });

      // 更新产品已售额度
      const newSoldAmount = new Decimal(holding.product.soldAmount).minus(holding.amount).toString();
      await queryRunner.manager.update(PoolProduct, holding.product.id, { soldAmount: newSoldAmount });

      await queryRunner.commitTransaction();

      return {
        returnAmount: returnAmount.toString(),
        principal: holding.amount,
        income: actualIncome,
        dailyIncome: holding.product.dailyRate ? new Decimal(holding.amount).mul(holding.product.dailyRate).toFixed(8) : '0',
        annualIncome: holding.product.dailyRate ? new Decimal(holding.amount).mul(holding.product.dailyRate).mul(365).toFixed(8) : '0',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
