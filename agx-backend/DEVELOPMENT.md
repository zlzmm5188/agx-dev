# AGX 前端开发说明

> 本文件是前端智能体的工作指南，请仔细阅读后按要求执行。

---

## 一、项目概述

你负责开发 **AGX 交易所前台**，这是一个 APP 级的移动端 Web 应用，后续会通过 Capacitor 打包成 iOS/Android APP。

### 1.1 技术栈

- **框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **路由**：Vue Router
- **状态管理**：Pinia
- **移动端适配**：postcss-px-to-viewport 或 rem 方案
- **APP 打包**：Capacitor（后续阶段）

### 1.2 设计风格

- **主题**：仿币安，深色模式，黄色品牌色
- **主色**：`#F0B90B`（币安金）
- **背景色**：`#0B0E11`（深黑）
- **设计参考**：`/www/wwwroot/agx/web-h5/` 目录下的现有设计

### 1.3 多语言支持（重要！）

> **从第一天就要按多语言架构开发，后期新增非常麻烦！**

**支持语言：**
- 简体中文 (zh-CN) - 默认
- 繁体中文 (zh-TW)
- English (en)
- 日本語 (ja)
- 한국어 (ko)
- ไทย (th)
- Tiếng Việt (vi)

**技术方案：**
- 使用 `vue-i18n` 国际化库
- 语言文件放在 `src/locales/` 目录
- 按模块拆分语言文件

**关键规则：**
```
✗ 禁止：硬编码中文字符串
✗ 禁止：<span>登录</span>
✓ 正确：<span>{{ $t('auth.login') }}</span>
```

---

## 二、项目结构

请按以下结构搭建项目：

```
agx-frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
│
├── src/
│   ├── main.ts                    # 入口文件
│   ├── App.vue                    # 根组件
│   │
│   ├── router/
│   │   └── index.ts               # 路由配置
│   │
│   ├── api/                       # API 接口封装
│   │   ├── request.ts             # axios 封装
│   │   ├── account.ts             # 账户相关接口
│   │   ├── market.ts              # 行情相关接口
│   │   ├── trade.ts               # 交易相关接口
│   │   └── wallet.ts              # 钱包相关接口
│   │
│   ├── stores/                    # Pinia 状态管理
│   │   ├── user.ts                # 用户状态
│   │   ├── market.ts              # 行情状态
│   │   └── app.ts                 # 全局状态
│   │
│   ├── styles/                    # 样式文件
│   │   ├── tokens.css             # 设计令牌（从 web-h5 复制）
│   │   ├── reset.css              # 重置样式
│   │   ├── components.css         # 组件样式
│   │   └── utilities.css          # 工具类
│   │
│   ├── components/                # 公共组件
│   │   ├── layout/
│   │   │   ├── AppHeader.vue      # 顶部导航
│   │   │   ├── AppTabBar.vue      # 底部 TabBar
│   │   │   └── PageContainer.vue  # 页面容器
│   │   ├── common/
│   │   │   ├── CoinIcon.vue       # 币种图标
│   │   │   ├── PriceChange.vue    # 涨跌幅显示
│   │   │   ├── LoadingSpinner.vue # 加载动画
│   │   │   └── EmptyState.vue     # 空状态
│   │   └── trade/
│   │       ├── KlineChart.vue     # K线图
│   │       ├── OrderBook.vue      # 盘口
│   │       └── TradePanel.vue     # 下单面板
│   │
│   └── views/                     # 页面视图
│       ├── tabs/                  # TabBar 主页面（5个）
│       │   ├── HomeView.vue       # 首页
│       │   ├── MarketView.vue     # 行情
│       │   ├── TradeView.vue      # 交易
│       │   ├── WalletView.vue     # 资产
│       │   └── UserView.vue       # 我的
│       │
│       ├── auth/                  # 认证页面
│       │   ├── LoginView.vue      # 登录
│       │   ├── RegisterView.vue   # 注册
│       │   └── ForgotPasswordView.vue
│       │
│       ├── wallet/                # 钱包子页面
│       │   ├── DepositView.vue    # 充币
│       │   ├── WithdrawView.vue   # 提币
│       │   ├── TransferView.vue   # 划转
│       │   └── HistoryView.vue    # 充提记录
│       │
│       ├── trade/                 # 交易子页面
│       │   ├── SpotTradeView.vue  # 现货交易
│       │   ├── OrdersView.vue     # 当前委托
│       │   └── OrderHistoryView.vue
│       │
│       ├── market/                # 行情子页面
│       │   └── MarketDetailView.vue
│       │
│       ├── user/                  # 用户中心子页面
│       │   ├── SecurityView.vue   # 安全设置
│       │   ├── KycView.vue        # 身份认证
│       │   ├── InviteView.vue     # 邀请好友
│       │   └── HelpView.vue       # 帮助中心
│       │
│       ├── ieo/
│       │   └── IeoView.vue        # IEO / 新币
│       │
│       ├── earn/
│       │   └── EarnView.vue       # 理财
│       │
│       └── gold/
│           └── GoldView.vue       # 黄金
```

---

## 三、底部 TabBar 配置

| Tab | 图标 | 路由 | 页面组件 |
|-----|------|------|----------|
| 首页 | home | `/` | HomeView |
| 行情 | chart | `/market` | MarketView |
| 交易 | trade | `/trade` | TradeView |
| 资产 | wallet | `/wallet` | WalletView |
| 我的 | user | `/user` | UserView |

---

## 四、开发阶段与任务

### 阶段 1（当前）

1. **初始化工程**
   - 使用 `npm create vite@latest . -- --template vue-ts` 初始化
   - 安装依赖：vue-router、pinia、axios
   - 复制 `/www/wwwroot/agx/web-h5/assets/css/tokens.css` 到 `src/styles/`

2. **搭建基础架构**
   - 创建 `src/api/request.ts`：axios 封装，统一处理 token 和错误
   - 创建 `src/stores/user.ts`：用户状态管理
   - 创建 `src/router/index.ts`：路由配置

3. **实现布局组件**
   - `AppHeader.vue`：顶部导航栏
   - `AppTabBar.vue`：底部 Tab 栏
   - `PageContainer.vue`：页面容器

4. **实现认证页面**
   - `LoginView.vue`：登录页面
   - `RegisterView.vue`：注册页面
   - 调用 `/api/account/login` 和 `/api/account/register` 接口

5. **实现首页骨架**
   - `HomeView.vue`：首页布局
   - 参考 `/www/wwwroot/agx/web-h5/app.html` 中的 `tpl-home` 模板

---

## 五、接口调用规范

### 5.1 统一请求封装

```typescript
// src/api/request.ts
import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// 请求拦截：添加 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：统一处理错误
request.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data;
    if (code === 0) {
      return data;
    }
    // 业务错误
    return Promise.reject(new Error(msg || '请求失败'));
  },
  (error) => {
    // 网络错误
    return Promise.reject(error);
  }
);

export default request;
```

### 5.2 接口封装示例

```typescript
// src/api/account.ts
import request from './request';

export interface LoginParams {
  loginType: 'phone' | 'email';
  account: string;
  password: string;
}

export interface LoginResult {
  token: string;
  refreshToken?: string;
  user: {
    id: number;
    uid: string;
    nickname: string;
    phone: string | null;
    email: string | null;
    kycStatus: number;
    createdAt: string;
  };
}

export function login(params: LoginParams): Promise<LoginResult> {
  return request.post('/account/login', params);
}

export function register(params: any): Promise<any> {
  return request.post('/account/register', params);
}

export function getProfile(): Promise<any> {
  return request.get('/account/profile');
}

export function getBalance(): Promise<any> {
  return request.get('/account/balance');
}
```

### 5.3 重要规则

1. **所有接口必须按 `API_CONTRACT.md` 中的定义来调用**，不得自行发明接口
2. **字段名必须与契约一致**，不要自己改名
3. **错误处理**：当 `code !== 0` 时，使用 `msg` 字段提示用户
4. **Token 存储**：用户端 token 存在 `localStorage.auth_token`

---

## 六、设计参考

### 6.1 设计令牌

从 `/www/wwwroot/agx/web-h5/assets/css/tokens.css` 复制，核心变量：

```css
:root {
  /* 品牌色 */
  --color-brand: #F0B90B;
  --color-brand-light: #F8D12F;
  --color-brand-dark: #C99A00;
  
  /* 语义色 */
  --color-up: #0ECB81;      /* 涨 - 绿色 */
  --color-down: #F6465D;    /* 跌 - 红色 */
  
  /* 背景色 */
  --bg-primary: #0B0E11;
  --bg-secondary: #181A20;
  --bg-card: #1E2329;
  
  /* 文字色 */
  --text-primary: #EAECEF;
  --text-secondary: #848E9C;
}
```

### 6.2 页面布局参考

- 首页布局：`/www/wwwroot/agx/web-h5/app.html` 中的 `<template id="tpl-home">`
- 钱包布局：`/www/wwwroot/agx/web-h5/pages/wallet.js`
- 登录布局：`/www/wwwroot/agx/web-h5/pages/login.js`

---

## 七、开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev -- --host 0.0.0.0 --port 5174

# 构建生产版本
npm run build
```

---

## 八、与后端对接

- 开发环境通过 Vite 代理转发 `/api` 请求到后端
- 后端服务地址：`http://127.0.0.1:3000`（后端智能体会告知具体端口）
- 接口契约：请查看同目录下的 `API_CONTRACT.md`

---

**现在请开始阶段 1 的开发工作。**
