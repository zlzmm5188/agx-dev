<template>
  <div class="earn-page">
    <!-- 标题栏 -->
    <div class="page-header">
      <h1 class="page-title">理财</h1>
      <div class="header-actions">
        <button class="header-btn" @click="$router.push('/assets')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/>
          </svg>
        </button>
        <button class="header-btn" @click="$router.push('/help')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="page-content">
    <!-- 总收益卡片 -->
    <div class="earn-summary">
      <div class="summary-row">
        <div class="summary-item">
          <span class="summary-label">累计收益 (USDT)</span>
          <span class="summary-value">{{ totalEarnings }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">昨日收益</span>
          <span class="summary-value small">+{{ yesterdayEarnings }}</span>
        </div>
      </div>
      <div class="summary-footer">
        <span>{{ holdingAssets }} 持仓中</span>
        <button class="summary-btn" @click="$router.push('/assets')">我的理财 ›</button>
      </div>
    </div>

    <!-- 推荐横幅 -->
    <div class="promo-banner">
      <div class="promo-content">
        <span class="promo-tag">限时</span>
        <span class="promo-title">AGX 新币理财</span>
        <span class="promo-apy">APY 高达 128%</span>
      </div>
      <router-link to="/mining" class="promo-btn">立即质押</router-link>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <router-link to="/ieo" class="quick-action">
        <div class="qa-icon buy">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span>购买AGX</span>
      </router-link>
      <router-link to="/mining" class="quick-action">
        <div class="qa-icon stake">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <path d="M6 10v4M10 10v4M14 10v4M18 10v4"/>
          </svg>
        </div>
        <span>质押挖矿</span>
      </router-link>
      <router-link to="/contract" class="quick-action">
        <div class="qa-icon contract">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 17l4-4 4 3 7-8"/>
            <path d="M14 8h6v6"/>
          </svg>
        </div>
        <span>合约交易</span>
      </router-link>
    </div>

    <!-- 产品分类 -->
    <div class="earn-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        class="earn-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <!-- 产品列表 -->
    <div class="product-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-header">
          <img :src="product.icon" class="product-icon" :alt="product.name">
          <div class="product-info">
            <span class="product-name">{{ product.name }}</span>
            <span class="product-type">{{ product.type }}</span>
          </div>
          <span class="product-tag" v-if="product.hot">热门</span>
        </div>
        <div class="product-body">
          <div class="product-apy">
            <span class="apy-value">{{ product.apy }}%</span>
            <span class="apy-label">年化收益</span>
          </div>
          <div class="product-meta">
            <span>期限: {{ product.term }}</span>
            <span>起投: {{ product.minAmount }}</span>
          </div>
        </div>
        <button class="product-btn" @click="handleSubscribe(product)">立即申购</button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="products.length === 0" class="empty-state">
      <span>暂无可用产品</span>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { alert } from '../utils/alert'

const totalEarnings = ref('1,258.36')
const yesterdayEarnings = ref('12.58')
const holdingAssets = ref('$12,500.00')
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'flexible', label: '活期' },
  { key: 'fixed', label: '定期' },
  { key: 'staking', label: '质押' }
]

const products = ref([
  {
    id: 1,
    name: 'USDT',
    type: '活期理财',
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    apy: '8.5',
    term: '随存随取',
    minAmount: '100 USDT',
    hot: true
  },
  {
    id: 2,
    name: 'BTC',
    type: '定期30天',
    icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    apy: '5.2',
    term: '30天',
    minAmount: '0.001 BTC',
    hot: false
  },
  {
    id: 3,
    name: 'ETH',
    type: '质押挖矿',
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    apy: '4.8',
    term: '灵活',
    minAmount: '0.01 ETH',
    hot: true
  },
  {
    id: 4,
    name: 'SOL',
    type: '定期60天',
    icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    apy: '12.5',
    term: '60天',
    minAmount: '1 SOL',
    hot: false
  },
  {
    id: 5,
    name: 'AGX',
    type: 'AGX质押',
    icon: 'https://web.agx.bi/assets/imgs/im/image.png',
    apy: '128',
    term: '灵活质押',
    minAmount: '100 AGX',
    hot: true,
    featured: true
  },
  {
    id: 6,
    name: 'BNB',
    type: '质押挖矿',
    icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    apy: '6.8',
    term: '灵活',
    minAmount: '0.1 BNB',
    hot: false
  }
])

const handleSubscribe = async (product) => {
  await alert('请先登录')
}
</script>

<style scoped>
/* 页面容器 */
.earn-page {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  -webkit-tap-highlight-color: transparent;
}

/* 标题栏 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  background: linear-gradient(180deg, rgba(24, 26, 32, 0.98) 0%, rgba(24, 26, 32, 0.95) 100%);
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: var(--text-secondary);
  transition: all 0.15s ease;
}

.header-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.1);
}

/* 可滚动内容区 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(60px + env(safe-area-inset-bottom, 16px));
}

/* 隐藏滚动条 */
.page-content::-webkit-scrollbar {
  display: none;
}

.page-content {
  scrollbar-width: none;
}

/* 总收益卡片 */
.earn-summary {
  margin: 16px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.12) 0%, var(--bg-card) 100%);
  border: 1px solid rgba(201, 169, 98, 0.15);
  border-radius: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-label {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-bottom: 8px;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-brand);
  font-family: var(--font-mono);
}

.summary-value.small {
  font-size: 20px;
  color: var(--color-up);
}

.summary-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.summary-footer > span {
  font-size: 12px;
  color: var(--text-secondary);
}

.summary-btn {
  font-size: 12px;
  color: var(--color-brand);
}

/* 推荐横幅 */
.promo-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 16px 16px;
  padding: 16px;
  background: linear-gradient(135deg, #2a1f0a 0%, #1a1510 100%);
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: 12px;
}

.promo-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.promo-tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  color: #fff;
  background: var(--color-down);
  border-radius: 8px;
  width: fit-content;
}

.promo-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.promo-apy {
  font-size: 12px;
  color: var(--color-up);
}

.promo-btn {
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #0B0E11;
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);
  border-radius: 10px;
  text-decoration: none;
}

/* 快捷入口 */
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 0 16px 16px;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.qa-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qa-icon.buy {
  background: linear-gradient(135deg, rgba(246, 70, 93, 0.15) 0%, rgba(246, 70, 93, 0.05) 100%);
  color: #F6465D;
}

.qa-icon.stake {
  background: linear-gradient(135deg, rgba(14, 203, 129, 0.15) 0%, rgba(14, 203, 129, 0.05) 100%);
  color: #0ECB81;
}

.qa-icon.contract {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%);
  color: #8B5CF6;
}

.quick-action span {
  font-size: 12px;
  color: var(--text-secondary);
}

.earn-tabs {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
  overflow-x: auto;
}

.earn-tabs::-webkit-scrollbar { display: none; }

.earn-tab {
  padding: 8px 18px;
  font-size: 13px;
  color: var(--text-tertiary);
  background: var(--bg-card);
  border-radius: 20px;
  white-space: nowrap;
}

.earn-tab.active {
  color: var(--text-primary);
  background: rgba(201, 169, 98, 0.15);
}

.product-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-card {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.04);
}

.product-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.product-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-input);
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.product-type {
  font-size: 12px;
  color: var(--text-tertiary);
}

.product-tag {
  padding: 4px 10px;
  font-size: 11px;
  color: var(--color-brand);
  background: rgba(201, 169, 98, 0.12);
  border-radius: 12px;
}

.product-body {
  margin-bottom: 16px;
}

.product-apy {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.apy-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-up);
  font-family: var(--font-mono);
}

.apy-label {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-tertiary);
}

.product-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);
  color: #0B0E11;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
}

.product-btn:active {
  opacity: 0.9;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-tertiary);
}
</style>
