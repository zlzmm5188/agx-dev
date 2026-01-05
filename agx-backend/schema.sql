-- ============================================================
-- AGX 数据库表结构 (PostgreSQL 16)
-- 执行: PGPASSWORD=AGX2025Pass psql -h 127.0.0.1 -U agx -d agx -f schema.sql
-- ============================================================

-- 用户表
CREATE TABLE IF NOT EXISTS agx_user (
  id              BIGSERIAL PRIMARY KEY,
  uid             VARCHAR(32) NOT NULL UNIQUE,
  username        VARCHAR(50) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  nickname        VARCHAR(50),
  avatar          VARCHAR(255),
  invite_code     VARCHAR(16) NOT NULL UNIQUE,
  inviter_id      BIGINT,
  kyc_status      SMALLINT NOT NULL DEFAULT 0,
  status          SMALLINT NOT NULL DEFAULT 1,
  last_login_at   TIMESTAMP,
  last_login_ip   VARCHAR(45),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_user_inviter ON agx_user(inviter_id);

-- 用户邀请关系表
CREATE TABLE IF NOT EXISTS agx_user_invite (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  inviter_id      BIGINT NOT NULL,
  level           SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_invite_user ON agx_user_invite(user_id);
CREATE INDEX IF NOT EXISTS idx_invite_inviter ON agx_user_invite(inviter_id);

-- 币种配置表
CREATE TABLE IF NOT EXISTS agx_coin (
  id              BIGSERIAL PRIMARY KEY,
  symbol          VARCHAR(20) NOT NULL UNIQUE,
  name            VARCHAR(50) NOT NULL,
  icon            VARCHAR(255),
  decimals        SMALLINT NOT NULL DEFAULT 8,
  is_deposit      SMALLINT NOT NULL DEFAULT 1,
  is_withdraw     SMALLINT NOT NULL DEFAULT 1,
  min_withdraw    DECIMAL(20,8) NOT NULL DEFAULT 0,
  withdraw_fee    DECIMAL(20,8) NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 用户钱包表
CREATE TABLE IF NOT EXISTS agx_wallet (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  coin_id         BIGINT NOT NULL,
  balance         DECIMAL(20,8) NOT NULL DEFAULT 0,
  frozen          DECIMAL(20,8) NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, coin_id)
);
CREATE INDEX IF NOT EXISTS idx_wallet_user ON agx_wallet(user_id);

-- 钱包流水表
CREATE TABLE IF NOT EXISTS agx_wallet_log (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  coin_id         BIGINT NOT NULL,
  type            VARCHAR(32) NOT NULL,
  amount          DECIMAL(20,8) NOT NULL,
  balance_before  DECIMAL(20,8) NOT NULL,
  balance_after   DECIMAL(20,8) NOT NULL,
  related_id      BIGINT,
  remark          VARCHAR(255),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_log_user ON agx_wallet_log(user_id);
CREATE INDEX IF NOT EXISTS idx_log_type ON agx_wallet_log(type);

-- 充值记录表
CREATE TABLE IF NOT EXISTS agx_deposit (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  coin_id         BIGINT NOT NULL,
  address         VARCHAR(255),
  txid            VARCHAR(255),
  amount          DECIMAL(20,8) NOT NULL,
  status          SMALLINT NOT NULL DEFAULT 0,
  confirmed_at    TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_deposit_user ON agx_deposit(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_status ON agx_deposit(status);

-- 提现记录表
CREATE TABLE IF NOT EXISTS agx_withdraw (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  coin_id         BIGINT NOT NULL,
  address         VARCHAR(255) NOT NULL,
  amount          DECIMAL(20,8) NOT NULL,
  fee             DECIMAL(20,8) NOT NULL DEFAULT 0,
  actual_amount   DECIMAL(20,8) NOT NULL,
  txid            VARCHAR(255),
  status          SMALLINT NOT NULL DEFAULT 0,
  reject_reason   VARCHAR(255),
  auditor_id      BIGINT,
  audited_at      TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_withdraw_user ON agx_withdraw(user_id);
CREATE INDEX IF NOT EXISTS idx_withdraw_status ON agx_withdraw(status);

-- 矿池产品表
CREATE TABLE IF NOT EXISTS agx_pool_product (
  id              BIGSERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  coin_id         BIGINT NOT NULL,
  type            VARCHAR(20) NOT NULL,
  lock_days       INT NOT NULL DEFAULT 0,
  daily_rate      DECIMAL(10,6) NOT NULL,
  min_amount      DECIMAL(20,8) NOT NULL,
  max_amount      DECIMAL(20,8),
  total_quota     DECIMAL(20,8),
  sold_amount     DECIMAL(20,8) NOT NULL DEFAULT 0,
  is_hot          SMALLINT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pool_status ON agx_pool_product(status);

-- 矿池持仓表
CREATE TABLE IF NOT EXISTS agx_pool_holding (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  product_id      BIGINT NOT NULL,
  amount          DECIMAL(20,8) NOT NULL,
  total_income    DECIMAL(20,8) NOT NULL DEFAULT 0,
  start_at        TIMESTAMP NOT NULL,
  end_at          TIMESTAMP,
  status          SMALLINT NOT NULL DEFAULT 1,
  redeemed_at     TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_holding_user ON agx_pool_holding(user_id);
CREATE INDEX IF NOT EXISTS idx_holding_status ON agx_pool_holding(status);

-- 矿池收益记录表
CREATE TABLE IF NOT EXISTS agx_pool_income (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  holding_id      BIGINT NOT NULL,
  product_id      BIGINT NOT NULL,
  amount          DECIMAL(20,8) NOT NULL,
  income_date     DATE NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_income_user ON agx_pool_income(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON agx_pool_income(income_date);

-- 秒合约配置表
CREATE TABLE IF NOT EXISTS agx_contract_config (
  id              BIGSERIAL PRIMARY KEY,
  symbol          VARCHAR(20) NOT NULL,
  name            VARCHAR(50) NOT NULL,
  duration        INT NOT NULL,
  profit_rate     DECIMAL(10,4) NOT NULL,
  min_amount      DECIMAL(20,8) NOT NULL,
  max_amount      DECIMAL(20,8) NOT NULL,
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 秒合约订单表
CREATE TABLE IF NOT EXISTS agx_contract_order (
  id              BIGSERIAL PRIMARY KEY,
  order_no        VARCHAR(32) NOT NULL UNIQUE,
  user_id         BIGINT NOT NULL,
  config_id       BIGINT NOT NULL,
  symbol          VARCHAR(20) NOT NULL,
  duration        INT NOT NULL,
  direction       SMALLINT NOT NULL,
  amount          DECIMAL(20,8) NOT NULL,
  open_price      DECIMAL(20,8) NOT NULL,
  close_price     DECIMAL(20,8),
  profit_rate     DECIMAL(10,4) NOT NULL,
  profit_loss     DECIMAL(20,8),
  result          SMALLINT,
  status          SMALLINT NOT NULL DEFAULT 0,
  open_at         TIMESTAMP NOT NULL,
  close_at        TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_order_user ON agx_contract_order(user_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON agx_contract_order(status);

-- OTC 广告表
CREATE TABLE IF NOT EXISTS agx_otc_ad (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  coin_id         BIGINT NOT NULL,
  type            SMALLINT NOT NULL,
  price           DECIMAL(20,8) NOT NULL,
  total_amount    DECIMAL(20,8) NOT NULL,
  remain_amount   DECIMAL(20,8) NOT NULL,
  min_limit       DECIMAL(20,8) NOT NULL,
  max_limit       DECIMAL(20,8) NOT NULL,
  payment_methods VARCHAR(100) NOT NULL,
  remark          VARCHAR(500),
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ad_user ON agx_otc_ad(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_status ON agx_otc_ad(status);

-- OTC 订单表
CREATE TABLE IF NOT EXISTS agx_otc_order (
  id              BIGSERIAL PRIMARY KEY,
  order_no        VARCHAR(32) NOT NULL UNIQUE,
  ad_id           BIGINT NOT NULL,
  buyer_id        BIGINT NOT NULL,
  seller_id       BIGINT NOT NULL,
  coin_id         BIGINT NOT NULL,
  price           DECIMAL(20,8) NOT NULL,
  amount          DECIMAL(20,8) NOT NULL,
  total_price     DECIMAL(20,8) NOT NULL,
  payment_method  VARCHAR(32) NOT NULL,
  status          SMALLINT NOT NULL DEFAULT 0,
  pay_at          TIMESTAMP,
  release_at      TIMESTAMP,
  cancel_at       TIMESTAMP,
  cancel_reason   VARCHAR(255),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_otc_order_buyer ON agx_otc_order(buyer_id);
CREATE INDEX IF NOT EXISTS idx_otc_order_seller ON agx_otc_order(seller_id);

-- 帖子表
CREATE TABLE IF NOT EXISTS agx_post (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  content         TEXT NOT NULL,
  images          VARCHAR(2000),
  like_count      INT NOT NULL DEFAULT 0,
  comment_count   INT NOT NULL DEFAULT 0,
  is_top          SMALLINT NOT NULL DEFAULT 0,
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_post_user ON agx_post(user_id);
CREATE INDEX IF NOT EXISTS idx_post_status ON agx_post(status);

-- 评论表
CREATE TABLE IF NOT EXISTS agx_comment (
  id              BIGSERIAL PRIMARY KEY,
  post_id         BIGINT NOT NULL,
  user_id         BIGINT NOT NULL,
  parent_id       BIGINT,
  content         VARCHAR(1000) NOT NULL,
  like_count      INT NOT NULL DEFAULT 0,
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_comment_post ON agx_comment(post_id);
CREATE INDEX IF NOT EXISTS idx_comment_user ON agx_comment(user_id);

-- 点赞表
CREATE TABLE IF NOT EXISTS agx_like (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  target_type     VARCHAR(20) NOT NULL,
  target_id       BIGINT NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, target_type, target_id)
);

-- 返佣记录表
CREATE TABLE IF NOT EXISTS agx_commission (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  from_user_id    BIGINT NOT NULL,
  coin_id         BIGINT NOT NULL,
  level           SMALLINT NOT NULL,
  source_type     VARCHAR(32) NOT NULL,
  source_id       BIGINT NOT NULL,
  amount          DECIMAL(20,8) NOT NULL,
  rate            DECIMAL(10,4) NOT NULL,
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_comm_user ON agx_commission(user_id);
CREATE INDEX IF NOT EXISTS idx_comm_from ON agx_commission(from_user_id);

-- 系统配置表
CREATE TABLE IF NOT EXISTS agx_config (
  id              BIGSERIAL PRIMARY KEY,
  config_key      VARCHAR(100) NOT NULL UNIQUE,
  config_value    TEXT NOT NULL,
  description     VARCHAR(255),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 公告表
CREATE TABLE IF NOT EXISTS agx_notice (
  id              BIGSERIAL PRIMARY KEY,
  title           VARCHAR(200) NOT NULL,
  content         TEXT NOT NULL,
  type            SMALLINT NOT NULL DEFAULT 0,
  is_popup        SMALLINT NOT NULL DEFAULT 0,
  start_at        TIMESTAMP,
  end_at          TIMESTAMP,
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 管理员表
CREATE TABLE IF NOT EXISTS agx_admin (
  id              BIGSERIAL PRIMARY KEY,
  username        VARCHAR(50) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  nickname        VARCHAR(50),
  role            VARCHAR(32) NOT NULL DEFAULT 'admin',
  permissions     TEXT,
  status          SMALLINT NOT NULL DEFAULT 1,
  last_login_at   TIMESTAMP,
  last_login_ip   VARCHAR(45),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 后台操作日志表
CREATE TABLE IF NOT EXISTS agx_admin_log (
  id              BIGSERIAL PRIMARY KEY,
  admin_id        BIGINT NOT NULL,
  action          VARCHAR(100) NOT NULL,
  target_type     VARCHAR(50),
  target_id       BIGINT,
  content         TEXT,
  ip              VARCHAR(45),
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admin_log_admin ON agx_admin_log(admin_id);

-- 用户登录记录表
CREATE TABLE IF NOT EXISTS agx_login_log (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  username        VARCHAR(50),
  login_ip        VARCHAR(45),
  device          VARCHAR(255),
  location        VARCHAR(100),
  status          SMALLINT NOT NULL DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_login_user ON agx_login_log(user_id);
CREATE INDEX IF NOT EXISTS idx_login_created ON agx_login_log(created_at);

-- ============================================================
-- 初始化数据
-- ============================================================

-- 系统配置
INSERT INTO agx_config (config_key, config_value, description) VALUES
('commission_level1_rate', '0.20', '一级返佣比例'),
('commission_level2_rate', '0.10', '二级返佣比例'),
('ieo_start_time', '2025-01-15 00:00:00', 'IEO开始时间'),
('ieo_end_time', '2025-02-15 00:00:00', 'IEO结束时间'),
('withdraw_min', '100', '最小提现金额'),
('withdraw_fee', '10', '提现手续费')
ON CONFLICT (config_key) DO NOTHING;

-- 币种配置
INSERT INTO agx_coin (symbol, name, decimals, is_deposit, is_withdraw, min_withdraw, withdraw_fee) VALUES
('AGX', 'AGX Token', 8, 1, 1, 100, 10),
('USDT', 'Tether USD', 6, 1, 1, 10, 5)
ON CONFLICT (symbol) DO NOTHING;

-- 矿池产品
INSERT INTO agx_pool_product (name, coin_id, type, lock_days, daily_rate, min_amount, is_hot) VALUES
('活期矿池', 1, 'flexible', 0, 0.001, 100, 0),
('7日矿池', 1, 'fixed', 7, 0.002, 500, 0),
('30日矿池', 1, 'fixed', 30, 0.003, 1000, 1),
('90日矿池', 1, 'fixed', 90, 0.005, 5000, 0);

-- 秒合约配置
INSERT INTO agx_contract_config (symbol, name, duration, profit_rate, min_amount, max_amount) VALUES
('XAU/USD', '黄金30秒', 30, 0.85, 10, 10000),
('XAU/USD', '黄金60秒', 60, 0.85, 10, 10000),
('XAU/USD', '黄金2分钟', 120, 0.85, 10, 10000),
('XAU/USD', '黄金5分钟', 300, 0.85, 10, 10000);

-- 默认管理员
INSERT INTO agx_admin (username, password_hash, nickname, role) VALUES
('admin', '$2b$10$abcdefghijklmnopqrstuv', '超级管理员', 'superadmin')
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- 黄金玩法产品配置表
-- ============================================================
CREATE TABLE IF NOT EXISTS agx_gold_product (
  id              BIGSERIAL PRIMARY KEY,
  code            VARCHAR(32) NOT NULL,
  name            VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100),
  product_type    VARCHAR(20) NOT NULL,
  icon            VARCHAR(500),
  description     TEXT,
  -- 现货黄金配置
  min_amount      DECIMAL(20,8) DEFAULT 0.01,
  max_amount      DECIMAL(20,8) DEFAULT 10000,
  fee_rate        DECIMAL(10,4) DEFAULT 0.001,
  -- 秒合约配置
  contract_periods VARCHAR(255),
  contract_profit_rate DECIMAL(10,4) DEFAULT 0.85,
  contract_amounts VARCHAR(255),
  -- 理财配置
  finance_period_days INT DEFAULT 0,
  finance_apy     DECIMAL(10,4) DEFAULT 0,
  finance_min_amount DECIMAL(20,8) DEFAULT 100,
  finance_total_amount DECIMAL(20,8) DEFAULT 0,
  finance_sold_amount DECIMAL(20,8) DEFAULT 0,
  -- AGX首发配置
  agx_price       DECIMAL(20,8) DEFAULT 0.10,
  agx_total_supply DECIMAL(20,8) DEFAULT 100000000,
  agx_sold        DECIMAL(20,8) DEFAULT 0,
  agx_gold_backing INT DEFAULT 100,
  agx_start_time  TIMESTAMP,
  agx_end_time    TIMESTAMP,
  -- 通用配置
  rules           TEXT,
  risk_warning    TEXT,
  is_hot          SMALLINT DEFAULT 0,
  is_recommend    SMALLINT DEFAULT 0,
  tag             VARCHAR(50),
  sort_order      INT DEFAULT 0,
  status          SMALLINT DEFAULT 1,
  extra           TEXT,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_gp_code ON agx_gold_product(code);
CREATE INDEX IF NOT EXISTS idx_gp_type ON agx_gold_product(product_type);

-- 黄金玩法默认产品
INSERT INTO agx_gold_product (code, name, name_en, product_type, description, is_hot, is_recommend, tag, sort_order) VALUES
('GOLD_SPOT', '现货黄金', 'Spot Gold', 'spot', '实时跟踪国际金价，随时买卖', 1, 1, '热门', 1),
('GOLD_30S', '黄金30秒合约', 'Gold 30s', 'contract', '30秒快速交易，盈利率高达85%', 1, 1, '新上线', 1),
('GOLD_60S', '黄金60秒合约', 'Gold 60s', 'contract', '60秒交易，稳健之选', 0, 1, NULL, 2),
('GOLD_300S', '黄金5分钟合约', 'Gold 5min', 'contract', '5分钟交易，专业之选', 0, 0, NULL, 3),
('GOLD_FLEX', '黄金活期宝', 'Gold Flex', 'finance', '灵活存取，每日计息', 1, 1, '推荐', 1),
('GOLD_7D', '黄金7天宝', 'Gold 7D', 'finance', '7天定期，较高收益', 0, 1, NULL, 2),
('GOLD_30D', '黄金30天宝', 'Gold 30D', 'finance', '30天定期，高收益', 0, 0, NULL, 3),
('AGX_LAUNCH', 'AGX升达金指币', 'AGX Token', 'agx', '100%黄金储备支撑，首发价$0.10', 1, 1, '限时', 1)
ON CONFLICT DO NOTHING;
