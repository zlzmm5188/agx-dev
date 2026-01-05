<template>
  <div class="contract-page">
    <!-- 固定顶部栏 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h1 class="page-title">合约交易</h1>
      <div class="header-actions">
        <button class="header-btn" @click="$router.push('/orders?type=contract')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="page-content">
      <!-- 交易对信息 -->
      <div class="pair-header">
        <div class="pair-info">
          <img src="https://web.agx.bi/assets/imgs/im/image.png" class="pair-icon" alt="AGX">
          <div class="pair-text">
            <span class="pair-name">AGX/USDT</span>
            <span class="pair-type">永续合约</span>
          </div>
        </div>
        <div class="pair-price">
          <span class="price" :class="priceChange >= 0 ? 'up' : 'down'">{{ currentPrice }}</span>
          <span class="change" :class="priceChange >= 0 ? 'up' : 'down'">{{ priceChange >= 0 ? '+' : '' }}{{ priceChange }}%</span>
        </div>
      </div>

      <!-- 市场数据 -->
      <div class="market-stats">
        <div class="stat-item">
          <span class="stat-label">24H高</span>
          <span class="stat-value">{{ high24h }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">24H低</span>
          <span class="stat-value">{{ low24h }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">24H量</span>
          <span class="stat-value">{{ volume24h }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">资金费率</span>
          <span class="stat-value" :class="fundingRate >= 0 ? 'up' : 'down'">{{ fundingRate }}%</span>
        </div>
      </div>

      <!-- K线图区域 -->
      <div class="chart-section">
        <div class="chart-tabs">
          <span v-for="tf in timeframes" :key="tf" :class="{ active: activeTimeframe === tf }" @click="activeTimeframe = tf">{{ tf }}</span>
        </div>
        <div class="chart-area">
          <svg class="kline-chart" viewBox="0 0 360 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="priceChange >= 0 ? '#0ECB81' : '#F6465D'" stop-opacity="0.3"/>
                <stop offset="100%" :stop-color="priceChange >= 0 ? '#0ECB81' : '#F6465D'" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path :d="areaPath" fill="url(#chartGrad)"/>
            <path :d="linePath" fill="none" :stroke="priceChange >= 0 ? '#0ECB81' : '#F6465D'" stroke-width="1.5"/>
          </svg>
        </div>
      </div>

      <!-- 杠杆选择 -->
      <div class="leverage-section">
        <div class="section-header">
          <span class="section-title">杠杆倍数</span>
          <span class="leverage-value">{{ leverage }}x</span>
        </div>
        <div class="leverage-slider">
          <input type="range" v-model="leverage" min="1" max="100" step="1">
          <div class="leverage-marks">
            <span @click="leverage = 1">1x</span>
            <span @click="leverage = 10">10x</span>
            <span @click="leverage = 25">25x</span>
            <span @click="leverage = 50">50x</span>
            <span @click="leverage = 100">100x</span>
          </div>
        </div>
      </div>

      <!-- 交易表单 -->
      <div class="trade-form">
        <div class="form-row">
          <span class="form-label">可用余额</span>
          <span class="form-value">{{ availableBalance }} USDT</span>
        </div>
        
        <div class="input-group">
          <label>数量 (AGX)</label>
          <div class="input-wrap">
            <input type="number" v-model="amount" placeholder="输入数量">
            <div class="input-btns">
              <button @click="setPercent(25)">25%</button>
              <button @click="setPercent(50)">50%</button>
              <button @click="setPercent(75)">75%</button>
              <button @click="setPercent(100)">全部</button>
            </div>
          </div>
        </div>

        <div class="order-info">
          <div class="info-row">
            <span>开仓价值</span>
            <span>≈ {{ orderValue }} USDT</span>
          </div>
          <div class="info-row">
            <span>所需保证金</span>
            <span>≈ {{ requiredMargin }} USDT</span>
          </div>
          <div class="info-row">
            <span>预估强平价</span>
            <span class="down">{{ liquidationPrice }} USDT</span>
          </div>
        </div>

        <div class="trade-buttons">
          <button class="trade-btn long" @click="openPosition('long')">
            <span class="btn-title">开多</span>
            <span class="btn-sub">看涨</span>
          </button>
          <button class="trade-btn short" @click="openPosition('short')">
            <span class="btn-title">开空</span>
            <span class="btn-sub">看跌</span>
          </button>
        </div>
      </div>

      <!-- 当前持仓 -->
      <div class="positions-section">
        <div class="section-header">
          <span class="section-title">当前持仓</span>
          <router-link to="/orders?type=contract" class="view-all">历史记录 ›</router-link>
        </div>
        <div v-if="positions.length === 0" class="empty-positions">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
          <p>暂无持仓</p>
        </div>
        <div v-else class="positions-list">
          <div v-for="pos in positions" :key="pos.id" class="position-item">
            <div class="pos-header">
              <span class="pos-pair">AGX/USDT</span>
              <span class="pos-type" :class="pos.type">{{ pos.type === 'long' ? '多' : '空' }} {{ pos.leverage }}x</span>
            </div>
            <div class="pos-details">
              <div class="pos-col">
                <span class="pos-label">持仓数量</span>
                <span class="pos-value">{{ pos.amount }} AGX</span>
              </div>
              <div class="pos-col">
                <span class="pos-label">开仓价格</span>
                <span class="pos-value">{{ pos.entryPrice }}</span>
              </div>
              <div class="pos-col">
                <span class="pos-label">未实现盈亏</span>
                <span class="pos-value" :class="pos.pnl >= 0 ? 'up' : 'down'">{{ pos.pnl >= 0 ? '+' : '' }}{{ pos.pnl }}%</span>
              </div>
            </div>
            <button class="close-btn">平仓</button>
          </div>
        </div>
      </div>

      <!-- 风险提示 -->
      <div class="risk-notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
        </svg>
        <span>合约交易具有高风险，请谨慎操作</span>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { alert } from '../utils/alert'

const currentPrice = ref('0.1025')
const priceChange = ref(3.56)
const high24h = ref('0.1080')
const low24h = ref('0.0985')
const volume24h = ref('12.5M')
const fundingRate = ref(0.01)

const activeTimeframe = ref('15分')
const timeframes = ['1分', '5分', '15分', '1时', '4时', '1日']

const leverage = ref(10)
const amount = ref('')
const availableBalance = ref('0.00')

const positions = ref([])

// 计算K线路径
const linePath = computed(() => {
  const points = []
  let y = 60
  for (let i = 0; i <= 36; i++) {
    const x = i * 10
    y = Math.max(10, Math.min(110, y + (Math.random() - 0.45) * 15))
    points.push(`${i === 0 ? 'M' : 'L'}${x},${y}`)
  }
  return points.join(' ')
})

const areaPath = computed(() => {
  return linePath.value + ' L360,120 L0,120 Z'
})

// 订单计算
const orderValue = computed(() => {
  if (!amount.value) return '0.00'
  return (parseFloat(amount.value) * parseFloat(currentPrice.value)).toFixed(2)
})

const requiredMargin = computed(() => {
  if (!amount.value || !leverage.value) return '0.00'
  return (parseFloat(orderValue.value) / leverage.value).toFixed(2)
})

const liquidationPrice = computed(() => {
  if (!amount.value) return '--'
  const price = parseFloat(currentPrice.value)
  const liqPrice = price * (1 - 0.8 / leverage.value)
  return liqPrice.toFixed(4)
})

const setPercent = (percent) => {
  // 模拟设置百分比
  console.log('设置', percent, '%')
}

const openPosition = async (type) => {
  await alert('请先登录后进行合约交易')
}
</script>

<style scoped>
.contract-page {
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

/* 固定顶部栏 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(180deg, #1e2228 0%, #181a20 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-right: 12px;
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.08);
}

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
}

.header-btn:active {
  background: rgba(255, 255, 255, 0.08);
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar { display: none; }

/* 交易对头部 */
.pair-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pair-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pair-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.pair-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pair-name {
  font-size: 18px;
  font-weight: 700;
  color: #eaecef;
}

.pair-type {
  font-size: 12px;
  color: #848e9c;
}

.pair-price {
  text-align: right;
}

.price {
  display: block;
  font-size: 22px;
  font-weight: 700;
  font-family: 'DIN Alternate', monospace;
}

.price.up { color: #0ECB81; }
.price.down { color: #F6465D; }

.change {
  font-size: 13px;
  font-weight: 500;
}

.change.up { color: #0ECB81; }
.change.down { color: #F6465D; }

/* 市场数据 */
.market-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.stat-item {
  flex: 1;
  padding: 10px;
  background: #1e2329;
  border-radius: 10px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 10px;
  color: #5e6673;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: #eaecef;
  font-family: 'DIN Alternate', monospace;
}

.stat-value.up { color: #0ECB81; }
.stat-value.down { color: #F6465D; }

/* K线图 */
.chart-section {
  background: #1e2329;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 16px;
}

.chart-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.chart-tabs span {
  font-size: 12px;
  color: #5e6673;
  cursor: pointer;
}

.chart-tabs span.active {
  color: #C9A962;
}

.chart-area {
  height: 120px;
}

.kline-chart {
  width: 100%;
  height: 100%;
}

/* 杠杆选择 */
.leverage-section {
  background: #1e2329;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
}

.leverage-value {
  font-size: 18px;
  font-weight: 700;
  color: #C9A962;
}

.leverage-slider input[type="range"] {
  width: 100%;
  height: 4px;
  background: #2B3139;
  border-radius: 2px;
  appearance: none;
  outline: none;
}

.leverage-slider input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border-radius: 50%;
  cursor: pointer;
}

.leverage-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.leverage-marks span {
  font-size: 11px;
  color: #5e6673;
  cursor: pointer;
}

/* 交易表单 */
.trade-form {
  background: #1e2329;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 16px;
}

.form-label { color: #5e6673; }
.form-value { color: #eaecef; }

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  font-size: 12px;
  color: #5e6673;
  margin-bottom: 8px;
}

.input-wrap {
  background: #14161a;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 12px;
}

.input-wrap input {
  width: 100%;
  background: transparent;
  border: none;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  outline: none;
  margin-bottom: 10px;
}

.input-wrap input::placeholder { color: #5e6673; }

.input-btns {
  display: flex;
  gap: 8px;
}

.input-btns button {
  flex: 1;
  padding: 6px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  font-size: 11px;
  color: #848e9c;
  cursor: pointer;
}

.input-btns button:active {
  background: rgba(201,169,98,0.1);
  color: #C9A962;
}

.order-info {
  padding: 12px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #848e9c;
  margin-bottom: 8px;
}

.info-row:last-child { margin-bottom: 0; }

.trade-buttons {
  display: flex;
  gap: 12px;
}

.trade-btn {
  flex: 1;
  height: 56px;
  border: none;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.trade-btn.long {
  background: linear-gradient(135deg, #0ECB81, #059669);
}

.trade-btn.short {
  background: linear-gradient(135deg, #F6465D, #D4374A);
}

.btn-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.btn-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.7);
}

/* 持仓 */
.positions-section {
  margin-bottom: 16px;
}

.view-all {
  font-size: 13px;
  color: #848e9c;
  text-decoration: none;
}

.empty-positions {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: #1e2329;
  border-radius: 14px;
  text-align: center;
}

.empty-positions p {
  font-size: 14px;
  color: #848e9c;
  margin: 16px 0 0;
}

.positions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.position-item {
  padding: 16px;
  background: #1e2329;
  border-radius: 14px;
}

.pos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pos-pair {
  font-size: 15px;
  font-weight: 600;
  color: #eaecef;
}

.pos-type {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.pos-type.long {
  background: rgba(14,203,129,0.12);
  color: #0ECB81;
}

.pos-type.short {
  background: rgba(246,70,93,0.12);
  color: #F6465D;
}

.pos-details {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.pos-col {
  flex: 1;
}

.pos-label {
  display: block;
  font-size: 11px;
  color: #5e6673;
  margin-bottom: 4px;
}

.pos-value {
  font-size: 13px;
  font-weight: 600;
  color: #eaecef;
}

.pos-value.up { color: #0ECB81; }
.pos-value.down { color: #F6465D; }

.close-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  font-size: 13px;
  color: #eaecef;
  cursor: pointer;
}

/* 风险提示 */
.risk-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(246, 70, 93, 0.08);
  border: 1px solid rgba(246, 70, 93, 0.2);
  border-radius: 10px;
  font-size: 12px;
  color: #F6465D;
}
</style>
