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
| 5005 | 交易对不存在或已禁用 |
| 5006 | 限价单必须指定价格 |
| 5007 | 最小交易量不足 |
| 5008 | 最大交易量超限 |
| 5009 | 币种配置缺失 |
| 5010 | 钱包不存在 |
| 5011 | 余额不足 |
| 5012 | 订单不存在 |
| 5013 | 订单不可撤销 |
| 5020 | 发行项目不存在 |
| 5021 | 申购尚未开始 |
| 5022 | 申购已结束 |
| 5023 | 最小申购数量不足 |
| 5024 | 最大申购数量超限 |
| 5025 | 已参与过此次申购 |
| 5026 | USDT余额不足 |

---

## 五、广场接口

### 5.1 获取帖子列表

- **URL**：`GET /api/square/posts`
- **认证**：不需要
- **说明**：获取广场帖子列表，支持按tab分类

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| tab | string | 否 | recommend | 分类: recommend-推荐, hot-热门, following-关注, news-新闻 |
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 20 | 每页数量 |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1001,
        "content": "帖子内容",
        "images": ["https://.../img1.jpg", "https://.../img2.jpg"],
        "topic": "BTC",
        "type": "normal",
        "viewCount": 1250,
        "likeCount": 250,
        "commentCount": 50,
        "shareCount": 20,
        "isTop": 0,
        "isHot": 1,
        "isOfficial": 0,
        "isLiked": false,
        "createdAt": "2024-12-18 10:30:00",
        "author": {
          "id": 1001,
          "nickname": "用户名",
          "avatar": "https://.../avatar.jpg",
          "isVerified": 1,
          "userTag": "认证标识"
        }
      }
    ],
    "total": 100
  }
}
```

---

### 5.2 获取帖子详情

- **URL**：`GET /api/square/post/:id`
- **认证**：不需要
- **说明**：获取帖子详情

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 1,
    "userId": 1001,
    "content": "帖子内容",
    "images": ["https://.../img1.jpg"],
    "topic": "BTC",
    "type": "normal",
    "viewCount": 1250,
    "likeCount": 250,
    "commentCount": 50,
    "shareCount": 20,
    "isTop": 0,
    "isHot": 1,
    "isOfficial": 0,
    "isLiked": false,
    "createdAt": "2024-12-18 10:30:00",
    "author": {
      "id": 1001,
      "nickname": "用户名",
      "avatar": "https://.../avatar.jpg",
      "isVerified": 1,
      "userTag": "认证标识"
    }
  }
}
```

---

### 5.3 发布帖子

- **URL**：`POST /api/square/post`
- **认证**：需要
- **说明**：发布新帖子

**请求体：**

```json
{
  "content": "帖子内容",
  "images": ["https://.../img1.jpg", "https://.../img2.jpg"],
  "topic": "BTC",
  "type": "normal"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 帖子内容 |
| images | array | 否 | 图片列表 |
| topic | string | 否 | 话题标签 |
| type | string | 否 | 帖子类型: normal-普通, news-新闻, analysis-分析 |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 1,
    "content": "帖子内容",
    "images": ["https://.../img1.jpg"],
    "topic": "BTC",
    "type": "normal",
    "createdAt": "2024-12-18 10:30:00"
  }
}
```

---

### 5.4 点赞/取消点赞

- **URL**：`POST /api/square/like`
- **认证**：需要
- **说明**：对帖子或评论进行点赞/取消点赞

**请求体：**

```json
{
  "targetType": "post",
  "targetId": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| targetType | string | 是 | 目标类型: post-帖子, comment-评论 |
| targetId | number | 是 | 目标ID |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "liked": true
  }
}
```

---

### 5.5 发表评论

- **URL**：`POST /api/square/comment`
- **认证**：需要
- **说明**：对帖子发表评论

**请求体：**

```json
{
  "postId": 1,
  "content": "评论内容",
  "parentId": null,
  "replyToUserId": null
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| postId | number | 是 | 帖子ID |
| content | string | 是 | 评论内容 |
| parentId | number | 否 | 父评论ID（用于回复评论） |
| replyToUserId | number | 否 | 回复用户ID |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1001,
    "content": "评论内容",
    "likeCount": 0,
    "createdAt": "2024-12-18 10:30:00",
    "author": {
      "id": 1001,
      "nickname": "用户名",
      "avatar": "https://.../avatar.jpg",
      "isVerified": 0
    }
  }
}
```

---

### 5.6 获取评论列表

- **URL**：`GET /api/square/comments`
- **认证**：不需要
- **说明**：获取帖子的评论列表

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| postId | number | 是 | - | 帖子ID |
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 20 | 每页数量 |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "postId": 1,
        "userId": 1001,
        "content": "评论内容",
        "likeCount": 5,
        "createdAt": "2024-12-18 10:30:00",
        "author": {
          "id": 1001,
          "nickname": "用户名",
          "avatar": "https://.../avatar.jpg",
          "isVerified": 0
        }
      }
    ],
    "total": 50
  }
}
```

---

### 5.7 关注/取消关注

- **URL**：`POST /api/square/follow`
- **认证**：需要
- **说明**：关注或取消关注用户

**请求体：**

```json
{
  "targetUserId": 1001
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| targetUserId | number | 是 | 目标用户ID |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "followed": true
  }
}
```

---

### 5.8 获取热门话题

- **URL**：`GET /api/square/topics`
- **认证**：不需要
- **说明**：获取热门话题列表

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| limit | number | 否 | 10 | 限制数量 |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "tag": "BTC突破10万",
        "icon": "🔥",
        "postCount": 125000,
        "isHot": 1
      }
    ]
  }
}
```

---

## 六、聊天接口

### 6.1 获取会话列表

- **URL**：`GET /api/user/conversations`
- **认证**：需要
- **说明**：获取用户的所有会话列表

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 20 | 每页数量 |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "otherUser": {
          "id": 1001,
          "nickname": "用户名",
          "avatar": "https://.../avatar.jpg"
        },
        "lastMessage": "最后一条消息",
        "lastMessageAt": "2024-12-18 10:30:00",
        "unread": 2
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 20
  }
}
```

---

### 6.2 获取会话消息

- **URL**：`GET /api/user/conversations/:conversationId/messages`
- **认证**：需要
- **说明**：获取指定会话的消息列表

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| limit | number | 否 | 50 | 每页数量 |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "conversationId": 1,
        "senderId": 1001,
        "receiverId": 1002,
        "msgType": 1,
        "content": "消息内容",
        "isRead": 1,
        "createdAt": "2024-12-18 10:30:00",
        "sender": {
          "id": 1001,
          "nickname": "发送者",
          "avatar": "https://.../avatar.jpg"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 50
  }
}
```

---

### 6.3 发送消息

- **URL**：`POST /api/user/messages/send`
- **认证**：需要
- **说明**：发送私聊消息

**请求体：**

```json
{
  "receiverId": 1002,
  "content": "消息内容",
  "msgType": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| receiverId | number | 是 | 接收者ID |
| content | string | 是 | 消息内容 |
| msgType | number | 否 | 消息类型: 1-文本, 2-图片, 3-语音, 4-系统消息（默认1） |

**响应体：**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "messageId": 1
  }
}
```

---

### 6.4 WebSocket 实时聊天

- **命名空间**：`/chat`
- **说明**：实时聊天WebSocket连接

**连接认证：**

```javascript
const socket = io('http://localhost:3000/chat', {
  auth: {
    userId: 1001
  }
});
```

**发送私聊消息：**

- **事件名**：`private_message`
- **发送数据：**

```json
{
  "receiverId": 1002,
  "content": "消息内容"
}
```

- **接收事件**：
  - `message_sent`：消息发送成功
  - `new_message`：收到新消息
  - `message_error`：消息发送失败

**正在输入状态：**

- **事件名**：`typing`
- **发送数据：**

```json
{
  "receiverId": 1002,
  "isTyping": true
}
```

- **接收事件**：
  - `user_typing`：用户正在输入

**标记消息已读：**

- **事件名**：`read_message`
- **发送数据：**

```json
{
  "conversationId": 1
}
```

- **接收事件**：
  - `message_read_ack`：标记已读确认

---

## 七、后续阶段接口（预览）

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
