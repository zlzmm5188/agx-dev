-- ============================================================
-- AGX 扩展模块迁移脚本 V1.0
-- 执行: PGPASSWORD=AGX2025Pass psql -h 127.0.0.1 -U agx -d agx -f migrations/001_extend_modules.sql
-- 功能: 多资产行情、黄金模块、内容广场、邀请与等级系统
-- ============================================================

-- ============================================================
-- 1. 多资产配置表 (扩展行情支持)
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_asset (
  id              BIGSERIAL PRIMARY KEY,
  symbol          VARCHAR(32) NOT NULL UNIQUE,
  name            VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100),
  icon            VARCHAR(255),
  asset_type      VARCHAR(20) NOT NULL DEFAULT 'crypto',   -- crypto=加密货币, forex=外汇, stock=股票, metal=贵金属, fund=基金, index=指数
  category        VARCHAR(32) DEFAULT 'main',              -- main=主流, alt=山寨, defi=DeFi, nft=NFT, meme=Meme等
  base_currency   VARCHAR(20) DEFAULT 'USD',
  quote_currency  VARCHAR(20) DEFAULT 'USDT',
  decimals        SMALLINT NOT NULL DEFAULT 2,
  price_decimals  SMALLINT NOT NULL DEFAULT 2,
  qty_decimals    SMALLINT NOT NULL DEFAULT 4,
  min_price       DECIMAL(20,8) DEFAULT 0,
  max_price       DECIMAL(20,8),
  min_qty         DECIMAL(20,8) DEFAULT 0.0001,
  max_qty         DECIMAL(20,8),
  is_tradable     SMALLINT NOT NULL DEFAULT 0,             -- 0只展示 1可交易
  is_hot          SMALLINT NOT NULL DEFAULT 0,             -- 是否热门
  is_new          SMALLINT NOT NULL DEFAULT 0,             -- 是否新上
  sort_order      INT NOT NULL DEFAULT 0,
  status          SMALLINT NOT NULL DEFAULT 1,
  extra_data      JSONB,                                   -- 扩展数据
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_asset_type ON agx_asset(asset_type);
CREATE INDEX IF NOT EXISTS idx_asset_category ON agx_asset(category);
CREATE INDEX IF NOT EXISTS idx_asset_status ON agx_asset(status);
COMMENT ON TABLE agx_asset IS '多资产品种配置表';
COMMENT ON COLUMN agx_asset.asset_type IS '资产类型: crypto=加密货币, forex=外汇, stock=股票, metal=贵金属, fund=基金, index=指数';

-- ============================================================
-- 2. 行情数据缓存表
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_asset_ticker (
  id              BIGSERIAL PRIMARY KEY,
  asset_id        BIGINT NOT NULL,
  symbol          VARCHAR(32) NOT NULL,
  asset_type      VARCHAR(20) NOT NULL DEFAULT 'crypto',
  price           DECIMAL(20,8) NOT NULL DEFAULT 0,
  open            DECIMAL(20,8),
  high            DECIMAL(20,8),
  low             DECIMAL(20,8),
  close           DECIMAL(20,8),
  volume          DECIMAL(30,8) DEFAULT 0,
  volume_usd      DECIMAL(30,8) DEFAULT 0,
  change_24h      DECIMAL(20,8) DEFAULT 0,
  change_percent  DECIMAL(10,4) DEFAULT 0,
  market_cap      DECIMAL(30,2),
  turnover        DECIMAL(30,8),
  bid_price       DECIMAL(20,8),
  ask_price       DECIMAL(20,8),
  last_trade_at   TIMESTAMP,
  data_source     VARCHAR(32) DEFAULT 'internal',           -- internal/binance/okx/yahoo/reuters
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(symbol)
);
CREATE INDEX IF NOT EXISTS idx_ticker_asset ON agx_asset_ticker(asset_id);
CREATE INDEX IF NOT EXISTS idx_ticker_type ON agx_asset_ticker(asset_type);
COMMENT ON TABLE agx_asset_ticker IS '行情数据缓存表';

-- ============================================================
-- 3. 贵金属价格表
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_gold_price (
  id              BIGSERIAL PRIMARY KEY,
  metal_type      VARCHAR(20) NOT NULL,                     -- XAU=黄金, XAG=白银, XPT=铂金, XPD=钯金
  name            VARCHAR(50) NOT NULL,
  name_en         VARCHAR(50),
  price_usd       DECIMAL(20,4) NOT NULL,                   -- 美元价格
  price_cny       DECIMAL(20,4),                            -- 人民币价格
  change_24h      DECIMAL(20,4) DEFAULT 0,
  change_percent  DECIMAL(10,4) DEFAULT 0,
  high_24h        DECIMAL(20,4),
  low_24h         DECIMAL(20,4),
  open_price      DECIMAL(20,4),
  prev_close      DECIMAL(20,4),
  bid_price       DECIMAL(20,4),
  ask_price       DECIMAL(20,4),
  unit            VARCHAR(20) DEFAULT 'oz',                 -- oz=盎司, g=克
  data_source     VARCHAR(32) DEFAULT 'reuters',
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(metal_type)
);
COMMENT ON TABLE agx_gold_price IS '贵金属实时价格表';
COMMENT ON COLUMN agx_gold_price.metal_type IS 'XAU=黄金, XAG=白银, XPT=铂金, XPD=钯金';

-- ============================================================
-- 4. 热门话题表
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_topic (
  id              BIGSERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL UNIQUE,
  icon            VARCHAR(255),
  description     VARCHAR(500),
  post_count      INT NOT NULL DEFAULT 0,
  view_count      BIGINT NOT NULL DEFAULT 0,
  is_hot          SMALLINT NOT NULL DEFAULT 0,
  is_official     SMALLINT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_topic_hot ON agx_topic(is_hot);
COMMENT ON TABLE agx_topic IS '热门话题表';

-- ============================================================
-- 5. 用户关注表
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_follow (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  follow_user_id  BIGINT NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, follow_user_id)
);
CREATE INDEX IF NOT EXISTS idx_follow_user ON agx_follow(user_id);
CREATE INDEX IF NOT EXISTS idx_follow_target ON agx_follow(follow_user_id);
COMMENT ON TABLE agx_follow IS '用户关注关系表';

-- ============================================================
-- 6. 用户等级配置表
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_user_level (
  id              BIGSERIAL PRIMARY KEY,
  level           INT NOT NULL UNIQUE,
  name            VARCHAR(50) NOT NULL,
  name_en         VARCHAR(50),
  icon            VARCHAR(255),
  min_invite      INT NOT NULL DEFAULT 0,                   -- 最低邀请人数
  min_trade       DECIMAL(20,8) DEFAULT 0,                  -- 最低交易额
  min_assets      DECIMAL(20,8) DEFAULT 0,                  -- 最低资产
  commission_rate_1  DECIMAL(5,4) NOT NULL DEFAULT 0.20,    -- 一级返佣比例
  commission_rate_2  DECIMAL(5,4) NOT NULL DEFAULT 0.10,    -- 二级返佣比例
  fee_discount    DECIMAL(5,4) NOT NULL DEFAULT 1.00,       -- 手续费折扣
  withdraw_limit  DECIMAL(20,8),                            -- 每日提现限额
  benefits        TEXT,                                      -- 权益说明JSON
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE agx_user_level IS '用户等级配置表';

-- ============================================================
-- 7. 邀请奖励记录表
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_invite_reward (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,                          -- 获得奖励的用户
  from_user_id    BIGINT NOT NULL,                          -- 被邀请用户
  reward_type     VARCHAR(32) NOT NULL,                     -- register=注册奖励, trade=交易返佣, level_up=升级奖励
  level           SMALLINT NOT NULL DEFAULT 1,              -- 邀请层级 1-2
  coin_id         BIGINT,
  amount          DECIMAL(20,8) NOT NULL,
  related_id      BIGINT,                                   -- 关联订单ID
  remark          VARCHAR(255),
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reward_user ON agx_invite_reward(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_from ON agx_invite_reward(from_user_id);
CREATE INDEX IF NOT EXISTS idx_reward_type ON agx_invite_reward(reward_type);
COMMENT ON TABLE agx_invite_reward IS '邀请奖励记录表';
COMMENT ON COLUMN agx_invite_reward.reward_type IS 'register=注册奖励, trade=交易返佣, level_up=升级奖励';

-- ============================================================
-- 8. 排行榜缓存表
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_rank (
  id              BIGSERIAL PRIMARY KEY,
  rank_type       VARCHAR(32) NOT NULL,                     -- profit=收益榜, invite=邀请榜, assets=资产榜, trade=交易榜
  time_range      VARCHAR(20) NOT NULL,                     -- day=日榜, week=周榜, month=月榜, all=总榜
  user_id         BIGINT NOT NULL,
  rank_no         INT NOT NULL,
  score           DECIMAL(30,8) NOT NULL DEFAULT 0,         -- 排名分数
  extra_data      JSONB,                                    -- 附加数据
  snapshot_at     TIMESTAMP NOT NULL,                       -- 快照时间
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rank_type ON agx_rank(rank_type, time_range);
CREATE INDEX IF NOT EXISTS idx_rank_user ON agx_rank(user_id);
CREATE INDEX IF NOT EXISTS idx_rank_snapshot ON agx_rank(snapshot_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rank_unique ON agx_rank(rank_type, time_range, user_id, snapshot_at);
COMMENT ON TABLE agx_rank IS '排行榜缓存表';
COMMENT ON COLUMN agx_rank.rank_type IS 'profit=收益榜, invite=邀请榜, assets=资产榜, trade=交易榜';
COMMENT ON COLUMN agx_rank.time_range IS 'day=日榜, week=周榜, month=月榜, all=总榜';

-- ============================================================
-- 9. 扩展 agx_user 表字段
-- ============================================================
DO $$
BEGIN
  -- 用户等级
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='level') THEN
    ALTER TABLE agx_user ADD COLUMN level INT NOT NULL DEFAULT 1;
    COMMENT ON COLUMN agx_user.level IS '用户等级: 1=普通, 2=银牌, 3=金牌, 4=钻石, 5=黑金';
  END IF;

  -- 是否认证（大V标识）
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='is_verified') THEN
    ALTER TABLE agx_user ADD COLUMN is_verified SMALLINT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_user.is_verified IS '是否认证用户: 0否 1是（大V标识）';
  END IF;

  -- 累计邀请人数
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='invite_count') THEN
    ALTER TABLE agx_user ADD COLUMN invite_count INT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_user.invite_count IS '直接邀请人数';
  END IF;

  -- 团队总人数
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='team_count') THEN
    ALTER TABLE agx_user ADD COLUMN team_count INT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_user.team_count IS '团队总人数（含间接邀请）';
  END IF;

  -- 累计返佣
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='total_commission') THEN
    ALTER TABLE agx_user ADD COLUMN total_commission DECIMAL(20,8) NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_user.total_commission IS '累计获得的返佣金额';
  END IF;

  -- 累计交易额
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='total_trade') THEN
    ALTER TABLE agx_user ADD COLUMN total_trade DECIMAL(20,8) NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_user.total_trade IS '累计交易额';
  END IF;

  -- 粉丝数
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='follower_count') THEN
    ALTER TABLE agx_user ADD COLUMN follower_count INT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_user.follower_count IS '粉丝数';
  END IF;

  -- 关注数
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='following_count') THEN
    ALTER TABLE agx_user ADD COLUMN following_count INT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_user.following_count IS '关注数';
  END IF;

  -- 帖子数
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='post_count') THEN
    ALTER TABLE agx_user ADD COLUMN post_count INT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_user.post_count IS '发帖数';
  END IF;

  -- 个人简介
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_user' AND column_name='bio') THEN
    ALTER TABLE agx_user ADD COLUMN bio VARCHAR(500);
    COMMENT ON COLUMN agx_user.bio IS '个人简介';
  END IF;
END $$;

-- ============================================================
-- 10. 扩展 agx_post 表字段
-- ============================================================
DO $$
BEGIN
  -- 话题ID
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_post' AND column_name='topic_id') THEN
    ALTER TABLE agx_post ADD COLUMN topic_id BIGINT;
    COMMENT ON COLUMN agx_post.topic_id IS '关联话题ID';
  END IF;

  -- 分享数
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_post' AND column_name='share_count') THEN
    ALTER TABLE agx_post ADD COLUMN share_count INT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_post.share_count IS '分享数';
  END IF;

  -- 浏览数
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_post' AND column_name='view_count') THEN
    ALTER TABLE agx_post ADD COLUMN view_count INT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_post.view_count IS '浏览数';
  END IF;

  -- 是否官方
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_post' AND column_name='is_official') THEN
    ALTER TABLE agx_post ADD COLUMN is_official SMALLINT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_post.is_official IS '是否官方帖子: 0否 1是';
  END IF;

  -- 是否精华
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_post' AND column_name='is_featured') THEN
    ALTER TABLE agx_post ADD COLUMN is_featured SMALLINT NOT NULL DEFAULT 0;
    COMMENT ON COLUMN agx_post.is_featured IS '是否精华帖: 0否 1是';
  END IF;

  -- 帖子类型
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agx_post' AND column_name='post_type') THEN
    ALTER TABLE agx_post ADD COLUMN post_type VARCHAR(20) NOT NULL DEFAULT 'normal';
    COMMENT ON COLUMN agx_post.post_type IS '帖子类型: normal=普通, analysis=分析, news=快讯';
  END IF;
END $$;

-- 添加话题索引
CREATE INDEX IF NOT EXISTS idx_post_topic ON agx_post(topic_id);

-- ============================================================
-- 初始化数据
-- ============================================================

-- 用户等级配置
INSERT INTO agx_user_level (level, name, name_en, min_invite, commission_rate_1, commission_rate_2, fee_discount) VALUES
(1, '普通会员', 'Normal', 0, 0.15, 0.05, 1.00),
(2, '银牌会员', 'Silver', 5, 0.18, 0.08, 0.95),
(3, '金牌会员', 'Gold', 20, 0.20, 0.10, 0.90),
(4, '钻石会员', 'Diamond', 50, 0.22, 0.12, 0.85),
(5, '黑金会员', 'Platinum', 100, 0.25, 0.15, 0.80)
ON CONFLICT (level) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  min_invite = EXCLUDED.min_invite,
  commission_rate_1 = EXCLUDED.commission_rate_1,
  commission_rate_2 = EXCLUDED.commission_rate_2,
  fee_discount = EXCLUDED.fee_discount;

-- 热门话题
INSERT INTO agx_topic (name, description, is_hot, is_official) VALUES
('黄金行情', '黄金市场行情分析与讨论', 1, 1),
('AGX讨论', 'AGX代币相关话题', 1, 1),
('新手入门', '新手学习与交流', 0, 1),
('技术分析', 'K线与技术指标分析', 1, 0),
('市场快讯', '最新市场资讯', 1, 1),
('理财心得', '投资理财经验分享', 0, 0)
ON CONFLICT (name) DO NOTHING;

-- 多资产配置 - 加密货币
INSERT INTO agx_asset (symbol, name, name_en, asset_type, category, is_tradable, is_hot, sort_order) VALUES
('BTC/USDT', '比特币', 'Bitcoin', 'crypto', 'main', 1, 1, 1),
('ETH/USDT', '以太坊', 'Ethereum', 'crypto', 'main', 1, 1, 2),
('AGX/USDT', 'AGX Token', 'AGX Token', 'crypto', 'main', 1, 1, 3),
('BNB/USDT', '币安币', 'BNB', 'crypto', 'main', 1, 0, 4),
('SOL/USDT', 'Solana', 'Solana', 'crypto', 'main', 1, 1, 5),
('XRP/USDT', '瑞波币', 'Ripple', 'crypto', 'main', 1, 0, 6),
('DOGE/USDT', '狗狗币', 'Dogecoin', 'crypto', 'meme', 1, 1, 7),
('ADA/USDT', '艾达币', 'Cardano', 'crypto', 'main', 1, 0, 8)
ON CONFLICT (symbol) DO NOTHING;

-- 多资产配置 - 贵金属
INSERT INTO agx_asset (symbol, name, name_en, asset_type, category, is_tradable, is_hot, sort_order) VALUES
('XAU/USD', '黄金', 'Gold', 'metal', 'precious', 1, 1, 1),
('XAG/USD', '白银', 'Silver', 'metal', 'precious', 1, 0, 2),
('XPT/USD', '铂金', 'Platinum', 'metal', 'precious', 0, 0, 3),
('XPD/USD', '钯金', 'Palladium', 'metal', 'precious', 0, 0, 4)
ON CONFLICT (symbol) DO NOTHING;

-- 多资产配置 - 外汇
INSERT INTO agx_asset (symbol, name, name_en, asset_type, category, is_tradable, is_hot, sort_order) VALUES
('EUR/USD', '欧元/美元', 'EUR/USD', 'forex', 'major', 0, 1, 1),
('GBP/USD', '英镑/美元', 'GBP/USD', 'forex', 'major', 0, 0, 2),
('USD/JPY', '美元/日元', 'USD/JPY', 'forex', 'major', 0, 0, 3),
('USD/CNH', '美元/离岸人民币', 'USD/CNH', 'forex', 'major', 0, 1, 4)
ON CONFLICT (symbol) DO NOTHING;

-- 多资产配置 - 股指
INSERT INTO agx_asset (symbol, name, name_en, asset_type, category, is_tradable, is_hot, sort_order) VALUES
('US500', '标普500', 'S&P 500', 'index', 'us', 0, 1, 1),
('NAS100', '纳斯达克100', 'Nasdaq 100', 'index', 'us', 0, 1, 2),
('HK50', '恒生指数', 'Hang Seng', 'index', 'asia', 0, 0, 3),
('CN50', '富时中国A50', 'FTSE China A50', 'index', 'asia', 0, 0, 4)
ON CONFLICT (symbol) DO NOTHING;

-- 贵金属价格初始数据
INSERT INTO agx_gold_price (metal_type, name, name_en, price_usd, price_cny, unit) VALUES
('XAU', '国际金价', 'Gold', 2650.00, 19200.00, 'oz'),
('XAG', '国际银价', 'Silver', 31.50, 228.00, 'oz'),
('XPT', '国际铂金价', 'Platinum', 980.00, 7100.00, 'oz'),
('XPD', '国际钯金价', 'Palladium', 1050.00, 7600.00, 'oz')
ON CONFLICT (metal_type) DO UPDATE SET
  price_usd = EXCLUDED.price_usd,
  price_cny = EXCLUDED.price_cny,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- 完成
-- ============================================================
SELECT 'Migration 001_extend_modules completed successfully!' as result;
