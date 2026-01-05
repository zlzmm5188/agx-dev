import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

/**
 * 创建订单DTO
 */
export class CreateOrderDto {
  @IsString()
  symbol: string; // 交易对符号，如 BTCUSDT

  @IsEnum(['buy', 'sell'])
  side: 'buy' | 'sell'; // 买卖方向

  @IsEnum(['limit', 'market'])
  type: 'limit' | 'market'; // 订单类型

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number; // 委托价格（市价单不需要）

  @IsNumber()
  @Min(0)
  quantity: number; // 委托数量
}

/**
 * 取消订单DTO
 */
export class CancelOrderDto {
  @IsString()
  orderNo: string; // 订单编号
}

/**
 * 创建交易对DTO（管理后台）
 */
export class CreateTradingPairDto {
  @IsString()
  symbol: string; // 交易对符号

  @IsString()
  baseCoin: string; // 基础货币

  @IsString()
  quoteCoin: string; // 计价货币

  @IsNumber()
  @Min(0)
  minQty: number; // 最小交易量

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxQty?: number; // 最大交易量

  @IsNumber()
  pricePrecision: number; // 价格精度

  @IsNumber()
  qtyPrecision: number; // 数量精度

  @IsNumber()
  tradeFee: number; // 交易手续费率

  @IsOptional()
  @IsNumber()
  status?: number; // 状态

  @IsOptional()
  @IsNumber()
  sortOrder?: number; // 排序
}

/**
 * 更新交易对DTO
 */
export class UpdateTradingPairDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  minQty?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxQty?: number;

  @IsOptional()
  @IsNumber()
  pricePrecision?: number;

  @IsOptional()
  @IsNumber()
  qtyPrecision?: number;

  @IsOptional()
  @IsNumber()
  tradeFee?: number;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

/**
 * 创建新币发行DTO
 */
export class CreateCoinIssueDto {
  @IsString()
  coinSymbol: string; // 币种符号

  @IsString()
  coinName: string; // 币种名称

  @IsNumber()
  totalSupply: number; // 总发行量

  @IsNumber()
  issuePrice: number; // 发行价格

  @IsNumber()
  issueAmount: number; // 本次发行量

  @IsNumber()
  minBuyAmount: number; // 最小申购数量

  @IsNumber()
  maxBuyAmount: number; // 最大申购数量

  @IsString()
  startTime: string; // 申购开始时间

  @IsString()
  endTime: string; // 申购结束时间

  @IsString()
  lotteryTime: string; // 开奖时间

  @IsString()
  unlockTime: string; // 解锁时间
}

/**
 * 申购新币DTO
 */
export class SubscribeCoinDto {
  @IsNumber()
  issueId: number; // 发行ID

  @IsNumber()
  @Min(0)
  buyAmount: number; // 申购数量
}
