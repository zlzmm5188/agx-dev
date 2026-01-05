<template>
  <PageLayout title="我的资产" :show-back="true">
    <template #navbar-right>
      <button class="header-btn" @click="$router.push('/orders')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
        </svg>
      </button>
    </template>

    <div class="page-content">
      <!-- 总资产卡片 -->
      <div class="total-card">
        <div class="total-header">
          <span class="total-label">总资产估值 (USDT)</span>
          <button class="eye-btn" @click="hideAssets = !hideAssets">
            <svg v-if="!hideAssets" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>
        <div class="total-value">{{ hideAssets ? '****' : '12,580.00' }}</div>
        <div class="total-sub">≈ ¥{{ hideAssets ? '****' : '91,456.56' }}</div>
        
        <div class="asset-chart">
          <div class="chart-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2B3139" stroke-width="12"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F7931A" stroke-width="12" stroke-dasharray="125.6 125.6" stroke-dashoffset="0" transform="rotate(-90 50 50)"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#627EEA" stroke-width="12" stroke-dasharray="62.8 188.4" stroke-dashoffset="-125.6" transform="rotate(-90 50 50)"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#0ECB81" stroke-width="12" stroke-dasharray="62.8 188.4" stroke-dashoffset="-188.4" transform="rotate(-90 50 50)"/>
            </svg>
          </div>
          <div class="chart-legend">
            <div class="legend-item"><span class="dot" style="background:#F7931A"></span>BTC 50%</div>
            <div class="legend-item"><span class="dot" style="background:#627EEA"></span>ETH 25%</div>
            <div class="legend-item"><span class="dot" style="background:#0ECB81"></span>USDT 25%</div>
          </div>
        </div>
      </div>

      <!-- 账户类型 -->
      <div class="account-tabs">
        <button 
          v-for="acc in accounts" 
          :key="acc.key"
          :class="['acc-tab', { active: activeAccount === acc.key }]"
          @click="activeAccount = acc.key"
        >
          <span class="acc-name">{{ acc.label }}</span>
          <span class="acc-value">{{ hideAssets ? '****' : acc.value }}</span>
        </button>
      </div>

      <!-- 资产列表 -->
      <div class="asset-section">
        <div class="section-header">
          <span class="section-title">持仓明细</span>
          <button class="hide-small" @click="hideSmall = !hideSmall">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline v-if="hideSmall" points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            隐藏小额
          </button>
        </div>

        <div class="asset-list">
          <div v-for="asset in filteredAssets" :key="asset.symbol" class="asset-item">
            <div class="asset-left">
              <div class="asset-icon" :style="{ background: asset.color }">
                {{ asset.symbol.charAt(0) }}
              </div>
              <div class="asset-info">
                <span class="asset-symbol">{{ asset.symbol }}</span>
                <span class="asset-name">{{ asset.name }}</span>
              </div>
            </div>
            <div class="asset-right">
              <span class="asset-amount">{{ hideAssets ? '****' : asset.amount }}</span>
              <span class="asset-value">≈ ${{ hideAssets ? '****' : asset.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="bottom-actions">
        <router-link to="/deposit" class="action-btn primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 18h14"/></svg>
          充币
        </router-link>
        <router-link to="/withdraw" class="action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21V9M7 14l5-5 5 5"/><path d="M5 6h14"/></svg>
          提币
        </router-link>
        <router-link to="/trade" class="action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l4-4 4 3 7-8"/><path d="M14 8h6v6"/></svg>
          交易
        </router-link>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'

const hideAssets = ref(false)
const hideSmall = ref(false)
const activeAccount = ref('spot')

const accounts = [
  { key: 'spot', label: '现货', value: '8,580.00' },
  { key: 'earn', label: '理财', value: '3,500.00' },
  { key: 'contract', label: '合约', value: '500.00' }
]

const assets = ref([
  { symbol: 'BTC', name: '比特币', amount: '0.0645', value: '6,290.00', color: 'linear-gradient(135deg, #F7931A, #E2820A)' },
  { symbol: 'ETH', name: '以太坊', amount: '0.8520', value: '3,145.00', color: 'linear-gradient(135deg, #627EEA, #4C64C7)' },
  { symbol: 'USDT', name: '泰达币', amount: '3,145.00', value: '3,145.00', color: 'linear-gradient(135deg, #0ECB81, #059669)' },
  { symbol: 'AGX', name: 'Ascenda Gold', amount: '500.00', value: '0.00', color: 'linear-gradient(135deg, #C9A962, #8B7355)' }
])

const filteredAssets = computed(() => {
  if (hideSmall.value) {
    return assets.value.filter(a => parseFloat(a.value) > 10)
  }
  return assets.value
})
</script>

<style scoped>

.header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #848e9c;
  background: transparent;
  border: none;
  border-radius: 10px;
  -webkit-tap-highlight-color: transparent;
}

.page-content {
  min-height: calc(100vh - 44px);
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

.total-card {
  margin: 16px;
  padding: 18px;
  background: linear-gradient(165deg, rgba(201, 169, 98, 0.1) 0%, #1e2329 100%);
  border: 1px solid rgba(201, 169, 98, 0.15);
  border-radius: 16px;
}

.total-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.total-label {
  font-size: 13px;
  color: #848e9c;
}

.eye-btn {
  color: #848e9c;
  background: none;
  border: none;
  padding: 4px;
  -webkit-tap-highlight-color: transparent;
}

.total-value {
  font-size: 28px;
  font-weight: 700;
  color: #eaecef;
  font-family: 'DIN Alternate', monospace;
}

.total-sub {
  font-size: 13px;
  color: #5e6673;
  margin-bottom: 16px;
}

.asset-chart {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.chart-ring {
  width: 70px;
  height: 70px;
  flex-shrink: 0;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #848e9c;
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.account-tabs {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 16px;
}

.acc-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: #1e2329;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 12px;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.15s;
}

.acc-tab.active {
  background: linear-gradient(135deg, rgba(201,169,98,0.15), rgba(201,169,98,0.05));
  border-color: rgba(201,169,98,0.3);
}

.acc-name {
  font-size: 12px;
  color: #848e9c;
}

.acc-tab.active .acc-name {
  color: #C9A962;
}

.acc-value {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
  font-family: 'DIN Alternate', monospace;
}

.asset-section {
  padding: 0 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #eaecef;
}

.hide-small {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #5e6673;
  background: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}

.asset-list {
  background: #1e2329;
  border-radius: 14px;
  overflow: hidden;
}

.asset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.asset-item:last-child {
  border-bottom: none;
}

.asset-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.asset-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.asset-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.asset-symbol {
  font-size: 15px;
  font-weight: 600;
  color: #eaecef;
}

.asset-name {
  font-size: 11px;
  color: #5e6673;
}

.asset-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.asset-amount {
  font-size: 15px;
  font-weight: 600;
  color: #eaecef;
  font-family: 'DIN Alternate', monospace;
}

.asset-value {
  font-size: 11px;
  color: #5e6673;
  font-family: 'DIN Alternate', monospace;
}

.bottom-actions {
  display: flex;
  gap: 10px;
  padding: 16px;
  margin-top: auto;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px;
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
  font-size: 13px;
  color: #eaecef;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.action-btn:active {
  opacity: 0.8;
}

.action-btn.primary {
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  color: #0f1317;
}

.action-btn svg {
  color: #C9A962;
}

.action-btn.primary svg {
  color: #0f1317;
}
</style>
