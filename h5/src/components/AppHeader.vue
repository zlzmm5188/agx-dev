<template>
  <header v-if="showHeader" class="app-header">
    <button v-if="showBack" class="header-back" @click="handleBack">
      <Icon name="arrowLeft" :size="20" color="var(--text-secondary)" stroke-width="medium" />
    </button>
    <div v-else class="header-placeholder"></div>
    
    <!-- Trade页面特殊标题 -->
    <div v-if="route.path === '/trade'" class="header-trade-info">
      <span class="trade-pair-text">{{ tradePair.base }}<small>/{{ tradePair.quote }}</small></span>
      <Icon name="arrowDown" :size="12" color="var(--text-tertiary)" stroke-width="medium" />
    </div>
    <h1 v-else class="header-title">{{ title }}</h1>
    
    <div class="header-actions">
      <slot name="actions">
        <!-- Trade页面的操作按钮 -->
        <template v-if="route.path === '/trade'">
          <button class="header-action-btn">
            <Icon name="chartPolyline" :size="18" color="currentColor" stroke-width="regular" />
          </button>
          <button class="header-action-btn">
            <Icon name="more" :size="18" color="currentColor" stroke-width="medium" />
          </button>
        </template>
      </slot>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from './Icon.vue'

const route = useRoute()
const router = useRouter()

// 交易对信息
const tradePair = computed(() => {
  const pair = route.query.pair || 'BTC_USDT'
  const [base, quote] = pair.split('_')
  return { base: base || 'BTC', quote: quote || 'USDT' }
})

// 根据路由获取标题，优先使用 route.meta.title
const title = computed(() => {
  if (route.meta?.title) {
    return route.meta.title
  }
  const titles = {
    '/': '首页',
    '/home': '首页',
    '/markets': '行情',
    '/trade': '交易',
    '/square': '广场',
    '/mine': '我的',
    '/earn': '理财中心',
    '/ieo': '新币发行',
    '/gold': '黄金交易',
    '/deposit': '充币',
    '/withdraw': '提币',
    '/settings': '设置'
  }
  return titles[route.path] || '首页'
})

// 判断是否显示标题栏（首页不显示，有自己page-header的页面也不显示）
const showHeader = computed(() => {
  const homePages = ['/', '/home']
  const customHeaderPages = [
    '/contract', '/gold', '/ieo', '/mining', '/ai', '/about', '/help',
    '/invite', '/kyc', '/notifications', '/orders', '/otc', '/ranking',
    '/security', '/settings', '/chat', '/assets', '/earn'
  ]
  return !homePages.includes(route.path) && !customHeaderPages.includes(route.path)
})

// 判断是否显示返回按钮
const showBack = computed(() => {
  const mainPages = ['/', '/home', '/markets', '/trade', '/square', '/mine']
  return !mainPages.includes(route.path)
})

const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 428px;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: linear-gradient(180deg, rgba(18, 20, 24, 0.98) 0%, rgba(14, 16, 19, 0.95) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 200;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-back {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.header-back:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.08);
}

.header-placeholder {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  padding: 0 12px;
}

.header-actions {
  min-width: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.header-actions:empty {
  width: 36px;
}

/* Trade页面特殊样式 */
.header-trade-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.trade-pair-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.trade-pair-text small {
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 400;
}

.header-trade-info svg {
  color: var(--text-tertiary);
}

.header-action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  transition: all 0.15s ease;
}

.header-action-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.08);
}
</style>
