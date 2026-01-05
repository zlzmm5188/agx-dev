<template>
  <div id="app">
    <AppHeader v-if="showHeader" />
    <div class="app-content" :class="{ 'with-header': showHeader, 'with-tabbar': showTabBar }">
      <router-view />
    </div>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import TabBar from './components/TabBar.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    TabBar
  },
  setup() {
    const route = useRoute()
    
    // 不显示全局标题栏的页面（这些页面有自己的标题栏或用户头部）
    const showHeader = computed(() => {
      // 首页和主Tab页面不显示全局标题栏
      const hiddenPages = ['/', '/home', '/markets', '/trade', '/earn', '/mine', '/square', '/post/create', '/login', '/register', '/kline', '/ieo', '/gold', '/contract', '/deposit', '/withdraw', '/mining', '/assets', '/about', '/help', '/ai']
      // 动态路由页面不显示
      const hiddenPaths = ['/chat/', '/user/', '/post/']
      if (hiddenPages.includes(route.path)) return false
      if (hiddenPaths.some(p => route.path.startsWith(p) && route.path !== p.slice(0, -1))) return false
      return true
    })
    
    // 主要页面显示底部导航
    const showTabBar = computed(() => {
      return route.meta.tabBar === true
    })
    
    return {
      showHeader,
      showTabBar
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  overflow: hidden;
}

body {
  font-family: var(--font-family);
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 隐藏滚动条 */
html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
}

html,
body {
  scrollbar-width: none;
}

#app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 内容区域 */
.app-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.app-content.with-header {
  top: 56px;
  height: calc(100vh - 56px);
}

.app-content.with-tabbar {
  bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  height: calc(100vh - 64px - env(safe-area-inset-bottom, 0px));
}

.app-content.with-header.with-tabbar {
  top: 56px;
  bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  height: calc(100vh - 56px - 64px - env(safe-area-inset-bottom, 0px));
}

/* 移动端滚动优化 */
* {
  -webkit-overflow-scrolling: touch;
}

/* 移动端点击优化 */
button, a, [role="button"] {
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

/* 移动端输入框优化 */
input, textarea {
  -webkit-appearance: none;
  appearance: none;
}
</style>