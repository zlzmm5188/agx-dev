<template>
  <div class="home-page">
    <!-- 公告栏 - 固定在顶部 -->
    <div class="notice-bar">
      <span class="notice-icon">
        <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
          <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 6v5M10 13v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
      <div class="notice-scroll">
        <span class="notice-text">AGX v2.0即将上线，新增秒合约、多币种理财等功能，敬请期待！</span>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
    </div>

    <!-- 可滚动内容区域 -->
    <div class="page-content">

    <!-- 金币雨Banner -->
    <div class="coin-rain-banner">
      <!-- 金币雨效果 -->
      <div class="coin-rain" v-if="showCoinRain">
        <div v-for="n in 30" :key="n" class="coin" :style="getCoinStyle(n)">
          <img src="/agx-new.png" alt="coin">
        </div>
      </div>
      
      <!-- 金币雨动画层 -->
      <transition name="fade">
        <div v-if="showCoinRain" class="coin-rain-layer">
          <div v-for="i in 20" :key="i" class="coin" :style="getCoinStyle(i)">💰</div>
        </div>
      </transition>
      
      <!-- 轮播图片 - 金币雨结束后显示 -->
      <transition name="fade-in">
        <div class="final-image" v-if="showCryptoImg">
          <img src="/crypto-icons.png" alt="Banner" class="crypto-img">
        </div>
      </transition>
      
      <div class="banner-text" style="display: none;">
        <span class="banner-tag">新币</span>
        <h3>AGX即将首发</h3>
        <p>黄金背书，稳定可靠</p>
      </div>
    </div>

    <!-- AGX 新币发行卡片 -->
    <router-link to="/ieo" class="launch-card">
      <div class="launch-header">
        <div class="launch-icon">
          <img src="/agx-new.png" alt="AGX" @error="handleImgError">
        </div>
        <div class="launch-info">
          <div class="launch-title">AGX 升达金指币</div>
          <div class="launch-subtitle">首发价 <span>$1.6</span></div>
        </div>
        <div class="launch-status">
          <span class="status-dot"></span>
          <span>即将开启</span>
        </div>
      </div>
      
      <div class="launch-countdown">
        <div class="cd-item">
          <div class="cd-num">{{ countdown.days }}</div>
          <span class="cd-label">天</span>
        </div>
        <span class="cd-sep">:</span>
        <div class="cd-item">
          <div class="cd-num">{{ countdown.hours }}</div>
          <span class="cd-label">时</span>
        </div>
        <span class="cd-sep">:</span>
        <div class="cd-item">
          <div class="cd-num">{{ countdown.mins }}</div>
          <span class="cd-label">分</span>
        </div>
        <span class="cd-sep">:</span>
        <div class="cd-item">
          <div class="cd-num" :class="{ tick: flipState.secs }">{{ countdown.secs }}</div>
          <span class="cd-label">秒</span>
        </div>
      </div>

      <div class="launch-footer">
        <span>预约即将开始，敬请期待</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </router-link>

    <!-- 核心行情 - 轮播切换 -->
    <section class="ticker-section">
      <transition name="fade" mode="out-in">
        <div class="ticker-grid" :key="currentTickerType">
          <router-link 
            v-for="item in currentTickerData" 
            :key="item.symbol" 
            :to="item.link || `/trade?pair=${item.symbol}_USDT`" 
            class="ticker-card"
          >
            <div class="ticker-header">
              <span v-if="item.flag" class="ticker-flag">{{ item.flag }}</span>
              <img v-else :src="item.icon" class="ticker-icon" :alt="item.symbol">
              <div class="ticker-name">{{ item.symbol }}</div>
            </div>
            <div class="ticker-price">{{ item.price }}</div>
            <div class="ticker-change" :class="item.change >= 0 ? 'up' : 'down'">
              {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
            </div>
          </router-link>
        </div>
      </transition>
    </section>

    <!-- 黄金指数 -->
    <router-link to="/gold" class="gold-card">
      <div class="gold-left">
        <img src="/gold-bar.png" alt="Gold" class="gold-icon" style="border-radius: 4px;">
        <div class="gold-info">
        <span class="gold-name">{{ goldData.name }}</span>
        <span class="gold-sub">{{ goldData.desc }}</span>
        </div>
      </div>
      <div class="gold-right">
        <span class="gold-price">${{ goldData.price }}</span>
        <span class="gold-change" :class="goldData.change >= 0 ? 'up' : 'down'">
          {{ goldData.change >= 0 ? '+' : '' }}{{ goldData.change }}%
        </span>
      </div>
    </router-link>

    <!-- 快捷功能 -->
    <section class="quick-section">
      <div class="quick-grid">
        <router-link to="/ieo" class="quick-item">
          <div class="quick-icon">
            <img src="/12331a111.png" alt="新币">
          </div>
          <span>新币</span>
        </router-link>
        <router-link to="/trade" class="quick-item">
          <div class="quick-icon">
            <img src="/12331ac.png" alt="现货">
          </div>
          <span>现货</span>
        </router-link>
        <router-link to="/contract" class="quick-item">
          <div class="quick-icon">
            <img src="/12331a1c.png" alt="合约">
          </div>
          <span>合约</span>
        </router-link>
        <router-link to="/gold" class="quick-item">
          <div class="quick-icon">
            <img src="/12331a1c.png" alt="黄金">
          </div>
          <span>黄金</span>
        </router-link>
        <router-link to="/earn" class="quick-item">
          <div class="quick-icon">
            <img src="/12331aff.png" alt="理财">
          </div>
          <span>理财</span>
        </router-link>
        <router-link to="/mining" class="quick-item">
          <div class="quick-icon">
            <img src="/12331afff.png" alt="质押">
          </div>
          <span>质押</span>
        </router-link>
        <router-link to="/otc" class="quick-item">
          <div class="quick-icon">
            <img src="/12331agg.png" alt="OTC">
          </div>
          <span>OTC</span>
        </router-link>
        <router-link to="/ai" class="quick-item">
          <div class="quick-icon">
            <img src="/12331aeee.png" alt="AGX智能">
          </div>
          <span>AGX智能</span>
        </router-link>
      </div>
    </section>

    <!-- 热门行情 -->
    <section class="market-section">
      <div class="market-list">
        <router-link 
          v-for="(coin, index) in marketCoins" 
          :key="coin.symbol" 
          :to="`/trade?pair=${coin.symbol}_USDT`"
          class="market-item"
        >
          <span class="market-rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
          <img :src="coin.icon" class="market-icon" :alt="coin.symbol">
          <div class="market-info">
            <span class="market-name">{{ coin.symbol }}<small>/USDT</small></span>
            <span class="market-vol">Vol {{ coin.volume }}</span>
          </div>
          <div class="market-price">
            <span class="price-val">${{ coin.price }}</span>
            <span class="price-change" :class="coin.change >= 0 ? 'up' : 'down'">
              {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
            </span>
          </div>
        </router-link>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import api from '../utils/api'

const countdown = ref({ days: '00', hours: '00', mins: '00', secs: '00' })
const prevCountdown = ref({ days: '00', hours: '00', mins: '00', secs: '00' })
const flipState = ref({ days: false, hours: false, mins: false, secs: false })
const currentBannerImage = ref(0)
const showCoinRain = ref(true)
const showCryptoImg = ref(false) // 开场金币雨

const hotCoins = ref([
  { symbol: 'BTC', price: '$99,870.88', change: 2.41, icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { symbol: 'ETH', price: '$3,572.15', change: 3.54, icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'SOL', price: '$186.06', change: -1.03, icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' }
])

// 股票数据
const stockData = ref([
  { symbol: '贵州茅台', price: '¥1,650.00', change: 1.25, link: '/stock/maotai' },
  { symbol: '宁德时代', price: '¥345.60', change: -0.85, link: '/stock/ningde' },
  { symbol: '比亚迪', price: '¥268.90', change: 2.10, link: '/stock/byd' }
])

// 外汇数据
const forexData = ref([
  { symbol: 'EUR/USD', price: '1.0875', change: 0.15, link: '/forex/eurusd', flag: '🇪🇺' },
  { symbol: 'GBP/USD', price: '1.2650', change: -0.22, link: '/forex/gbpusd', flag: '🇬🇧' },
  { symbol: 'USD/JPY', price: '145.80', change: 0.35, link: '/forex/usdjpy', flag: '🇯🇵' }
])

// 基金数据
const fundData = ref([
  { symbol: '华夏成长', price: '¥1.6820', change: 1.85, link: '/fund/huaxia' },
  { symbol: '易方达中小盘', price: '¥2.3456', change: -0.52, link: '/fund/yifangda' },
  { symbol: '嘉实优质', price: '¥3.1245', change: 2.13, link: '/fund/harvest' }
])

// 期货数据
const futuresData = ref([
  { symbol: '原油', price: '$76.50', change: 1.80, link: '/futures/crude' },
  { symbol: '天然气', price: '$3.250', change: -2.15, link: '/futures/gas' },
  { symbol: '铜', price: '$8,750', change: 0.95, link: '/futures/copper' }
])

// 当前显示类型: 0=虚拟货币, 1=外汇
const currentTickerType = ref(0)
const currentTickerData = computed(() => {
  if (currentTickerType.value === 0) return hotCoins.value
  if (currentTickerType.value === 1) return forexData.value
  return []
})

const marketCoins = ref([
  { symbol: 'BTC', price: '99,870.88', change: 2.41, volume: '12.5K', icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { symbol: 'ETH', price: '3,572.15', change: 3.54, volume: '85.2K', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'SOL', price: '186.06', change: -1.03, volume: '25.8K', icon: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { symbol: 'BNB', price: '715.50', change: 1.28, volume: '18.3K', icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { symbol: 'XRP', price: '2.35', change: 5.67, volume: '156.7K', icon: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' }
])

// 黄金现货数据
const goldData = ref({
  name: '国际现货黄金 XAU/USD',
  desc: 'AGX 黄金储备支撑',
  price: '2,650.00',
  change: 0.35
})

let timer = null
let goldTimer = null
let tickerTimer = null
let bannerTimer = null
const timeoutIds = [] // 存储所有setTimeout的ID
const countdownTarget = new Date('2026-01-12T00:00:00').getTime() // 固定目标时间

// Banner图片轮播(10秒一次)
const switchBannerImage = () => {
  currentBannerImage.value = (currentBannerImage.value + 1) % 2 // 0-1循环
}

// 轮播切换行情类型(10秒一次)
const switchTickerType = () => {
  currentTickerType.value = (currentTickerType.value + 1) % 2 // 0-1循环
}

// 从后端获取黄金价格
const fetchGoldPrice = async () => {
  try {
    const res = await api.gold.getPrices()
    if (res.success && res.data) {
      const gold = res.data.gold || res.data
      if (gold && gold.price) {
        goldData.value = {
          name: '国际现货黄金 XAU/USD',
          desc: 'AGX 黄金储备支撑',
          price: parseFloat(gold.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          change: parseFloat(gold.change24h || 0).toFixed(2)
        }
      }
    }
  } catch (e) {
    console.log('黄金价格获取失败，使用默认数据')
  }
}

// 从后端获取行情数据
const fetchMarketData = async () => {
  try {
    const res = await api.market.getTickers('crypto', 'all')
    if (res.success && res.data && res.data.list) {
      const list = res.data.list.slice(0, 5)
      if (list.length > 0) {
        marketCoins.value = list.map(item => ({
          symbol: item.symbol?.replace('USDT', '') || item.symbol,
          price: parseFloat(item.price || 0).toLocaleString(),
          change: parseFloat(item.change24h || 0),
          volume: item.volume ? (parseFloat(item.volume) / 1000).toFixed(1) + 'K' : '0',
          icon: item.icon || `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`
        }))
        // 更新热门币种
        if (list.length >= 3) {
          hotCoins.value = list.slice(0, 3).map(item => ({
            symbol: item.symbol?.replace('USDT', '') || item.symbol,
            price: '$' + parseFloat(item.price || 0).toLocaleString(),
            change: parseFloat(item.change24h || 0),
            icon: item.icon || `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`
          }))
        }
      }
    }
  } catch (e) {
    console.log('行情数据获取失败，使用默认数据')
  }
}

const updateCountdown = () => {
  const diff = countdownTarget - Date.now()
  if (diff > 0) {
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    const newVal = {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      mins: String(m).padStart(2, '0'),
      secs: String(s).padStart(2, '0')
    }
    // 检测变化并触发翻牌
    const keys = ['days', 'hours', 'mins', 'secs']
    keys.forEach(key => {
      if (newVal[key] !== countdown.value[key]) {
        prevCountdown.value[key] = countdown.value[key]
        flipState.value[key] = true
        const timeoutId = setTimeout(() => { flipState.value[key] = false }, 600)
        timeoutIds.push(timeoutId)
      }
    })
    countdown.value = newVal
  }
}

const handleImgError = (e) => {
  e.target.style.background = 'linear-gradient(135deg, #C9A962, #8B7355)'
  e.target.src = 'data:,'
}

onMounted(async () => { 
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
  
  // 初始加载数据
  fetchGoldPrice()
  fetchMarketData()
  
  // 定时刷新黄金价格(30秒一次)
  goldTimer = setInterval(fetchGoldPrice, 30000)
  // 启动行情轮播（10秒一次）
  tickerTimer = setInterval(switchTickerType, 10000)
  // 开场金币雨动画,6秒后停止并显示图片
  setTimeout(() => {
    showCoinRain.value = false
    // 金币雨结束后0.3秒显示图片
    setTimeout(() => {
      showCryptoImg.value = true
    }, 300)
  }, 6000)
})
onUnmounted(() => { 
  if (timer) clearInterval(timer)
  if (goldTimer) clearInterval(goldTimer)
  if (tickerTimer) clearInterval(tickerTimer)
  // 清理所有setTimeout
  timeoutIds.forEach(id => clearTimeout(id))
  timeoutIds.length = 0
})

// 金币雨样式 - 大雨效果
const getCoinStyle = (n) => {
  const delay = (n * 0.2).toFixed(1)
  const duration = (2.5 + Math.random() * 2).toFixed(1)
  const left = (Math.random() * 100).toFixed(1)
  const size = (20 + Math.random() * 20).toFixed(0)  // 20-40px 更小
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}
</script>

<style scoped>
/* 公告栏 */
.notice-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(240, 185, 11, 0.08) 0%, rgba(240, 185, 11, 0.04) 100%);
  border: 1px solid rgba(240, 185, 11, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.notice-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F0B90B;
}

.notice-icon svg {
  width: 16px;
  height: 16px;
}

.notice-scroll {
  flex: 1;
  overflow: hidden;
}

.notice-text {
  display: inline-block;
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  animation: scrollText 20s linear infinite;
}

@keyframes scrollText {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.notice-bar > svg {
  color: var(--text-tertiary);
  flex-shrink: 0;
}

/* 金币雨动画层 */
.coin-rain-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
  overflow: hidden;
}

.coin {
  position: absolute;
  top: -50px;
  font-size: 24px;
  animation: coinFall linear infinite;
}

@keyframes coinFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(200px) rotate(360deg);
    opacity: 0;
  }
}

/* 金币雨Banner */
.coin-rain-banner {
  margin: 8px 0;
  padding: 16px 14px;
  min-height: 140px;
  background: 
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 60%, white, transparent),
    radial-gradient(1px 1px at 33% 80%, white, transparent),
    radial-gradient(1px 1px at 15% 90%, white, transparent),
    linear-gradient(180deg, #3a3d44 0%, #2e3036 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 
    0 6px 20px rgba(0,0,0,0.4),
    0 2px 8px rgba(0,0,0,0.3),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 2px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.5s ease;
}

.coin-rain-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* 金币雨容器 */
.coin-rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 15;
  transition: opacity 0.5s ease;
}

.coin-rain.rain-ended {
  opacity: 0;
}







.coin-display-enter-from {
  opacity: 0;
}

.coin-display-leave-to {
  opacity: 0;
}

/* 最终显示图 */
.final-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.crypto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

/* 金币雨容器 */
.coin-rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}

/* 金币 */
.coin {
  position: absolute;
  top: -50px;
  border-radius: 50%;
  animation: coinFall linear forwards;
  opacity: 0;
  filter: drop-shadow(0 4px 12px rgba(255, 215, 0, 0.5));
}

.coin img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

@keyframes coinFall {
  0% {
    transform: translateY(0) scale(0.5) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(10px) scale(1) rotate(45deg);
  }
  90% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(200px) scale(0.8) rotate(360deg);
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 图片淡入动画 */
.fade-in-enter-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in-enter-from {
  opacity: 0;
  transform: scale(0.9);
}















.banner-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.banner-text {
  flex: 1;
  position: relative;
  z-index: 10;
}

.banner-tag {
  display: inline-block;
  padding: 3px 10px;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  margin-bottom: 10px;
}

.banner-text h3 {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.banner-text p {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
}

/* 页面容器 */
.home-page {
  width: 100%;
  max-width: 428px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  overflow: hidden;
}

/* 可滚动内容区 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 80px;
}

/* 隐藏滚动条 */
.page-content::-webkit-scrollbar {
  display: none;
}

.page-content {
  scrollbar-width: none;
}

/* 全局链接点击效果 */
.home-page a:active {
  opacity: 0.9;
}

/* 公告栏 - 固定顶部 */
.notice-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
  padding: 10px 12px;
  background: linear-gradient(165deg, #242930 0%, #1a1e24 100%);
  border: 1px solid rgba(201, 169, 98, 0.25);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 
    0 0 0 1px rgba(201, 169, 98, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.4),
    0 1px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* 新币发行卡片 */
.launch-card {
  display: block;
  margin: 10px 0;
  padding: 20px 18px;
  background: linear-gradient(165deg, #242930 0%, #1a1e24 100%);
  border: 1px solid rgba(201, 169, 98, 0.25);
  border-radius: 18px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 0 1px rgba(201, 169, 98, 0.12),
    0 8px 32px rgba(0,0,0,0.5),
    0 4px 12px rgba(0,0,0,0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.launch-card:active {
  transform: scale(0.99) translateY(2px);
  box-shadow: 
    0 0 0 1px rgba(201, 169, 98, 0.2),
    0 2px 12px rgba(0,0,0,0.4);
}

/* 卡片背景装饰 */
.launch-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(201, 169, 98, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

.launch-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
}

.launch-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(145deg, #1a1e24 0%, #0f1317 100%);
  overflow: hidden;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.5),
    0 3px 10px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(201, 169, 98, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: #0e1013;
}

.launch-icon img { width: 100%; height: 100%; object-fit: cover; }

.launch-info { flex: 1; }

.launch-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.launch-title::after {
  content: 'HOT';
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  background: linear-gradient(135deg, #F6465D, #D4374A);
  border-radius: 4px;
  color: #fff;
}

.launch-subtitle {
  font-size: 14px;
  color: var(--text-tertiary);
}

.launch-subtitle span {
  color: #C9A962;
  font-weight: 600;
  font-size: 1.3rem;
}

.launch-status {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(14, 203, 129, 0.12);
  border: 1px solid rgba(14, 203, 129, 0.2);
  border-radius: 20px;
  font-size: 10px;
  font-weight: 500;
  color: #0ECB81;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #0ECB81;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(14, 203, 129, 0.5);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.launch-countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
}

.cd-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.cd-label {
  font-size: 11px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.cd-sep {
  font-size: 24px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 22px;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.3; }
}

.launch-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  margin: 0 -18px -20px;
  background: linear-gradient(180deg, transparent 0%, rgba(201, 169, 98, 0.02) 100%);
  border-top: 1px solid rgba(201, 169, 98, 0.05);
  font-size: 13px;
  font-weight: 500;
  color: #848E9C;
}

.launch-footer svg { 
  color: #848E9C; 
  transition: transform 0.2s ease;
}

.launch-card:active .launch-footer svg {
  transform: translateX(4px);
}

/* 行情卡片 */
.ticker-section { padding: 0 0 10px; overflow: hidden; }

/* 轻微淡入淡出效果 */
.fade-enter-active {
  transition: all 0.4s ease;
}

.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.ticker-grid {
  display: flex;
  gap: 10px;
  width: 100%;
  overflow: hidden;
}

/* 图片展示 */
.ticker-image {
  width: 100%;
  height: 120px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.06);
}

.ticker-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ticker-card {
  flex: 0 0 calc((100% - 20px) / 3);
  width: calc((100% - 20px) / 3);
  min-width: calc((100% - 20px) / 3);
  max-width: calc((100% - 20px) / 3);
  height: 110px;
  padding: 14px 12px;
  background: linear-gradient(180deg, #242930 0%, #1a1e24 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.ticker-card:active {
  transform: scale(0.98) translateY(1px);
  border-color: rgba(201, 169, 98, 0.25);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(201, 169, 98, 0.15);
}

.ticker-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ticker-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow: 
    0 4px 12px rgba(0,0,0,0.5),
    0 2px 4px rgba(0,0,0,0.3),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

/* 国旗 */
.ticker-flag {
  font-size: 24px;
  line-height: 1;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* emoji图标 */
.ticker-emoji {
  font-size: 24px;
  line-height: 1;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 文字图标（基金/指数） */
.ticker-icon-text {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-brand);
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(201, 169, 98, 0.05) 100%);
  border: 1px solid rgba(201, 169, 98, 0.3);
  border-radius: 50%;
  box-shadow: 
    0 4px 12px rgba(0,0,0,0.5),
    0 2px 4px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.ticker-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.ticker-name.index-name {
  color: var(--color-brand);
  font-weight: 700;
}

.ticker-pair {
  font-size: 11px;
  color: var(--text-tertiary);
}

.ticker-price {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.ticker-change {
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-mono);
  line-height: 1.3;
}

.ticker-change.up { color: var(--color-up); }
.ticker-change.down { color: var(--color-down); }

/* 黄金卡片 */
.gold-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 10px;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.12) 0%, #242930 100%);
  border: 1px solid rgba(201, 169, 98, 0.25);
  border-radius: 14px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(201, 169, 98, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.gold-card::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(201, 169, 98, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.gold-card:active {
  transform: scale(0.99) translateY(1px);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(201, 169, 98, 0.18);
}

.gold-left { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }

.gold-icon { 
  width: 40px; 
  height: 40px; 
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(201, 169, 98, 0.15));
}

.gold-info { display: flex; flex-direction: column; gap: 3px; }

.gold-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }

.gold-sub { font-size: 11px; color: var(--color-brand); }

.gold-right { 
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  text-align: right; 
  position: relative; 
  z-index: 1; 
}

.gold-price {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-brand);
  font-family: var(--font-mono);
}

.gold-change {
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-mono);
}

.gold-change.up { color: var(--color-up); }
.gold-change.down { color: var(--color-down); }

/* 快捷功能 */
.quick-section { padding: 0 0 12px; }

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px 12px;
  padding: 22px 18px;
  background: linear-gradient(180deg, #242930 0%, #1a1e24 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 2px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.quick-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  transition: all 180ms ease;
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  box-shadow: 
    0 6px 18px rgba(0, 0, 0, 0.4),
    0 3px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.quick-icon img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover;
  position: relative; 
  z-index: 1;
  filter: brightness(0.8) contrast(0.9) saturate(0.8);
  opacity: 0.85;
}

.quick-item:hover .quick-icon {
  transform: translateY(-2px) scale(1.05);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.35),
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.quick-item:hover .quick-icon img {
  filter: brightness(1.2) contrast(1.3) saturate(1.4);
}

.quick-item:active .quick-icon {
  transform: scale(0.95);
}

.quick-item span {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 热门行情 */
.market-section { padding: 0 0 24px; }

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-more {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.section-more:active {
  color: var(--color-brand);
}

.market-list {
  background: linear-gradient(180deg, #242930 0%, #1a1e24 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 2px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

.market-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  text-decoration: none;
  transition: background 100ms ease;
  position: relative;
}

.market-item:active { 
  background: rgba(201, 169, 98, 0.05);
}

.market-item + .market-item { border-top: 1px solid rgba(255, 255, 255, 0.04); }

.market-rank {
  width: 22px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-tertiary);
  text-align: center;
}

.market-rank.top { 
  color: var(--color-brand); 
  text-shadow: 0 0 10px rgba(201, 169, 98, 0.4);
}

.market-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(145deg, #2a2e35 0%, #1f2229 100%);
  box-shadow: 
    0 4px 12px rgba(0,0,0,0.4),
    0 2px 4px rgba(0,0,0,0.3),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

.market-info { flex: 1; min-width: 0; }

.market-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.market-name small {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 400;
  margin-left: 4px;
}

.market-vol {
  display: block;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 3px;
}

.market-price { text-align: right; }

.price-val {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.price-change {
  display: block;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-mono);
  margin-top: 3px;
}

.price-change.up { color: var(--color-up); }
.price-change.down { color: var(--color-down); }

/* 倒计时数字块 */
.cd-num {
  width: 56px;
  height: 64px;
  background: linear-gradient(180deg, #1a1e24 0%, #0f1317 100%);
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--color-brand);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.5),
    0 1px 4px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(201, 169, 98, 0.1),
    inset 0 2px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
}

/* 上半部分背景 */
.cd-num::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%);
  pointer-events: none;
}

/* 中间分割线 */
.cd-num::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(0,0,0,0.6) 10%,
    rgba(0,0,0,0.6) 90%,
    transparent 100%);
  transform: translateY(-50%);
}

/* 秒数跳动效果 */
.cd-num.tick {
  animation: numTick 0.15s ease-out;
}

@keyframes numTick {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); background: #1a1d21; }
  100% { transform: scale(1); }
}

</style>
