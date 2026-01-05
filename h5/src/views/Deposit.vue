<template>
  <div class="deposit-page">
    <div class="page-content">
    <!-- 页面描述 -->
    <div class="page-desc">
      <p>将数字资产充值到您的账户</p>
    </div>
    
    <div class="coin-selector" @click="showCoinModal = true">
      <div class="coin-info">
        <img :src="selectedCoin.icon" :alt="selectedCoin.symbol" class="coin-icon">
        <div class="coin-text">
          <span class="coin-symbol">{{ selectedCoin.symbol }}</span>
          <span class="coin-name">{{ selectedCoin.name }}</span>
        </div>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    </div>

    <div class="network-section">
      <div class="section-title">选择网络</div>
      <div class="network-list">
        <div v-for="net in networks" :key="net.name"
             :class="['network-item', { active: selectedNetwork === net.name }]"
             @click="selectedNetwork = net.name">
          <div class="net-left">
            <span class="net-name">{{ net.name }}</span>
            <span class="net-fee">预计到账: {{ net.time }}</span>
          </div>
          <div class="net-check" v-if="selectedNetwork === net.name">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <div class="address-section">
      <div class="section-title">充值地址</div>
      <div class="qr-code">
        <div class="qr-placeholder">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="4" height="4"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="14" y1="21" x2="21" y2="21"/>
          </svg>
        </div>
      </div>
      <div class="address-wrap">
        <input type="text" :value="depositAddress" readonly class="address-input">
        <button class="copy-btn" @click="copyAddress">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          复制
        </button>
      </div>
    </div>

    <div class="notice-section">
      <div class="section-title">注意事项</div>
      <ul class="notice-list">
        <li>请勿向上述地址充值任何非 {{ selectedCoin.symbol }} 资产</li>
        <li>充值需要网络确认后才能到账</li>
        <li>最小充值金额: 0.0001 {{ selectedCoin.symbol }}</li>
      </ul>
    </div>
    
    <!-- 充值记录 -->
    <div class="history-section">
      <div class="section-header">
        <span class="section-title">充值记录</span>
        <router-link to="/orders?type=deposit" class="view-all">查看全部</router-link>
      </div>
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
        </svg>
        <p>暂无充值记录</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { alert } from '../utils/alert'

const showCoinModal = ref(false)
const showHistory = ref(false)
const selectedNetwork = ref('ERC20')

const selectedCoin = ref({
  symbol: 'USDT',
  name: 'Tether',
  icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
})

const networks = ref([
  { name: 'ERC20', time: '12次确认' },
  { name: 'TRC20', time: '1次确认' },
  { name: 'BEP20', time: '15次确认' }
])

const depositAddress = ref('0x8a7d...5f3e9c2b')

const copyAddress = async () => {
  navigator.clipboard.writeText(depositAddress.value)
  await alert('地址已复制')
}
</script>

<style scoped>
/* 页面容器 */
.deposit-page {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
}

/* 可滚动内容区 */
.page-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

/* 页面描述 */
.page-desc {
  padding: 12px 16px;
}

.page-desc p {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
}

.coin-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 16px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.coin-selector:active {
  background: var(--bg-hover);
}

.coin-selector svg {
  color: var(--text-tertiary);
}

.coin-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coin-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-input);
}

.coin-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.coin-symbol {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.coin-name {
  font-size: 12px;
  color: var(--text-tertiary);
}

.network-section,
.address-section,
.notice-section,
.history-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.view-all {
  font-size: 13px;
  color: var(--color-brand);
  text-decoration: none;
}

.network-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.network-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.network-item:active {
  background: var(--bg-hover);
}

.network-item.active {
  border-color: var(--color-brand);
  background: rgba(201, 169, 98, 0.08);
}

.net-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.net-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.net-fee {
  font-size: 12px;
  color: var(--text-tertiary);
}

.net-check {
  color: var(--color-brand);
}

.qr-code {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  background: var(--bg-card);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.address-wrap {
  display: flex;
  gap: 10px;
}

.address-input {
  flex: 1;
  padding: 14px 16px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font-mono);
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 20px;
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);
  border: none;
  border-radius: 12px;
  color: #0B0E11;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.copy-btn:active {
  transform: scale(0.98);
}

.notice-list {
  list-style: none;
  padding: 16px;
  margin: 0;
  background: rgba(201, 169, 98, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(201, 169, 98, 0.2);
}

.notice-list li {
  font-size: 13px;
  color: var(--color-brand);
  padding: 6px 0;
  padding-left: 16px;
  position: relative;
}

.notice-list li::before {
  content: '•';
  position: absolute;
  left: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-card);
  border-radius: 12px;
}

.empty-state p {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--text-tertiary);
}
</style>
