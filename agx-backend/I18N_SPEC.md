# AGX 多语言开发规范

> **重要：从第一天就要按多语言架构开发！后期新增非常麻烦！**

---

## 一、支持语言

| 代码 | 语言 | 说明 |
|------|------|------|
| zh-CN | 简体中文 | 默认语言 |
| zh-TW | 繁体中文 | 港澳台用户 |
| en | English | 国际用户 |
| ja | 日本語 | 日本用户 |
| ko | 한국어 | 韩国用户 |
| th | ไทย | 泰国用户 |
| vi | Tiếng Việt | 越南用户 |

---

## 二、技术方案

### 2.1 安装依赖

```bash
npm install vue-i18n@9
```

### 2.2 目录结构

```
src/
├── locales/
│   ├── index.ts              # i18n 配置
│   ├── zh-CN/                # 简体中文
│   │   ├── common.json       # 通用文案
│   │   ├── auth.json         # 登录注册
│   │   ├── home.json         # 首页
│   │   ├── market.json       # 行情
│   │   ├── trade.json        # 交易
│   │   ├── pool.json         # 矿池
│   │   ├── wallet.json       # 钱包
│   │   ├── user.json         # 用户中心
│   │   ├── square.json       # 广场
│   │   └── otc.json          # OTC
│   ├── zh-TW/
│   │   └── ... (同上)
│   ├── en/
│   │   └── ... (同上)
│   └── ...
```

### 2.3 配置文件

```typescript
// src/locales/index.ts
import { createI18n } from 'vue-i18n'

// 导入语言包
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import en from './en'

// 获取默认语言
function getDefaultLocale(): string {
  // 1. 优先读取本地存储
  const saved = localStorage.getItem('locale')
  if (saved) return saved
  
  // 2. 浏览器语言
  const browserLang = navigator.language
  if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK')) {
    return 'zh-TW'
  }
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  if (browserLang.startsWith('en')) {
    return 'en'
  }
  
  // 3. 默认简体中文
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false,           // 使用 Composition API
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en': en,
  }
})

export default i18n

// 切换语言函数
export function setLocale(locale: string) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}
```

### 2.4 main.ts 注册

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './locales'

const app = createApp(App)
app.use(i18n)
app.mount('#app')
```

---

## 三、语言文件格式

### 3.1 JSON 结构

```json
// src/locales/zh-CN/common.json
{
  "app": {
    "name": "AGX Exchange",
    "slogan": "升达数字资本"
  },
  "nav": {
    "home": "首页",
    "market": "行情",
    "trade": "交易",
    "square": "广场",
    "user": "我的"
  },
  "action": {
    "confirm": "确认",
    "cancel": "取消",
    "submit": "提交",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑",
    "copy": "复制",
    "copied": "已复制",
    "loading": "加载中...",
    "retry": "重试",
    "refresh": "刷新"
  },
  "status": {
    "success": "成功",
    "failed": "失败",
    "pending": "处理中",
    "completed": "已完成",
    "cancelled": "已取消"
  },
  "error": {
    "network": "网络错误，请重试",
    "unknown": "未知错误",
    "timeout": "请求超时"
  },
  "empty": {
    "data": "暂无数据",
    "record": "暂无记录"
  }
}
```

```json
// src/locales/zh-CN/auth.json
{
  "login": {
    "title": "登录",
    "username": "用户名",
    "password": "密码",
    "submit": "登录",
    "noAccount": "还没有账号？",
    "register": "立即注册"
  },
  "register": {
    "title": "注册",
    "username": "用户名",
    "password": "密码",
    "confirmPassword": "确认密码",
    "inviteCode": "邀请码",
    "submit": "注册",
    "hasAccount": "已有账号？",
    "login": "立即登录"
  },
  "validation": {
    "usernameRequired": "请输入用户名",
    "usernameFormat": "用户名4-20位，只能包含字母数字下划线",
    "passwordRequired": "请输入密码",
    "passwordFormat": "密码8-20位",
    "passwordMismatch": "两次密码不一致",
    "inviteCodeRequired": "请输入邀请码"
  }
}
```

```json
// src/locales/en/auth.json
{
  "login": {
    "title": "Login",
    "username": "Username",
    "password": "Password",
    "submit": "Login",
    "noAccount": "Don't have an account?",
    "register": "Register Now"
  },
  "register": {
    "title": "Register",
    "username": "Username",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "inviteCode": "Invite Code",
    "submit": "Register",
    "hasAccount": "Already have an account?",
    "login": "Login Now"
  },
  "validation": {
    "usernameRequired": "Please enter username",
    "usernameFormat": "Username 4-20 characters, letters/numbers/underscore only",
    "passwordRequired": "Please enter password",
    "passwordFormat": "Password 8-20 characters",
    "passwordMismatch": "Passwords do not match",
    "inviteCodeRequired": "Please enter invite code"
  }
}
```

---

## 四、使用方式

### 4.1 模板中使用

```vue
<template>
  <!-- 基础用法 -->
  <h1>{{ $t('auth.login.title') }}</h1>
  
  <!-- 带参数 -->
  <p>{{ $t('welcome.greeting', { name: user.name }) }}</p>
  
  <!-- 复数形式 -->
  <span>{{ $t('items.count', count) }}</span>
  
  <!-- 属性绑定 -->
  <input :placeholder="$t('auth.login.username')">
  
  <!-- v-t 指令 -->
  <span v-t="'common.action.confirm'"></span>
</template>
```

### 4.2 JS/TS 中使用

```typescript
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t, locale } = useI18n()
    
    // 获取翻译
    const message = t('auth.login.title')
    
    // 带参数
    const greeting = t('welcome.greeting', { name: 'John' })
    
    // 切换语言
    function changeLanguage(lang: string) {
      locale.value = lang
      localStorage.setItem('locale', lang)
    }
    
    return { message, changeLanguage }
  }
}
```

### 4.3 在 Pinia Store 中使用

```typescript
import { useI18n } from 'vue-i18n'

export const useUserStore = defineStore('user', () => {
  const { t } = useI18n()
  
  function showError(code: string) {
    // 根据错误码获取翻译
    return t(`error.${code}`)
  }
  
  return { showError }
})
```

---

## 五、开发规则

### 5.1 绝对禁止

```vue
<!-- ❌ 禁止：硬编码中文 -->
<button>登录</button>
<span>暂无数据</span>
<p>网络错误，请重试</p>

<!-- ❌ 禁止：模板字符串拼接 -->
<span>{{ `欢迎 ${user.name}` }}</span>
```

### 5.2 正确做法

```vue
<!-- ✅ 正确：使用 $t -->
<button>{{ $t('auth.login.submit') }}</button>
<span>{{ $t('common.empty.data') }}</span>
<p>{{ $t('common.error.network') }}</p>

<!-- ✅ 正确：带参数 -->
<span>{{ $t('welcome.greeting', { name: user.name }) }}</span>
```

### 5.3 特殊情况

```typescript
// 日期格式化 - 需要国际化
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'

dayjs.locale(locale.value === 'zh-CN' ? 'zh-cn' : 'en')

// 数字格式化 - 使用 Intl
const formatter = new Intl.NumberFormat(locale.value, {
  style: 'currency',
  currency: 'USD'
})
```

---

## 六、语言切换 UI

### 6.1 语言选择器组件

```vue
<!-- components/LanguageSelector.vue -->
<template>
  <div class="lang-selector" @click="showPicker = true">
    <span class="lang-current">{{ currentLangName }}</span>
    <span class="lang-arrow">▼</span>
  </div>
  
  <!-- 底部弹窗选择 -->
  <van-popup v-model:show="showPicker" position="bottom">
    <div class="lang-list">
      <div 
        v-for="lang in languages" 
        :key="lang.code"
        class="lang-item"
        :class="{ active: lang.code === currentLocale }"
        @click="selectLanguage(lang.code)"
      >
        <span class="lang-name">{{ lang.name }}</span>
        <span v-if="lang.code === currentLocale" class="lang-check">✓</span>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/locales'

const { locale } = useI18n()
const showPicker = ref(false)

const languages = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'th', name: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt' },
]

const currentLocale = computed(() => locale.value)
const currentLangName = computed(() => 
  languages.find(l => l.code === locale.value)?.name || '简体中文'
)

function selectLanguage(code: string) {
  setLocale(code)
  showPicker.value = false
}
</script>
```

### 6.2 放置位置

- **登录页**：右上角
- **我的页面**：菜单项 "语言 / Language"

---

## 七、翻译工作流

### 7.1 开发流程

1. 开发时先写中文 key
2. 完成一个模块后，整理语言文件
3. 导出给翻译人员
4. 导入翻译结果

### 7.2 翻译文件管理

```
第一阶段：先做中文 + 英文
第二阶段：补充日韩泰越
```

### 7.3 后续添加语言

```bash
# 新增语言只需：
# 1. 在 src/locales/ 下新建语言目录
# 2. 复制 zh-CN 的文件结构
# 3. 翻译内容
# 4. 在 index.ts 中注册
```

---

## 八、检查清单

开发时对照检查：

```
[ ] 所有界面文字是否使用 $t() ？
[ ] 是否有硬编码的中文字符串？
[ ] 日期/时间格式是否国际化？
[ ] 数字格式是否国际化？
[ ] 错误提示是否国际化？
[ ] 空状态文案是否国际化？
[ ] 按钮文字是否国际化？
[ ] 表单验证提示是否国际化？
[ ] placeholder 是否国际化？
```

---

**从第一行代码就要遵守多语言规范！**
