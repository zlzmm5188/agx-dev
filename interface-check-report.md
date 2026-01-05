# 前后端接口对接检查报告

## 检查时间
2026-01-05

## 检查范围
- 后端模块：account, market, contract, pool, invite, square, social, gold, ai
- 前端API调用：h5/src/utils/api.js
- 接口契约：agx-backend/API_CONTRACT.md

## 检查结果

### ✅ Account 模块
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| POST /api/account/register | ✓ 已实现 | 匹配 |
| POST /api/account/login | ✓ 已实现 | 匹配 |
| GET /api/account/profile | ✓ 已实现 | 匹配 |
| GET /api/account/balance | ✓ 已实现 | 匹配 |
| POST /api/account/password | ✓ 已实现 | 匹配 |
| PUT /api/account/profile | ✓ 已实现 | 匹配 |
| POST /api/account/kyc | ✓ 已实现 | 匹配 |
| GET /api/account/kyc | ✓ 已实现 | 匹配 |
| GET /api/account/deposit/address | ✓ 已实现 | 匹配 |
| GET /api/account/deposit/history | ✓ 已实现 | 匹配 |
| POST /api/account/withdraw | ✓ 已实现 | 匹配 |
| GET /api/account/withdraw/history | ✓ 已实现 | 匹配 |
| GET /api/account/invites | ✓ 已实现 | 匹配 |
| GET /api/account/invite/stats | ✓ 已实现 | 匹配 |
| GET /api/account/notices | ✓ 已实现 | 匹配 |

### ✅ Market 模块
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| GET /api/market/tickers | ✓ 已实现 | 匹配 |
| GET /api/market/ticker/:symbol | ✓ 已实现 | 匹配 |
| GET /api/market/klines | ✓ 已实现 | 匹配 |
| GET /api/market/assets | ✓ 已实现 | 匹配 |

### ✅ Contract 模块
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| GET /api/contract/configs | ✓ 已实现 | 匹配 |
| POST /api/contract/order | ✓ 已实现 | 匹配 |
| GET /api/contract/orders | ✓ 已实现 | 匹配 |

### ✅ Pool 模块
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| GET /api/pool/products | ✓ 已实现 | 匹配 |
| GET /api/pool/holdings | ✓ 已实现 | 匹配 |
| POST /api/pool/subscribe | ✓ 已实现 | 匹配 |
| POST /api/pool/redeem | ✓ 已实现 | 匹配 |

### ✅ Invite 模块
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| GET /api/invite/info | ✓ 已实现 | 匹配 |
| GET /api/invite/records | ✓ 已实现 | 匹配 |
| GET /api/invite/commissions | ✓ 已实现 | 匹配 |
| GET /api/invite/levels | ✓ 已实现 | 匹配 |
| GET /api/invite/rank | ✓ 已实现 | 匹配 |
| GET /api/invite/myrank | ✓ 已实现 | 匹配 |

### ✅ Square 模块
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| GET /api/square/posts | ✓ 已实现 | 匹配 |
| GET /api/square/post/:id | ✓ 已实现 | 匹配 |
| POST /api/square/post | ✓ 已实现 | 匹配 |
| POST /api/square/like | ✓ 已实现 | 匹配 |
| POST /api/square/comment | ✓ 已实现 | 匹配 |
| GET /api/square/comments | ✓ 已实现 | 匹配 |
| POST /api/square/follow | ✓ 已实现 | 匹配 |
| GET /api/square/topics | ✓ 已实现 | 匹配 |

### ⚠️ Social 模块（需要调整）
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| POST /api/user/follow/:targetId | 需要实现 | 缺失 |
| POST /api/user/unfollow/:targetId | 需要实现 | 缺失 |
| GET /api/user/friends | 需要实现 | 缺失 |
| POST /api/user/friend-request | 需要实现 | 缺失 |
| POST /api/user/friend-request/:id/handle | 需要实现 | 缺失 |
| GET /api/user/conversations | 需要实现 | 缺失 |
| GET /api/user/conversations/:id/messages | 需要实现 | 缺失 |
| POST /api/user/messages/send | 需要实现 | 缺失 |

### ✅ Gold 模块
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| GET /api/gold/prices | ✓ 已实现 | 匹配 |
| GET /api/gold/detail | ✓ 已实现 | 匹配 |
| GET /api/gold/klines | ✓ 已实现 | 匹配 |
| GET /api/gold/categories | ✓ 已实现 | 匹配 |
| GET /api/gold/products | ✓ 已实现 | 匹配 |
| GET /api/gold/product/:id | ✓ 已实现 | 匹配 |
| GET /api/gold/spot | ✓ 已实现 | 匹配 |
| GET /api/gold/contract | ✓ 已实现 | 匹配 |
| GET /api/gold/finance | ✓ 已实现 | 匹配 |
| GET /api/gold/agx | ✓ 已实现 | 匹配 |

### ✅ AI 模块
| 前端调用 | 后端路由 | 状态 |
|---------|---------|------|
| POST /api/ai/chat | ✓ 已实现 | 匹配 |
| GET /api/ai/questions | ✓ 已实现 | 匹配 |

## 需要补充的功能

### 1. Social 模块（聊天系统）
需要在后端实现完整的社交聊天功能（阶段四处理）

### 2. 现货交易接口
需要新增交易对和订单管理接口（阶段二处理）

### 3. 新币发行接口
需要新增新币发行和申购接口（阶段二处理）

## 结论
✅ 核心接口（账户、行情、合约、矿池、邀请、广场）已完全对接
⚠️ 聊天系统接口需要在阶段四实现
⚠️ 交易和新币发行接口需要在阶段二实现
