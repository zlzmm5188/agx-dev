# AGX 后台管理模块

> 后台管理系统的功能模块规划，供后端智能体参考。

---

## 一、后台菜单结构

```
后台管理系统
├── 仪表盘
│   ├── 今日数据（注册、充值、交易）
│   ├── 用户统计
│   └── 资金统计
│
├── 用户管理
│   ├── 用户列表
│   ├── 用户详情
│   ├── 邀请关系（树状裂变图）
│   ├── 用户余额
│   └── 登录记录
│
├── 财务管理
│   ├── 充值记录
│   ├── 提现记录（含审核）
│   ├── 充值地址管理
│   └── 资金流水
│
├── 交易管理
│   ├── 秒合约订单
│   ├── OTC 订单
│   └── OTC 广告
│
├── 矿池管理
│   ├── 矿池产品配置
│   ├── 用户持仓
│   └── 收益发放记录
│
├── 内容管理
│   ├── 公告管理
│   ├── 广场帖子
│   └── 帮助中心
│
├── 配置管理
│   ├── 币种管理
│   ├── 系统参数
│   └── 收益率配置
│
├── 管理员
│   ├── 管理员列表
│   ├── 角色权限
│   └── 操作日志（详细）
│
├── IEO 管理
│   ├── 认购配置
│   ├── 认购记录
│   └── 发放记录
│
└── 项目发布
    ├── 矿池产品发布
    ├── 秒合约产品发布
    └── 产品上下架管理
```

---

## 二、核心功能详细

### 2.1 仪表盘

| 数据项 | 说明 |
|--------|------|
| 今日新增用户 | - |
| 今日充值金额 | - |
| 今日提现金额 | - |
| 今日交易量 | 秒合约成交量 |
| 活跃用户数 | 7日内登录 |
| 总用户数 | - |
| 平台总资产 | - |

### 2.2 用户管理

**用户列表字段：**
- UID、用户名、状态
- 注册时间、最后登录
- 总资产、邀请人数
- 操作：查看、禁用

**用户详情页：**
- 基本信息
- 资产列表
- 交易记录
- 充提记录
- 邀请记录
- 登录记录
- 操作日志

### 2.3 登录记录

**记录字段：**
- 用户ID、用户名
- 登录时间
- 登录IP
- 登录设备（UA解析）
- 登录地点（IP归属地）
- 登录状态（成功/失败）

### 2.4 会员裂变图（树状结构）

**功能要求：**
- 树状展示用户邀请关系
- 支持展开/收起子节点
- 点击节点显示用户信息卡片：
  - 用户名、注册时间
  - 累计充值、累计提款
  - 当前余额
  - 下级人数
- 支持搜索用户定位到该节点
- 层级显示（用不同颜色区分）

**节点显示信息：**
```
┌─────────────────────┐
│  👤 user001          │
│  充: ¥10,000          │
│  提: ¥2,000           │
│  余额: ¥8,000        │
│  下级: 5人           │
└─────────────────────┘
```

### 2.3 提现审核

**列表字段：**
- 订单号、用户、币种
- 金额、手续费、到账金额
- 提现地址、链
- 状态、申请时间
- 操作：通过、拒绝

**状态流转：**
```
待审核 → 已通过 → 已完成
      → 已拒绝
```

### 2.4 秒合约订单

**列表字段：**
- 订单号、用户
- 品种（XAU/USD）
- 方向（看涨/看跌）
- 投入金额、周期
- 开仓价、结算价
- 结果（赢/输）
- 盈亏金额
- 开仓时间、结算时间

### 2.5 矿池管理

**产品配置：**
- 矿池名称
- 锁定天数
- 收益率（每日/年化）← **后台可配置**
- 最低申购
- 状态（开启/关闭）

**用户持仓：**
- 用户、矿池产品
- 持仓金额
- 累计收益
- 到期时间
- 状态

### 2.6 系统参数配置

| 参数 | 说明 |
|------|------|
| 秒合约收益率 | 各周期的收益率 |
| OTC 手续费率 | - |
| 提现手续费 | 各链的费用 |
| 自动审核限额 | 多少以下自动通过 |
| IEO 价格 | AGX 认购价格 |
| 邀请返佣比例 | 一级、二级 |

---

## 三、后台接口规划

### 3.1 仪表盘

```
GET /api/admin/dashboard/stats       # 统计数据
GET /api/admin/dashboard/chart       # 图表数据
```

### 3.2 用户管理

```
GET    /api/admin/user/list          # 用户列表
GET    /api/admin/user/:id           # 用户详情
PUT    /api/admin/user/:id/status    # 启用/禁用
GET    /api/admin/user/:id/assets    # 用户资产
GET    /api/admin/user/:id/orders    # 用户订单
GET    /api/admin/user/:id/invites   # 邀请记录
```

### 3.3 财务管理

```
GET    /api/admin/deposit/list       # 充值记录
GET    /api/admin/withdraw/list      # 提现列表
POST   /api/admin/withdraw/:id/approve   # 审核通过
POST   /api/admin/withdraw/:id/reject    # 审核拒绝
GET    /api/admin/finance/flow       # 资金流水
```

### 3.4 交易管理

```
GET    /api/admin/contract/list      # 秒合约订单
GET    /api/admin/otc/order/list     # OTC 订单
GET    /api/admin/otc/ad/list        # OTC 广告
PUT    /api/admin/otc/ad/:id/status  # 广告上下架
```

### 3.5 矿池管理

```
GET    /api/admin/pool/product/list  # 产品列表
POST   /api/admin/pool/product       # 新增产品
PUT    /api/admin/pool/product/:id   # 编辑产品
GET    /api/admin/pool/holding/list  # 用户持仓
GET    /api/admin/pool/earning/list  # 收益记录
```

### 3.6 内容管理

```
GET    /api/admin/notice/list        # 公告列表
POST   /api/admin/notice             # 新增公告
PUT    /api/admin/notice/:id         # 编辑公告
DELETE /api/admin/notice/:id         # 删除公告
GET    /api/admin/post/list          # 帖子列表
DELETE /api/admin/post/:id           # 删除帖子
```

### 3.7 配置管理

```
GET    /api/admin/currency/list      # 币种列表
POST   /api/admin/currency           # 新增币种
PUT    /api/admin/currency/:id       # 编辑币种
GET    /api/admin/config             # 系统配置
PUT    /api/admin/config             # 更新配置
```

### 3.8 管理员

```
GET    /api/admin/admin/list         # 管理员列表
POST   /api/admin/admin              # 新增管理员
PUT    /api/admin/admin/:id          # 编辑管理员
GET    /api/admin/log/list           # 操作日志
```

### 3.9 IEO 管理

```
GET    /api/admin/ieo/config         # IEO 配置
PUT    /api/admin/ieo/config         # 更新配置
GET    /api/admin/ieo/order/list     # 认购记录
```

### 3.10 用户登录记录

```
GET    /api/admin/user/login-log     # 登录记录列表
GET    /api/admin/user/:id/login-log # 指定用户登录记录
```

### 3.11 会员裂变图

```
GET    /api/admin/user/invite-tree   # 整体裂变图
GET    /api/admin/user/:id/tree      # 指定用户下级树
GET    /api/admin/user/:id/summary   # 用户卡片摘要（充/提/余额）
```

### 3.12 资金流向记录

```
GET    /api/admin/finance/flow       # 全平台资金流水
GET    /api/admin/user/:id/flow      # 指定用户资金流水
```

### 3.13 项目发布管理

```
GET    /api/admin/product/pool/list      # 矿池产品列表
POST   /api/admin/product/pool           # 发布矿池产品
PUT    /api/admin/product/pool/:id       # 编辑矿池产品
PUT    /api/admin/product/pool/:id/status # 上下架

GET    /api/admin/product/contract/list  # 秒合约产品列表
POST   /api/admin/product/contract       # 发布秒合约产品
PUT    /api/admin/product/contract/:id   # 编辑秒合约产品
PUT    /api/admin/product/contract/:id/status # 上下架
```

---

## 四、后台 UI 参考

参考币安后台风格：
- 左侧菜单栏
- 顶部面包屑 + 管理员信息
- 主内容区：卡片式布局
- 表格：分页、搜索、筛选
- 弹窗：新增/编辑表单

配色：
- 背景：`#0B0E11`（深色）或白色（浅色）
- 主色：`#F0B90B`（金色）
- 表格斑马纹、hover 效果

---

## 五、声音提示功能

**触发场景：**
| 事件 | 声音 | 说明 |
|------|------|------|
| 新用户注册 | 叮咚 | - |
| 新充值订单 | 叮咚叮 | 金额较大时特殊提示 |
| 新提现申请 | 叮 | 需审核 |
| 新OTC订单 | 叮咚 | - |
| 秒合约开仓 | 无 | 高频，不提示 |

**实现方式：**
- 后台WebSocket推送新事件
- 前端接收后播放音效
- 可在设置中开关声音

**接口：**
```
WebSocket /ws/admin/notify

# 推送消息格式
{
  "type": "new_deposit",
  "data": {
    "userId": 123,
    "username": "user001",
    "amount": 10000,
    "coin": "USDT"
  },
  "time": "2025-01-02 10:30:00"
}
```

---

## 六、项目发布功能

### 6.1 矿池产品发布

**发布表单字段：**
| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 产品名称，如"灵活矿池"、30日矿池" |
| coinId | number | 投入币种，默认AGX |
| type | enum | flexible(活期) / fixed(定期) |
| lockDays | number | 锁仓天数，活期为0 |
| dailyRate | decimal | 每日收益率，如0.003表0.3% |
| minAmount | decimal | 最低申购金额 |
| maxAmount | decimal | 最高申购金额（可空） |
| totalQuota | decimal | 总额度（可空不限） |
| isHot | boolean | 是否热门推荐 |
| sortOrder | number | 排序 |
| status | enum | 1上架 / 0下架 |

### 6.2 秒合约产品发布

**发布表单字段：**
| 字段 | 类型 | 说明 |
|------|------|------|
| symbol | string | 交易对，如"XAU/USD" |
| name | string | 产品名称，如"黄金30秒" |
| duration | number | 周期秒数：30/60/120/300 |
| profitRate | decimal | 盈利收益率，如0.85表示85% |
| minAmount | decimal | 最小下单金额 |
| maxAmount | decimal | 最大下单金额 |
| status | enum | 1开启 / 0关闭 |

---

## 七、管理员操作日志

**记录内容：**
| 字段 | 说明 |
|------|------|
| adminId | 操作管理员 |
| action | 操作类型：登录/审核/配置/编辑等 |
| targetType | 操作对象类型：user/withdraw/config等 |
| targetId | 操作对象ID |
| content | 操作详情JSON |
| ip | 操作来源IP |
| createdAt | 操作时间 |

**必须记录的操作：**
- 管理员登录/登出
- 提现审核通过/拒绝
- 用户禁用/启用
- 系统配置修改
- 产品上下架
- 币种配置修改

---

**后端智能体请按此规划实现接口，前端智能体后续会开发对应的后台页面。**
