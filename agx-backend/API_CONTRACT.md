# AGX 接口契约文档

> 本文档是前后端共同遵守的接口规范，任何一方都不得私自修改。
> 如需变更，必须在代码中明确说明"变更建议"，并通知对方。

---

## 一、通用约定

### 1.1 基础 URL

- 开发环境：`http://localhost:3000/api`
- 生产环境：`https://api.yourdomain.com/api`

### 1.2 认证方式

所有需要认证的接口，请求头必须携带：

```http
Authorization: Bearer <token>
```

- 用户端 token 存储在：`localStorage.auth_token`
- 管理端 token 存储在：`localStorage.admin_token`

### 1.3 统一返回格式

**成功响应：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": { ... }
}
```

**失败响应：**

```json
{
  "code": 1001,
  "msg": "错误原因",
  "data": null
}
```

### 1.4 时间格式

所有时间字段统一使用：`YYYY-MM-DD HH:mm:ss`

示例：`2024-01-15 10:30:00`

---

## 二、前台账户接口

### 2.1 用户注册

- **URL**：`POST /api/account/register`
- **认证**：不需要
- **说明**：用户名 + 密码注册，邀请码必填

**请求体：**

```json
{
  "username": "user001",
  "password": "Abc12345",
  "inviteCode": "ABC123"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名（4-20位，字母数字下划线） |
| password | string | 是 | 密码（8-20位） |
| inviteCode | string | 是 | 邀请码（必填，6位） |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "user": {
      "id": 1,
      "uid": "10000001",
      "username": "user001",
      "nickname": "新用户",
      "inviteCode": "XYZ789",
      "inviterId": 100,
      "createdAt": "2024-01-15 10:00:00"
    }
  }
}
```

---

### 2.2 用户登录

- **URL**：`POST /api/account/login`
- **认证**：不需要
- **说明**：用户名 + 密码登录

**请求体：**

```json
{
  "username": "user001",
  "password": "Abc12345"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "uid": "10000001",
      "username": "user001",
      "nickname": "用户昵称",
      "avatar": null,
      "inviteCode": "XYZ789",
      "createdAt": "2024-01-01 12:00:00"
    }
  }
}
```

---

### 2.3 获取用户信息

- **URL**：`GET /api/account/profile`
- **认证**：需要
- **说明**：获取当前登录用户的基本信息

**请求头：**

```http
Authorization: Bearer <token>
```

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 1,
    "uid": "10000001",
    "username": "user001",
    "nickname": "用户昵称",
    "avatar": "https://...",
    "inviteCode": "XYZ789",
    "inviteCount": 10,
    "totalCommission": "1234.56",
    "createdAt": "2024-01-01 12:00:00"
  }
}
```

---

### 2.4 获取资产余额

- **URL**：`GET /api/account/balance`
- **认证**：需要
- **说明**：获取用户所有币种余额

**请求头：**

```http
Authorization: Bearer <token>
```

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "assets": [
      {
        "asset": "USDT",
        "name": "Tether USD",
        "free": "10000.00",
        "locked": "500.00",
        "usdValue": "10500.00",
        "icon": "https://.../usdt.svg"
      },
      {
        "asset": "BTC",
        "name": "Bitcoin",
        "free": "0.05234",
        "locked": "0",
        "usdValue": "5104.00",
        "icon": "https://.../btc.svg"
      }
    ]
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| asset | string | 币种代码 |
| name | string | 币种名称 |
| free | string | 可用余额 |
| locked | string | 冻结余额 |
| usdValue | string | USD 估值 |
| icon | string | 图标 URL |

---

## 三、后台管理接口

### 3.1 管理员登录

- **URL**：`POST /api/admin/login`
- **认证**：不需要
- **说明**：管理员登录

**请求体：**

```json
{
  "username": "admin",
  "password": "Admin123",
  "captcha": "ABCD"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |
| captcha | string | 否 | 验证码（阶段1可不校验） |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "username": "admin",
      "role": "super",
      "lastLoginAt": "2024-01-15 10:00:00"
    }
  }
}
```

---

### 3.2 币种列表

- **URL**：`GET /api/admin/currency/list`
- **认证**：需要（管理员）
- **说明**：获取币种列表，支持分页和筛选

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 20 | 每页条数 |
| keyword | string | 否 | - | 搜索关键词（匹配 name 或 symbol） |
| status | number | 否 | - | 状态筛选：0=禁用，1=启用 |

**请求示例：**

```http
GET /api/admin/currency/list?page=1&pageSize=20&keyword=BTC&status=1
Authorization: Bearer <admin_token>
```

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "比特币",
        "symbol": "BTC",
        "icon": "/assets/imgs/coins/btc.svg",
        "status": 1,
        "sort": 1,
        "createdAt": "2024-01-01 10:00:00"
      }
    ],
    "total": 100
  }
}
```

---

### 3.3 新增币种

- **URL**：`POST /api/admin/currency`
- **认证**：需要（管理员）
- **说明**：创建新币种

**请求体：**

```json
{
  "name": "比特币",
  "symbol": "BTC",
  "icon": "/assets/imgs/coins/btc.svg",
  "status": 1,
  "sort": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 币种名称 |
| symbol | string | 是 | 币种代码（唯一） |
| icon | string | 否 | 图标 URL |
| status | number | 否 | 状态：0=禁用，1=启用（默认1） |
| sort | number | 否 | 排序值（默认0） |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 1
  }
}
```

---

### 3.4 编辑币种

- **URL**：`PUT /api/admin/currency/:id`
- **认证**：需要（管理员）
- **说明**：更新币种信息

**请求体：**（所有字段可选）

```json
{
  "name": "比特币",
  "symbol": "BTC",
  "icon": "/assets/imgs/coins/btc.svg",
  "status": 0,
  "sort": 2
}
```

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {}
}
```

---

### 3.5 删除币种

- **URL**：`DELETE /api/admin/currency/:id`
- **认证**：需要（管理员）
- **说明**：删除币种

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {}
}
```

---

## 四、错误码一览

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 未登录 |
| 1003 | Token 过期 |
| 1004 | 无权限 |
| 2001 | 用户不存在 |
| 2002 | 密码错误 |
| 2003 | 账号已存在 |
| 2004 | 验证码错误 |
| 2005 | 验证码已过期 |
| 5001 | 管理员不存在 |
| 5002 | 管理员密码错误 |
| 5003 | 币种代码已存在 |
| 5004 | 币种不存在 |

---

## 五、后续阶段接口（预览）

> 以下接口将在后续阶段实现，这里仅做预览。

### 阶段 2：钱包充提

- `GET /api/wallet/deposit/address` - 获取充值地址
- `POST /api/wallet/withdraw` - 提现申请
- `GET /api/wallet/deposit/history` - 充值记录
- `GET /api/wallet/withdraw/history` - 提现记录
- `GET /api/admin/deposit/list` - 后台充值列表
- `GET /api/admin/withdraw/list` - 后台提现列表
- `POST /api/admin/withdraw/approve/:id` - 审核通过
- `POST /api/admin/withdraw/reject/:id` - 审核拒绝

### 阶段 3：行情交易

- `GET /api/market/tickers` - 行情列表
- `GET /api/market/ticker/:symbol` - 单个行情
- `GET /api/market/klines` - K线数据
- `GET /api/market/depth/:symbol` - 盘口深度
- `POST /api/order/create` - 创建订单
- `POST /api/order/cancel/:id` - 撤销订单
- `GET /api/order/open` - 当前委托
- `GET /api/order/history` - 历史订单
- `GET /api/admin/order/list` - 后台订单列表

---

**本文档为阶段 1 版本，后续阶段会持续更新。**
