import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 黄金玩法产品配置表
 * 支持四种玩法类型：现货黄金、黄金秒合约、黄金理财、AGX首发
 */
@Entity('agx_gold_product')
export class GoldProduct {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 32, comment: '产品代码' })
  @Index('idx_code')
  code: string;

  @Column({ type: 'varchar', length: 100, comment: '产品名称' })
  name: string;

  @Column({ type: 'varchar', length: 100, name: 'name_en', nullable: true, comment: '英文名称' })
  nameEn: string;

  /**
   * 玩法类型
   * spot: 现货黄金 - 实时金价交易
   * contract: 黄金秒合约 - 短周期合约交易
   * finance: 黄金理财 - 黄金定期/活期理财
   * agx: AGX首发 - AGX代币首发认购
   */
  @Column({ 
    type: 'varchar', 
    length: 20, 
    name: 'product_type',
    comment: '玩法类型: spot=现货黄金, contract=黄金秒合约, finance=黄金理财, agx=AGX首发' 
  })
  @Index('idx_product_type')
  productType: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '产品图标' })
  icon: string;

  @Column({ type: 'text', nullable: true, comment: '产品描述' })
  description: string;

  // ===== 现货黄金配置 =====
  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'min_amount', default: '0.01', comment: '最小交易量（克）' })
  minAmount: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'max_amount', default: '10000', comment: '最大交易量（克）' })
  maxAmount: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'fee_rate', default: '0.001', comment: '手续费率' })
  feeRate: string;

  // ===== 秒合约配置 =====
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'contract_periods', comment: '合约周期选项JSON: [30,60,120,300]秒' })
  contractPeriods: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'contract_profit_rate', default: '0.85', comment: '合约盈利率' })
  contractProfitRate: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'contract_amounts', comment: '合约金额选项JSON: [10,50,100,500]' })
  contractAmounts: string;

  // ===== 理财配置 =====
  @Column({ type: 'int', name: 'finance_period_days', default: 0, comment: '理财周期天数，0为活期' })
  financePeriodDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'finance_apy', default: '0', comment: '年化收益率' })
  financeApy: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'finance_min_amount', default: '100', comment: '理财最小金额' })
  financeMinAmount: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'finance_total_amount', default: '0', comment: '理财总额度' })
  financeTotalAmount: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'finance_sold_amount', default: '0', comment: '已售额度' })
  financeSoldAmount: string;

  // ===== AGX首发配置 =====
  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'agx_price', default: '0.10', comment: 'AGX首发价格(USD)' })
  agxPrice: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'agx_total_supply', default: '100000000', comment: 'AGX总发行量' })
  agxTotalSupply: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, name: 'agx_sold', default: '0', comment: 'AGX已售数量' })
  agxSold: string;

  @Column({ type: 'int', name: 'agx_gold_backing', default: 100, comment: 'AGX黄金储备支撑百分比' })
  agxGoldBacking: number;

  @Column({ type: 'timestamp', nullable: true, name: 'agx_start_time', comment: 'AGX首发开始时间' })
  agxStartTime: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'agx_end_time', comment: 'AGX首发结束时间' })
  agxEndTime: Date;

  // ===== 通用配置 =====
  @Column({ type: 'text', nullable: true, name: 'rules', comment: '交易规则说明' })
  rules: string;

  @Column({ type: 'text', nullable: true, name: 'risk_warning', comment: '风险提示' })
  riskWarning: string;

  @Column({ type: 'smallint', name: 'is_hot', default: 0, comment: '是否热门: 0否 1是' })
  isHot: number;

  @Column({ type: 'smallint', name: 'is_recommend', default: 0, comment: '是否推荐: 0否 1是' })
  isRecommend: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'tag', comment: '标签：新上线/火爆/限时等' })
  tag: string;

  @Column({ type: 'int', name: 'sort_order', default: 0, comment: '排序值' })
  sortOrder: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0禁用 1启用' })
  status: number;

  @Column({ type: 'text', nullable: true, comment: '扩展配置JSON' })
  extra: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
