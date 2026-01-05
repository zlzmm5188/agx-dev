# AGX UI 设计规范

> **核心目标**：打造独一无二的高端交易平台，对标币安/OKX/Bybit 顶级体验

---

## 一、设计原则

### 1.1 高端感

| 要素 | 要求 |
|------|------|
| 留白 | 充足留白，不拥挤。宁可少内容，不可塞满 |
| 层次 | 信息层次分明，主次清晰 |
| 动效 | 微动效精致，过渡丝滑 |
| 细节 | 阴影、渐变、圆角统一且精细 |

### 1.2 内容密度

```
❌ 错误：大片空白 + 几行文字
✅ 正确：有实际价值的数据/图表/卡片填充
```

每个板块必须有**实质内容**：
- 首页：实时行情、倒计时、收益数据
- 矿池：产品卡片、收益曲线
- 交易：K线图、盘口、下单面板
- 广场：帖子流、图片预览

### 1.3 操作流畅

| 场景 | 要求 |
|------|------|
| 页面切换 | < 300ms，有过渡动画 |
| 点击反馈 | 立即响应（100ms 内） |
| 加载状态 | 骨架屏，不是空白 |
| 手势支持 | 下拉刷新、左滑删除 |

---

## 二、图标系统

### 2.1 图标风格

```
❌ 禁止：简陋线条、不成套、风格混乱
✅ 要求：统一风格、精致填充、成套设计
```

**推荐图标库（按优先级）：**

1. **Phosphor Icons** - 6种风格可选，现代感强
   - https://phosphoricons.com/
   - 风格：Regular / Bold / Fill / Duotone / Light / Thin
   - **推荐使用 Fill 或 Duotone 风格**

2. **Remix Icon** - 2400+ 图标，适合金融App
   - https://remixicon.com/
   - 风格：Line / Fill
   - **推荐使用 Fill 风格**

3. **Lucide** - Feather 升级版，更精致
   - https://lucide.dev/
   - 适合简约高端风格

### 2.2 图标规范

| 规格 | 尺寸 | 用途 |
|------|------|------|
| xs | 16px | 辅助信息、标签 |
| sm | 20px | 列表项、按钮内 |
| md | 24px | Tab栏、菜单项 |
| lg | 32px | 快捷入口、空状态 |
| xl | 48px | 页面焦点、大入口 |

### 2.3 核心图标清单

```
TabBar 图标（需要选中/未选中两态）
├── 首页：home / home-fill
├── 行情：chart / chart-fill
├── 交易：trending-up / trending-up-fill
├── 广场：chat-circle / chat-circle-fill
└── 我的：user / user-fill

功能图标
├── 钱包：wallet
├── 充值：arrow-down-circle
├── 提现：arrow-up-circle
├── 矿池：stack / coins
├── 邀请：gift / user-plus
├── 设置：gear
├── 安全：shield-check
├── 帮助：question-circle
├── 复制：copy
├── 分享：share
├── 扫码：qr-code
├── 搜索：magnifying-glass
├── 筛选：funnel
├── 排序：arrows-down-up
├── 刷新：arrows-clockwise
├── 返回：caret-left
├── 更多：dots-three
└── 关闭：x

交易图标
├── 买入：arrow-up（绿色）
├── 卖出：arrow-down（红色）
├── 看涨：trend-up
├── 看跌：trend-down
├── K线：chart-line
└── 盘口：list-numbers

状态图标
├── 成功：check-circle（绿色）
├── 失败：x-circle（红色）
├── 警告：warning（黄色）
├── 信息：info（蓝色）
├── 待处理：clock
└── 已完成：check
```

---

## 三、卡片设计

### 3.1 卡片层次

```css
/* 一级卡片 - 突出显示 */
.card-primary {
  background: linear-gradient(135deg, #1E2329 0%, #181A20 100%);
  border: 1px solid rgba(240, 185, 11, 0.15);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

/* 二级卡片 - 常规内容 */
.card-secondary {
  background: #1E2329;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

/* 三级卡片 - 列表项 */
.card-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}
```

### 3.2 卡片内容结构

```
┌─────────────────────────────────────────┐
│ [Icon] 标题                    [Action] │  ← 头部
├─────────────────────────────────────────┤
│                                         │
│            主要内容区                    │  ← 内容
│       （数据/图表/列表）                 │
│                                         │
├─────────────────────────────────────────┤
│ 底部操作区 / 辅助信息                    │  ← 底部
└─────────────────────────────────────────┘
```

### 3.3 矿池产品卡片示例

```
┌─────────────────────────────────────────┐
│ ⛏️ 30日矿池                     热门 🔥  │
├─────────────────────────────────────────┤
│                                         │
│     预期收益率                          │
│     ██████████ 可视化进度条             │
│                                         │
│  最低申购     锁定期      已购人数       │
│  1000 AGX    30天        1,234人        │
│                                         │
├─────────────────────────────────────────┤
│          [      立即申购      ]         │
└─────────────────────────────────────────┘
```

---

## 四、数据可视化

### 4.1 实时数据展示

**价格显示：**
```
$2,650.00          ← 大字号、醒目
+$12.50 (+0.47%)   ← 绿色/红色，带背景色块
```

**数据卡片矩阵：**
```
┌─────────┐ ┌─────────┐ ┌─────────┐
│ 24H高   │ │ 24H低   │ │ 24H量   │
│ $2,680  │ │ $2,620  │ │ 1.2M    │
└─────────┘ └─────────┘ └─────────┘
```

### 4.2 图表要求

| 图表 | 库推荐 | 用途 |
|------|--------|------|
| K线图 | Lightweight Charts | 交易页面 |
| 折线图 | Chart.js / ECharts | 收益曲线 |
| 饼图 | Chart.js | 资产分布 |
| 进度环 | 纯 CSS/SVG | 进度展示 |

### 4.3 K线图配置

```javascript
// 配色方案
{
  upColor: '#0ECB81',      // 涨 - 绿
  downColor: '#F6465D',    // 跌 - 红
  wickUpColor: '#0ECB81',
  wickDownColor: '#F6465D',
  borderVisible: false,
  background: { color: 'transparent' },
  gridLines: { color: 'rgba(255,255,255,0.05)' }
}
```

---

## 五、动效规范

### 5.1 过渡动画

```css
/* 快速反馈 - 100ms */
.transition-fast {
  transition: all 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 标准过渡 - 200ms */
.transition-normal {
  transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 页面切换 - 300ms */
.transition-page {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 5.2 常用动效

```css
/* 按钮点击 */
.btn:active {
  transform: scale(0.97);
}

/* 卡片 hover */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* 列表项滑入 */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 数字跳动 */
@keyframes countUp {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 骨架屏闪烁 */
@keyframes skeleton {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}
```

---

## 六、交互规范

### 6.1 点击区域

- 最小点击区域：44px × 44px
- 列表项高度：≥ 56px
- 按钮间距：≥ 12px

### 6.2 加载状态

```
加载中：
├── 骨架屏（首选）
├── Spinner + 文字
└── 进度条（有进度时）

空状态：
├── 精致插图（不是简陋图标）
├── 友好文案
└── 操作引导按钮
```

### 6.3 反馈提示

| 场景 | 方式 |
|------|------|
| 操作成功 | Toast 3秒自动消失 |
| 操作失败 | Toast + 红色 |
| 确认操作 | 底部弹窗（不是 alert） |
| 表单错误 | 输入框下方红字 |

---

## 七、参考对标

### 7.1 必须研究的App

1. **币安 Binance** - 整体框架、交易体验
2. **OKX 欧易** - 首页布局、动效细节
3. **Bybit** - 合约交易、UI细节
4. **Bitget** - 跟单社区、广场设计
5. **Gate.io** - 理财产品、矿池设计

### 7.2 设计灵感

- Dribbble 搜索：Crypto Exchange UI
- Behance 搜索：Trading App Design
- Mobbin：https://mobbin.com/browse/ios/apps

### 7.3 本项目已有设计资源

```
/www/wwwroot/agx/web-h5/                    # H5 原型
├── app.html                                # 主页面模板
├── assets/css/tokens.css                   # 设计令牌 ★
├── assets/css/components.css               # 组件库 ★
├── assets/css/home.css                     # 首页样式
├── assets/css/trade.css                    # 交易页样式
└── assets/css/market.css                   # 行情页样式

/www/wwwroot/agx/frontend-h5/zh-hans.html   # 官网首页
```

---

## 八、开发要求

### 8.1 Vue 组件库推荐

| 库 | 用途 | 说明 |
|----|------|------|
| Vant | 基础组件 | 移动端组件库 |
| @vueuse/core | 工具函数 | 组合式API工具 |
| dayjs | 日期处理 | 轻量时间库 |
| axios | HTTP请求 | 请求库 |
| pinia | 状态管理 | Vue3官方推荐 |

### 8.2 图表库

| 库 | 用途 |
|----|------|
| lightweight-charts | K线图（TradingView出品）|
| chart.js | 折线图、饼图 |
| echarts | 复杂图表 |

### 8.3 图标集成

```bash
# 推荐 Phosphor Icons Vue
npm install @phosphor-icons/vue

# 使用
import { House, ChartLine, Wallet } from '@phosphor-icons/vue'
```

---

## 九、品质检查清单

开发完成后对照检查：

```
[ ] 所有图标是否成套、风格统一？
[ ] 卡片是否有实质内容（非大片空白）？
[ ] 页面切换是否有过渡动画？
[ ] 点击是否有即时反馈？
[ ] 加载状态是否使用骨架屏？
[ ] 空状态是否有精致插图和引导？
[ ] 数字是否等宽显示？
[ ] 涨跌色是否正确（绿涨红跌）？
[ ] 深色模式下对比度是否足够？
[ ] 安全区域是否正确适配？
```

---

**这是一个高端平台，每个像素都要精心设计。宁可慢一点，也要做精致。**
