-- AGX 交易系统数据库迁移 (现货交易 + 新币发行)

-- 交易对配置表
CREATE TABLE IF NOT EXISTS agx_trading_pair (
  id              BIGSERIAL PRIMARY KEY,
  symbol          VARCHAR(20) NOT NULL UNIQUE,
  base_coin       VARCHAR(20) NOT NULL,
  quote_coin      VARCHAR(20) NOT NULL,
  min_qty         DECIMAL(20,8) NOT NULL DEFAULT 0.00000001,
  max_qty         DECIMAL(20,8),
  price_precision INT NOT NULL DEFAULT 8,
  qty_precision   INT NOT NULL DEFAULT 8,
  trade_fee       DECIMAL(10,6) NOT NULL DEFAULT 0.002,
  status          SMALLINT NOT NULL DEFAULT 1,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 现货订单表
CREATE TABLE IF NOT EXISTS agx_spot_order (
  id              BIGSERIAL PRIMARY KEY,
  order_no        VARCHAR(32) NOT NULL UNIQUE,
  user_id         BIGINT NOT NULL,
  pair_id         BIGINT NOT NULL,
  symbol          VARCHAR(20) NOT NULL,
  side            VARCHAR(10) NOT NULL,
  type            VARCHAR(10) NOT NULL,
  price           DECIMAL(20,8),
  quantity        DECIMAL(20,8) NOT NULL,
  executed_qty    DECIMAL(20,8) NOT NULL DEFAULT 0,
  avg_price       DECIMAL(20,8),
  fee             DECIMAL(20,8) NOT NULL DEFAULT 0,
  fee_coin        VARCHAR(10),
  status          SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 新币发行配置表
CREATE TABLE IF NOT EXISTS agx_coin_issue (
  id              BIGSERIAL PRIMARY KEY,
  coin_symbol     VARCHAR(20) NOT NULL UNIQUE,
  coin_name       VARCHAR(50) NOT NULL,
  total_supply    DECIMAL(20,8) NOT NULL,
  issue_price     DECIMAL(20,8) NOT NULL,
  issue_amount    DECIMAL(20,8) NOT NULL,
  min_buy_amount  DECIMAL(20,8) NOT NULL,
  max_buy_amount  DECIMAL(20,8) NOT NULL,
  start_time      TIMESTAMP NOT NULL,
  end_time        TIMESTAMP NOT NULL,
  lottery_time    TIMESTAMP NOT NULL,
  unlock_time     TIMESTAMP NOT NULL,
  total_subscribed DECIMAL(20,8) NOT NULL DEFAULT 0,
  subscriber_count INT NOT NULL DEFAULT 0,
  win_rate        DECIMAL(10,4),
  status          SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 新币申购记录表
CREATE TABLE IF NOT EXISTS agx_coin_subscription (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  issue_id        BIGINT NOT NULL,
  buy_amount      DECIMAL(20,8) NOT NULL,
  pay_amount      DECIMAL(20,8) NOT NULL,
  win_amount      DECIMAL(20,8) NOT NULL DEFAULT 0,
  refund_amount   DECIMAL(20,8) NOT NULL DEFAULT 0,
  status          SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 初始化示例交易对
INSERT INTO agx_trading_pair (symbol, base_coin, quote_coin, min_qty, price_precision, qty_precision, trade_fee, status, sort_order)
VALUES 
  ('BTC/USDT', 'BTC', 'USDT', 0.0001, 2, 4, 0.002, 1, 1),
  ('ETH/USDT', 'ETH', 'USDT', 0.001, 2, 3, 0.002, 1, 2)
ON CONFLICT (symbol) DO NOTHING;
