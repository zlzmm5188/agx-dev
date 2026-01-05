# 邀请奖励API

<cite>
**本文档引用文件**  
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts)
- [user-invite.entity.ts](file://agx-backend/src/entities/user-invite.entity.ts)
- [invite-reward.entity.ts](file://agx-backend/src/entities/invite-reward.entity.ts)
- [invite.controller.ts](file://agx-backend/src/modules/invite/invite.controller.ts)
- [invite.service.ts](file://agx-backend/src/modules/invite/invite.service.ts)
- [invites.vue](file://agx-admin/src/views/agx/invites.vue)
- [index.js](file://agx-admin/src/api/agx/index.js)
- [api.js](file://h5/src/utils/api.js)
</cite>

## 目录
1. [简介](#简介)
2. [API接口详情](#api接口详情)
   - [获取邀请链接 (GET /invite/info)](#获取邀请链接-get--inviteinfo)
   - [获取邀请记录 (GET /invite/records)](#获取邀请记录-get--inviterecords)
   - [获取返佣记录 (GET /invite/commissions)](#获取返佣记录-get--invitecommissions)
3. [业务逻辑说明](#业务逻辑说明)
   - [邀请层级](#邀请层级)
   - [奖励分配](#奖励分配)
4. [请求/响应示例](#请求响应示例)
   - [获取个人邀请链接](#获取个人邀请链接)
   - [查询下级用户](#查询下级用户)
5. [前端与移动端调用](#前端与移动端调用)
   - [前端邀请页面](#前端邀请页面)
   - [移动端邀请功能](#移动端邀请功能)
6. [数据模型](#数据模型)
   - [UserInvite 实体](#userinvite-实体)
   - [InviteReward 实体](#invitereward-实体)

## 简介

邀请奖励API为用户提供邀请好友并获得奖励的功能。该系统支持邀请链接生成、邀请记录查询和返佣奖励领取。用户可以通过分享个人邀请链接来邀请新用户注册，当被邀请人完成注册或其他指定行为（如首充、交易等）时，邀请人将获得相应的奖励。

本API文档详细描述了相关HTTP接口、请求参数、响应结构、错误码以及业务逻辑，帮助开发者理解如何集成和使用邀请奖励功能。

## API接口详情

### 获取邀请链接 (GET /invite/info)

获取当前用户的邀请信息，包括邀请码、邀请链接、邀请统计和等级信息。

**HTTP方法**: `GET`  
**URL路径**: `/api/invite/info`

**请求头**:
```http
Authorization: Bearer <token>
```

**请求参数**: 无

**响应JSON Schema**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "inviteCode": "ABC123",
    "inviteLink": "https://agx.bi/register?ref=ABC123",
    "inviteCount": 10,
    "teamCount": 25,
    "totalCommission": "1234.56",
    "level": 3,
    "levelInfo": {
      "level": 3,
      "name": "金牌会员",
      "icon": "🥇",
      "color": "#D4B872",
      "commissionRate1": "0.25",
      "commissionRate2": "0.12"
    },
    "rewards": {
      "signup": 10,
      "trade": 20,
      "lifetime": true
    }
  }
}
```

**可能的错误码**:
- `1002`: 请先登录

**Section sources**
- [invite.controller.ts](file://agx-backend/src/modules/invite/invite.controller.ts#L11-L23)
- [invite.service.ts](file://agx-backend/src/modules/invite/invite.service.ts#L27-L62)

### 获取邀请记录 (GET /invite/records)

获取当前用户的邀请记录列表，支持分页查询。

**HTTP方法**: `GET`  
**URL路径**: `/api/invite/records`

**请求头**:
```http
Authorization: Bearer <token>
```

**请求参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 20 | 每页条数 |

**响应JSON Schema**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 101,
        "user": {
          "id": 101,
          "uid": "10000101",
          "username": "user001",
          "nickname": "新用户",
          "avatar": null,
          "kycStatus": 2,
          "createdAt": "2024-01-15 10:00:00"
        },
        "createdAt": "2024-01-15T10:00:00.000Z",
        "status": "active"
      }
    ],
    "total": 1
  }
}
```

**可能的错误码**:
- `1002`: 请先登录

**Section sources**
- [invite.controller.ts](file://agx-backend/src/modules/invite/invite.controller.ts#L25-L41)
- [invite.service.ts](file://agx-backend/src/modules/invite/invite.service.ts#L160-L190)

### 获取返佣记录 (GET /invite/commissions)

获取当前用户的返佣记录列表，支持分页查询。

**HTTP方法**: `GET`  
**URL路径**: `/api/invite/commissions`

**请求头**:
```http
Authorization: Bearer <token>
```

**请求参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 20 | 每页条数 |

**响应JSON Schema**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "fromUserId": 101,
        "level": 1,
        "sourceType": "contract",
        "amount": "25.60",
        "rate": "0.20",
        "createdAt": "2024-01-15T09:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

**可能的错误码**:
- `1002`: 请先登录

**Section sources**
- [invite.controller.ts](file://agx-backend/src/modules/invite/invite.controller.ts#L43-L59)
- [invite.service.ts](file://agx-backend/src/modules/invite/invite.service.ts#L192-L208)

## 业务逻辑说明

### 邀请层级

系统支持两级邀请关系：
- **一级邀请**: 直接由用户邀请的用户，层级为1
- **二级邀请**: 由一级用户邀请的用户，层级为2

当新用户注册时，系统会根据其填写的邀请码建立邀请关系。如果邀请人本身也有邀请人，则会自动创建二级邀请关系。

**邀请层级示例**:
```
用户A (邀请人)
├── 用户B (一级被邀请人)
│   └── 用户C (二级被邀请人)
└── 用户D (一级被邀请人)
```

在数据库中，`user-invite.entity.ts` 使用 `level` 字段来区分层级：
- `level = 1`: 一级邀请
- `level = 2`: 二级邀请

**Section sources**
- [user-invite.entity.ts](file://agx-backend/src/entities/user-invite.entity.ts#L33-L34)
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L110-L126)

### 奖励分配

奖励分配基于用户的等级和邀请层级：
- **一级返佣**: 根据用户等级的 `commissionRate1` 计算
- **二级返佣**: 根据用户等级的 `commissionRate2` 计算

返佣金额计算公式：
```
返佣金额 = 交易金额 × 返佣比例
```

用户等级越高，返佣比例越高。系统预设了5个等级：
1. 普通会员 (等级1): 一级20%，二级10%
2. 银牌会员 (等级2): 一级22%，二级11%
3. 金牌会员 (等级3): 一级25%，二级12%
4. 钻石会员 (等级4): 一级28%，二级14%
5. 黑金会员 (等级5): 一级30%，二级15%

返佣记录存储在 `invite-reward.entity.ts` 中，并在用户完成KYC认证后发放。

**Section sources**
- [invite.service.ts](file://agx-backend/src/modules/invite/invite.service.ts#L64-L131)
- [invite-reward.entity.ts](file://agx-backend/src/entities/invite-reward.entity.ts)

## 请求/响应示例

### 获取个人邀请链接

**请求**:
```http
GET /api/invite/info
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "inviteCode": "ABC123",
    "inviteLink": "https://agx.bi/register?ref=ABC123",
    "inviteCount": 5,
    "teamCount": 12,
    "totalCommission": "567.80",
    "level": 2,
    "levelInfo": {
      "level": 2,
      "name": "银牌会员",
      "icon": "🥈",
      "color": "#C0C0C0",
      "commissionRate1": "0.22",
      "commissionRate2": "0.11"
    },
    "rewards": {
      "signup": 10,
      "trade": 20,
      "lifetime": true
    }
  }
}
```

### 查询下级用户

**请求**:
```http
GET /api/invite/records?page=1&pageSize=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应**:
```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 101,
        "user": {
          "id": 101,
          "uid": "10000101",
          "username": "newuser001",
          "nickname": "新用户",
          "avatar": null,
          "kycStatus": 2,
          "createdAt": "2024-01-15 10:00:00"
        },
        "createdAt": "2024-01-15T10:00:00.000Z",
        "status": "active"
      }
    ],
    "total": 1
  }
}
```

## 前端与移动端调用

### 前端邀请页面

在管理后台的邀请页面 (`invites.vue`) 中，通过调用API获取邀请列表数据并展示。

**关键代码**:
```javascript
const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getInviteList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      inviterId: searchForm.inviterId || undefined,
      userId: searchForm.userId || undefined
    })
    if (res.code === 0) {
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
    }
  } finally {
    loading.value = false
  }
}
```

该页面使用 `a-table` 组件展示邀请记录，包括ID、邀请人、被邀请人、层级和邀请时间等信息。

**Section sources**
- [invites.vue](file://agx-admin/src/views/agx/invites.vue)

### 移动端邀请功能

在移动端应用中，通过封装的API服务调用邀请相关接口。

**API调用定义**:
```javascript
// ========== 邀请模块 /api/invite ==========
invite: {
  getInfo: () => apiClient.get('/api/invite/info'),
  getRecords: (params) => apiClient.get('/api/invite/records', { params }),
  getCommissions: (params) => apiClient.get('/api/invite/commissions', { params }),
  getLevels: () => apiClient.get('/api/invite/levels'),
  getRank: (params) => apiClient.get('/api/invite/rank', { params }),
  getMyRank: (params) => apiClient.get('/api/invite/myrank', { params }),
},
```

移动端通过 `accountApi` 调用这些接口，实现邀请功能的展示和交互。

**Section sources**
- [api.js](file://h5/src/utils/api.js#L141-L149)

## 数据模型

### UserInvite 实体

`UserInvite` 实体定义了用户之间的邀请关系。

```typescript
@Entity('agx_user_invite')
export class UserInvite {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '用户ID' })
  @Index('idx_user_id')
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint', unsigned: true, name: 'inviter_id', comment: '直接邀请人ID' })
  @Index('idx_inviter_id')
  inviterId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviter_id' })
  inviter: User;

  @Column({ type: 'smallint', default: 1, comment: '邀请层级：1直接 2间接' })
  level: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
```

**字段说明**:
- `id`: 主键
- `userId`: 被邀请用户ID
- `inviterId`: 邀请人ID
- `level`: 邀请层级 (1=一级, 2=二级)
- `createdAt`: 创建时间

**Section sources**
- [user-invite.entity.ts](file://agx-backend/src/entities/user-invite.entity.ts)

### InviteReward 实体

`InviteReward` 实体定义了邀请奖励记录。

```typescript
@Entity('agx_invite_reward')
export class InviteReward {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id', comment: '获得奖励的用户ID' })
  @Index('idx_user_id')
  userId: number;

  @Column({ type: 'bigint', unsigned: true, name: 'invited_user_id', comment: '被邀请用户ID' })
  @Index('idx_invited_user_id')
  invitedUserId: number;

  @Column({ type: 'varchar', length: 50, name: 'reward_type', comment: '奖励类型: signup=注册奖励, kyc=实名奖励, first_trade=首笔交易, first_deposit=首充' })
  rewardType: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, comment: '奖励金额' })
  amount: string;

  @Column({ type: 'varchar', length: 20, name: 'coin_symbol', default: 'USDT', comment: '奖励币种' })
  coinSymbol: string;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0待发放 1已发放 2已过期' })
  status: number;

  @Column({ type: 'timestamp', nullable: true, name: 'issued_at', comment: '发放时间' })
  issuedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
```

**字段说明**:
- `id`: 主键
- `userId`: 获得奖励的用户ID
- `invitedUserId`: 被邀请用户ID
- `rewardType`: 奖励类型
- `amount`: 奖励金额
- `coinSymbol`: 奖励币种
- `status`: 状态 (0=待发放, 1=已发放, 2=已过期)
- `issuedAt`: 发放时间
- `createdAt`: 创建时间

**Section sources**
- [invite-reward.entity.ts](file://agx-backend/src/entities/invite-reward.entity.ts)