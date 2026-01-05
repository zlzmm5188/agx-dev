<template>
  <PageLayout title="安全中心" :show-back="true">
    <div class="page-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span class="loading-text">加载中...</span>
      </div>

      <!-- 安全评分 -->
      <div v-else class="security-score">
        <div class="score-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#2B3139" stroke-width="8" fill="none"/>
            <circle 
              cx="50" cy="50" r="45" 
              stroke="url(#scoreGrad)" 
              stroke-width="8" 
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="`${score * 2.83} 283`"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0ECB81"/>
                <stop offset="100%" stop-color="#C9A962"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="score-text">
            <span class="score-value">{{ score }}</span>
            <span class="score-label">安全分</span>
          </div>
        </div>
        <div class="score-info">
          <span class="score-level" :class="scoreLevel">{{ scoreLevelText }}</span>
          <span class="score-tip">完成更多安全设置可提升安全等级</span>
        </div>
      </div>

      <!-- 安全设置列表 -->
      <div v-if="!loading" class="security-list">
        <div class="security-item" v-for="item in securityItems" :key="item.key" @click="handleSecurityItem(item)">
          <div class="item-left">
            <div :class="['item-icon', item.status ? 'active' : '']">
              <Icon :name="item.icon" :size="20" color="currentColor" stroke-width="medium" />
            </div>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-desc">{{ item.desc }}</span>
            </div>
          </div>
          <div class="item-right">
            <span v-if="item.status" class="status-tag success">已设置</span>
            <span v-else class="status-tag warning">未设置</span>
            <Icon name="chevronRight" :size="16" color="currentColor" stroke-width="medium" />
          </div>
        </div>
      </div>

      <!-- 安全记录 -->
      <div v-if="!loading" class="security-logs">
        <div class="section-header">
          <span class="section-title">安全记录</span>
          <button class="view-all" @click="viewAllLogs">查看全部</button>
        </div>
        <div class="log-list">
          <div v-for="log in securityLogs" :key="log.id" class="log-item">
            <div class="log-icon" :class="log.type">
              <Icon v-if="log.type === 'login'" name="arrowRight" :size="16" color="currentColor" stroke-width="medium" />
              <Icon v-else-if="log.type === 'password'" name="lockIcon" :size="16" color="currentColor" stroke-width="medium" />
              <Icon v-else name="shield" :size="16" color="currentColor" stroke-width="medium" />
            </div>
            <div class="log-info">
              <span class="log-title">{{ log.title }}</span>
              <span class="log-detail">{{ log.detail }}</span>
            </div>
            <span class="log-time">{{ formatTime(log.time) }}</span>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Icon from '../components/Icon.vue'
import PageLayout from '../components/layout/PageLayout.vue'

const loading = ref(true)
const score = ref(0)

const scoreLevel = computed(() => {
  if (score.value >= 80) return 'high'
  if (score.value >= 50) return 'medium'
  return 'low'
})

const scoreLevelText = computed(() => {
  if (score.value >= 80) return '安全等级高'
  if (score.value >= 50) return '安全等级中'
  return '安全等级低'
})

const securityItems = ref([
  {
    key: 'password',
    name: '登录密码',
    desc: '用于登录账户',
    icon: 'lockIcon',
    status: true
  },
  {
    key: 'phone',
    name: '手机绑定',
    desc: '已绑定 138****8888',
    icon: 'phoneDevice',
    status: true
  },
  {
    key: 'email',
    name: '邮箱绑定',
    desc: '用于接收安全通知',
    icon: 'mailBox',
    status: false
  },
  {
    key: 'google',
    name: 'Google验证',
    desc: '提现、交易二次验证',
    icon: 'shield',
    status: false
  },
  {
    key: 'trade',
    name: '交易密码',
    desc: '用于资产操作验证',
    icon: 'target',
    status: true
  },
  {
    key: 'antiPhishing',
    name: '防钓鱼码',
    desc: '识别官方邮件',
    icon: 'eye',
    status: false
  }
])

const securityLogs = ref([
  {
    id: 1,
    type: 'login',
    title: '登录成功',
    detail: 'iPhone 15 Pro · 北京市',
    time: '今天 10:30'
  },
  {
    id: 2,
    type: 'password',
    title: '修改登录密码',
    detail: '密码已更新',
    time: '2025-12-28'
  },
  {
    id: 3,
    type: 'login',
    title: '登录成功',
    detail: 'Chrome · 上海市',
    time: '2025-12-25'
  }
])

const handleSecurityItem = (item) => {
  // 根据不同的安全项跳转到对应设置页
  const routeMap = {
    password: '/security/password',
    phone: '/security/phone',
    email: '/security/email',
    google: '/security/google-auth',
    trade: '/security/trade-password',
    antiPhishing: '/security/anti-phishing'
  }
  console.log(`跳转到: ${routeMap[item.key]}`, item)
  // TODO: 接入路由跳转
  // router.push(routeMap[item.key])
}

const viewAllLogs = () => {
  // 跳转到安全记录详情页
  console.log('查看全部安全记录')
  // TODO: 接入路由跳转
  // router.push('/security/logs')
}

// 格式化时间为相对时间
const formatTime = (timeStr) => {
  if (timeStr.includes('今天')) return timeStr
  
  const now = new Date()
  const time = new Date(timeStr)
  const diff = now - time
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return timeStr
}

// 加载安全数据
const loadSecurityData = async () => {
  loading.value = true
  try {
    // TODO: 调用后端 API 获取安全数据
    // const response = await fetch('/api/user/security')
    // const data = await response.json()
    
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 设置安全评分（带动画效果）
    score.value = 65
    
    // TODO: 更新 securityItems 和 securityLogs
    // securityItems.value = data.items
    // securityLogs.value = data.logs
  } catch (error) {
    console.error('加载安全数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadSecurityData()
})
</script>

<style scoped>
.security-page {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

/* 固定顶部栏 */
.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  padding-top: max(12px, env(safe-area-inset-top));
  background: linear-gradient(180deg, #1e2228 0%, #181a20 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #848e9c;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-right: 12px;
}

.back-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin: 0;
}

.header-actions { display: flex; gap: 8px; }

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar { display: none; }
.page-content { scrollbar-width: none; }

.security-score {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: #1e2329;
  border-radius: 18px;
  margin-bottom: 16px;
}

.score-circle {
  position: relative;
  width: 100px;
  height: 100px;
}

.score-circle svg {
  width: 100%;
  height: 100%;
}

.score-circle svg circle:last-of-type {
  transition: stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #eaecef;
}

.score-label {
  font-size: 11px;
  color: #5e6673;
}

.score-info { flex: 1; }

.score-level {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}

.score-level.high { background: rgba(14, 203, 129, 0.15); color: #0ECB81; }
.score-level.medium { background: rgba(240, 185, 11, 0.15); color: #F0B90B; }
.score-level.low { background: rgba(246, 70, 93, 0.15); color: #F6465D; }

.score-tip {
  display: block;
  font-size: 12px;
  color: #5e6673;
}

.security-list {
  background: #1e2329;
  border-radius: 16px;
  margin-bottom: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  cursor: pointer;
}

.security-item:last-child { border-bottom: none; }

.security-item:active {
  background: rgba(255, 255, 255, 0.04);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #2B3139;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5e6673;
}

.item-icon.active {
  background: rgba(14, 203, 129, 0.15);
  color: #0ECB81;
}

.item-info { display: flex; flex-direction: column; gap: 4px; }

.item-name {
  font-size: 14px;
  color: #eaecef;
}

.item-desc {
  font-size: 12px;
  color: #5e6673;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
}

.status-tag.success { background: rgba(14, 203, 129, 0.15); color: #0ECB81; }
.status-tag.warning { background: rgba(246, 70, 93, 0.15); color: #F6465D; }

.item-right > svg { color: #5e6673; }

.security-logs { margin-bottom: 16px; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #eaecef;
}

.view-all {
  font-size: 12px;
  color: #848e9c;
  background: none;
  border: none;
  cursor: pointer;
}

.log-list {
  background: #1e2329;
  border-radius: 14px;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.log-item:last-child { border-bottom: none; }

.log-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-icon.login { background: rgba(96, 165, 250, 0.15); color: #60A5FA; }
.log-icon.password { background: rgba(168, 85, 247, 0.15); color: #A855F7; }

.log-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }

.log-title { font-size: 14px; color: #eaecef; }
.log-detail { font-size: 12px; color: #5e6673; }

.log-time {
  font-size: 12px;
  color: #5e6673;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #F0B90B;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #848e9c;
}
</style>
