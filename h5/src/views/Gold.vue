<template>
  <div class="gold-page">
    <!-- 固定顶部栏 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h1 class="page-title">黄金交易</h1>
      <div class="header-actions">
        <button class="header-btn" @click="$router.push('/orders')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="page-content">
    <!-- 实时金价卡片 -->
    <div class="gold-price-card">
      <div class="gp-header">
        <svg class="gp-icon" viewBox="0 0 40 40" fill="none">
          <path d="M20 4L8 10v10l12 8 12-8V10L20 4z" stroke="url(#goldG1)" stroke-width="1" opacity="0.3" fill="url(#goldBg1)" fill-opacity="0.05"/>
          <path d="M20 6L10 11v8l10 6 10-6v-8L20 6z" stroke="url(#goldG1)" stroke-width="1.6" fill="url(#goldFill1)" fill-opacity="0.1"/>
          <rect x="15" y="16" width="10" height="8" rx="1.5" stroke="url(#goldG1)" stroke-width="1.4" fill="url(#goldFill2)" fill-opacity="0.15"/>
          <path d="M15 18.5h10M15 21h10" stroke="url(#goldG1)" stroke-width="0.7" opacity="0.4"/>
          <circle cx="20" cy="20" r="1.3" fill="url(#goldG1)"/>
          <circle cx="20" cy="20" r="0.5" fill="#0f1317" opacity="0.3"/>
          <defs>
            <linearGradient id="goldG1" x1="8" y1="4" x2="32" y2="36">
              <stop stop-color="#FFE5B4"/><stop offset="0.3" stop-color="#F0DDA8"/>
              <stop offset="0.7" stop-color="#D4B872"/><stop offset="1" stop-color="#8B7355"/>
            </linearGradient>
            <linearGradient id="goldBg1" x1="8" y1="4" x2="32" y2="36">
              <stop stop-color="#F0DDA8"/><stop offset="1" stop-color="#C9A962"/>
            </linearGradient>
            <linearGradient id="goldFill1" x1="10" y1="11" x2="30" y2="25">
              <stop stop-color="#F0DDA8" stop-opacity="0.4"/><stop offset="1" stop-color="#C9A962" stop-opacity="0.1"/>
            </linearGradient>
            <linearGradient id="goldFill2" x1="15" y1="16" x2="25" y2="24">
              <stop stop-color="#FFE5B4" stop-opacity="0.5"/><stop offset="0.5" stop-color="#D4B872" stop-opacity="0.3"/>
              <stop offset="1" stop-color="#C9A962" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
        <div class="gp-info">
          <span class="gp-name">{{ spotData.symbol }}</span>
          <span class="gp-label">{{ spotData.name }}</span>
        </div>
        <span class="live-tag">
          <span class="live-dot"></span>
          实时
        </span>
      </div>
      <div class="gp-price">${{ spotData.price }}</div>
      <div class="gp-change" :class="spotData.change >= 0 ? 'up' : 'down'">
        {{ spotData.change >= 0 ? '+' : '' }}{{ spotData.changeAmount }} ({{ spotData.change >= 0 ? '+' : '' }}{{ spotData.change }}%)
      </div>
      <div class="gp-stats">
        <div class="stat">
          <span class="stat-label">24H高</span>
          <span class="stat-value">${{ spotData.high24h }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">24H低</span>
          <span class="stat-value">${{ spotData.low24h }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">成交量</span>
          <span class="stat-value">{{ spotData.volume }}</span>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="gold-actions">
      <button class="gold-btn buy">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        买入黄金
      </button>
      <button class="gold-btn sell">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        卖出黄金
      </button>
    </div>

    <!-- 我的持仓 -->
    <div class="my-holdings">
      <div class="section-head">
        <span>我的持仓</span>
        <button class="view-all" @click="$router.push('/assets')">查看全部 →</button>
      </div>
      <div class="holding-card">
        <div class="holding-row">
          <span class="h-label">黄金持有量</span>
          <span class="h-value">{{ holdings.amount }} 盎司</span>
        </div>
        <div class="holding-row">
          <span class="h-label">持仓价值</span>
          <span class="h-value gold">${{ holdings.value }}</span>
        </div>
        <div class="holding-row">
          <span class="h-label">盈亏</span>
          <span class="h-value" :class="holdings.pnl >= 0 ? 'up' : 'down'">
            {{ holdings.pnl >= 0 ? '+' : '' }}${{ Math.abs(holdings.pnl).toFixed(2) }} ({{ holdings.pnlPercent >= 0 ? '+' : '' }}{{ holdings.pnlPercent }}%)
          </span>
        </div>
      </div>
    </div>

    <!-- 价格走势 -->
    <div class="price-chart-section">
      <div class="section-head">
        <span>价格走势</span>
        <div class="time-tabs">
          <button 
            v-for="tab in timeTabs" 
            :key="tab" 
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
      </div>
      <div class="chart-container">
        <svg class="mini-chart" viewBox="0 0 300 120">
          <defs>
            <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(201, 169, 98, 0.3)"/>
              <stop offset="100%" stop-color="rgba(201, 169, 98, 0)"/>
            </linearGradient>
          </defs>
          <path :d="chartPath" fill="url(#chartGrad)" opacity="0.5"/>
          <path :d="chartLine" fill="none" stroke="#C9A962" stroke-width="2"/>
          <circle v-for="(point, i) in chartPoints" :key="i" 
            :cx="point.x" :cy="point.y" r="3" 
            fill="#C9A962" opacity="0.6"/>
        </svg>
      </div>
    </div>

    <!-- AGX黄金储备 -->
    <div class="gold-reserve">
      <div class="section-head">
        <span>AGX 黄金储备</span>
        <span class="verified-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          已审计
        </span>
      </div>
      <div class="reserve-card">
        <div class="reserve-row">
          <span>储备总量</span>
          <span class="value">1,250 公斤</span>
        </div>
        <div class="reserve-row">
          <span>储备价值</span>
          <span class="value gold">${{ reserveValue }}</span>
        </div>
        <div class="reserve-row">
          <span>存储地点</span>
          <span>瑞士苏黎世金库</span>
        </div>
        <div class="reserve-row">
          <span>审计机构</span>
          <span>德勤 Deloitte</span>
        </div>
        <div class="reserve-row">
          <span>最近审计</span>
          <span>2026年1月</span>
        </div>
      </div>
    </div>

    <!-- 黄金理财 -->
    <div class="gold-products">
      <div class="section-head">
        <span>黄金理财</span>
      </div>
      <div class="product-list">
        <div class="product-item" v-for="p in products" :key="p.name">
          <div class="prod-left">
            <div class="prod-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="url(#prodG)" stroke-width="1.5" opacity="0.3"/>
                <circle cx="12" cy="12" r="6" stroke="url(#prodG)" stroke-width="1.8" fill="url(#prodFill)" fill-opacity="0.08"/>
                <path d="M12 8v1.5M12 14.5v1.5" stroke="url(#prodG)" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 10.5h4M10 13.5h4" stroke="url(#prodG)" stroke-width="1.4" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="prodG" x1="3" y1="3" x2="21" y2="21">
                    <stop stop-color="#F0DDA8"/><stop offset="0.5" stop-color="#D4B872"/><stop offset="1" stop-color="#9A8A68"/>
                  </linearGradient>
                  <linearGradient id="prodFill" x1="6" y1="6" x2="18" y2="18">
                    <stop stop-color="#D4B872" stop-opacity="0.3"/><stop offset="1" stop-color="#9A8A68" stop-opacity="0.05"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="prod-info">
              <span class="prod-name">{{ p.name }}</span>
              <span class="prod-desc">{{ p.desc }}</span>
            </div>
          </div>
          <div class="prod-apy">
            <span class="apy">{{ p.apy }}%</span>
            <span class="apy-label">年化</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 黄金知识 -->
    <div class="gold-knowledge">
      <div class="section-head">
        <span>黄金知识</span>
      </div>
      <div class="knowledge-list">
        <div class="knowledge-item" v-for="k in knowledge" :key="k.title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="k-title">{{ k.title }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 现货黄金数据
const spotData = ref({
  symbol: 'XAU/USD',
  name: '国际现货黄金',
  price: '2,650.00',
  changeAmount: '+8.50',
  change: 0.32,
  high24h: '2,658.00',
  low24h: '2,635.00',
  volume: '125.8K'
})

// 持仓数据
const holdings = ref({
  amount: '0.000',
  value: '0.00',
  pnl: 0,
  pnlPercent: 0
})

// 图表数据
const timeTabs = ['1H', '24H', '7D', '30D']
const activeTab = ref('24H')
const chartData = ref([2635, 2640, 2645, 2638, 2650, 2655, 2648, 2652, 2658, 2650])

const chartPoints = computed(() => {
  const width = 300
  const height = 120
  const padding = 10
  const dataPoints = chartData.value
  const max = Math.max(...dataPoints)
  const min = Math.min(...dataPoints)
  const range = max - min || 1
  
  return dataPoints.map((value, index) => ({
    x: padding + (index / (dataPoints.length - 1)) * (width - 2 * padding),
    y: padding + ((max - value) / range) * (height - 2 * padding)
  }))
})

const chartLine = computed(() => {
  const points = chartPoints.value
  if (points.length === 0) return ''
  
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }
  return path
})

const chartPath = computed(() => {
  const points = chartPoints.value
  if (points.length === 0) return ''
  
  let path = `M ${points[0].x} 120 L ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }
  path += ` L ${points[points.length - 1].x} 120 Z`
  return path
})

// 储备价值计算
const reserveValue = computed(() => {
  const kg = 1250
  const ozPerKg = 32.15 // 1公斤 = 32.15盎司
  const totalOz = kg * ozPerKg
  const pricePerOz = parseFloat(spotData.value.price.replace(/,/g, ''))
  const total = totalOz * pricePerOz
  return total.toLocaleString('en-US', { maximumFractionDigits: 0 })
})

// 理财产品
const products = ref([
  { name: '黄金活期', desc: '随存随取，收益稳定', apy: '5.2' },
  { name: '黄金定期30天', desc: '锁仓30天，更高收益', apy: '8.5' },
  { name: '黄金定期90天', desc: '锁仓90天，尊享收益', apy: '12.0' },
  { name: '黄金定期180天', desc: '锁仓180天，VIP收益', apy: '15.5' }
])

// 知识文章
const knowledge = ref([
  { title: '什么是数字黄金？' },
  { title: '如何购买和存储黄金？' },
  { title: '黄金投资的优势与风险' },
  { title: 'AGX黄金储备审计报告' }
])

// 定时器
let priceTimer = null
const isRefreshing = ref(false)

// 模拟实时价格更新
const updateSpotPrice = () => {
  const basePrice = 2650
  const fluctuation = (Math.random() - 0.5) * 10 // ±5美元波动
  const newPrice = basePrice + fluctuation
  const priceChange = fluctuation
  const percentChange = (priceChange / basePrice) * 100
  
  spotData.value = {
    symbol: 'XAU/USD',
    name: '国际现货黄金',
    price: newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    changeAmount: priceChange.toFixed(2),
    change: parseFloat(percentChange.toFixed(2)),
    high24h: (newPrice + Math.random() * 5).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    low24h: (newPrice - Math.random() * 10).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    volume: (Math.random() * 50 + 100).toFixed(1) + 'K'
  }
  
  // 更新图表数据
  chartData.value.shift()
  chartData.value.push(newPrice)
}

// 刷新数据
const refreshData = () => {
  isRefreshing.value = true
  updateSpotPrice()
  setTimeout(() => {
    isRefreshing.value = false
  }, 600)
}

onMounted(() => {
  // 首次更新
  updateSpotPrice()
  // 每3秒更新一次价格
  priceTimer = setInterval(updateSpotPrice, 3000)
})

onUnmounted(() => {
  if (priceTimer) clearInterval(priceTimer)
})
</script>

<style scoped>
/* 页面容器 */
.gold-page {
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
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
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

/* 可滚动内容区 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar {
  display: none;
}

.page-content {
  scrollbar-width: none;
}

/* 金价卡片 */
.gold-price-card {
  margin: 16px;
  padding: 24px 16px;
  background: linear-gradient(165deg, rgba(201, 169, 98, 0.12) 0%, #242930 100%);
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: 18px;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(201, 169, 98, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.gp-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.gp-icon {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 3px 6px rgba(201, 169, 98, 0.2));
}

.gp-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.gp-name {
  font-size: 19px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.gp-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.live-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: rgba(14, 203, 129, 0.12);
  border: 1px solid rgba(14, 203, 129, 0.3);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-up);
}

.live-dot {
  width: 6px;
  height: 6px;
  background: var(--color-up);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.gp-price {
  font-size: 40px;
  font-weight: 700;
  color: var(--color-brand);
  font-family: var(--font-mono);
  margin-bottom: 6px;
  letter-spacing: -1px;
}

.gp-change {
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-mono);
  margin-bottom: 20px;
}

.gp-change.up { color: var(--color-up); }
.gp-change.down { color: var(--color-down); }

.gp-stats {
  display: flex;
  gap: 16px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 600;
}

/* 快捷操作 */
.gold-actions {
  display: flex;
  gap: 12px;
  padding: 0 16px 20px;
}

.gold-btn {
  flex: 1;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.gold-btn:active {
  transform: scale(0.97) translateY(1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.gold-btn.buy {
  background: linear-gradient(135deg, #0ECB81 0%, #0BA968 100%);
  color: #fff;
}

.gold-btn.sell {
  background: linear-gradient(135deg, #F6465D 0%, #D83548 100%);
  color: #fff;
}

/* 我的持仓 */
.my-holdings {
  padding: 0 16px 24px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
}

.view-all {
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.holding-card {
  background: linear-gradient(145deg, #242930 0%, #1e2228 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 4px 0;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.holding-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.holding-row:last-child {
  border-bottom: none;
}

.h-label {
  color: var(--text-tertiary);
  font-weight: 500;
}

.h-value {
  color: var(--text-primary);
  font-weight: 600;
  font-family: var(--font-mono);
}

.h-value.gold {
  color: var(--color-brand);
}

.h-value.up { color: var(--color-up); }
.h-value.down { color: var(--color-down); }

/* 价格走势 */
.price-chart-section {
  padding: 0 16px 24px;
}

.time-tabs {
  display: flex;
  gap: 6px;
}

.time-tabs button {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s;
}

.time-tabs button.active {
  color: var(--color-brand);
  background: rgba(201, 169, 98, 0.12);
  border-color: rgba(201, 169, 98, 0.3);
}

.chart-container {
  margin-top: 12px;
  padding: 20px;
  background: linear-gradient(145deg, #242930 0%, #1e2228 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.mini-chart {
  width: 100%;
  height: 120px;
}

/* AGX储备 */
.gold-reserve {
  padding: 0 16px 24px;
}

.verified-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(14, 203, 129, 0.12);
  border: 1px solid rgba(14, 203, 129, 0.25);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-up);
}

.reserve-card {
  background: linear-gradient(145deg, #242930 0%, #1e2228 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 4px 0;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.reserve-row {
  display: flex;
  justify-content: space-between;
  padding: 13px 18px;
  font-size: 13px;
  color: var(--text-tertiary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.reserve-row:last-child {
  border-bottom: none;
}

.reserve-row .value {
  color: var(--text-primary);
  font-weight: 600;
  font-family: var(--font-mono);
}

.reserve-row .value.gold {
  color: var(--color-brand);
}

/* 理财产品 */
.gold-products {
  padding: 0 16px 24px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: linear-gradient(145deg, #242930 0%, #1e2228 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.product-item:active {
  transform: scale(0.98);
  background: linear-gradient(145deg, #2a2f36 0%, #22262c 100%);
}

.prod-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.prod-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201, 169, 98, 0.08);
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: 12px;
}

.prod-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prod-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.prod-desc {
  font-size: 12px;
  color: var(--text-tertiary);
}

.prod-apy {
  text-align: right;
}

.apy {
  display: block;
  font-size: 26px;
  font-weight: 700;
  color: var(--color-up);
  font-family: var(--font-mono);
  line-height: 1;
}

.apy-label {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 2px;
  display: block;
}

/* 黄金知识 */
.gold-knowledge {
  padding: 0 16px 24px;
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.knowledge-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 18px;
  background: linear-gradient(145deg, #242930 0%, #1e2228 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  transition: all 0.2s;
}

.knowledge-item:active {
  background: linear-gradient(145deg, #2a2f36 0%, #22262c 100%);
  transform: scale(0.98);
}

.knowledge-item svg:first-child {
  color: var(--color-brand);
  flex-shrink: 0;
}

.k-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.knowledge-item svg:last-child {
  color: var(--text-tertiary);
  flex-shrink: 0;
}
</style>
