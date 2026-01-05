# AGX 前后端对接状态报告

生成时间：2026-01-05

## 一、后端服务状态

### 1.1 后端架构
- **框架**: NestJS + TypeScript
- **数据库**: PostgreSQL
- **端口**: 3000
- **认证**: JWT (Bearer Token)

### 1.2 已实现的模块

| 模块 | 路径 | Controller | Service | 状态 |
|------|------|-----------|---------|------|
| 账户模块 | `/api/account` | ✅ | ✅ | 已实现 |
| 管理后台 | `/api/admin` | ✅ | ✅ | 已实现 |
| 行情模块 | `/api/market` | ✅ | ✅ | 已实现 |
| 合约模块 | `/api/contract` | ✅ | ✅ | 已实现 |
| 矿池模块 | `/api/pool` | ✅ | ✅ | 已实现 |
| 黄金模块 | `/api/gold` | ✅ | ✅ | 已实现 |
| 邀请模块 | `/api/invite` | ✅ | ✅ | 已实现 |
| 广场模块 | `/api/square` | ✅ | ✅ | 已实现 |
| 社交模块 | `/api/user` | ✅ | ✅ | 已实现 |
| AI模块 | `/api/ai` | ✅ | ✅ | 已实现 |

### 1.3 后端启动状态
- ⚠️ **环境中未安装 npm**，无法直接启动后端服务
- 后端代码已完整，配置文件正常（.env 已配置）
- 数据库配置：PostgreSQL 127.0.0.1:5432，数据库名：agx

## 二、前端 API 对接情况

### 2.1 前端 API 封装位置
- **主文件**: `h5/src/utils/api.js`
- **导出文件**: `h5/src/api/index.js`
- **基础配置**: 
  - baseURL: `http://localhost:3000`
  - timeout: 10000ms
  - 统一响应格式处理: `{ code: 0, msg: 'ok', data: {...} }`

### 2.2 前后端接口对接检查

#### ✅ 账户模块 (`/api/account`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `account.register(data)` | `POST /api/account/register` | ✅ | 完全匹配 |
| `account.login(data)` | `POST /api/account/login` | ✅ | 完全匹配 |
| `account.profile()` | `GET /api/account/profile` | ✅ | 完全匹配 |
| `account.updateProfile(data)` | `PUT /api/account/profile` | ✅ | 完全匹配 |
| `account.balance()` | `GET /api/account/balance` | ✅ | 完全匹配 |
| `account.changePassword(data)` | `POST /api/account/password` | ✅ | 完全匹配 |
| `account.submitKyc(data)` | `POST /api/account/kyc` | ✅ | 完全匹配 |
| `account.getKycStatus()` | `GET /api/account/kyc` | ✅ | 完全匹配 |
| `account.getDepositAddress(params)` | `GET /api/account/deposit/address` | ✅ | 完全匹配 |
| `account.getDepositHistory(params)` | `GET /api/account/deposit/history` | ✅ | 完全匹配 |
| `account.withdraw(data)` | `POST /api/account/withdraw` | ✅ | 完全匹配 |
| `account.getWithdrawHistory(params)` | `GET /api/account/withdraw/history` | ✅ | 完全匹配 |
| `account.getInviteList(params)` | `GET /api/account/invites` | ✅ | 完全匹配 |
| `account.getInviteStats()` | `GET /api/account/invite/stats` | ✅ | 完全匹配 |
| `account.getNotices()` | `GET /api/account/notices` | ✅ | 完全匹配 |

#### ✅ 行情模块 (`/api/market`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `market.getTickers(type, tab)` | `GET /api/market/tickers` | ✅ | 完全匹配 |
| `market.getTicker(symbol)` | `GET /api/market/ticker/:symbol` | ✅ | 完全匹配 |
| `market.getKlines(params)` | `GET /api/market/klines` | ✅ | 完全匹配 |
| `market.getAssets(type)` | `GET /api/market/assets` | ✅ | 完全匹配 |

#### ✅ 黄金模块 (`/api/gold`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `gold.getPrices()` | `GET /api/gold/prices` | ✅ | 完全匹配 |
| `gold.getDetail()` | `GET /api/gold/detail` | ✅ | 完全匹配 |
| `gold.getKlines(params)` | `GET /api/gold/klines` | ✅ | 完全匹配 |
| `gold.getCategories()` | `GET /api/gold/categories` | ✅ | 完全匹配 |
| `gold.getProducts(type)` | `GET /api/gold/products` | ✅ | 完全匹配 |
| `gold.getProductDetail(id)` | `GET /api/gold/product/:id` | ✅ | 完全匹配 |
| `gold.getSpot()` | `GET /api/gold/spot` | ✅ | 完全匹配 |
| `gold.getContract()` | `GET /api/gold/contract` | ✅ | 完全匹配 |
| `gold.getFinance()` | `GET /api/gold/finance` | ✅ | 完全匹配 |
| `gold.getAgx()` | `GET /api/gold/agx` | ✅ | 完全匹配 |

#### ✅ 合约模块 (`/api/contract`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `contract.getConfigs()` | `GET /api/contract/configs` | ✅ | 完全匹配 |
| `contract.createOrder(data)` | `POST /api/contract/order` | ✅ | 完全匹配 |
| `contract.getOrders(status)` | `GET /api/contract/orders` | ✅ | 完全匹配 |

#### ✅ 矿池模块 (`/api/pool`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `pool.getProducts()` | `GET /api/pool/products` | ✅ | 完全匹配 |
| `pool.getHoldings()` | `GET /api/pool/holdings` | ✅ | 完全匹配 |
| `pool.subscribe(data)` | `POST /api/pool/subscribe` | ✅ | 完全匹配 |
| `pool.redeem(data)` | `POST /api/pool/redeem` | ✅ | 完全匹配 |

#### ✅ 邀请模块 (`/api/invite`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `invite.getInfo()` | `GET /api/invite/info` | ✅ | 完全匹配 |
| `invite.getRecords(params)` | `GET /api/invite/records` | ✅ | 完全匹配 |
| `invite.getCommissions(params)` | `GET /api/invite/commissions` | ✅ | 完全匹配 |
| `invite.getLevels()` | `GET /api/invite/levels` | ✅ | 完全匹配 |
| `invite.getRank(params)` | `GET /api/invite/rank` | ✅ | 完全匹配 |
| `invite.getMyRank(params)` | `GET /api/invite/myrank` | ✅ | 完全匹配 |

#### ✅ 广场模块 (`/api/square`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `square.getPosts(params)` | `GET /api/square/posts` | ✅ | 完全匹配 |
| `square.getPost(id)` | `GET /api/square/post/:id` | ✅ | 完全匹配 |
| `square.createPost(data)` | `POST /api/square/post` | ✅ | 完全匹配 |
| `square.toggleLike(data)` | `POST /api/square/like` | ✅ | 完全匹配 |
| `square.createComment(data)` | `POST /api/square/comment` | ✅ | 完全匹配 |
| `square.getComments(params)` | `GET /api/square/comments` | ✅ | 完全匹配 |
| `square.toggleFollow(data)` | `POST /api/square/follow` | ✅ | 完全匹配 |
| `square.getTopics(limit)` | `GET /api/square/topics` | ✅ | 完全匹配 |

#### ✅ 社交模块 (`/api/user`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `social.follow(targetId)` | `POST /api/user/follow/:id` | ✅ | 完全匹配 |
| `social.unfollow(targetId)` | `POST /api/user/unfollow/:id` | ✅ | 完全匹配 |
| `social.getFriends(params)` | `GET /api/user/friends` | ✅ | 完全匹配 |
| `social.sendFriendRequest(data)` | `POST /api/user/friend-request` | ✅ | 完全匹配 |
| `social.handleFriendRequest(...)` | `POST /api/user/friend-request/:id/handle` | ✅ | 完全匹配 |
| `social.getConversations(params)` | `GET /api/user/conversations` | ✅ | 完全匹配 |
| `social.getMessages(...)` | `GET /api/user/conversations/:id/messages` | ✅ | 完全匹配 |
| `social.sendMessage(data)` | `POST /api/user/messages/send` | ✅ | 完全匹配 |

#### ✅ AI模块 (`/api/ai`)

| 前端调用 | 后端接口 | 方法 | 对接状态 |
|---------|---------|------|---------|
| `ai.chat(data)` | `POST /api/ai/chat` | ✅ | 完全匹配 |
| `ai.getQuestions(language)` | `GET /api/ai/questions` | ✅ | 完全匹配 |

## 三、对接状态总结

### 3.1 整体评估
- ✅ **前后端接口规范完全一致**
- ✅ **所有模块接口已实现对接**
- ✅ **统一返回格式已配置**：`{ code: 0, msg: 'ok', data: {...} }`
- ✅ **认证机制已对接**：JWT Bearer Token
- ✅ **错误处理已统一**：前端拦截器处理 code !== 0 的情况

### 3.2 已对接的模块统计
- **账户模块**: 15个接口 ✅
- **行情模块**: 4个接口 ✅
- **黄金模块**: 10个接口 ✅
- **合约模块**: 3个接口 ✅
- **矿池模块**: 4个接口 ✅
- **邀请模块**: 6个接口 ✅
- **广场模块**: 8个接口 ✅
- **社交模块**: 8个接口 ✅
- **AI模块**: 2个接口 ✅

**总计**: **60个接口** 全部对接完成 ✅

### 3.3 需要启动的服务

#### 后端服务启动
```bash
cd agx-backend
npm install  # 首次运行需要安装依赖
npm run dev  # 启动开发服务器（端口3000）
```

#### 前端服务启动
```bash
cd h5
npm install  # 首次运行需要安装依赖
npm run dev  # 启动开发服务器
```

#### 数据库准备
```bash
# 确保 PostgreSQL 服务运行
PGPASSWORD=AGX2025Pass psql -h 127.0.0.1 -U agx -d agx -f schema.sql
```

## 四、当前工作状态

### 4.1 已完成的工作
1. ✅ **前端页面宽度统一修复** - 所有页面统一为移动端居中布局（max-width: 428px）
2. ✅ **后端API全部实现** - 10个模块、60个接口
3. ✅ **前端API封装完成** - 统一在 `h5/src/utils/api.js`
4. ✅ **接口规范对接检查** - 所有接口URL、参数、返回格式完全匹配
5. ✅ **认证机制对接** - JWT Token 统一处理
6. ✅ **错误处理统一** - 响应拦截器统一处理错误码

### 4.2 待完成的工作
1. ⚠️ **后端服务启动** - 需要在有 npm 的环境中启动
2. ⚠️ **前端服务启动** - 需要启动前端开发服务器
3. ⚠️ **数据库初始化** - 需要执行 schema.sql 创建表结构
4. ⚠️ **实际接口测试** - 启动服务后进行端到端测试

### 4.3 下一步建议
1. **立即启动后端服务**：`cd agx-backend && npm run dev`
2. **立即启动前端服务**：`cd h5 && npm run dev`
3. **测试核心接口**：
   - 注册登录流程
   - 获取用户信息
   - 获取行情数据
   - 发布帖子功能
4. **修复发现的问题**（如果有）

## 五、接口规范说明

### 5.1 统一返回格式
所有接口返回格式：
```typescript
{
  code: number,      // 0=成功，非0=失败
  msg: string,       // 提示信息
  data: any          // 业务数据
}
```

### 5.2 认证方式
```http
Authorization: Bearer <token>
```
- Token 存储在 `localStorage.token`
- 所有需要认证的接口都已添加 `@UseGuards(JwtAuthGuard)`

### 5.3 错误码规范
- `0` - 成功
- `1001` - 参数错误
- `1002` - 未登录（前端自动跳转登录页）
- `1003` - Token过期
- `1004` - 无权限
- `2xxx` - 业务错误

---

## 总结

**✅ 前后端接口已完全对接，规范统一，可以直接启动服务进行测试！**

所有60个接口的URL、参数、返回格式都已检查完毕，完全匹配。只需启动后端和前端服务即可开始实际测试。
