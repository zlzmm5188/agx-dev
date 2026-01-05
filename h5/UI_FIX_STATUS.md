# H5 移动端 UI 修复状态

## 已完成的工作

### 1. 核心组件和样式 ✅
- ✅ 创建 `PageLayout.vue` - 标准布局组件，支持固定导航栏和安全区域
- ✅ 创建 `SvgIcon.vue` - SVG 图标组件
- ✅ 创建 `variables.css` - 全局 CSS 变量
- ✅ 创建 `reset-width.css` - 全局宽度重置样式
- ✅ 更新 `main.js` - 导入新样式和全局注册 SvgIcon 组件
- ✅ 配置 `vite.config.js` - 添加 SVG 图标插件配置（待安装依赖后启用）

### 2. 已修复的页面 ✅
- ✅ `Markets.vue` - 行情中心页面已改用 PageLayout 组件

## 待处理事项

### 1. 依赖安装 ⏳
需要在有 npm/pnpm/yarn 的环境中执行：
```bash
cd /data/workspace/agx-dev/h5
npm install vite-plugin-svg-icons fast-glob -D
```

安装完成后，需要在以下文件中取消注释：
- `vite.config.js` 第4-5行和第9-15行
- `main.js` 第9行

### 2. 待修复的页面列表

#### 高优先级（常用功能页面）
- [ ] `Trade.vue` - 交易页面
- [ ] `Mine.vue` - 我的页面
- [ ] `Assets.vue` - 资产页面
- [ ] `Square.vue` - 广场页面
- [ ] `Chat.vue` - 聊天列表
- [ ] `ChatDetail.vue` - 聊天详情

#### 中优先级（功能页面）
- [ ] `IEO.vue` - 新币发行
- [ ] `Earn.vue` - 理财中心
- [ ] `Contract.vue` - 合约交易
- [ ] `Gold.vue` - 黄金交易
- [ ] `OTC.vue` - C2C交易
- [ ] `Mining.vue` - 算力挖矿
- [ ] `Kline.vue` - K线图

#### 低优先级（辅助页面）
- [ ] `Deposit.vue` - 充币
- [ ] `Withdraw.vue` - 提币
- [ ] `Orders.vue` - 订单记录
- [ ] `Security.vue` - 安全中心
- [ ] `Settings.vue` - 设置
- [ ] `KYC.vue` - 身份认证
- [ ] `Invite.vue` - 邀请好友
- [ ] `Notifications.vue` - 通知
- [ ] `Ranking.vue` - 排行榜
- [ ] `AI.vue` - AI分析
- [ ] `Help.vue` - 帮助中心
- [ ] `About.vue` - 关于
- [ ] `UserProfile.vue` - 用户资料
- [ ] `PostDetail.vue` - 帖子详情
- [ ] `CreatePost.vue` - 创建帖子

### 3. 修复步骤模板

每个页面的修复步骤：

1. **替换顶部导航栏结构**：
   - 将自定义的 `<div class="page-header">` 改为 `<PageLayout>` 组件
   - 提取导航栏右侧按钮到 `#navbar-right` 插槽
   - 移除 `.page-content` 的 wrapper div

2. **更新组件导入**：
   ```vue
   import PageLayout from '../components/layout/PageLayout.vue'
   ```

3. **更新模板结构**：
   ```vue
   <template>
     <PageLayout title="页面标题" :show-back="true">
       <template #navbar-right>
         <!-- 右侧按钮 -->
       </template>
       
       <!-- 页面主体内容 -->
     </PageLayout>
   </template>
   ```

4. **检查和移除冗余样式**：
   - 删除自定义的 `.page-header` 样式
   - 删除固定定位相关的 CSS
   - 依赖全局样式 `reset-width.css` 和 `variables.css`

### 4. 图标优化计划

当依赖安装完成后：

1. **收集图标资源**：
   - 从现有页面提取内联 SVG
   - 转换为独立的 `.svg` 文件
   - 存放在 `src/assets/icons/` 目录

2. **替换内联 SVG**：
   - 将 `<svg>...</svg>` 替换为 `<SvgIcon name="icon-name" />`
   - 统一图标大小和颜色

3. **图标命名规范**：
   - `arrow-left.svg` - 返回箭头
   - `bell.svg` - 通知
   - `settings.svg` - 设置
   - `star.svg` - 收藏
   - 等等...

## 设计规范参考

### 页面宽度
- 全屏宽度：`100vw`
- 内容区域：`padding: 0 16px`（使用 `var(--page-padding)`）
- 最小宽度：`320px`

### 导航栏
- 高度：`44px`（`var(--navbar-height)`）
- 背景色：`var(--bg-secondary)`
- 安全区域：`padding-top: var(--safe-area-top)`

### TabBar
- 高度：`50px`（`var(--tabbar-height)`）
- 背景色：`var(--bg-secondary)`
- 安全区域：`padding-bottom: var(--safe-area-bottom)`

### 颜色系统
- 品牌色：`var(--color-brand)` (#F0B90B)
- 涨色：`var(--color-up)` (#0ECB81)
- 跌色：`var(--color-down)` (#F6465D)
- 主背景：`var(--bg-primary)` (#0B0E11)
- 次背景：`var(--bg-secondary)` (#181A20)
- 主文字：`var(--text-primary)` (#EAECEF)
- 次文字：`var(--text-secondary)` (#848E9C)

## 下一步操作

1. 安装必要的依赖包
2. 按优先级依次修复页面
3. 测试每个页面的显示效果
4. 确保在 iOS 和 Android 上的适配正确
5. 验证所有页面宽度统一、标题栏位置正确

## 注意事项

- 首页（Home.vue）保持不变，因为设计文档说明首页是正常的
- 所有修改都要保持响应式设计
- 确保安全区域适配在所有设备上正确工作
- 使用 CSS 变量而不是硬编码值
- 保持代码风格统一
