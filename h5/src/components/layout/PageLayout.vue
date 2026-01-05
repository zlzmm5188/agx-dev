<template>
  <div class="page-layout">
    <!-- 导航标题栏 -->
    <div class="navbar" v-if="showNavbar">
      <div class="navbar-inner">
        <div class="navbar-left" @click="handleBack" v-if="showBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span v-if="backText">{{ backText }}</span>
        </div>
        <div class="navbar-title">{{ title }}</div>
        <div class="navbar-right">
          <slot name="navbar-right"></slot>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="page-main" :class="{ 'has-navbar': showNavbar, 'has-tabbar': showTabbar }">
      <slot></slot>
    </div>

    <!-- 底部操作栏（可选） -->
    <div class="page-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showNavbar: {
    type: Boolean,
    default: true
  },
  showBack: {
    type: Boolean,
    default: true
  },
  backText: {
    type: String,
    default: ''
  },
  showTabbar: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back'])

const handleBack = () => {
  emit('back')
  // 如果没有监听back事件，默认执行router.back()
  if (!emit('back')) {
    router.back()
  }
}
</script>

<style scoped>
.page-layout {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--bg-primary, #0B0E11);
  overflow-x: hidden;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: var(--bg-secondary, #181A20);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  /* iOS 安全区域适配 */
  padding-top: constant(safe-area-inset-top); /* iOS 11.0 */
  padding-top: env(safe-area-inset-top); /* iOS 11.2+ */
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 60px;
  color: var(--color-brand, #F0B90B);
  cursor: pointer;
  font-size: 15px;
}

.navbar-left svg {
  flex-shrink: 0;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary, #EAECEF);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
}

.navbar-right {
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 主内容区域 */
.page-main {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 有导航栏时，预留导航栏空间 */
.page-main.has-navbar {
  padding-top: calc(44px + constant(safe-area-inset-top));
  padding-top: calc(44px + env(safe-area-inset-top));
}

/* 有TabBar时，预留TabBar空间 */
.page-main.has-tabbar {
  padding-bottom: calc(50px + constant(safe-area-inset-bottom));
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
}

/* 底部操作栏 */
.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: var(--bg-secondary, #181A20);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 998;
}
</style>
