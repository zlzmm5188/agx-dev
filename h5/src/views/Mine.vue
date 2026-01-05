<template>
  <div class="mine-page">
    <!-- 固定顶部栏 -->
    <div class="user-header">
      <div class="user-row" @click="goToProfile">
        <div class="user-avatar">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="avatar">
          <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0114 0v2"/>
          </svg>
        </div>
        <div class="user-info">
          <div class="user-name-row">
            <span class="user-name">{{ userInfo.isLoggedIn ? userInfo.username : '未登录' }}</span>
            <span v-if="userInfo.isLoggedIn && userInfo.vipLevel > 0" class="vip-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              VIP {{ userInfo.vipLevel }}
            </span>
          </div>
          <span class="user-id">{{ userInfo.isLoggedIn ? `UID: ${userInfo.userId}` : '点击登录/注册' }}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-icon">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
      <div class="header-actions">
        <button class="header-btn" @click="$router.push('/notifications')">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="notificationCount > 0" class="badge">{{ notificationCount > 99 ? '99+' : notificationCount }}</span>
        </button>
        <router-link to="/settings" class="header-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </router-link>
      </div>
    </div>

    <!-- 可滚动内容区 -->
    <div class="page-content">
    <!-- 资产卡片 -->

    <div class="asset-card">
      <div class="asset-header">
        <span class="asset-label">总资产估值 (USDT)</span>
        <button class="asset-eye" @click="toggleHide">
          <svg v-if="!hideAssets" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </button>
      </div>
      <div class="asset-main">
        <span class="asset-value">{{ formatNumber(assetInfo.totalValue) }}</span>
        <span class="asset-change" :class="assetInfo.changePercent >= 0 ? 'up' : 'down'">{{ formatPercent(assetInfo.changePercent) }}</span>
      </div>
      <div class="asset-sub">≈ ￥{{ formatNumber(assetInfo.totalValueCNY) }}</div>
      
      <!-- 资产分布 -->
      <div class="asset-breakdown">
        <div class="breakdown-item">
          <span class="bd-label">现货</span>
          <span class="bd-value">{{ formatNumber(assetInfo.spot) }}</span>
        </div>
        <div class="breakdown-item">
          <span class="bd-label">理财</span>
          <span class="bd-value">{{ formatNumber(assetInfo.earn) }}</span>
        </div>
        <div class="breakdown-item">
          <span class="bd-label">合约</span>
          <span class="bd-value">{{ formatNumber(assetInfo.contract) }}</span>
        </div>
      </div>
      
      <div class="asset-actions">
        <router-link to="/deposit" class="asset-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 18h14"/></svg>
          充币
        </router-link>
        <router-link to="/withdraw" class="asset-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21V9M7 14l5-5 5 5"/><path d="M5 6h14"/></svg>
          提币
        </router-link>
        <router-link to="/assets" class="asset-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
          资产
        </router-link>
        <router-link to="/trade" class="asset-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l4-4 4 3 7-8"/><path d="M14 8h6v6"/></svg>
          交易
        </router-link>
      </div>
    </div>

    <!-- 快捷功能 -->
    <div class="quick-features">
      <div class="feature-item" @click="$router.push('/earn')">
        <div class="feature-icon earn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6"/>
          </svg>
        </div>
        <div class="feature-text">
          <span class="feature-name">理财中心</span>
          <span class="feature-desc">稳健收益</span>
        </div>
      </div>
      <div class="feature-item" @click="$router.push('/ieo')">
        <div class="feature-icon ieo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="feature-text">
          <span class="feature-name">新币中心</span>
          <span class="feature-desc">AGX首发</span>
        </div>
      </div>
      <div class="feature-item" @click="$router.push('/otc')">
        <div class="feature-icon otc">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
          </svg>
        </div>
        <div class="feature-text">
          <span class="feature-name">买币</span>
          <span class="feature-desc">C2C交易</span>
        </div>
      </div>
      <div class="feature-item" @click="$router.push('/ranking')">
        <div class="feature-icon rank">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="feature-text">
          <span class="feature-name">排行榜</span>
          <span class="feature-desc">TOP100</span>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-group">
        <div class="menu-group-title">账户服务</div>
        <router-link to="/orders" class="menu-item">
          <div class="menu-icon orders-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
          </div>
          <span class="menu-title">订单记录</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-arrow"><path d="M9 18l6-6-6-6"/></svg>
        </router-link>
        <router-link to="/security" class="menu-item">
          <div class="menu-icon security-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span class="menu-title">安全中心</span>
          <span class="menu-status" :class="userInfo.securityLevel >= 3 ? 'safe' : 'warning'">{{ getSecurityText() }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-arrow"><path d="M9 18l6-6-6-6"/></svg>
        </router-link>
        <router-link to="/kyc" class="menu-item">
          <div class="menu-icon kyc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/>
            </svg>
          </div>
          <span class="menu-title">身份认证</span>
          <span class="menu-status" :class="userInfo.kycStatus === 2 ? 'safe' : 'warning'">{{ getKycStatusText() }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-arrow"><path d="M9 18l6-6-6-6"/></svg>
        </router-link>
      </div>

      <div class="menu-group">
        <div class="menu-group-title">更多服务</div>
        <router-link to="/invite" class="menu-item highlight">
          <div class="menu-icon invite-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <span class="menu-title">邀请好友</span>
          <span class="menu-extra brand">赚佣金</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-arrow"><path d="M9 18l6-6-6-6"/></svg>
        </router-link>
        <router-link to="/mining" class="menu-item">
          <div class="menu-icon mining-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <span class="menu-title">算力挖矿</span>
          <span class="menu-extra hot">热门</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-arrow"><path d="M9 18l6-6-6-6"/></svg>
        </router-link>
        <router-link to="/help" class="menu-item">
          <div class="menu-icon help-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
            </svg>
          </div>
          <span class="menu-title">帮助中心</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-arrow"><path d="M9 18l6-6-6-6"/></svg>
        </router-link>
        <router-link to="/about" class="menu-item">
          <div class="menu-icon about-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <span class="menu-title">关于我们</span>
          <span class="menu-extra">v2.0.0</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-arrow"><path d="M9 18l6-6-6-6"/></svg>
        </router-link>
      </div>
    </div>

    <!-- 登录按钮 -->
    <div class="login-section" v-if="!userInfo.isLoggedIn">
      <router-link to="/login" class="login-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
        </svg>
        登录
      </router-link>
      <router-link to="/register" class="register-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/>
        </svg>
        注册
      </router-link>
    </div>
    
    <!-- 底部版权信息 -->
    <div class="footer-info">
      <p class="copyright">Ascenda © 2024</p>
      <p class="version">Version 2.0.0</p>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { api } from '../utils/api'

const router = useRouter()

const userStore = useUserStore()
const hideAssets = ref(false)

// 用户信息
const userInfo = reactive({
  isLoggedIn: false,
  username: '',
  avatar: '',
  vipLevel: 0,
  userId: '',
  kycStatus: 0, // 0: 未认证, 1: 认证中, 2: 已认证
  securityLevel: 0 // 安全等级
})

// 资产信息
const assetInfo = reactive({
  totalValue: 0,
  totalValueCNY: 0,
  changePercent: 0,
  spot: 0,
  earn: 0,
  contract: 0,
  loading: false
})

// 通知数量
const notificationCount = ref(0)

// API调用函数
const fetchUserInfo = async () => {
  try {
    const response = await api.get('/api/user/profile')
    if (response.success) {
      Object.assign(userInfo, {
        isLoggedIn: true,
        username: response.data.username,
        avatar: response.data.avatar,
        vipLevel: response.data.vipLevel,
        userId: response.data.userId,
        kycStatus: response.data.kycStatus,
        securityLevel: response.data.securityLevel
      })
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const fetchAssetInfo = async () => {
  if (!userInfo.isLoggedIn) return
  
  assetInfo.loading = true
  try {
    const response = await api.get('/api/asset/overview')
    if (response.success) {
      Object.assign(assetInfo, {
        totalValue: response.data.totalValue,
        totalValueCNY: response.data.totalValueCNY,
        changePercent: response.data.changePercent,
        spot: response.data.spot,
        earn: response.data.earn,
        contract: response.data.contract
      })
    }
  } catch (error) {
    console.error('获取资产信息失败:', error)
  } finally {
    assetInfo.loading = false
  }
}

const fetchNotificationCount = async () => {
  try {
    const response = await api.get('/api/notification/unread-count')
    if (response.success) {
      notificationCount.value = response.data.count
    }
  } catch (error) {
    console.error('获取通知数量失败:', error)
  }
}

// 切换资产显示/隐藏
const toggleHide = () => {
  hideAssets.value = !hideAssets.value
}

// 格式化数字
const formatNumber = (num) => {
  if (hideAssets.value) return '****'
  return parseFloat(num || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 格式化百分比
const formatPercent = (percent) => {
  if (hideAssets.value) return '****'
  const value = parseFloat(percent || 0)
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

// 获取KYC状态文本
const getKycStatusText = () => {
  switch (userInfo.kycStatus) {
    case 0: return '未认证'
    case 1: return '认证中'
    case 2: return '已认证'
    default: return '未认证'
  }
}

// 获取安全等级文本
const getSecurityText = () => {
  return userInfo.securityLevel >= 3 ? '安全' : '风险'
}

// 跳转到个人资料
const goToProfile = () => {
  if (userInfo.isLoggedIn) {
    router.push(`/user/${userInfo.userId}`)
  } else {
    router.push('/login')
  }
}

let refreshTimer = null

onMounted(async () => {
  // 检查登录状态
  const token = localStorage.getItem('token')
  if (token) {
    await fetchUserInfo()
    await fetchAssetInfo()
  }
  
  // 获取通知数量（无论是否登录）
  await fetchNotificationCount()
  
  // 定期刷新资产信息（如果已登录）
  if (userInfo.isLoggedIn) {
    refreshTimer = setInterval(() => {
      fetchAssetInfo()
      fetchNotificationCount()
    }, 30000) // 每30秒刷新
  }
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>

/* 页面容器 */
.mine-page {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* 可滚动内容区 */
.page-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  background: var(--bg-primary);
}

.page-content::-webkit-scrollbar {
  display: none;
}

/* 固定顶部栏 */
.user-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(26, 30, 37, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 10;
  padding-top: max(14px, env(safe-area-inset-top));
}

.user-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  cursor: pointer;
}

.user-row .arrow-icon {
  color: var(--text-tertiary);
  margin-left: auto;
}

.user-avatar {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #C9A962 0%, #8B7355 100%);
  border: 2px solid rgba(201, 169, 98, 0.3);
  border-radius: 50%;
  color: #fff;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.vip-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
  color: var(--color-brand);
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.2) 0%, rgba(201, 169, 98, 0.1) 100%);
  border: 1px solid rgba(201, 169, 98, 0.3);
  border-radius: 10px;
}

.vip-badge svg {
  color: var(--color-brand);
}

.user-id {
  font-size: 13px;
  color: var(--text-tertiary);
}

.header-actions {
  display: flex;
  gap: 4px;
}

.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  position: relative;
  background: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}

.header-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  background: var(--color-down);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 资产卡片 */
.asset-card {
  margin: 0 16px 20px;
  padding: 20px;
  background: linear-gradient(165deg, rgba(201, 169, 98, 0.08) 0%, rgba(30, 35, 45, 0.6) 100%);
  border: 1px solid rgba(201, 169, 98, 0.12);
  border-radius: 16px;
  color: var(--text-primary);
}

.asset-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.asset-label {
  font-size: 13px;
  color: var(--text-tertiary);
}

.asset-eye {
  color: var(--text-tertiary);
  background: none;
  border: none;
  padding: 4px;
  -webkit-tap-highlight-color: transparent;
}

.asset-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.asset-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.asset-change {
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-mono);
}

.asset-change.up { color: var(--color-up); }
.asset-change.down { color: var(--color-down); }

.asset-sub {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.asset-breakdown {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  margin-bottom: 16px;
  border-top: 1px solid rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.breakdown-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bd-label {
  font-size: 11px;
  color: var(--text-tertiary);
}

.bd-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.asset-actions {
  display: flex;
  gap: 10px;
}

.asset-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 56px;
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 100ms ease;
}

.asset-btn:active {
  background: rgba(255,255,255,0.08);
}

.asset-btn svg {
  color: var(--color-brand);
}

/* 快捷功能 */
.quick-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: 14px;
  cursor: pointer;
  transition: all 100ms ease;
}

.feature-item:active {
  background: var(--bg-hover);
}

.feature-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--text-secondary);
}

.feature-icon.earn {
  background: rgba(14, 203, 129, 0.1);
  color: var(--color-up);
}

.feature-icon.ieo {
  background: rgba(201, 169, 98, 0.12);
  color: var(--color-brand);
}

.feature-icon.otc {
  background: rgba(30, 136, 229, 0.1);
  color: var(--color-info);
}

.feature-icon.rank {
  background: rgba(240, 185, 11, 0.1);
  color: var(--color-warning);
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.feature-desc {
  font-size: 11px;
  color: var(--text-tertiary);
}

/* 菜单 */
.menu-section {
  padding: 0;
}

.menu-group {
  background: var(--bg-card);
  border-radius: 16px;
  margin: 0 16px 12px;
  overflow: hidden;
}

.menu-group-title {
  padding: 14px 16px 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  transition: background 100ms ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: var(--bg-hover);
}

.menu-item.highlight {
  background: linear-gradient(90deg, rgba(201, 169, 98, 0.06) 0%, transparent 100%);
}

.menu-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  color: var(--text-secondary);
}

.menu-icon.orders-icon {
  background: rgba(99, 102, 241, 0.1);
  color: #818CF8;
}

.menu-icon.security-icon {
  background: rgba(14, 203, 129, 0.1);
  color: #0ECB81;
}

.menu-icon.kyc-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.menu-icon.invite-icon {
  background: rgba(201, 169, 98, 0.12);
  color: var(--color-brand);
}

.menu-icon.mining-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.menu-icon.help-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #A78BFA;
}

.menu-icon.about-icon {
  background: rgba(107, 114, 128, 0.1);
  color: #9CA3AF;
}

.menu-title {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.menu-status {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
}

.menu-status.safe {
  color: var(--color-up);
  background: rgba(14, 203, 129, 0.1);
}

.menu-status.warning {
  color: var(--color-down);
  background: rgba(246, 70, 93, 0.1);
}

.menu-extra {
  font-size: 12px;
  color: var(--text-tertiary);
}

.menu-extra.brand {
  color: var(--color-brand);
}

.menu-extra.hot {
  color: #F59E0B;
  background: rgba(245, 158, 11, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.menu-arrow {
  color: var(--text-tertiary);
}

/* 登录按钮 */
.login-section {
  display: flex;
  gap: 12px;
  padding: 24px 16px;
}

.login-btn,
.register-btn {
  flex: 1;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.login-btn {
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);
  color: #0B0E11;
}

.register-btn {
  background: rgba(255,255,255,0.06);
  color: var(--text-primary);
  border: 1px solid rgba(255,255,255,0.1);
}

/* 底部版权信息 */
.footer-info {
  padding: 16px 16px 24px;
  text-align: center;
}

.footer-info p {
  margin: 0;
}

.copyright {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 4px !important;
}

.version {
  font-size: 11px;
  color: var(--text-tertiary);
  opacity: 0.6;
}
</style>
