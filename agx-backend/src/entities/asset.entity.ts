import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 资产/品种配置表
 * 支持多种资产类型：加密货币、外汇、股票、贵金属、基金等
 */
@Entity('agx_asset')
export class Asset {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, comment: '资产代码，如 BTC, XAU, EUR' })
  @Index('idx_symbol', { unique: true })
  symbol: string;

  @Column({ type: 'varchar', length: 100, comment: '资产名称' })
  name: string;

  @Column({ type: 'varchar', length: 100, name: 'name_en', nullable: true, comment: '英文名称' })
  nameEn: string;

  @Column({ type: 'varchar', length: 100, name: 'name_zh', nullable: true, comment: '中文名称' })
  nameZh: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    name: 'asset_type',
    comment: '资产类型: crypto=加密货币, forex=外汇, stock=股票, metal=贵金属, fund=基金, index=指数' 
  })
  @Index('idx_asset_type')
  assetType: string;

  @Column({ type: 'varchar', length: 20, name: 'quote_asset', default: 'USD', comment: '报价资产，如 USD, USDT' })
  quoteAsset: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '图标URL' })
  icon: string;

  @Column({ type: 'smallint', default: 8, comment: '价格小数位数' })
  decimals: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'data_source', comment: '数据源: binance, coingecko, custom等' })
  dataSource: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'data_source_symbol', comment: '数据源对应的交易对符号' })
  dataSourceSymbol: string;

  @Column({ type: 'smallint', name: 'is_tradable', default: 0, comment: '是否可交易: 0只展示 1可交易' })
  isTradable: number;

  @Column({ type: 'smallint', name: 'is_contract', default: 0, comment: '是否支持合约: 0不支持 1支持' })
  isContract: number;

  @Column({ type: 'smallint', name: 'is_hot', default: 0, comment: '是否热门' })
  isHot: number;

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
