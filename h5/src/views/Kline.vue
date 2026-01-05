<template>
  <div class="kline-page">
    <!-- 顶部栏 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <div class="header-pair">
        <div class="pair-icon" v-html="getSymbolIcon()"></div>
        <div class="pair-info">
          <span class="pair-name">{{ displaySymbol }}</span>
          <span class="pair-exchange">{{ exchange }}</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="header-btn" @click="toggleFavorite">
          <svg width="18" height="18" viewBox="0 0 24 24" :fill="isFavorite ? '#F0B90B' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
          </svg>
        </button>
        <button class="header-btn" @click="toggleFullscreen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 价格信息栏 -->
    <div class="price-bar">
      <div class="price-main">
        <span class="current-price" :class="priceDirection">{{ currentPrice }}</span>
        <span class="price-change" :class="changePercent >= 0 ? 'up' : 'down'">
          {{ changePercent >= 0 ? '+' : '' }}{{ changePercent }}%
        </span>
      </div>
      <div class="price-stats">
        <div class="stat-item">
          <span class="stat-label">24h最高</span>
          <span class="stat-value up">{{ high24h }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">24h最低</span>
          <span class="stat-value down">{{ low24h }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">24h额</span>
          <span class="stat-value">{{ volume24h }}</span>
        </div>
      </div>
    </div>

    <!-- 时间周期选择 -->
    <div class="timeframe-bar">
      <button 
        v-for="tf in timeframes" 
        :key="tf.value"
        :class="['tf-btn', { active: activeTimeframe === tf.value }]"
        @click="changeTimeframe(tf.value)"
      >{{ tf.label }}</button>
      <button class="tf-btn indicator-btn" @click="showIndicators = !showIndicators">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20V10M18 20V4M6 20v-4"/>
        </svg>
        指标
      </button>
    </div>

    <!-- TradingView 图表容器 -->
    <div class="chart-wrapper" :class="{ fullscreen: isFullscreen }">
      <div class="tradingview-widget-container" ref="chartContainer">
        <div class="tradingview-widget-container__widget"></div>
      </div>
      <div class="chart-loading" v-if="loading">
        <div class="spinner"></div>
        <span>加载图表...</span>
      </div>
    </div>

    <!-- 指标面板 -->
    <div class="indicator-panel" v-show="showIndicators">
      <div class="indicator-title">技术指标</div>
      <div class="indicator-list">
        <button 
          v-for="ind in indicators" 
          :key="ind.value"
          :class="['ind-btn', { active: activeIndicators.includes(ind.value) }]"
          @click="toggleIndicator(ind.value)"
        >{{ ind.label }}</button>
      </div>
    </div>

    <!-- 市场信息 -->
    <div class="market-info-section">
      <div class="section-header">
        <span class="section-title">市场信息</span>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">开盘价</span>
          <span class="info-value">{{ openPrice }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">收盘价</span>
          <span class="info-value">{{ closePrice }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">涨跌额</span>
          <span class="info-value" :class="changeAmount >= 0 ? 'up' : 'down'">{{ changeAmount >= 0 ? '+' : '' }}{{ changeAmount }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">振幅</span>
          <span class="info-value">{{ amplitude }}%</span>
        </div>
      </div>
    </div>

    <!-- 相关推荐 -->
    <div class="related-section">
      <div class="section-header">
        <span class="section-title">相关品种</span>
        <router-link to="/markets" class="see-all">查看全部</router-link>
      </div>
      <div class="related-list">
        <router-link 
          v-for="item in relatedSymbols" 
          :key="item.symbol"
          :to="`/kline?symbol=${item.tvSymbol}&exchange=${item.exchange}`"
          class="related-item"
        >
          <span class="related-name">{{ item.symbol }}</span>
          <span class="related-change" :class="item.change >= 0 ? 'up' : 'down'">
            {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
          </span>
        </router-link>
      </div>
    </div>

    <!-- 底部交易按钮 -->
    <div class="bottom-actions">
      <button class="action-btn buy" @click="goTrade('buy')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        买入
      </button>
      <button class="action-btn sell" @click="goTrade('sell')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
        卖出
      </button>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const symbol = ref(route.query.symbol || 'BTCUSDT')
const exchange = ref(route.query.exchange || 'BINANCE')
const loading = ref(true)
const isFullscreen = ref(false)
const isFavorite = ref(false)
const showIndicators = ref(false)
const activeTimeframe = ref('15')
const activeIndicators = ref(['MA'])
const priceDirection = ref('')

const chartContainer = ref(null)
let widgetScript = null

// 模拟数据
const currentPrice = ref('99,870.88')
const changePercent = ref(2.41)
const changeAmount = ref(2350.00)
const high24h = ref('101,250.00')
const low24h = ref('97,520.00')
const volume24h = ref('12.5B')
const openPrice = ref('97,520.88')
const closePrice = ref('99,870.88')
const amplitude = ref(3.82)

const timeframes = [
  { label: '1分', value: '1' },
  { label: '5分', value: '5' },
  { label: '15分', value: '15' },
  { label: '1时', value: '60' },
  { label: '4时', value: '240' },
  { label: '日', value: 'D' },
  { label: '周', value: 'W' }
]

const indicators = [
  { label: 'MA', value: 'MA' },
  { label: 'EMA', value: 'EMA' },
  { label: 'BOLL', value: 'BB' },
  { label: 'MACD', value: 'MACD' },
  { label: 'RSI', value: 'RSI' },
  { label: 'KDJ', value: 'STOCH' },
  { label: 'VOL', value: 'VOL' }
]

const relatedSymbols = ref([
  { symbol: 'ETH/USDT', tvSymbol: 'ETHUSDT', exchange: 'BINANCE', change: 1.89 },
  { symbol: 'BNB/USDT', tvSymbol: 'BNBUSDT', exchange: 'BINANCE', change: 0.85 },
  { symbol: 'SOL/USDT', tvSymbol: 'SOLUSDT', exchange: 'BINANCE', change: -1.03 },
  { symbol: 'XRP/USDT', tvSymbol: 'XRPUSDT', exchange: 'BINANCE', change: 3.21 }
])

const displaySymbol = computed(() => {
  const s = symbol.value.toUpperCase()
  if (s.includes('USDT')) return s.replace('USDT', '/USDT')
  if (s.includes('USD') && !s.includes('/')) return s.replace('USD', '/USD')
  if (s.includes('/')) return s
  return s
})

const getTradingViewSymbol = () => {
  const s = symbol.value.toUpperCase()
  const ex = exchange.value.toUpperCase()
  
  if (['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'AVAX', 'DOT', 'MATIC'].some(c => s.includes(c))) {
    return `BINANCE:${s.includes('USDT') ? s : s + 'USDT'}`
  }
  if (['EURUSD', 'GBPUSD', 'USDJPY', 'USDCNY', 'USDCNH', 'AUDUSD', 'USDCHF', 'NZDUSD', 'USDCAD'].includes(s.replace('/', ''))) {
    return `FX:${s.replace('/', '')}`
  }
  if (['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'META', 'AMZN', 'NFLX'].includes(s)) {
    return `NASDAQ:${s}`
  }
  if (['SPY', 'QQQ', 'IWM', 'DIA', 'VTI'].includes(s)) {
    return `AMEX:${s}`
  }
  if (s === 'GOLD' || s === 'XAUUSD') return 'TVC:GOLD'
  if (s === 'SILVER' || s === 'XAGUSD') return 'TVC:SILVER'
  if (s === 'OIL' || s === 'USOIL') return 'TVC:USOIL'
  if (s === 'UKOIL') return 'TVC:UKOIL'
  
  return `${ex}:${s}`
}

const getSymbolIcon = () => {
  const s = symbol.value.toUpperCase()
  const baseSymbol = s.split('USDT')[0].split('USD')[0].split('/')[0]
  
  const icons = {
    BTC: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#F7931A"/><text x="18" y="22" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">₿</text></svg>`,
    ETH: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#627EEA"/><text x="18" y="22" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">Ξ</text></svg>`,
    BNB: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#F3BA2F"/><text x="18" y="22" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">BNB</text></svg>`,
    SOL: `<svg viewBox="0 0 36 36"><defs><linearGradient id="gs" x1="0" y1="0" x2="36" y2="36"><stop stop-color="#9945FF"/><stop offset="1" stop-color="#14F195"/></linearGradient></defs><circle cx="18" cy="18" r="16" fill="url(#gs)"/><text x="18" y="22" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">SOL</text></svg>`,
    AAPL: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#A3AAAE"/><text x="18" y="22" text-anchor="middle" fill="#fff" font-size="9" font-weight="700">AAPL</text></svg>`,
    GOLD: `<svg viewBox="0 0 36 36"><defs><linearGradient id="gg" x1="0" y1="0" x2="36" y2="36"><stop stop-color="#FFD700"/><stop offset="1" stop-color="#DAA520"/></linearGradient></defs><circle cx="18" cy="18" r="16" fill="url(#gg)"/><rect x="12" y="14" width="12" height="8" rx="2" fill="#8B6914"/></svg>`,
    EUR: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#003399"/><text x="18" y="23" text-anchor="middle" fill="#FFCC00" font-size="14" font-weight="700">€</text></svg>`
  }
  
  return icons[baseSymbol] || `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#7C3AED"/><circle cx="18" cy="18" r="6" stroke="#fff" stroke-width="2" fill="none"/></svg>`
}

const initTradingViewWidget = () => {
  if (!chartContainer.value) return
  
  const container = chartContainer.value.querySelector('.tradingview-widget-container__widget')
  if (container) container.innerHTML = ''
  
  if (widgetScript && widgetScript.parentNode) {
    widgetScript.parentNode.removeChild(widgetScript)
  }

  const tvSymbol = getTradingViewSymbol()
  
  widgetScript = document.createElement('script')
  widgetScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
  widgetScript.type = 'text/javascript'
  widgetScript.async = true
  widgetScript.innerHTML = JSON.stringify({
    "autosize": true,
    "symbol": tvSymbol,
    "interval": activeTimeframe.value,
    "timezone": "Asia/Shanghai",
    "theme": "dark",
    "style": "1",
    "locale": "zh_CN",
    "enable_publishing": false,
    "hide_top_toolbar": false,
    "hide_legend": false,
    "save_image": false,
    "calendar": false,
    "hide_volume": false,
    "support_host": "https://www.tradingview.com",
    "studies": activeIndicators.value.map(ind => `STD;${ind}`)
  })

  chartContainer.value.appendChild(widgetScript)
  
  setTimeout(() => {
    loading.value = false
  }, 1500)
}

const changeTimeframe = (tf) => {
  activeTimeframe.value = tf
  loading.value = true
  initTradingViewWidget()
}

const toggleIndicator = (ind) => {
  const index = activeIndicators.value.indexOf(ind)
  if (index === -1) {
    activeIndicators.value.push(ind)
  } else {
    activeIndicators.value.splice(index, 1)
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const goTrade = (side) => {
  router.push(`/trade?pair=${symbol.value}&side=${side}`)
}

// 模拟价格更新
let priceTimer = null
const startPriceUpdate = () => {
  priceTimer = setInterval(() => {
    const basePrice = parseFloat(currentPrice.value.replace(/,/g, ''))
    const change = (Math.random() - 0.5) * basePrice * 0.001
    const newPrice = basePrice + change
    
    priceDirection.value = change >= 0 ? 'up' : 'down'
    currentPrice.value = newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
    setTimeout(() => {
      priceDirection.value = ''
    }, 300)
  }, 2000)
}

onMounted(() => {
  setTimeout(initTradingViewWidget, 100)
  startPriceUpdate()
})

onUnmounted(() => {
  if (widgetScript && widgetScript.parentNode) {
    widgetScript.parentNode.removeChild(widgetScript)
  }
  if (priceTimer) clearInterval(priceTimer)
})

watch(() => route.query.symbol, (newSymbol) => {
  if (newSymbol) {
    symbol.value = newSymbol
    loading.value = true
    setTimeout(initTradingViewWidget, 100)
  }
})

watch(() => route.query.exchange, (newExchange) => {
  if (newExchange) {
    exchange.value = newExchange
    loading.value = true
    setTimeout(initTradingViewWidget, 100)
  }
})
</script>

<style scoped>
.kline-page {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #1a1d24 0%, #14171e 100%);  
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 20px;
}

.kline-page::-webkit-scrollbar {
  display: none;
}

.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(24, 26, 32, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
}

.back-btn, .header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 10px;
  color: #848e9c;
}

.header-pair {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
}

.pair-icon {
  width: 32px;
  height: 32px;
}

.pair-icon :deep(svg) { width: 100%; height: 100%; }

.pair-info { display: flex; flex-direction: column; }

.pair-name {
  font-size: 16px;
  font-weight: 700;
  color: #eaecef;
}

.pair-exchange {
  font-size: 11px;
  color: #5e6673;
}

.header-actions { display: flex; gap: 8px; }

/* 价格信息栏 */
.price-bar {
  padding: 12px 16px;
  background: rgba(30, 35, 41, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 28px;
  font-weight: 700;
  color: #eaecef;
  font-family: var(--font-mono);
  transition: color 0.3s;
}

.current-price.up { color: #0ECB81; }
.current-price.down { color: #F6465D; }

.price-change {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.price-change.up { background: rgba(14, 203, 129, 0.15); color: #0ECB81; }
.price-change.down { background: rgba(246, 70, 93, 0.15); color: #F6465D; }

.price-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: #5e6673;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: #eaecef;
  font-family: var(--font-mono);
}

.stat-value.up { color: #0ECB81; }
.stat-value.down { color: #F6465D; }

/* 时间周期 */
.timeframe-bar {
  display: flex;
  gap: 4px;
  padding: 10px 16px;
  overflow-x: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.timeframe-bar::-webkit-scrollbar { display: none; }

.tf-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #848e9c;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  border-radius: 6px;
  white-space: nowrap;
}

.tf-btn.active {
  color: #A78BFA;
  background: rgba(139, 92, 246, 0.15);
}

.indicator-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 图表 */
.chart-wrapper {
  position: relative;
  height: 420px;
  min-height: 420px;
}

.chart-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  height: 100vh;
  min-height: 100vh;
}

.tradingview-widget-container {
  width: 100%;
  height: 100%;
  min-height: 420px;
}

.tradingview-widget-container__widget {
  width: 100%;
  height: 420px !important;
  min-height: 420px;
}

.chart-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(12, 14, 18, 0.8);
  color: #848e9c;
  font-size: 13px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(139, 92, 246, 0.2);
  border-top-color: #A78BFA;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* 指标面板 */
.indicator-panel {
  padding: 12px 16px;
  background: rgba(30, 35, 41, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.indicator-title {
  font-size: 12px;
  color: #5e6673;
  margin-bottom: 10px;
}

.indicator-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ind-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  color: #848e9c;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.ind-btn.active {
  color: #A78BFA;
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
}

/* 市场信息 */
.market-info-section {
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
}

.see-all {
  font-size: 12px;
  color: #A78BFA;
  text-decoration: none;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(30, 35, 41, 0.5);
  border-radius: 10px;
}

.info-label {
  font-size: 12px;
  color: #5e6673;
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  color: #eaecef;
  font-family: var(--font-mono);
}

.info-value.up { color: #0ECB81; }
.info-value.down { color: #F6465D; }

/* 相关推荐 */
.related-section {
  padding: 0 16px 16px;
}

.related-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.related-list::-webkit-scrollbar { display: none; }

.related-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  background: rgba(30, 35, 41, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  text-decoration: none;
  white-space: nowrap;
}

.related-name {
  font-size: 12px;
  font-weight: 600;
  color: #eaecef;
}

.related-change {
  font-size: 11px;
  font-weight: 600;
}

.related-change.up { color: #0ECB81; }
.related-change.down { color: #F6465D; }

/* 底部交易按钮 */
.bottom-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  margin: 16px;
  background: rgba(30, 35, 41, 0.6);
  border-radius: 16px;
}

.action-btn {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
}

.action-btn.buy {
  background: linear-gradient(135deg, #0ECB81, #0AA06A);
  color: #fff;
}

.action-btn.sell {
  background: linear-gradient(135deg, #F6465D, #D13A4D);
  color: #fff;
}

.action-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>
