# 个人资料API

<cite>
**本文档引用的文件**  
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts)
- [account.dto.ts](file://agx-backend/src/modules/account/account.dto.ts)
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts)
- [jwt-auth.guard.ts](file://agx-backend/src/modules/auth/jwt-auth.guard.ts)
- [jwt.strategy.ts](file://agx-backend/src/modules/auth/jwt.strategy.ts)
- [api.js](file://h5/src/utils/api.js)
- [index.vue](file://agx-admin/src/views/userCenter/index.vue)
</cite>

## 目录
1. [简介](#简介)
2. [核心端点](#核心端点)
3. [请求认证机制](#请求认证机制)
4. [用户资料数据结构](#用户资料数据结构)
5. [前端调用示例](#前端调用示例)
6. [KYC认证状态管理](#kyc认证状态管理)
7. [错误码说明](#错误码说明)

## 简介
个人资料API提供用户信息的读取和更新功能，是系统用户中心的核心接口。该API支持通过`GET /profile`获取用户资料，通过`PUT /profile`更新用户资料，包括昵称和头像等字段。所有端点均需JWT认证，确保用户数据安全。本API被前端用户中心页面和移动端个人资料页广泛调用。

**Section sources**
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts#L8-L159)

## 核心端点

### GET /profile - 获取用户资料
获取当前登录用户的完整资料信息。

**请求信息**
- **HTTP方法**: GET
- **URL路径**: `/api/account/profile`
- **认证要求**: JWT Bearer Token

**响应JSON Schema**
```json
{
  "id": 123,
  "uid": "12345678",
  "username": "user123",
  "nickname": "昵称",
  "avatar": "https://example.com/avatar.jpg",
  "inviteCode": "ABC123",
  "inviteCount": 5,
  "totalCommission": "0.00",
  "createdAt": "2023-01-01 12:00:00"
}
```

**Section sources**
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts#L34-L39)
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L204-L231)

### PUT /profile - 更新用户资料
更新当前登录用户的可编辑资料字段。

**请求信息**
- **HTTP方法**: PUT
- **URL路径**: `/api/account/profile`
- **认证要求**: JWT Bearer Token
- **请求体结构**: `UpdateProfileDto`

**请求体参数**
- `nickname` (可选): 用户昵称，字符串类型，长度1-50
- `avatar` (可选): 头像URL，字符串类型

**响应JSON Schema**
```json
{
  "nickname": "新昵称",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Section sources**
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts#L64-L69)
- [account.dto.ts](file://agx-backend/src/modules/account/account.dto.ts#L37-L46)
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L276-L290)

## 请求认证机制
个人资料API的所有端点均需JWT认证，通过`@UseGuards(JwtAuthGuard)`装饰器实现。

```mermaid
sequenceDiagram
participant 前端 as 前端应用
participant API as 个人资料API
participant 守卫 as JwtAuthGuard
participant 策略 as JwtStrategy
前端->>API : GET /api/account/profile<br/>Authorization : Bearer <token>
API->>守卫 : canActivate()
守卫->>策略 : 验证JWT令牌
策略-->>守卫 : 解析payload
守卫->>守卫 : handleRequest()
守卫-->>API : 返回用户信息
API-->>前端 : 200 OK + 用户资料
```

**Diagram sources**
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts#L35-L36)
- [jwt-auth.guard.ts](file://agx-backend/src/modules/auth/jwt-auth.guard.ts#L5-L17)
- [jwt.strategy.ts](file://agx-backend/src/modules/auth/jwt.strategy.ts#L13-L32)

## 用户资料数据结构
个人资料API涉及的主要数据结构包括用户实体和更新资料DTO。

```mermaid
classDiagram
class User {
+id : number
+uid : string
+username : string
+nickname : string
+avatar : string
+inviteCode : string
+inviteCount : number
+totalCommission : string
+createdAt : string
+kycStatus : number
}
class UpdateProfileDto {
+nickname? : string
+avatar? : string
}
class AccountService {
+getProfile(userId : number) : Promise~User~
+updateProfile(userId : number, dto : UpdateProfileDto) : Promise~object~
}
AccountService --> User : "返回"
AccountService --> UpdateProfileDto : "接收"
```

**Diagram sources**
- [account.dto.ts](file://agx-backend/src/modules/account/account.dto.ts#L37-L46)
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L204-L290)
- [user.entity.ts](file://agx-backend/src/entities/user.entity.ts)

## 前端调用示例
前端通过封装的API客户端调用个人资料API。

### H5移动端调用
```mermaid
sequenceDiagram
participant 移动端 as H5移动端
participant API客户端 as API客户端
participant 个人资料API as 个人资料API
移动端->>API客户端 : api.account.profile()
API客户端->>API客户端 : 添加Bearer Token
API客户端->>个人资料API : GET /api/account/profile
个人资料API-->>API客户端 : 用户资料
API客户端-->>移动端 : 返回用户资料
```

**Diagram sources**
- [api.js](file://h5/src/utils/api.js#L84-L85)
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts#L34-L39)

### 管理后台调用
```mermaid
flowchart TD
A[用户中心页面] --> B{页面加载}
B --> C[调用GET /profile]
C --> D[获取用户资料]
D --> E[显示用户信息]
F[修改头像] --> G[调用PUT /profile]
G --> H[更新用户资料]
H --> I[刷新用户信息]
```

**Diagram sources**
- [index.vue](file://agx-admin/src/views/userCenter/index.vue)
- [account.controller.ts](file://agx-backend/src/modules/account/account.controller.ts)

## KYC认证状态管理
KYC认证状态集成在用户资料系统中，通过`kycStatus`字段表示用户认证状态。

**KYC状态值说明**
- `0`: 未认证
- `1`: 认证中
- `2`: 已认证

```mermaid
stateDiagram-v2
[*] --> 未认证
未认证 --> 认证中 : 提交KYC申请
认证中 --> 已认证 : 审核通过
认证中 --> 未认证 : 审核拒绝
已认证 --> 已认证 : 无法重复提交
```

**Diagram sources**
- [kyc.entity.ts](file://agx-backend/src/entities/kyc.entity.ts#L42-L43)
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L309-L311)

## 错误码说明
个人资料API可能返回的错误码及其含义。

**常见错误码**
- `1001`: 账号已被禁用
- `1002`: 旧密码错误
- `5002`: 已有待审核的认证申请
- `5003`: 已完成实名认证
- `5004`: 真实姓名长度不正确
- `5005`: 证件号码长度不正确

**Section sources**
- [account.service.ts](file://agx-backend/src/modules/account/account.service.ts#L305-L311)