# AGX 数据库设计规范

> **后端智能体必读！** 所有表结构设计必须按此规范执行。

---

## 零、数据库连接信息

```bash
# 连接命令
PGPASSWORD='AGX2025Pass' psql -h 127.0.0.1 -U agx -d agx

# 连接参数
DB_TYPE=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=agx
DB_USERNAME=agx
DB_PASSWORD=AGX2025Pass
```

> **注意**：使用 PostgreSQL 16，通过终端执行 `psql` 命令操作数据库

---

## 一、基础规范

### 1.1 命名规则

| 类型 | 规则 | 示例 |
|------|------|------|
| 表名 | 小写下划线，前缀 `agx_` | `agx_user`, `agx_order` |
| 字段 | 小写下划线 | `user_id`, `created_at` |
| 主键 | `id` (BIGINT AUTO_INCREMENT) | - |
| 外键 | `{表名}_id` | `user_id`, `coin_id` |
| 时间 | `created_at`, `updated_at`, `deleted_at` | - |
| 状态 | `status` (TINYINT) | - |
| 金额 | `DECIMAL(20,8)` | 支持8位小数 |

### 1.2 公共字段

每张表必须包含：

```sql
id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at  DATETIME NULL DEFAULT NULL,
PRIMARY KEY (id)
```

### 1.3 索引规范

- 主键：必须有
- 外键：必须建索引
- 查询条件：按需建索引
- 唯一约束：用 `UNIQUE INDEX`

---

## 二、核心表设计

### 2.1 用户模块

```sql
-- 用户表
CREATE TABLE agx_user (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uid             VARCHAR(32) NOT NULL COMMENT '用户UID，对外展示',
  username        VARCHAR(50) NOT NULL COMMENT '用户名，登录用',
  password_hash   VARCHAR(255) NOT NULL COMMENT '密码哈希',
  nickname        VARCHAR(50) NULL COMMENT '昵称',
  avatar          VARCHAR(255) NULL COMMENT '头像URL',
  invite_code     VARCHAR(16) NOT NULL COMMENT '我的邀请码',
  inviter_id      BIGINT UNSIGNED NULL COMMENT '邀请人ID',
  kyc_status      TINYINT NOT NULL DEFAULT 0 COMMENT 'KYC状态：0未认证 1认证中 2已认证 3失败',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '账户状态：0禁用 1正常',
  last_login_at   DATETIME NULL COMMENT '最后登录时间',
  last_login_ip   VARCHAR(45) NULL COMMENT '最后登录IP',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_uid (uid),
  UNIQUE INDEX idx_username (username),
  UNIQUE INDEX idx_invite_code (invite_code),
  INDEX idx_inviter_id (inviter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 用户邀请关系表（方便查询多级）
CREATE TABLE agx_user_invite (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  inviter_id      BIGINT UNSIGNED NOT NULL COMMENT '直接邀请人ID',
  level           TINYINT NOT NULL DEFAULT 1 COMMENT '邀请层级：1直接 2间接',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_inviter_id (inviter_id),
  INDEX idx_inviter_level (inviter_id, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户邀请关系表';
```

### 2.2 钱包与资产

```sql
-- 币种配置表
CREATE TABLE agx_coin (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  symbol          VARCHAR(20) NOT NULL COMMENT '币种符号，如 AGX',
  name            VARCHAR(50) NOT NULL COMMENT '币种名称',
  icon            VARCHAR(255) NULL COMMENT '图标URL',
  decimals        TINYINT NOT NULL DEFAULT 8 COMMENT '小数位数',
  is_deposit      TINYINT NOT NULL DEFAULT 1 COMMENT '是否可充值',
  is_withdraw     TINYINT NOT NULL DEFAULT 1 COMMENT '是否可提现',
  min_withdraw    DECIMAL(20,8) NOT NULL DEFAULT 0 COMMENT '最小提现',
  withdraw_fee    DECIMAL(20,8) NOT NULL DEFAULT 0 COMMENT '提现手续费',
  sort_order      INT NOT NULL DEFAULT 0 COMMENT '排序',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='币种配置表';

-- 用户钱包表
CREATE TABLE agx_wallet (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  coin_id         BIGINT UNSIGNED NOT NULL,
  balance         DECIMAL(20,8) NOT NULL DEFAULT 0 COMMENT '可用余额',
  frozen          DECIMAL(20,8) NOT NULL DEFAULT 0 COMMENT '冻结余额',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_user_coin (user_id, coin_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户钱包表';

-- 钱包流水表
CREATE TABLE agx_wallet_log (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  coin_id         BIGINT UNSIGNED NOT NULL,
  type            VARCHAR(32) NOT NULL COMMENT '类型：deposit/withdraw/pool_in/pool_out/trade/commission',
  amount          DECIMAL(20,8) NOT NULL COMMENT '变动金额（正加负减）',
  balance_before  DECIMAL(20,8) NOT NULL COMMENT '变动前余额',
  balance_after   DECIMAL(20,8) NOT NULL COMMENT '变动后余额',
  related_id      BIGINT UNSIGNED NULL COMMENT '关联业务ID',
  remark          VARCHAR(255) NULL COMMENT '备注',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_user_coin (user_id, coin_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钱包流水表';

-- 充值记录表
CREATE TABLE agx_deposit (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  coin_id         BIGINT UNSIGNED NOT NULL,
  address         VARCHAR(255) NULL COMMENT '充值地址',
  txid            VARCHAR(255) NULL COMMENT '链上交易ID',
  amount          DECIMAL(20,8) NOT NULL COMMENT '充值金额',
  status          TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0待确认 1已到账 2失败',
  confirmed_at    DATETIME NULL COMMENT '确认时间',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_txid (txid),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='充值记录表';

-- 提现记录表
CREATE TABLE agx_withdraw (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  coin_id         BIGINT UNSIGNED NOT NULL,
  address         VARCHAR(255) NOT NULL COMMENT '提现地址',
  amount          DECIMAL(20,8) NOT NULL COMMENT '提现金额',
  fee             DECIMAL(20,8) NOT NULL DEFAULT 0 COMMENT '手续费',
  actual_amount   DECIMAL(20,8) NOT NULL COMMENT '实际到账',
  txid            VARCHAR(255) NULL COMMENT '链上交易ID',
  status          TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0待审核 1审核通过 2已打款 3已完成 4拒绝',
  reject_reason   VARCHAR(255) NULL COMMENT '拒绝原因',
  auditor_id      BIGINT UNSIGNED NULL COMMENT '审核人',
  audited_at      DATETIME NULL COMMENT '审核时间',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现记录表';
```

### 2.3 矿池模块

```sql
-- 矿池产品表
CREATE TABLE agx_pool_product (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(100) NOT NULL COMMENT '产品名称',
  coin_id         BIGINT UNSIGNED NOT NULL COMMENT '投入币种',
  type            VARCHAR(20) NOT NULL COMMENT '类型：flexible(活期) / fixed(定期)',
  lock_days       INT NOT NULL DEFAULT 0 COMMENT '锁定天数，0为活期',
  daily_rate      DECIMAL(10,6) NOT NULL COMMENT '日收益率（如0.003表示0.3%）',
  min_amount      DECIMAL(20,8) NOT NULL COMMENT '最低申购',
  max_amount      DECIMAL(20,8) NULL COMMENT '最高申购（NULL不限）',
  total_quota     DECIMAL(20,8) NULL COMMENT '总额度（NULL不限）',
  sold_amount     DECIMAL(20,8) NOT NULL DEFAULT 0 COMMENT '已售额度',
  is_hot          TINYINT NOT NULL DEFAULT 0 COMMENT '是否热门',
  sort_order      INT NOT NULL DEFAULT 0 COMMENT '排序',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0下架 1上架',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_type (type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='矿池产品表';

-- 矿池持仓表
CREATE TABLE agx_pool_holding (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  product_id      BIGINT UNSIGNED NOT NULL,
  amount          DECIMAL(20,8) NOT NULL COMMENT '持仓数量',
  total_income    DECIMAL(20,8) NOT NULL DEFAULT 0 COMMENT '累计收益',
  start_at        DATETIME NOT NULL COMMENT '开始计息时间',
  end_at          DATETIME NULL COMMENT '到期时间（活期为NULL）',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0已赎回 1持仓中',
  redeemed_at     DATETIME NULL COMMENT '赎回时间',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id),
  INDEX idx_status (status),
  INDEX idx_end_at (end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='矿池持仓表';

-- 矿池收益记录表
CREATE TABLE agx_pool_income (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  holding_id      BIGINT UNSIGNED NOT NULL,
  product_id      BIGINT UNSIGNED NOT NULL,
  amount          DECIMAL(20,8) NOT NULL COMMENT '收益金额',
  income_date     DATE NOT NULL COMMENT '收益日期',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_holding_id (holding_id),
  INDEX idx_income_date (income_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='矿池收益记录表';
```

### 2.4 秒合约交易

```sql
-- 秒合约配置表
CREATE TABLE agx_contract_config (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  symbol          VARCHAR(20) NOT NULL COMMENT '交易对，如 XAU/USD',
  name            VARCHAR(50) NOT NULL COMMENT '名称',
  duration        INT NOT NULL COMMENT '周期秒数：30/60/120/300',
  profit_rate     DECIMAL(10,4) NOT NULL COMMENT '盈利收益率，如0.85表示85%',
  min_amount      DECIMAL(20,8) NOT NULL COMMENT '最小下单',
  max_amount      DECIMAL(20,8) NOT NULL COMMENT '最大下单',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_symbol (symbol),
  INDEX idx_duration (duration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='秒合约配置表';

-- 秒合约订单表
CREATE TABLE agx_contract_order (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_no        VARCHAR(32) NOT NULL COMMENT '订单号',
  user_id         BIGINT UNSIGNED NOT NULL,
  config_id       BIGINT UNSIGNED NOT NULL,
  symbol          VARCHAR(20) NOT NULL COMMENT '交易对',
  duration        INT NOT NULL COMMENT '周期秒数',
  direction       TINYINT NOT NULL COMMENT '方向：1看涨 2看跌',
  amount          DECIMAL(20,8) NOT NULL COMMENT '下单金额',
  open_price      DECIMAL(20,8) NOT NULL COMMENT '开仓价',
  close_price     DECIMAL(20,8) NULL COMMENT '平仓价',
  profit_rate     DECIMAL(10,4) NOT NULL COMMENT '收益率',
  profit_loss     DECIMAL(20,8) NULL COMMENT '盈亏金额',
  result          TINYINT NULL COMMENT '结果：1盈 2亏 3平',
  status          TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0进行中 1已结算',
  open_at         DATETIME NOT NULL COMMENT '开仓时间',
  close_at        DATETIME NULL COMMENT '平仓时间',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_order_no (order_no),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_close_at (close_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='秒合约订单表';
```

### 2.5 OTC 交易

```sql
-- OTC 广告表
CREATE TABLE agx_otc_ad (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL COMMENT '发布人',
  coin_id         BIGINT UNSIGNED NOT NULL COMMENT '交易币种',
  type            TINYINT NOT NULL COMMENT '类型：1买入 2卖出',
  price           DECIMAL(20,8) NOT NULL COMMENT '单价',
  total_amount    DECIMAL(20,8) NOT NULL COMMENT '总数量',
  remain_amount   DECIMAL(20,8) NOT NULL COMMENT '剩余数量',
  min_limit       DECIMAL(20,8) NOT NULL COMMENT '最小限额',
  max_limit       DECIMAL(20,8) NOT NULL COMMENT '最大限额',
  payment_methods VARCHAR(100) NOT NULL COMMENT '支付方式，逗号分隔',
  remark          VARCHAR(500) NULL COMMENT '交易说明',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0下架 1上架',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_coin_type (coin_id, type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='OTC广告表';

-- OTC 订单表
CREATE TABLE agx_otc_order (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_no        VARCHAR(32) NOT NULL COMMENT '订单号',
  ad_id           BIGINT UNSIGNED NOT NULL COMMENT '广告ID',
  buyer_id        BIGINT UNSIGNED NOT NULL COMMENT '买家ID',
  seller_id       BIGINT UNSIGNED NOT NULL COMMENT '卖家ID',
  coin_id         BIGINT UNSIGNED NOT NULL,
  price           DECIMAL(20,8) NOT NULL COMMENT '成交单价',
  amount          DECIMAL(20,8) NOT NULL COMMENT '交易数量',
  total_price     DECIMAL(20,8) NOT NULL COMMENT '总金额',
  payment_method  VARCHAR(32) NOT NULL COMMENT '支付方式',
  status          TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0待付款 1已付款待放币 2已完成 3已取消 4申诉中',
  pay_at          DATETIME NULL COMMENT '付款时间',
  release_at      DATETIME NULL COMMENT '放币时间',
  cancel_at       DATETIME NULL COMMENT '取消时间',
  cancel_reason   VARCHAR(255) NULL COMMENT '取消原因',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_order_no (order_no),
  INDEX idx_ad_id (ad_id),
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_seller_id (seller_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='OTC订单表';
```

### 2.6 广场社区

```sql
-- 帖子表
CREATE TABLE agx_post (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL COMMENT '发帖人',
  content         TEXT NOT NULL COMMENT '内容',
  images          VARCHAR(2000) NULL COMMENT '图片URL，JSON数组',
  like_count      INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  comment_count   INT NOT NULL DEFAULT 0 COMMENT '评论数',
  is_top          TINYINT NOT NULL DEFAULT 0 COMMENT '是否置顶',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0隐藏 1正常',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子表';

-- 评论表
CREATE TABLE agx_comment (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id         BIGINT UNSIGNED NOT NULL COMMENT '帖子ID',
  user_id         BIGINT UNSIGNED NOT NULL COMMENT '评论人',
  parent_id       BIGINT UNSIGNED NULL COMMENT '父评论ID',
  content         VARCHAR(1000) NOT NULL COMMENT '内容',
  like_count      INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at      DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 点赞表
CREATE TABLE agx_like (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL,
  target_type     VARCHAR(20) NOT NULL COMMENT '类型：post/comment',
  target_id       BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_user_target (user_id, target_type, target_id),
  INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';
```

### 2.7 返佣与奖励

```sql
-- 返佣记录表
CREATE TABLE agx_commission (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id         BIGINT UNSIGNED NOT NULL COMMENT '获得返佣的用户',
  from_user_id    BIGINT UNSIGNED NOT NULL COMMENT '贡献者用户ID',
  coin_id         BIGINT UNSIGNED NOT NULL,
  level           TINYINT NOT NULL COMMENT '返佣层级：1一级 2二级',
  source_type     VARCHAR(32) NOT NULL COMMENT '来源类型：pool/contract/otc',
  source_id       BIGINT UNSIGNED NOT NULL COMMENT '来源业务ID',
  amount          DECIMAL(20,8) NOT NULL COMMENT '返佣金额',
  rate            DECIMAL(10,4) NOT NULL COMMENT '返佣比例',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0冻结 1已发放',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_from_user_id (from_user_id),
  INDEX idx_source (source_type, source_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='返佣记录表';
```

### 2.8 系统配置

```sql
-- 系统配置表
CREATE TABLE agx_config (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  config_key      VARCHAR(100) NOT NULL COMMENT '配置键',
  config_value    TEXT NOT NULL COMMENT '配置值',
  description     VARCHAR(255) NULL COMMENT '说明',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 公告表
CREATE TABLE agx_notice (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title           VARCHAR(200) NOT NULL COMMENT '标题',
  content         TEXT NOT NULL COMMENT '内容',
  type            TINYINT NOT NULL DEFAULT 0 COMMENT '类型：0普通 1紧急',
  is_popup        TINYINT NOT NULL DEFAULT 0 COMMENT '是否弹窗',
  start_at        DATETIME NULL COMMENT '开始展示时间',
  end_at          DATETIME NULL COMMENT '结束展示时间',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_status (status),
  INDEX idx_start_end (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';
```

### 2.9 后台管理

```sql
-- 管理员表
CREATE TABLE agx_admin (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username        VARCHAR(50) NOT NULL COMMENT '用户名',
  password_hash   VARCHAR(255) NOT NULL COMMENT '密码哈希',
  nickname        VARCHAR(50) NULL COMMENT '昵称',
  role            VARCHAR(32) NOT NULL DEFAULT 'admin' COMMENT '角色',
  permissions     TEXT NULL COMMENT '权限列表，JSON',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
  last_login_at   DATETIME NULL,
  last_login_ip   VARCHAR(45) NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- 操作日志表
CREATE TABLE agx_admin_log (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_id        BIGINT UNSIGNED NOT NULL,
  action          VARCHAR(100) NOT NULL COMMENT '操作',
  target_type     VARCHAR(50) NULL COMMENT '操作对象类型',
  target_id       BIGINT UNSIGNED NULL COMMENT '操作对象ID',
  content         TEXT NULL COMMENT '操作内容',
  ip              VARCHAR(45) NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='后台操作日志表';
```

---

## 三、索引策略

### 3.1 必须建索引

- 所有外键字段
- 查询条件中的 `status` 字段
- 时间范围查询的 `created_at` 字段
- 唯一业务字段（订单号、用户名等）

### 3.2 复合索引

```sql
-- 用户钱包查询
INDEX idx_user_coin (user_id, coin_id)

-- 邀请关系查询
INDEX idx_inviter_level (inviter_id, level)

-- 时间范围 + 状态查询
INDEX idx_status_created (status, created_at)
```

---

## 四、初始化数据

### 4.1 系统配置

```sql
INSERT INTO agx_config (config_key, config_value, description) VALUES
('commission_level1_rate', '0.20', '一级返佣比例'),
('commission_level2_rate', '0.10', '二级返佣比例'),
('ieo_start_time', '2025-01-15 00:00:00', 'IEO开始时间'),
('ieo_end_time', '2025-02-15 00:00:00', 'IEO结束时间'),
('withdraw_min', '100', '最小提现金额'),
('withdraw_fee', '10', '提现手续费');
```

### 4.2 币种配置

```sql
INSERT INTO agx_coin (symbol, name, decimals, is_deposit, is_withdraw, min_withdraw, withdraw_fee) VALUES
('AGX', 'AGX Token', 8, 1, 1, 100, 10),
('USDT', 'Tether USD', 6, 1, 1, 10, 5);
```

### 4.3 矿池产品

```sql
-- 收益率由后台配置，这里只是示例
INSERT INTO agx_pool_product (name, coin_id, type, lock_days, daily_rate, min_amount, is_hot) VALUES
('活期矿池', 1, 'flexible', 0, 0.001, 100, 0),
('7日矿池', 1, 'fixed', 7, 0.002, 500, 0),
('30日矿池', 1, 'fixed', 30, 0.003, 1000, 1),
('90日矿池', 1, 'fixed', 90, 0.005, 5000, 0);
```

### 4.4 秒合约配置

```sql
INSERT INTO agx_contract_config (symbol, name, duration, profit_rate, min_amount, max_amount) VALUES
('XAU/USD', '黄金30秒', 30, 0.85, 10, 10000),
('XAU/USD', '黄金60秒', 60, 0.85, 10, 10000),
('XAU/USD', '黄金2分钟', 120, 0.85, 10, 10000),
('XAU/USD', '黄金5分钟', 300, 0.85, 10, 10000);
```

---

## 五、ER 关系图

```
agx_user ─────────────────┐
    │                     │
    ├── agx_wallet        │
    │       │             │
    │       └── agx_wallet_log
    │                     │
    ├── agx_pool_holding  │
    │       │             │
    │       └── agx_pool_income
    │                     │
    ├── agx_contract_order│
    │                     │
    ├── agx_otc_ad        │
    │       │             │
    │       └── agx_otc_order
    │                     │
    ├── agx_post          │
    │       │             │
    │       └── agx_comment
    │                     │
    └── agx_commission ◄──┘
```

---

**后端智能体必须按此规范创建数据库！**
