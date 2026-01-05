<template>
  <PageLayout :show-back="true" :show-navbar="false">
    <div class="trade-custom-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <div class="header-pair" @click="$router.push('/markets')">
        <img :src="getCoinIcon()" class="pair-icon" alt="">
        <span class="pair-name">{{ symbol }}/USDT</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
      </div>
      <div class="header-info">
        <span class="price" :class="priceChange >= 0 ? 'up' : 'down'">{{ currentPrice }}</span>
        <span class="change" :class="priceChange >= 0 ? 'up' : 'down'">{{ priceChange >= 0 ? '+' : '' }}{{ priceChange }}%</span>
      </div>
      <button class="header-btn" @click="toggleFavorite">
        <svg width="18" height="18" viewBox="0 0 24 24" :fill="isFavorite ? '#F0B90B' : 'none'" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>
    </div>

    <div class="page-content">
      <!-- 价格信息 -->
      <div class="price-bar">
        <div class="price-item"><span>24H高</span><span>{{ high24h }}</span></div>
        <div class="price-item"><span>24H低</span><span>{{ low24h }}</span></div>
        <div class="price-item"><span>24H量</span><span>{{ volume24h }}</span></div>
      </div>

      <!-- K线图 -->
      <div class="chart-panel">
        <div class="chart-tabs">
          <button 
            v-for="tf in timeframes" 
            :key="tf.value"
            :class="['tf-btn', { active: activeTimeframe === tf.value }]"
            @click="changeTimeframe(tf.value)"
          >{{ tf.label }}</button>
        </div>
        <div class="chart-container" ref="chartContainer">
          <div class="chart-loading" v-if="chartLoading">
            <div class="spinner"></div>
          </div>
        </div>
      </div>

      <!-- 交易快捷操作 -->
      <div class="quick-actions">
        <div class="quick-btn leverage" @click="showLeverage = true">
          <span class="label">杠杆</span>
          <span class="value">{{ leverage }}x</span>
        </div>
        <div class="quick-btn order-type">
          <span class="label">限价单</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
        </div>
        <div class="quick-btn tp-sl">
          <span class="label">止盈止损</span>
          <span class="indicator off"></span>
        </div>
      </div>

      <!-- 交易操作 -->
      <div class="trade-panel">
        <div class="trade-tabs">
          <span :class="{ active: tradeDir === 'buy' }" @click="tradeDir = 'buy'">买入</span>
          <span :class="{ active: tradeDir === 'sell' }" @click="tradeDir = 'sell'">卖出</span>
        </div>
        
        <div class="trade-form">
          <div class="form-item">
            <div class="form-row">
              <label>价格</label>
              <span class="balance">可用 {{ tradeDir === 'buy' ? usdtBalance : coinBalance }} {{ tradeDir === 'buy' ? 'USDT' : symbol }}</span>
            </div>
            <div class="input-box">
              <input type="number" v-model="price" placeholder="市价">
              <span class="unit">USDT</span>
            </div>
          </div>

          <div class="form-item">
            <label>数量</label>
            <div class="input-box">
              <input type="number" v-model="amount" placeholder="0.00">
              <span class="unit">{{ symbol }}</span>
            </div>
          </div>

          <div class="percent-btns">
            <button v-for="p in [25, 50, 75, 100]" :key="p" :class="{ active: percent === p }" @click="setPercent(p)">{{ p }}%</button>
          </div>

          <div class="total-row">
            <span>成交额</span>
            <span class="total-val">{{ total }} USDT</span>
          </div>

          <button class="submit-btn" :class="tradeDir" @click="submitOrder">
            {{ tradeDir === 'buy' ? '买入' : '卖出' }} {{ symbol }}
          </button>
        </div>
      </div>

      <!-- 深度订单簿 -->
      <div class="orderbook-panel">
        <div class="orderbook-header">
          <span>实时深度</span>
          <div class="depth-tabs">
            <button :class="{ active: depthView === 'full' }" @click="depthView = 'full'">全部</button>
            <button :class="{ active: depthView === 'buy' }" @click="depthView = 'buy'">买盘</button>
            <button :class="{ active: depthView === 'sell' }" @click="depthView = 'sell'">卖盘</button>
          </div>
        </div>
        
        <div class="orderbook-content">
          <div class="orderbook-header-row">
            <span>价格(USDT)</span>
            <span>数量({{ symbol }})</span>
            <span>累计({{ symbol }})</span>
          </div>
          
          <!-- 卖盘数据 -->
          <div class="sell-orders" v-show="depthView === 'full' || depthView === 'sell'">
            <div v-for="order in sellOrders" :key="order.price" class="order-row sell" @click="setTradePrice(order.price)">
              <span class="price">{{ order.price }}</span>
              <span class="amount">{{ order.amount }}</span>
              <span class="total">{{ order.total }}</span>
              <div class="depth-bg" :style="{ width: order.percentage + '%' }"></div>
            </div>
          </div>
          
          <!-- 当前价格 -->
          <div class="current-price-row">
            <span class="spread-price" :class="priceChange >= 0 ? 'up' : 'down'">
              {{ currentPrice }} ≈ ${{ (parseFloat(currentPrice.replace(/,/g, '')) * 0.999).toLocaleString() }}
            </span>
            <span class="spread-info">价差: {{ spreadPercent }}%</span>
          </div>
          
          <!-- 买盘数据 -->
          <div class="buy-orders" v-show="depthView === 'full' || depthView === 'buy'">
            <div v-for="order in buyOrders" :key="order.price" class="order-row buy" @click="setTradePrice(order.price)">
              <span class="price">{{ order.price }}</span>
              <span class="amount">{{ order.amount }}</span>
              <span class="total">{{ order.total }}</span>
              <div class="depth-bg" :style="{ width: order.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前订单 -->
      <div class="orders-panel">
        <div class="orders-tabs">
          <span :class="{ active: orderTab === 'position' }" @click="orderTab = 'position'">当前持仓</span>
          <span :class="{ active: orderTab === 'current' }" @click="orderTab = 'current'">当前委托</span>
          <span :class="{ active: orderTab === 'history' }" @click="orderTab = 'history'">历史委托</span>
        </div>
        
        <!-- 持仓列表 -->
        <div class="positions-list" v-if="orderTab === 'position'">
          <div class="position-item" v-if="positions.length">
            <div v-for="pos in positions" :key="pos.id" class="position-card">
              <div class="pos-header">
                <span class="pos-pair">{{ pos.symbol }}/USDT</span>
                <span class="pos-leverage">{{ pos.leverage }}x</span>
                <span class="pos-side" :class="pos.side">{{ pos.side === 'long' ? '多' : '空' }}</span>
              </div>
              <div class="pos-stats">
                <div class="pos-stat">
                  <span class="label">未实现盈亏</span>
                  <span class="value" :class="pos.pnl >= 0 ? 'up' : 'down'">{{ pos.pnl >= 0 ? '+' : '' }}{{ pos.pnl }} USDT</span>
                </div>
                <div class="pos-stat">
                  <span class="label">收益率</span>
                  <span class="value" :class="pos.pnlPercent >= 0 ? 'up' : 'down'">{{ pos.pnlPercent >= 0 ? '+' : '' }}{{ pos.pnlPercent }}%</span>
                </div>
              </div>
              <div class="pos-details">
                <span>开仓价: {{ pos.entryPrice }}</span>
                <span>数量: {{ pos.amount }}</span>
                <span>强平价: {{ pos.liquidPrice }}</span>
              </div>
              <div class="pos-actions">
                <button class="btn-tp-sl">止盈止损</button>
                <button class="btn-close">平仓</button>
              </div>
            </div>
          </div>
          <div class="empty-orders" v-else>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 15h6"/>
            </svg>
            <p>暂无持仓</p>
          </div>
        </div>
        <div class="orders-list" v-if="orderTab !== 'position' && orders.length">
          <div class="order-item" v-for="order in orders" :key="order.id">
            <div class="order-row">
              <span class="order-pair">{{ order.symbol }}/USDT</span>
              <span class="order-side" :class="order.side">{{ order.side === 'buy' ? '买入' : '卖出' }}</span>
              <span class="order-price">{{ order.price }}</span>
            </div>
            <div class="order-row">
              <span class="order-time">{{ order.time }}</span>
              <span class="order-status">{{ order.status }}</span>
              <button class="order-cancel" v-if="order.status === '未成交'" @click="cancelOrder(order.id)">撤单</button>
            </div>
          </div>
        </div>
        <div class="empty-orders" v-if="orderTab !== 'position' && !orders.length">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 15h6"/>
          </svg>
          <p>暂无订单</p>
        </div>
      </div>

    <!-- 杠杆选择弹窗 -->
    <transition name="fade">
      <div class="modal-overlay" v-if="showLeverage" @click="showLeverage = false">
        <div class="leverage-modal" @click.stop>
          <div class="modal-header">
            <span>选择杠杆倍数</span>
            <button @click="showLeverage = false">×</button>
          </div>
          <div class="leverage-options">
            <button v-for="lv in [1, 5, 10, 20, 50, 100, 125]" :key="lv"
              :class="['lv-btn', { active: leverage === lv }]"
              @click="leverage = lv; showLeverage = false"
            >{{ lv }}x</button>
          </div>
          <div class="leverage-slider">
            <input type="range" min="1" max="125" v-model="leverage">
            <span class="lv-value">{{ leverage }}x</span>
          </div>
          <div class="leverage-warning">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/></svg>
            <span>高杠杆会放大风险，请谨慎操作</span>
          </div>
        </div>
      </div>
    </transition>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { createChart } from 'lightweight-charts'
import { alert } from '../utils/alert'
import PageLayout from '../components/layout/PageLayout.vue'

const route = useRoute()
const symbol = ref(route.query.pair?.split('_')[0] || 'BTC')
const isFavorite = ref(false)

// 获取币种图标
const cryptoIcons = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/small/cardano.png'
}

const getCoinIcon = () => {
  return cryptoIcons[symbol.value] || 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

// 价格数据
const currentPrice = ref('99,870.88')
const priceChange = ref(2.41)
const high24h = ref('101,250.00')
const low24h = ref('98,450.00')
const volume24h = ref('12.5K')

// 图表
const chartContainer = ref(null)
const chartLoading = ref(true)
let chart = null
let candleSeries = null
let volumeSeries = null

const activeTimeframe = ref('15m')
const timeframes = [
  { label: '1分', value: '1m' },
  { label: '5分', value: '5m' },
  { label: '15分', value: '15m' },
  { label: '1时', value: '1h' },
  { label: '4时', value: '4h' },
  { label: '1日', value: '1d' }
]

// 生成模拟K线数据
const generateKlineData = (count = 80) => {
  const data = []
  let basePrice = 99000
  const now = Math.floor(Date.now() / 1000)
  const interval = 60 * 15

  for (let i = count; i > 0; i--) {
    const time = now - i * interval
    const open = basePrice + (Math.random() - 0.5) * 500
    const close = open + (Math.random() - 0.5) * 800
    const high = Math.max(open, close) + Math.random() * 300
    const low = Math.min(open, close) - Math.random() * 300
    
    data.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2))
    })
    basePrice = close
  }
  return data
}

// 生成成交量数据
const generateVolumeData = (klineData) => {
  return klineData.map(candle => ({
    time: candle.time,
    value: Math.random() * 500 + 100,
    color: candle.close >= candle.open ? 'rgba(14, 203, 129, 0.5)' : 'rgba(246, 70, 93, 0.5)'
  }))
}

// 实时价格更新
const updateRealTimeData = () => {
  if (!candleSeries) return
  
  const lastCandle = candleSeries.dataByIndex(candleSeries.data().length - 1)
  if (!lastCandle) return
  
  // 模拟实时价格变化
  const change = (Math.random() - 0.5) * 50
  const newPrice = lastCandle.close + change
  const newChange = ((newPrice - lastCandle.open) / lastCandle.open * 100)
  
  currentPrice.value = newPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  
  priceChange.value = parseFloat(newChange.toFixed(2))
  
  // 更新24h数据
  const basePrice = parseFloat(currentPrice.value.replace(/,/g, ''))
  high24h.value = (basePrice + Math.random() * 1000).toLocaleString()
  low24h.value = (basePrice - Math.random() * 1000).toLocaleString()
  volume24h.value = (Math.random() * 50 + 10).toFixed(1) + 'K'
  
  // 更新图表最后一根蜡烛
  const time = Math.floor(Date.now() / 1000)
  const newCandle = {
    time: time,
    open: lastCandle.close,
    high: Math.max(lastCandle.close, newPrice) + Math.random() * 20,
    low: Math.min(lastCandle.close, newPrice) - Math.random() * 20,
    close: newPrice
  }
  
  candleSeries.update(newCandle)
  
  // 更新成交量
  const volume = {
    time: time,
    value: Math.random() * 500 + 100,
    color: newPrice >= lastCandle.close ? 'rgba(14, 203, 129, 0.5)' : 'rgba(246, 70, 93, 0.5)'
  }
  volumeSeries.update(volume)
}

// 价格推送定时器
let priceTimer = null
const startPriceUpdates = () => {
  priceTimer = setInterval(updateRealTimeData, 2000) // 每2秒更新
}

const stopPriceUpdates = () => {
  if (priceTimer) {
    clearInterval(priceTimer)
    priceTimer = null
  }
}

const initChart = () => {
  if (!chartContainer.value) return
  
  if (chart) {
    chart.remove()
    chart = null
  }

  const width = chartContainer.value.clientWidth
  const height = 260

  chart = createChart(chartContainer.value, {
    width,
    height,
    layout: {
      background: { type: 'solid', color: 'transparent' },
      textColor: '#848e9c'
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.04)' }
    },
    crosshair: {
      mode: 1,
      vertLine: { color: 'rgba(201, 169, 98, 0.4)', width: 1, style: 2 },
      horzLine: { color: 'rgba(201, 169, 98, 0.4)', width: 1, style: 2 }
    },
    rightPriceScale: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      scaleMargins: { top: 0.1, bottom: 0.2 }
    },
    timeScale: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      timeVisible: true,
      secondsVisible: false
    },
    handleScale: { axisPressedMouseMove: { time: true, price: true } },
    handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false }
  })

  candleSeries = chart.addCandlestickSeries({
    upColor: '#0ECB81',
    downColor: '#F6465D',
    borderUpColor: '#0ECB81',
    borderDownColor: '#F6465D',
    wickUpColor: '#0ECB81',
    wickDownColor: '#F6465D'
  })

  volumeSeries = chart.addHistogramSeries({
    priceFormat: { type: 'volume' },
    priceScaleId: 'volume',
    scaleMargins: { top: 0.85, bottom: 0 }
  })

  const klineData = generateKlineData()
  const volumeData = generateVolumeData(klineData)

  candleSeries.setData(klineData)
  volumeSeries.setData(volumeData)

  const lastCandle = klineData[klineData.length - 1]
  currentPrice.value = lastCandle.close.toLocaleString()
  
  chartLoading.value = false

  const resizeObserver = new ResizeObserver(() => {
    if (chart && chartContainer.value) {
      chart.applyOptions({ width: chartContainer.value.clientWidth })
    }
  })
  resizeObserver.observe(chartContainer.value)
}

const changeTimeframe = (tf) => {
  activeTimeframe.value = tf
  chartLoading.value = true
  setTimeout(() => {
    const klineData = generateKlineData()
    const volumeData = generateVolumeData(klineData)
    candleSeries.setData(klineData)
    volumeSeries.setData(volumeData)
    chartLoading.value = false
  }, 200)
}

// 交易表单
const tradeDir = ref('buy')
const price = ref('')
const amount = ref('')
const percent = ref(0)
const usdtBalance = ref('10,000.00')
const coinBalance = ref('0.5')
const leverage = ref(10)
const showLeverage = ref(false)

const total = computed(() => {
  const p = parseFloat(price.value) || parseFloat(currentPrice.value.replace(/,/g, ''))
  const a = parseFloat(amount.value) || 0
  return (p * a).toFixed(2)
})

const setPercent = (p) => {
  percent.value = p
  const maxAmt = tradeDir.value === 'buy' 
    ? parseFloat(usdtBalance.value.replace(/,/g, '')) / parseFloat(currentPrice.value.replace(/,/g, ''))
    : parseFloat(coinBalance.value)
  amount.value = ((maxAmt * p) / 100).toFixed(4)
}

const submitOrder = () => {
  alert(`${tradeDir.value === 'buy' ? '买入' : '卖出'} ${amount.value} ${symbol.value}`)
}

// 订单簿功能
const depthView = ref('full')
const sellOrders = ref([])
const buyOrders = ref([])
const spreadPercent = ref(0.02)

// 生成模拟订单簿数据
const generateOrderbookData = () => {
  const basePrice = parseFloat(currentPrice.value.replace(/,/g, ''))
  const newSellOrders = []
  const newBuyOrders = []
  
  let sellTotal = 0
  let buyTotal = 0
  
  // 生成卖盘
  for (let i = 1; i <= 10; i++) {
    const price = basePrice + (i * Math.random() * 50 + 10)
    const amount = (Math.random() * 2 + 0.1).toFixed(4)
    sellTotal += parseFloat(amount)
    
    newSellOrders.push({
      price: price.toFixed(2),
      amount: amount,
      total: sellTotal.toFixed(4),
      totalNum: sellTotal,
      percentage: Math.min((i / 10) * 100, 100)
    })
  }
  
  // 生成买盘
  for (let i = 1; i <= 10; i++) {
    const price = basePrice - (i * Math.random() * 50 + 10)
    const amount = (Math.random() * 2 + 0.1).toFixed(4)
    buyTotal += parseFloat(amount)
    
    newBuyOrders.push({
      price: price.toFixed(2),
      amount: amount,
      total: buyTotal.toFixed(4),
      totalNum: buyTotal,
      percentage: Math.min((i / 10) * 100, 100)
    })
  }
  
  sellOrders.value = newSellOrders.reverse() // 卖盘价格从高到低
  buyOrders.value = newBuyOrders // 买盘价格从高到低
  
  // 计算价差
  const bestSell = newSellOrders[newSellOrders.length - 1]?.price
  const bestBuy = newBuyOrders[0]?.price
  if (bestSell && bestBuy) {
    spreadPercent.value = (((parseFloat(bestSell) - parseFloat(bestBuy)) / parseFloat(bestBuy)) * 100).toFixed(4)
  }
}

// 设置交易价格
const setTradePrice = (orderPrice) => {
  price.value = orderPrice
}

// 更新订单簿
const updateOrderbook = () => {
  generateOrderbookData()
}

// 订单簿更新定时器
let orderbookTimer = null
const startOrderbookUpdates = () => {
  orderbookTimer = setInterval(updateOrderbook, 3000) // 每3秒更新订单簿
}

const stopOrderbookUpdates = () => {
  if (orderbookTimer) {
    clearInterval(orderbookTimer)
    orderbookTimer = null
  }
}

// 订单列表
const orderTab = ref('position')
const orders = ref([
  { id: 1, symbol: 'BTC', side: 'buy', price: '99,500.00', time: '14:23:45', status: '未成交' },
  { id: 2, symbol: 'ETH', side: 'sell', price: '3,580.00', time: '13:15:20', status: '部分成交' }
])

// 持仓数据
const positions = ref([
  {
    id: 1,
    symbol: 'BTC',
    side: 'long',
    leverage: 10,
    entryPrice: '99,250.00',
    amount: '0.15',
    liquidPrice: '89,500.00',
    pnl: 125.50,
    pnlPercent: 8.42
  }
])

const cancelOrder = async (id) => {
  orders.value = orders.value.filter(o => o.id !== id)
  await alert('撤单成功')
}

onMounted(() => {
  setTimeout(() => {
    initChart()
    generateOrderbookData()
    startPriceUpdates()
    startOrderbookUpdates()
  }, 100)
})

onUnmounted(() => {
  if (chart) {
    chart.remove()
    chart = null
  }
  stopPriceUpdates()
  stopOrderbookUpdates()
})

watch(() => route.query.pair, (newPair) => {
  if (newPair) {
    symbol.value = newPair.split('_')[0]
    chartLoading.value = true
    setTimeout(initChart, 100)
  }
})
</script>

<style scoped>
.trade-custom-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  padding-top: calc(10px + env(safe-area-inset-top));
  background: #181A20;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.back-btn, .header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #EAECEF;
}

.header-pair {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  cursor: pointer;
}

.header-pair:active {
  opacity: 0.8;
}

.pair-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.pair-name {
  font-size: 15px;
  font-weight: 700;
  color: #EAECEF;
}

.header-pair svg {
  color: #848E9C;
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  padding-right: 4px;
}

.price {
  font-size: 15px;
  font-weight: 600;
}

.change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.up { color: #0ECB81; }
.down { color: #F6465D; }
.change.up { background: rgba(14, 203, 129, 0.15); }
.change.down { background: rgba(246, 70, 93, 0.15); }

.page-content {
  padding-top: calc(56px + env(safe-area-inset-top));
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar {
  display: none;
}

.price-bar {
  display: flex;
  padding: 10px 16px;
  background: rgba(24, 26, 32, 0.6);
}

.price-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-item span:first-child {
  font-size: 10px;
  color: #5e6673;
}

.price-item span:last-child {
  font-size: 12px;
  font-weight: 600;
  color: #eaecef;
}

.chart-panel {
  background: #181A20;
  margin: 8px;
  border-radius: 12px;
  overflow: hidden;
}

.chart-tabs {
  display: flex;
  gap: 4px;
  padding: 10px 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.chart-tabs::-webkit-scrollbar { display: none; }

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
  color: #C9A962;
  background: rgba(201, 169, 98, 0.15);
}

.chart-container {
  height: 260px;
  position: relative;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 14, 18, 0.8);
  z-index: 10;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(201, 169, 98, 0.2);
  border-top-color: #C9A962;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.trade-panel {
  background: #181A20;
  margin: 0 8px 8px;
  border-radius: 12px;
  padding: 14px;
}

.trade-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  background: #0B0E11;
  border-radius: 8px;
  padding: 4px;
}

.trade-tabs span {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #848E9C;
}

.trade-tabs span.active {
  color: #fff;
  background: #0ECB81;
}

.trade-tabs span:last-child.active {
  background: #F6465D;
}

.form-item {
  margin-bottom: 12px;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.form-item label {
  font-size: 12px;
  color: #EAECEF;
  font-weight: 500;
}

.balance {
  font-size: 11px;
  color: #848E9C;
}

.input-box {
  background: #0B0E11;
  border: 1px solid #2B3139;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-box input {
  flex: 1;
  background: none;
  border: none;
  color: #EAECEF;
  font-size: 14px;
  outline: none;
}

.input-box input::placeholder {
  color: #474D57;
}

.unit {
  font-size: 12px;
  color: #848E9C;
}

.percent-btns {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.percent-btns button {
  flex: 1;
  padding: 7px;
  border-radius: 6px;
  background: #0B0E11;
  border: 1px solid #2B3139;
  color: #848E9C;
  font-size: 12px;
}

.percent-btns button.active {
  background: rgba(240, 185, 11, 0.15);
  border-color: #F0B90B;
  color: #F0B90B;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #0B0E11;
  border-radius: 8px;
  margin-bottom: 12px;
}

.total-row span:first-child {
  font-size: 12px;
  color: #848E9C;
}

.total-val {
  font-size: 14px;
  color: #EAECEF;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.submit-btn.buy {
  background: linear-gradient(135deg, #0ECB81, #0BA66C);
}

.submit-btn.sell {
  background: linear-gradient(135deg, #F6465D, #D9344E);
}

.submit-btn:active {
  opacity: 0.85;
  transform: scale(0.99);
}

.orders-panel {
  background: #181A20;
  margin: 0 8px 8px;
  border-radius: 12px;
  padding: 14px;
}

.orders-tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  border-bottom: 1px solid #2B3139;
  padding-bottom: 10px;
}

.orders-tabs span {
  font-size: 13px;
  color: #848E9C;
  position: relative;
  padding-bottom: 8px;
}

.orders-tabs span.active {
  color: #EAECEF;
  font-weight: 500;
}

.orders-tabs span.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #F0B90B;
  border-radius: 2px 2px 0 0;
}

.order-item {
  padding: 10px 0;
  border-bottom: 1px solid #2B3139;
}

.order-item:last-child {
  border-bottom: none;
}

.order-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  margin-bottom: 4px;
}

.order-pair {
  color: #EAECEF;
  font-weight: 500;
}

.order-side {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.order-side.buy {
  background: rgba(14, 203, 129, 0.15);
  color: #0ECB81;
}

.order-side.sell {
  background: rgba(246, 70, 93, 0.15);
  color: #F6465D;
}

.order-price {
  color: #EAECEF;
  font-weight: 500;
  margin-left: auto;
}

.order-time {
  color: #848E9C;
}

.order-status {
  color: #F0B90B;
  margin-left: auto;
}

.order-cancel {
  background: transparent;
  border: 1px solid #F6465D;
  color: #F6465D;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
}

.empty-orders {
  text-align: center;
  padding: 30px 20px;
  color: #474D57;
}

.empty-orders svg {
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-orders p {
  font-size: 13px;
}

/* 订单簿样式 */
.orderbook-panel {
  background: #1E2026;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
}

.orderbook-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-weight: 600;
  color: #EAECEF;
  font-size: 15px;
}

.depth-tabs {
  display: flex;
  gap: 2px;
  background: rgba(255,255,255,0.04);
  border-radius: 6px;
  padding: 2px;
}

.depth-tabs button {
  background: transparent;
  border: none;
  color: #848E9C;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;
}

.depth-tabs button.active {
  background: #F0B90B;
  color: #000;
  font-weight: 500;
}

.orderbook-content {
  max-height: 300px;
  overflow-y: auto;
}

.orderbook-header-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 12px 16px 8px;
  font-size: 11px;
  color: #848E9C;
  font-weight: 500;
  text-transform: uppercase;
}

.orderbook-header-row span:last-child {
  text-align: right;
}

.order-row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 4px 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.order-row:hover {
  background: rgba(255,255,255,0.02);
}

.order-row span:last-child {
  text-align: right;
}

.order-row.sell .price {
  color: #F6465D;
  font-weight: 500;
}

.order-row.buy .price {
  color: #0ECB81;
  font-weight: 500;
}

.order-row .amount {
  color: #EAECEF;
  text-align: center;
}

.order-row .total {
  color: #848E9C;
}

.depth-bg {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  opacity: 0.1;
  transition: width 0.3s ease;
  pointer-events: none;
}

.order-row.sell .depth-bg {
  background: linear-gradient(90deg, transparent, #F6465D);
}

.order-row.buy .depth-bg {
  background: linear-gradient(90deg, transparent, #0ECB81);
}

.current-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255,255,255,0.02);
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin: 4px 0;
}

.spread-price {
  font-weight: 600;
  font-size: 14px;
}

.spread-price.up {
  color: #0ECB81;
}

.spread-price.down {
  color: #F6465D;
}

.spread-info {
  font-size: 11px;
  color: #848E9C;
}

.sell-orders {
  max-height: 120px;
  overflow: hidden;
}

.buy-orders {
  max-height: 120px;
  overflow: hidden;
}

/* 快捷操作栏 */
.quick-actions {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(24, 26, 32, 0.6);
}

.quick-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  background: #181A20;
  border-radius: 8px;
  font-size: 12px;
  color: #848E9C;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btn:hover {
  background: #1E2026;
}

.quick-btn .label {
  color: #EAECEF;
  font-weight: 500;
}

.quick-btn .value {
  color: #F0B90B;
  font-weight: 600;
}

.quick-btn svg {
  color: #848E9C;
}

.quick-btn .indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #474D57;
}

.quick-btn .indicator.on {
  background: #0ECB81;
}

/* 杠杆弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.leverage-modal {
  width: 100%;
  max-width: 428px;
  background: #181A20;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #EAECEF;
  font-size: 16px;
  font-weight: 600;
}

.modal-header button {
  background: none;
  border: none;
  color: #848E9C;
  font-size: 24px;
  line-height: 1;
  padding: 0;
}

.leverage-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.lv-btn {
  flex: 1;
  min-width: 60px;
  padding: 10px 8px;
  background: #0B0E11;
  border: 1px solid #2B3139;
  border-radius: 8px;
  color: #848E9C;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.lv-btn.active {
  background: rgba(240, 185, 11, 0.15);
  border-color: #F0B90B;
  color: #F0B90B;
}

.leverage-slider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.leverage-slider input {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: linear-gradient(90deg, #F0B90B 0%, #2B3139 100%);
  border-radius: 2px;
}

.leverage-slider input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #F0B90B;
  border-radius: 50%;
  cursor: pointer;
}

.lv-value {
  color: #F0B90B;
  font-weight: 600;
  min-width: 45px;
}

.leverage-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(246, 70, 93, 0.1);
  border-radius: 8px;
  color: #F6465D;
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 持仓卡片样式 */
.position-card {
  background: #0B0E11;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 8px;
}

.pos-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.pos-pair {
  font-size: 14px;
  font-weight: 600;
  color: #EAECEF;
}

.pos-leverage {
  padding: 2px 6px;
  background: rgba(240, 185, 11, 0.15);
  color: #F0B90B;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.pos-side {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.pos-side.long {
  background: rgba(14, 203, 129, 0.15);
  color: #0ECB81;
}

.pos-side.short {
  background: rgba(246, 70, 93, 0.15);
  color: #F6465D;
}

.pos-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.pos-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pos-stat .label {
  font-size: 11px;
  color: #848E9C;
}

.pos-stat .value {
  font-size: 14px;
  font-weight: 600;
}

.pos-stat .value.up {
  color: #0ECB81;
}

.pos-stat .value.down {
  color: #F6465D;
}

.pos-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid #2B3139;
  border-bottom: 1px solid #2B3139;
  margin-bottom: 12px;
}

.pos-details span {
  font-size: 11px;
  color: #848E9C;
}

.pos-actions {
  display: flex;
  gap: 10px;
}

.pos-actions button {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: none;
}

.btn-tp-sl {
  background: rgba(255, 255, 255, 0.04);
  color: #EAECEF;
  border: 1px solid #2B3139 !important;
}

.btn-close {
  background: linear-gradient(135deg, #F0B90B, #DBA700);
  color: #000;
}
</style>
