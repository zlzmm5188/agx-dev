import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TradingPair, SpotOrder, Wallet, Coin, CoinIssue, CoinSubscription } from '../../entities';
import { CreateSpotOrderDto, GetOrdersDto, SubscribeCoinDto } from './trade.dto';
import { BusinessException } from '../../common/exceptions/business.exception';
import Decimal from 'decimal.js';

/**
 * 交易服务
 * 币币交易 + 新币发行
 */
@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradingPair)
    private readonly pairRepo: Repository<TradingPair>,
    @InjectRepository(SpotOrder)
    private readonly orderRepo: Repository<SpotOrder>,
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Coin)
    private readonly coinRepo: Repository<Coin>,
    @InjectRepository(CoinIssue)
    private readonly issueRepo: Repository<CoinIssue>,
    @InjectRepository(CoinSubscription)
    private readonly subscriptionRepo: Repository<CoinSubscription>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 生成订单号
   */
  private generateOrderNo(): string {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const timePart = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `S${datePart}${timePart}${random}`;
  }

  /**
   * 获取交易对列表
   */
  async getTradingPairs() {
    const pairs = await this.pairRepo.find({
      where: { status: 1 },
      order: { sortOrder: 'ASC', symbol: 'ASC' },
    });

    return {
      code: 0,
      msg: 'ok',
      data: {
        list: pairs.map((p) => ({
          id: p.id,
          symbol: p.symbol,
          baseCoin: p.baseCoin,
          quoteCoin: p.quoteCoin,
          minQty: p.minQty,
          maxQty: p.maxQty,
          pricePrecision: p.pricePrecision,
          qtyPrecision: p.qtyPrecision,
          tradeFee: p.tradeFee,
        })),
      },
    };
  }

  /**
   * 创建现货订单（限价单/市价单）
   */
  async createSpotOrder(userId: number, dto: CreateSpotOrderDto) {
    // 查找交易对
    const pair = await this.pairRepo.findOne({
      where: { symbol: dto.symbol, status: 1 },
    });

    if (!pair) {
      throw new BusinessException(5001, '交易对不存在或已禁用');
    }

    // 验证限价单必须有价格
    if (dto.type === 'limit' && !dto.price) {
      throw new BusinessException(5002, '限价单必须指定价格');
    }

    // 验证数量
    const qty = new Decimal(dto.quantity);
    if (qty.lt(pair.minQty)) {
      throw new BusinessException(5003, `最小交易量 ${pair.minQty}`);
    }

    if (pair.maxQty && qty.gt(pair.maxQty)) {
      throw new BusinessException(5004, `最大交易量 ${pair.maxQty}`);
    }

    // 获取币种信息
    const baseCoin = await this.coinRepo.findOne({ where: { symbol: pair.baseCoin } });
    const quoteCoin = await this.coinRepo.findOne({ where: { symbol: pair.quoteCoin } });

    if (!baseCoin || !quoteCoin) {
      throw new BusinessException(5005, '币种配置缺失');
    }

    // 查询钱包余额
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let wallet: Wallet;
      let needAmount: Decimal;

      if (dto.side === 'buy') {
        // 买入：检查quote币余额
        wallet = await queryRunner.manager.findOne(Wallet, {
          where: { userId, coinId: quoteCoin.id },
        });

        if (!wallet) {
          throw new BusinessException(5006, `${quoteCoin.symbol} 钱包不存在`);
        }

        // 市价单：按当前市价估算所需金额（此处简化，实际需从行情获取）
        const price = dto.type === 'limit' ? new Decimal(dto.price) : new Decimal(100000); // mock价格
        needAmount = qty.mul(price);

        if (new Decimal(wallet.balance).lt(needAmount)) {
          throw new BusinessException(5007, `${quoteCoin.symbol} 余额不足`);
        }

        // 冻结资金
        wallet.balance = new Decimal(wallet.balance).minus(needAmount).toString();
        wallet.frozen = new Decimal(wallet.frozen).plus(needAmount).toString();
        await queryRunner.manager.save(wallet);
      } else {
        // 卖出：检查base币余额
        wallet = await queryRunner.manager.findOne(Wallet, {
          where: { userId, coinId: baseCoin.id },
        });

        if (!wallet) {
          throw new BusinessException(5008, `${baseCoin.symbol} 钱包不存在`);
        }

        needAmount = qty;

        if (new Decimal(wallet.balance).lt(needAmount)) {
          throw new BusinessException(5009, `${baseCoin.symbol} 余额不足`);
        }

        // 冻结资金
        wallet.balance = new Decimal(wallet.balance).minus(needAmount).toString();
        wallet.frozen = new Decimal(wallet.frozen).plus(needAmount).toString();
        await queryRunner.manager.save(wallet);
      }

      // 创建订单
      const order = this.orderRepo.create({
        orderNo: this.generateOrderNo(),
        userId,
        pairId: pair.id,
        symbol: dto.symbol,
        side: dto.side,
        type: dto.type,
        price: dto.type === 'limit' ? dto.price : null,
        quantity: dto.quantity,
        executedQty: 0,
        avgPrice: null,
        fee: 0,
        feeCoin: pair.quoteCoin,
        status: 0, // 待成交
      });

      await queryRunner.manager.save(order);

      // 市价单立即成交（模拟）
      if (dto.type === 'market') {
        const mockPrice = new Decimal(100000); // 实际应从行情获取
        order.executedQty = order.quantity;
        order.avgPrice = parseFloat(mockPrice.toString());
        order.status = 2; // 全部成交
        order.fee = mockPrice.mul(qty).mul(pair.tradeFee).toNumber();
        await queryRunner.manager.save(order);

        // 解冻并完成交易
        // ... 实际需要更复杂的撮合逻辑
      }

      await queryRunner.commitTransaction();

      return {
        code: 0,
        msg: 'ok',
        data: {
          orderNo: order.orderNo,
          symbol: order.symbol,
          side: order.side,
          type: order.type,
          price: order.price,
          quantity: order.quantity,
          status: order.status,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 撤销订单
   */
  async cancelOrder(userId: number, orderNo: string) {
    const order = await this.orderRepo.findOne({
      where: { orderNo, userId },
    });

    if (!order) {
      throw new BusinessException(5010, '订单不存在');
    }

    if (order.status !== 0 && order.status !== 1) {
      throw new BusinessException(5011, '订单不可撤销');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 计算未成交数量
      const remainQty = new Decimal(order.quantity).minus(order.executedQty);

      if (remainQty.gt(0)) {
        const pair = await this.pairRepo.findOne({ where: { id: order.pairId } });
        
        // 解冻资金
        if (order.side === 'buy') {
          const quoteCoin = await this.coinRepo.findOne({ where: { symbol: pair.quoteCoin } });
          const wallet = await queryRunner.manager.findOne(Wallet, {
            where: { userId, coinId: quoteCoin.id },
          });

          const price = new Decimal(order.price || 100000);
          const unfreezeAmount = remainQty.mul(price);

          wallet.balance = new Decimal(wallet.balance).plus(unfreezeAmount).toString();
          wallet.frozen = new Decimal(wallet.frozen).minus(unfreezeAmount).toString();
          await queryRunner.manager.save(wallet);
        } else {
          const baseCoin = await this.coinRepo.findOne({ where: { symbol: pair.baseCoin } });
          const wallet = await queryRunner.manager.findOne(Wallet, {
            where: { userId, coinId: baseCoin.id },
          });

          wallet.balance = new Decimal(wallet.balance).plus(remainQty.toString()).toString();
          wallet.frozen = new Decimal(wallet.frozen).minus(remainQty.toString()).toString();
          await queryRunner.manager.save(wallet);
        }
      }

      // 更新订单状态
      order.status = 3; // 已取消
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return { code: 0, msg: '撤单成功', data: { orderNo } };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 获取用户订单列表
   */
  async getOrders(userId: number, dto: GetOrdersDto) {
    const page = dto.page || 1;
    const pageSize = dto.pageSize || 20;

    const query = this.orderRepo.createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (dto.symbol) {
      query.andWhere('order.symbol = :symbol', { symbol: dto.symbol });
    }

    if (dto.status !== undefined) {
      query.andWhere('order.status = :status', { status: dto.status });
    }

    const [orders, total] = await query.getManyAndCount();

    return {
      code: 0,
      msg: 'ok',
      data: {
        list: orders.map((o) => ({
          orderNo: o.orderNo,
          symbol: o.symbol,
          side: o.side,
          type: o.type,
          price: o.price,
          quantity: o.quantity,
          executedQty: o.executedQty,
          avgPrice: o.avgPrice,
          fee: o.fee,
          status: o.status,
          statusText: this.getStatusText(o.status),
          createdAt: this.formatDate(o.createdAt),
        })),
        total,
        page,
        pageSize,
      },
    };
  }

  /**
   * 获取新币发行列表
   */
  async getCoinIssues() {
    const issues = await this.issueRepo.find({
      where: { status: 1 },
      order: { startTime: 'DESC' },
    });

    return {
      code: 0,
      msg: 'ok',
      data: {
        list: issues.map((i) => ({
          id: i.id,
          coinSymbol: i.coinSymbol,
          coinName: i.coinName,
          totalSupply: i.totalSupply,
          issuePrice: i.issuePrice,
          issueAmount: i.issueAmount,
          minBuyAmount: i.minBuyAmount,
          maxBuyAmount: i.maxBuyAmount,
          startTime: this.formatDate(i.startTime),
          endTime: this.formatDate(i.endTime),
          lotteryTime: this.formatDate(i.lotteryTime),
          unlockTime: this.formatDate(i.unlockTime),
          totalSubscribed: i.totalSubscribed,
          subscriberCount: i.subscriberCount,
          winRate: i.winRate,
          subscribeRate: new Decimal(i.totalSubscribed).div(i.issueAmount).mul(100).toFixed(2),
        })),
      },
    };
  }

  /**
   * 新币申购
   */
  async subscribeCoin(userId: number, dto: SubscribeCoinDto) {
    const issue = await this.issueRepo.findOne({
      where: { id: dto.issueId, status: 1 },
    });

    if (!issue) {
      throw new BusinessException(5020, '发行项目不存在');
    }

    const now = new Date();
    if (now < issue.startTime) {
      throw new BusinessException(5021, '申购尚未开始');
    }

    if (now > issue.endTime) {
      throw new BusinessException(5022, '申购已结束');
    }

    const buyAmount = new Decimal(dto.buyAmount);

    if (buyAmount.lt(issue.minBuyAmount)) {
      throw new BusinessException(5023, `最小申购数量 ${issue.minBuyAmount}`);
    }

    if (buyAmount.gt(issue.maxBuyAmount)) {
      throw new BusinessException(5024, `最大申购数量 ${issue.maxBuyAmount}`);
    }

    // 检查是否已申购
    const existing = await this.subscriptionRepo.findOne({
      where: { userId, issueId: dto.issueId },
    });

    if (existing) {
      throw new BusinessException(5025, '您已参与过此次申购');
    }

    const payAmount = buyAmount.mul(issue.issuePrice);

    // 检查USDT余额
    const usdtCoin = await this.coinRepo.findOne({ where: { symbol: 'USDT' } });
    const wallet = await this.walletRepo.findOne({
      where: { userId, coinId: usdtCoin.id },
    });

    if (!wallet || new Decimal(wallet.balance).lt(payAmount)) {
      throw new BusinessException(5026, 'USDT余额不足');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 扣减余额
      wallet.balance = new Decimal(wallet.balance).minus(payAmount.toString()).toString();
      await queryRunner.manager.save(wallet);

      // 创建申购记录
      const subscription = this.subscriptionRepo.create({
        userId,
        issueId: dto.issueId,
        buyAmount: dto.buyAmount,
        payAmount: payAmount.toNumber(),
        winAmount: 0,
        refundAmount: 0,
        status: 0, // 待开奖
      });
      await queryRunner.manager.save(subscription);

      // 更新发行统计
      issue.totalSubscribed = new Decimal(issue.totalSubscribed).plus(buyAmount.toString()).toNumber();
      issue.subscriberCount += 1;
      await queryRunner.manager.save(issue);

      await queryRunner.commitTransaction();

      return {
        code: 0,
        msg: '申购成功',
        data: {
          id: subscription.id,
          buyAmount: subscription.buyAmount,
          payAmount: subscription.payAmount,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getStatusText(status: number): string {
    const map = {
      0: '待成交',
      1: '部分成交',
      2: '全部成交',
      3: '已取消',
      4: '失败',
    };
    return map[status] || '未知';
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}
