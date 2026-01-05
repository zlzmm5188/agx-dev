<template>
  <PageLayout :show-back="true" :title="'交易市场'">
    <div class="markets-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索交易对" 
          class="search-input"
        >
      </div>

      <div class="market-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab-btn', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="pairs-list">
        <div 
          v-for="pair in filteredPairs" 
          :key="pair.symbol"
          class="pair-item"
          @click="selectPair(pair)"
        >
          <div class="pair-info">
            <div class="pair-name">
              <span class="base">{{ pair.baseCoin }}</span>
              <span class="quote">/{{ pair.quoteCoin }}</span>
            </div>
            <div class="pair-price">{{ formatPrice(pair.lastPrice) }}</div>
          </div>
          <div class="pair-stats">
            <div class="change" :class="pair.priceChangePercent >= 0 ? 'up' : 'down'">
              {{ pair.priceChangePercent >= 0 ? '+' : '' }}{{ pair.priceChangePercent }}%
            </div>
            <div class="volume">量 {{ formatVolume(pair.volume) }}</div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '../components/layout/PageLayout.vue'
import { api } from '../utils/api'

const router = useRouter()
const searchKeyword = ref('')
const activeTab = ref('all')
const pairs = ref([])

const tabs = [
  { label: '全部', value: 'all' },
  { label: '热门', value: 'hot' },
  { label: '涨幅', value: 'gainers' },
  { label: '跌幅', value: 'losers' },
  { label: 'USDT', value: 'usdt' }
]

// 获取交易对列表
const loadPairs = async () => {
  try {
    // 从行情API获取数据
    const response = await api.market.getTickers('crypto', activeTab.value)
    if (response.success) {
      pairs.value = response.data.list.map(item => ({
        symbol: item.symbol,
        baseCoin: item.symbol.replace('USDT', '').replace('BTC', '').replace('ETH', '').replace('BNB', ''),
        quoteCoin: item.symbol.includes('USDT') ? 'USDT' : 
                  item.symbol.includes('BTC') ? 'BTC' : 
                  item.symbol.includes('ETH') ? 'ETH' : 'BNB',
        lastPrice: item.lastPrice,
        priceChangePercent: parseFloat(item.priceChangePercent || 0),
        volume: item.volume
      }))
    }
  } catch (error) {
    console.error('获取交易对失败:', error)
  }
}

// 过滤后的交易对列表
const filteredPairs = computed(() => {
  let result = pairs.value
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(pair => 
      pair.baseCoin.toLowerCase().includes(keyword) || 
      pair.quoteCoin.toLowerCase().includes(keyword)
    )
  }
  
  // 根据标签过滤
  if (activeTab.value === 'usdt') {
    result = result.filter(pair => pair.quoteCoin === 'USDT')
  }
  
  return result
})

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0.00'
  return parseFloat(price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  })
}

// 格式化交易量
const formatVolume = (volume) => {
  if (!volume) return '0'
  const num = parseFloat(volume)
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B'
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K'
  return num.toLocaleString()
}

// 选择交易对
const selectPair = (pair) => {
  // 跳转到交易页面，传递交易对参数
  router.push(`/trade?pair=${pair.baseCoin}_${pair.quoteCoin}`)
}

onMounted(() => {
  loadPairs()
})
</script>

<style scoped>
.markets-container {
  padding: 16px;
  min-height: 100vh;
  background: #0B0E11;
}

.search-box {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  background: #181A20;
  border: 1px solid #2B3139;
  border-radius: 8px;
  color: #EAECEF;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #F0B90B;
}

.market-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.market-tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 8px 16px;
  background: #181A20;
  border: none;
  border-radius: 20px;
  color: #848E9C;
  font-size: 12px;
  white-space: nowrap;
}

.tab-btn.active {
  background: #F0B90B;
  color: #000;
}

.pairs-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.pair-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #181A20;
  cursor: pointer;
}

.pair-item:active {
  opacity: 0.8;
}

.pair-info {
  flex: 1;
}

.pair-name {
  margin-bottom: 4px;
}

.pair-name .base {
  color: #EAECEF;
  font-weight: 600;
  font-size: 14px;
}

.pair-name .quote {
  color: #848E9C;
  font-size: 12px;
}

.pair-price {
  color: #EAECEF;
  font-weight: 600;
  font-size: 14px;
}

.pair-stats {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.change.up {
  color: #0ECB81;
  background: rgba(14, 203, 129, 0.15);
}

.change.down {
  color: #F6465D;
  background: rgba(246, 70, 93, 0.15);
}

.volume {
  color: #848E9C;
  font-size: 11px;
}
</style>
</template>