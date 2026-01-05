<template>
  <PageLayout title="提币" :show-back="true">
    <div class="page-content">
    <!-- 页面描述 -->
    <div class="page-desc">
      <p>将数字资产提取到外部地址</p>
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

    <div class="form-section">
      <div class="form-group">
        <div class="label-row">
          <label>提现网络</label>
        </div>
        <div class="network-select">
          <span v-for="net in networks" :key="net"
                :class="['net-tag', { active: selectedNetwork === net }]"
                @click="selectedNetwork = net">{{ net }}</span>
        </div>
      </div>

      <div class="form-group">
        <div class="label-row">
          <label>提现地址</label>
          <span class="paste-btn" @click="pasteAddress">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            粘贴
          </span>
        </div>
        <div class="input-wrap">
          <input type="text" v-model="address" placeholder="请输入提现地址">
        </div>
      </div>

      <div class="form-group">
        <div class="label-row">
          <label>提现数量</label>
          <span class="available">可用: 0.00 {{ selectedCoin.symbol }}</span>
        </div>
        <div class="input-wrap">
          <input type="text" v-model="amount" placeholder="请输入提现数量">
          <span class="max-btn" @click="setMax">全部</span>
        </div>
      </div>
    </div>

    <div class="fee-info">
      <div class="fee-row">
        <span>网络手续费</span>
        <span class="fee-value">0.5 USDT</span>
      </div>
      <div class="fee-row highlight">
        <span>实际到账</span>
        <span class="amount">{{ actualAmount }} {{ selectedCoin.symbol }}</span>
      </div>
    </div>

    <div class="notice-section">
      <ul class="notice-list">
        <li>请务必确认提现地址和网络正确</li>
        <li>提现到错误地址将无法找回</li>
        <li>单笔最小提现: 10 USDT</li>
      </ul>
    </div>
    
    <!-- 提币记录 -->
    <div class="history-section">
      <div class="section-header">
        <span class="section-title">提币记录</span>
        <router-link to="/orders?type=withdraw" class="view-all">查看全部</router-link>
      </div>
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
        </svg>
        <p>暂无提币记录</p>
      </div>
    </div>

    <div class="bottom-btn">
      <button class="submit-btn" @click="handleWithdraw">确认提现</button>
    </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'

const showCoinModal = ref(false)
const selectedNetwork = ref('TRC20')
const address = ref('')
const amount = ref('')

const selectedCoin = ref({
  symbol: 'USDT',
  name: 'Tether',
  icon: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
})

const networks = ref(['ERC20', 'TRC20', 'BEP20'])

const actualAmount = computed(() => {
  const val = parseFloat(amount.value) || 0
  return Math.max(0, val - 0.5).toFixed(2)
})

const pasteAddress = async () => {
  try {
    const text = await navigator.clipboard.readText()
    address.value = text
  } catch {
    alert('无法读取剪贴板')
  }
}

const setMax = () => {
  amount.value = '0.00'
}

const handleWithdraw = () => {
  if (!address.value || !amount.value) {
    alert('请填写完整信息')
    return
  }
  alert('请先登录')
}
</script>

<style scoped>
/* 页面容器 */
.withdraw-page {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  -webkit-tap-highlight-color: transparent;
}

/* 可滚动内容区 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 16px));
}

/* 隐藏滚动条 */
.page-content::-webkit-scrollbar {
  display: none;
}

.page-content {
  scrollbar-width: none;
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

.form-section {
  padding: 0 16px;
}

.form-group {
  margin-bottom: 20px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.label-row label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.paste-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-brand);
  cursor: pointer;
}

.available {
  font-size: 13px;
  color: var(--text-tertiary);
}

.network-select {
  display: flex;
  gap: 10px;
}

.net-tag {
  padding: 12px 20px;
  background: var(--bg-card);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-tertiary);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.net-tag:active {
  transform: scale(0.98);
}

.net-tag.active {
  color: var(--color-brand);
  border-color: var(--color-brand);
  background: rgba(201, 169, 98, 0.1);
}

.input-wrap {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: 12px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.15s ease;
}

.input-wrap:focus-within {
  border-color: rgba(201, 169, 98, 0.3);
}

.input-wrap input {
  flex: 1;
  padding: 16px 0;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
}

.input-wrap input::placeholder {
  color: var(--text-tertiary);
}

.max-btn {
  color: var(--color-brand);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.fee-info {
  margin: 20px 16px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: 14px;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  color: var(--text-tertiary);
}

.fee-row.highlight {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  margin-top: 4px;
  padding-top: 14px;
}

.fee-value {
  color: var(--text-secondary);
}

.fee-row .amount {
  color: var(--text-primary);
  font-weight: 600;
  font-family: var(--font-mono);
}

.notice-section,
.history-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.view-all {
  font-size: 13px;
  color: var(--color-brand);
  text-decoration: none;
}

.notice-list {
  list-style: none;
  padding: 16px;
  margin: 0;
  background: rgba(246, 70, 93, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(246, 70, 93, 0.2);
}

.notice-list li {
  font-size: 13px;
  color: var(--color-down);
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

.bottom-btn {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 100vw;
  padding: 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(11, 14, 17, 0) 0%, #0b0e11 20%);
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);
  border: none;
  border-radius: 12px;
  color: #0B0E11;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.submit-btn:active {
  transform: scale(0.98);
}
</style>
