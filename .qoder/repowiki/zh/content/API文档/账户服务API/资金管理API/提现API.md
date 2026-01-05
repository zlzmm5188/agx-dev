# 提现API

<cite>
**本文档引用的文件**
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts)
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts)
- [withdraw.entity.ts](file://agx-backend/src/entities/withdraw.entity.ts)
- [account.dto.ts](file://agx-backend/src/modules/account/account.dto.ts)
- [withdraw.vue](file://agx-admin/src/views/agx/withdraw.vue)
- [Withdraw.vue](file://h5/src/views/Withdraw.vue)
</cite>

## 目录
1. [简介](#简介)
2. [API端点详情](#api端点详情)
3. [请求参数与结构](#请求参数与结构)
4. [响应格式](#响应格式)
5. [错误码](#错误码)
6. [业务逻辑流程](#业务逻辑流程)
7. [状态流转](#状态流转)
8. [前端集成](#前端集成)
9. [示例](#示例)
10. [安全验证](#安全验证)

## 简介

提现API允许用户申请将数字资产从平台提取到外部地址。该API包含完整的风控检查、审核流程和状态管理机制，确保提现操作的安全性和可追溯性。API需要用户完成实名认证（KYC）后才能使用，并通过JWT进行身份验证。

**Section sources**
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts#L115-L119)

## API端点详情

提现API提供以下端点：

- **HTTP方法**: POST
- **URL路径**: `/api/account/withdraw`
- **认证要求**: JWT Bearer Token
- **功能**: 提交提现申请

该端点由`account.controller.ts`中的`withdraw`方法处理，接收用户提交的提现请求并进行验证和处理。

**Section sources**
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts#L115-L119)

## 请求参数与结构

### 请求头

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| Authorization | string | 是 | Bearer JWT令牌 |

### 请求体结构

请求体为JSON格式，包含以下字段：

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| coin | string | 是 | 提现币种（如USDT） |
| chain | string | 是 | 链网络（如TRC20、ERC20） |
| amount | string | 是 | 提现金额（字符串格式） |
| address | string | 是 | 提现目标地址 |
| payPassword | string | 否 | 二级密码（安全验证） |

这些字段定义在`account.dto.ts`的`WithdrawDto`类中，使用class-validator进行数据验证。

```mermaid
classDiagram
class WithdrawDto {
+string coin
+string chain
+string amount
+string address
+string? payPassword
}
```

**Diagram sources**
- [account.dto.ts](file://agx-backend/src/modules/account/account.dto.ts#L73-L89)

**Section sources**
- [account.dto.ts](file://agx-backend/src/modules/account/account.dto.ts#L73-L89)

## 响应格式

### 成功响应

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 123,
    "orderNo": "W20240101ABC123",
    "amount": "100.00",
    "fee": "1.00",
    "actualAmount": "99.00"
  }
}
```

### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| id | number | 提现记录ID |
| orderNo | string | 提现订单号 |
| amount | string | 提现金额 |
| fee | string | 手续费 |
| actualAmount | string | 实际到账金额 |

响应格式遵循统一的API响应规范，由`ApiResponse`类定义。

**Section sources**
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L485-L492)

## 错误码

| 错误码 | 错误消息 | 描述 |
|--------|---------|------|
| 6002 | 请先完成实名认证 | 用户未完成KYC认证 |
| 6003 | 钱包不存在 | 用户钱包记录不存在 |
| 6004 | 余额不足 | 用户余额不足以支付提现金额 |
| 2001 | 用户不存在 | 用户ID无效或不存在 |
| 1002 | 未登录 | JWT令牌无效或已过期 |

这些错误码在`business.exception.ts`中定义，并在业务逻辑中抛出相应的`BusinessException`。

**Section sources**
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L440-L461)
- [business.exception.ts](file://agx-backend/src/common/filters/business.exception.ts)

## 业务逻辑流程

提现API的业务逻辑流程如下：

1. 验证用户身份和JWT令牌
2. 检查用户KYC认证状态
3. 验证提现金额和余额
4. 计算手续费和实际到账金额
5. 创建提现记录
6. 冻结相应余额
7. 返回提现结果

```mermaid
flowchart TD
A[用户提交提现申请] --> B{验证JWT令牌}
B --> |有效| C{检查KYC状态}
C --> |已认证| D{检查余额}
D --> |充足| E[计算手续费]
E --> F[创建提现记录]
F --> G[冻结余额]
G --> H[返回成功响应]
C --> |未认证| I[返回KYC错误]
D --> |不足| J[返回余额不足错误]
B --> |无效| K[返回未登录错误]
I --> L[响应: code=6002]
J --> M[响应: code=6004]
K --> N[响应: code=1002]
H --> O[响应: code=0]
```

**Diagram sources**
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L433-L492)

**Section sources**
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L433-L492)

## 状态流转

提现记录有四种状态，定义在`withdraw.entity.ts`中：

| 状态值 | 状态名称 | 描述 |
|--------|---------|------|
| 0 | 待审核 | 提现申请已提交，等待管理员审核 |
| 1 | 处理中 | 提现申请已通过，正在处理 |
| 2 | 已完成 | 提现已成功完成 |
| 3 | 已拒绝 | 提现申请被拒绝 |

状态流转图如下：

```mermaid
stateDiagram-v2
[*] --> 待审核
待审核 --> 处理中 : 管理员通过
待审核 --> 已拒绝 : 管理员拒绝
处理中 --> 已完成 : 交易上链
已拒绝 --> [*]
已完成 --> [*]
```

**Diagram sources**
- [withdraw.entity.ts](file://agx-backend/src/entities/withdraw.entity.ts#L48-L49)

**Section sources**
- [withdraw.entity.ts](file://agx-backend/src/entities/withdraw.entity.ts#L48-L49)

## 前端集成

### 管理员后台

管理员后台的提现管理页面位于`agx-admin/src/views/agx/withdraw.vue`，提供以下功能：

- 提现记录列表展示
- 按用户ID、关键词和状态搜索
- 审核操作（通过/拒绝）
- 查看提现详情

页面通过`agxApi.getWithdrawList`和`agxApi.reviewWithdraw` API与后端交互。

### 移动端

移动端提现页面位于`h5/src/views/Withdraw.vue`，提供用户友好的提现界面：

- 币种选择器
- 网络选择（TRC20、ERC20等）
- 地址输入和粘贴功能
- 金额输入和"全部"按钮
- 手续费和实际到账计算
- 提现记录查看

页面集成账户余额和交易历史接口，为用户提供完整的资产管理体验。

**Section sources**
- [withdraw.vue](file://agx-admin/src/views/agx/withdraw.vue)
- [Withdraw.vue](file://h5/src/views/Withdraw.vue)

## 示例

### 请求示例

```http
POST /api/account/withdraw HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "coin": "USDT",
  "chain": "TRC20",
  "amount": "100.00",
  "address": "TN3W4H6rK7qj6bX7d9bR3j6bX7d9bR3j6bX7",
  "payPassword": "123456"
}
```

### 响应示例

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "id": 12345,
    "orderNo": "W20240101ABC123",
    "amount": "100.00",
    "fee": "1.00",
    "actualAmount": "99.00"
  }
}
```

**Section sources**
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L485-L492)

## 安全验证

提现API包含多层安全验证机制：

1. **身份验证**: 通过JWT确保用户身份
2. **KYC验证**: 要求用户完成实名认证
3. **余额验证**: 确保用户有足够的余额
4. **数据验证**: 使用class-validator验证输入数据
5. **状态验证**: 防止重复提交或状态冲突

安全验证逻辑主要在`account.service.ts`的`withdraw`方法中实现，确保只有符合条件的用户才能成功提交提现申请。

**Section sources**
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L433-L461)