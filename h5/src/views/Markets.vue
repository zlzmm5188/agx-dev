<template>
  <div class="market-page">
    <!-- 固定顶部栏 -->
    <div class="page-header">
      <h1 class="page-title">行情中心</h1>
      <div class="header-actions">
        <button class="header-btn" @click="toggleView">
          <svg v-if="viewMode === 'list'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
        <button class="header-btn" @click="$router.push('/notifications')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="page-content">
      <!-- 自建滚动走马灯 -->
      <div class="ticker-tape">
        <div class="ticker-track">
          <div class="ticker-item" v-for="(item, idx) in tickerItems" :key="idx">
            <img :src="item.icon" class="ticker-icon" :alt="item.symbol">
            <span class="ticker-symbol">{{ item.symbol }}</span>
            <span class="ticker-price">{{ item.price }}</span>
            <span class="ticker-change" :class="item.change >= 0 ? 'up' : 'down'">
              {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
            </span>
          </div>
          <!-- 复制一份实现无缝滚动 -->
          <div class="ticker-item" v-for="(item, idx) in tickerItems" :key="'dup-' + idx">
            <img :src="item.icon" class="ticker-icon" :alt="item.symbol">
            <span class="ticker-symbol">{{ item.symbol }}</span>
            <span class="ticker-price">{{ item.price }}</span>
            <span class="ticker-change" :class="item.change >= 0 ? 'up' : 'down'">
              {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 分类Tab -->
      <div class="market-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key" 
          class="market-tab"
          :class="{ active: activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          <span class="tab-icon" v-html="tab.icon"></span>
          {{ tab.label }}
        </button>
      </div>

      <!-- 热力图/图表区域 -->
      <div class="widget-section" v-show="viewMode === 'heatmap'">
        <div class="widget-header">
          <span class="widget-title">{{ getWidgetTitle() }}</span>
          <span class="widget-source">数据来源: TradingView</span>
        </div>
        <div class="widget-container" ref="widgetContainer">
          <div class="widget-loading" v-if="widgetLoading">
            <div class="spinner"></div>
            <span>加载中...</span>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div class="list-section" v-show="viewMode === 'list'">
        <div class="market-header">
          <span class="mh-col name">品种</span>
          <span class="mh-col price">最新价</span>
          <span class="mh-col change">涨跌幅</span>
        </div>

        <div class="market-list">
          <router-link 
            v-for="coin in filteredCoins" 
            :key="coin.symbol" 
            :to="`/kline?symbol=${coin.tvSymbol}&exchange=${coin.exchange}`"
            class="market-item"
          >
            <div class="mi-left">
              <img :src="getCoinIcon(coin)" class="mi-icon-img" :alt="coin.symbol" @error="handleIconError">
              <div class="mi-info">
                <span class="mi-name">{{ coin.symbol }}</span>
                <span class="mi-vol">{{ coin.name }}</span>
              </div>
            </div>

            <div class="mi-prices">
              <span class="mi-price">{{ coin.pricePrefix }}{{ coin.price }}</span>
              <span class="mi-price-cny" v-if="coin.priceCny">≈¥{{ coin.priceCny }}</span>
            </div>
            <div class="mi-change-wrap">
              <span class="mi-change" :class="coin.change >= 0 ? 'up' : 'down'">
                {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
              </span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 快速导航 -->
      <div class="quick-nav">
        <router-link to="/ranking" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
          </svg>
          <span>排行榜</span>
        </router-link>
        <router-link to="/ai" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span>AI分析</span>
        </router-link>
        <router-link to="/gold" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a5 5 0 0110 0v2"/>
          </svg>
          <span>黄金专区</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { api } from '../utils/api'

const activeTab = ref('crypto')
const viewMode = ref('list')
const widgetLoading = ref(false)
const markets = ref([])
let updateTimer = null

const widgetContainer = ref(null)
let currentWidget = null

// 跑马灯数据
const tickerItems = ref([
  { symbol: 'BTC', price: '$99,870', change: 2.41, icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { symbol: 'ETH', price: '$3,826', change: 1.89, icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'GOLD', price: '$2,065', change: 0.78, icon: 'https://img.icons8.com/color/48/gold-bars.png' },
  { symbol: 'AAPL', price: '$195.89', change: 1.45, icon: 'https://companiesmarketcap.com/img/company-logos/64/AAPL.webp' },
  { symbol: 'EUR/USD', price: '1.0852', change: 0.23, icon: 'https://img.icons8.com/color/48/euro-pound-exchange.png' },
  { symbol: 'NVDA', price: '$875.30', change: 2.78, icon: 'https://companiesmarketcap.com/img/company-logos/64/NVDA.webp' },
  { symbol: 'SOL', price: '$186.06', change: -1.03, icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { symbol: 'SPY', price: '$480.50', change: 0.67, icon: 'https://img.icons8.com/color/48/futures.png' }
])

const tabs = [
  { key: 'crypto', label: '加密货币', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6"/></svg>' },
  { key: 'stock', label: '美股', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 5 5-9"/></svg>' },
  { key: 'forex', label: '外汇', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M6 12h2m8 0h2"/></svg>' },
  { key: 'fund', label: '基金ETF', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="4" height="10" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><rect x="17" y="2" width="4" height="18" rx="1"/></svg>' },
  { key: 'futures', label: '商品期货', icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="10" rx="2"/><path d="M8 8V6a4 4 0 018 0v2"/></svg>' }
]

// TradingView Widget 配置
const widgetConfigs = {
  crypto: {
    type: 'crypto-coins-heatmap',
    config: {
      "dataSource": "Crypto",
      "blockSize": "market_cap_calc",
      "blockColor": "change",
      "locale": "zh_CN",
      "colorTheme": "dark",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true
    }
  },
  stock: {
    type: 'stock-heatmap',
    config: {
      "exchanges": [],
      "dataSource": "SPX500",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "zh_CN",
      "colorTheme": "dark",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true
    }
  },
  forex: {
    type: 'forex-cross-rates',
    config: {
      "currencies": ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "CNY"],
      "isTransparent": false,
      "colorTheme": "dark",
      "locale": "zh_CN"
    }
  },
  fund: {
    type: 'market-overview',
    config: {
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": true,
      "locale": "zh_CN",
      "largeChartUrl": "",
      "isTransparent": false,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "tabs": [
        {
          "title": "指数ETF",
          "symbols": [
            { "s": "AMEX:SPY", "d": "标普500 ETF" },
            { "s": "NASDAQ:QQQ", "d": "纳指100 ETF" },
            { "s": "AMEX:IWM", "d": "罗素2000 ETF" },
            { "s": "AMEX:DIA", "d": "道琼斯 ETF" },
            { "s": "AMEX:VTI", "d": "全美股票 ETF" }
          ]
        }
      ]
    }
  },
  futures: {
    type: 'market-overview',
    config: {
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": true,
      "locale": "zh_CN",
      "isTransparent": false,
      "showSymbolLogo": true,
      "tabs": [
        {
          "title": "商品期货",
          "symbols": [
            { "s": "TVC:GOLD", "d": "黄金" },
            { "s": "TVC:SILVER", "d": "白银" },
            { "s": "TVC:USOIL", "d": "WTI原油" },
            { "s": "TVC:UKOIL", "d": "布伦特原油" },
            { "s": "NYMEX:NG1!", "d": "天然气" }
          ]
        }
      ]
    }
  }
}

const getWidgetTitle = () => {
  const titles = {
    crypto: '加密货币热力图',
    stock: '美股热力图',
    forex: '外汇交叉汇率',
    fund: '基金ETF概览',
    futures: '商品期货概览'
  }
  return titles[activeTab.value] || '市场概览'
}

const switchTab = (key) => {
  activeTab.value = key
  if (viewMode.value === 'heatmap') {
    loadWidget()
  }
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'heatmap' : 'list'
  if (viewMode.value === 'heatmap') {
    nextTick(() => loadWidget())
  }
}

// 加载 TradingView Widget
const loadWidget = () => {
  if (!widgetContainer.value) return
  
  widgetLoading.value = true
  
  // 清除旧 widget
  widgetContainer.value.innerHTML = ''
  
  const config = widgetConfigs[activeTab.value]
  if (!config) return
  
  const widgetDiv = document.createElement('div')
  widgetDiv.className = 'tradingview-widget-container__widget'
  widgetContainer.value.appendChild(widgetDiv)
  
  const script = document.createElement('script')
  script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${config.type}.js`
  script.async = true
  script.innerHTML = JSON.stringify({
    ...config.config,
    "width": "100%",
    "height": 400
  })
  
  widgetContainer.value.appendChild(script)
  
  setTimeout(() => {
    widgetLoading.value = false
  }, 2000)
}

// 模拟数据
const loadFallbackData = () => {
  markets.value = [
    // 加密货币
    { symbol: 'BTC/USDT', tvSymbol: 'BTCUSDT', exchange: 'BINANCE', name: '比特币', price: '99,870.88', pricePrefix: '$', priceCny: '727,179', change: 2.41, category: 'crypto' },
    { symbol: 'ETH/USDT', tvSymbol: 'ETHUSDT', exchange: 'BINANCE', name: '以太坊', price: '3,826.45', pricePrefix: '$', priceCny: '27,856', change: 1.89, category: 'crypto' },
    { symbol: 'BNB/USDT', tvSymbol: 'BNBUSDT', exchange: 'BINANCE', name: '币安币', price: '715.50', pricePrefix: '$', priceCny: '5,208', change: 0.85, category: 'crypto' },
    { symbol: 'SOL/USDT', tvSymbol: 'SOLUSDT', exchange: 'BINANCE', name: '索拉纳', price: '186.06', pricePrefix: '$', priceCny: '1,354', change: -1.03, category: 'crypto' },
    { symbol: 'XRP/USDT', tvSymbol: 'XRPUSDT', exchange: 'BINANCE', name: '瑞波币', price: '2.45', pricePrefix: '$', priceCny: '17.84', change: 3.21, category: 'crypto' },
    { symbol: 'DOGE/USDT', tvSymbol: 'DOGEUSDT', exchange: 'BINANCE', name: '狗狗币', price: '0.3856', pricePrefix: '$', priceCny: '2.81', change: 2.15, category: 'crypto' },
    
    // 美股
    { symbol: 'AAPL', tvSymbol: 'AAPL', exchange: 'NASDAQ', name: '苹果公司', price: '195.89', pricePrefix: '$', priceCny: '1,426', change: 1.45, category: 'stock' },
    { symbol: 'GOOGL', tvSymbol: 'GOOGL', exchange: 'NASDAQ', name: '谷歌A类', price: '140.93', pricePrefix: '$', priceCny: '1,026', change: 0.87, category: 'stock' },
    { symbol: 'MSFT', tvSymbol: 'MSFT', exchange: 'NASDAQ', name: '微软', price: '415.26', pricePrefix: '$', priceCny: '3,023', change: 0.93, category: 'stock' },
    { symbol: 'TSLA', tvSymbol: 'TSLA', exchange: 'NASDAQ', name: '特斯拉', price: '248.50', pricePrefix: '$', priceCny: '1,809', change: -1.24, category: 'stock' },
    { symbol: 'NVDA', tvSymbol: 'NVDA', exchange: 'NASDAQ', name: '英伟达', price: '875.30', pricePrefix: '$', priceCny: '6,372', change: 2.78, category: 'stock' },
    { symbol: 'META', tvSymbol: 'META', exchange: 'NASDAQ', name: 'Meta平台', price: '511.50', pricePrefix: '$', priceCny: '3,723', change: 1.45, category: 'stock' },
    
    // 外汇
    { symbol: 'EUR/USD', tvSymbol: 'EURUSD', exchange: 'FX', name: '欧元/美元', price: '1.0852', pricePrefix: '', priceCny: null, change: 0.23, category: 'forex' },
    { symbol: 'GBP/USD', tvSymbol: 'GBPUSD', exchange: 'FX', name: '英镑/美元', price: '1.2698', pricePrefix: '', priceCny: null, change: -0.18, category: 'forex' },
    { symbol: 'USD/JPY', tvSymbol: 'USDJPY', exchange: 'FX', name: '美元/日元', price: '149.85', pricePrefix: '', priceCny: null, change: 0.45, category: 'forex' },
    { symbol: 'USD/CNH', tvSymbol: 'USDCNH', exchange: 'FX', name: '美元/离岸人民币', price: '7.2800', pricePrefix: '', priceCny: null, change: 0.12, category: 'forex' },
    { symbol: 'AUD/USD', tvSymbol: 'AUDUSD', exchange: 'FX', name: '澳元/美元', price: '0.6543', pricePrefix: '', priceCny: null, change: -0.31, category: 'forex' },
    
    // 基金ETF
    { symbol: 'SPY', tvSymbol: 'SPY', exchange: 'AMEX', name: '标普500ETF', price: '480.50', pricePrefix: '$', priceCny: '3,498', change: 0.67, category: 'fund' },
    { symbol: 'QQQ', tvSymbol: 'QQQ', exchange: 'NASDAQ', name: '纳斯达克100ETF', price: '408.90', pricePrefix: '$', priceCny: '2,976', change: 1.23, category: 'fund' },
    { symbol: 'IWM', tvSymbol: 'IWM', exchange: 'AMEX', name: '罗素2000ETF', price: '197.80', pricePrefix: '$', priceCny: '1,440', change: -0.65, category: 'fund' },
    
    // 期货商品
    { symbol: 'GOLD', tvSymbol: 'GOLD', exchange: 'TVC', name: '黄金现货', price: '2,065.40', pricePrefix: '$', priceCny: '15,036', change: 0.78, category: 'futures' },
    { symbol: 'SILVER', tvSymbol: 'SILVER', exchange: 'TVC', name: '白银现货', price: '24.85', pricePrefix: '$', priceCny: '180.91', change: 1.45, category: 'futures' },
    { symbol: 'USOIL', tvSymbol: 'USOIL', exchange: 'TVC', name: 'WTI原油', price: '78.50', pricePrefix: '$', priceCny: '571.48', change: -0.92, category: 'futures' },
    { symbol: 'UKOIL', tvSymbol: 'UKOIL', exchange: 'TVC', name: '布伦特原油', price: '82.30', pricePrefix: '$', priceCny: '599.14', change: -0.75, category: 'futures' }
  ]
  
  startPriceSimulation()
}

const startPriceSimulation = () => {
  updateTimer = setInterval(() => {
    markets.value.forEach(market => {
      const changeRate = (Math.random() - 0.5) * 0.005
      const currentPrice = parseFloat(market.price.replace(/,/g, ''))
      const newPrice = currentPrice * (1 + changeRate)
      market.price = newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: market.symbol.includes('/') ? 4 : 2 })
      if (market.priceCny) {
        market.priceCny = (newPrice * 7.28).toLocaleString('en-US', { maximumFractionDigits: 0 })
      }
      market.change = (parseFloat(market.change) + changeRate * 50).toFixed(2)
    })
  }, 3000)
}

const filteredCoins = computed(() => {
  return markets.value.filter(coin => coin.category === activeTab.value)
})

// 加密货币图标
const cryptoIcons = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png'
}

// 股票图标
const stockIcons = {
  AAPL: 'https://companiesmarketcap.com/img/company-logos/64/AAPL.webp',
  GOOGL: 'https://companiesmarketcap.com/img/company-logos/64/GOOG.webp',
  MSFT: 'https://companiesmarketcap.com/img/company-logos/64/MSFT.webp',
  TSLA: 'https://companiesmarketcap.com/img/company-logos/64/TSLA.webp',
  NVDA: 'https://companiesmarketcap.com/img/company-logos/64/NVDA.webp',
  META: 'https://companiesmarketcap.com/img/company-logos/64/META.webp',
  AMZN: 'https://companiesmarketcap.com/img/company-logos/64/AMZN.webp'
}

// 获取币种图标
const getCoinIcon = (coin) => {
  const baseSymbol = coin.symbol.split('/')[0].replace('USDT', '').replace('USD', '')
  
  // 加密货币
  if (cryptoIcons[baseSymbol]) return cryptoIcons[baseSymbol]
  
  // 股票
  if (stockIcons[baseSymbol] || stockIcons[coin.tvSymbol]) {
    return stockIcons[baseSymbol] || stockIcons[coin.tvSymbol]
  }
  
  // 外汇
  if (coin.category === 'forex') {
    return 'https://img.icons8.com/color/48/euro-pound-exchange.png'
  }
  
  // 基金ETF
  if (coin.category === 'fund') {
    return 'https://img.icons8.com/color/48/futures.png'
  }
  
  // 期货商品
  if (coin.symbol === 'GOLD') return 'https://img.icons8.com/color/48/gold-bars.png'
  if (coin.symbol === 'SILVER') return 'https://img.icons8.com/color/48/silver-bars.png'
  if (coin.symbol.includes('OIL')) return 'https://img.icons8.com/color/48/oil-industry.png'
  
  // 默认
  return 'https://img.icons8.com/color/48/cryptocurrency.png'
}

onMounted(() => {
  loadFallbackData()
})

const handleIconError = (e) => {
  e.target.src = 'https://img.icons8.com/color/48/cryptocurrency.png'
}

onUnmounted(() => {
  if (updateTimer) clearInterval(updateTimer)
})

watch(activeTab, () => {
  if (viewMode.value === 'heatmap') {
    loadWidget()
  }
})
</script>

<style scoped>
.market-page {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #1a1d24 0%, #14171e 100%);
}

.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(24, 26, 32, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #eaecef;
  margin: 0;
}

.header-actions { display: flex; gap: 8px; }

.header-btn {
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

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 80px;
}

.page-content::-webkit-scrollbar {
  display: none;
}

/* 跑马灯 */
.ticker-tape {
  height: 50px;
  overflow: hidden;
  background: rgba(24, 26, 32, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.ticker-track {
  display: flex;
  animation: tickerScroll 30s linear infinite;
  width: max-content;
}

@keyframes tickerScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  height: 50px;
  white-space: nowrap;
}

.ticker-item .ticker-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.ticker-symbol {
  font-size: 13px;
  font-weight: 600;
  color: #eaecef;
}

.ticker-price {
  font-size: 13px;
  color: #b7bdc6;
  font-family: var(--font-mono);
}

.ticker-change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.ticker-change.up {
  color: #0ECB81;
  background: rgba(14, 203, 129, 0.1);
}

.ticker-change.down {
  color: #F6465D;
  background: rgba(246, 70, 93, 0.1);
}

/* 分类Tab */
.market-tabs {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  overflow-x: auto;
}

.market-tabs::-webkit-scrollbar { display: none; }

.market-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #848e9c;
  white-space: nowrap;
  transition: all 0.2s;
}

.market-tab.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.1));
  border-color: rgba(139, 92, 246, 0.3);
  color: #A78BFA;
}

.tab-icon { display: flex; align-items: center; }

/* Widget区域 */
.widget-section {
  margin: 0 16px 16px;
  background: rgba(30, 35, 41, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.widget-title {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
}

.widget-source {
  font-size: 11px;
  color: #5e6673;
}

.widget-container {
  min-height: 400px;
  position: relative;
}

.widget-loading {
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

/* 列表区域 */
.list-section { padding: 0 16px; }

.market-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 11px;
  color: #5e6673;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.mh-col.name { flex: 2; }
.mh-col.price { flex: 1.5; text-align: right; }
.mh-col.change { flex: 1; text-align: right; }

.market-list { margin-top: 8px; }

.market-item {
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  text-decoration: none;
  transition: background 0.15s;
}

.market-item:active { background: rgba(255, 255, 255, 0.02); }

.mi-left {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 12px;
}

.mi-icon-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
}

.mi-info { display: flex; flex-direction: column; gap: 2px; }

.mi-name {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
}

.mi-vol {
  font-size: 11px;
  color: #5e6673;
}

.mi-prices {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.mi-price {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
  font-family: var(--font-mono);
}

.mi-price-cny {
  font-size: 11px;
  color: #5e6673;
}

.mi-change-wrap { flex: 1; display: flex; justify-content: flex-end; }

.mi-change {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-mono);
}

.mi-change.up { background: rgba(14, 203, 129, 0.15); color: #0ECB81; }
.mi-change.down { background: rgba(246, 70, 93, 0.15); color: #F6465D; }

/* 快速导航 */
.quick-nav {
  display: flex;
  gap: 10px;
  margin: 20px 16px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  background: rgba(30, 35, 41, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  text-decoration: none;
  color: #848e9c;
  font-size: 12px;
  transition: all 0.15s;
}

.nav-item:active {
  transform: scale(0.97);
  background: rgba(36, 41, 48, 0.8);
}
</style>
