<template>
  <nav class="tabbar">
    <div class="tabbar-inner">
      <router-link 
        v-for="item in tabs" 
        :key="item.path" 
        :to="item.path" 
        class="tab-item"
        :class="{ active: isActive(item.path) }"
      >
        <div class="tab-icon">
          <img :src="item.icon" :alt="item.label">
        </div>
        <span class="tab-label">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/home', label: '首页', icon: '/src/assets/tabbar/home.png' },
  { path: '/markets', label: '行情', icon: '/src/assets/tabbar/markets.png' },
  { path: '/trade', label: '交易', icon: '/src/assets/tabbar/trade.png' },
  { path: '/square', label: '广场', icon: '/src/assets/tabbar/square.png' },
  { path: '/mine', label: '我的', icon: '/src/assets/tabbar/mine.png' }
]

const isActive = (path) => {
  return route.path === path || (path === '/home' && route.path === '/')
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 428px;
  height: calc(68px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: #1a1c20;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 300;
}

.tabbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 68px;
  width: 100%;
  margin: 0 auto;
  padding: 0 8px;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--text-tertiary);
  text-decoration: none;
  transition: all 150ms ease-out;
  padding: 4px 0;
}

.tab-item:active {
  transform: scale(0.95);
}

.tab-item.active {
  color: var(--color-brand);
}

.tab-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tab-icon img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  transition: all 0.2s ease;
}

.tab-item.active .tab-icon img {
  filter: brightness(1.2) drop-shadow(0 0 4px rgba(201, 169, 98, 0.6));
  transform: scale(1.05);
}

.tab-label {
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
}

.tab-item.active .tab-label {
  color: var(--color-brand);
  text-shadow: 0 0 8px rgba(201, 169, 98, 0.4);
}
</style>
