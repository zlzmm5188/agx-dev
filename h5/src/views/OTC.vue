<template>
  <div class="otc-page">
    <!-- 固定顶部栏 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h1 class="page-title">法币交易</h1>
      <div class="header-placeholder"></div>
    </div>

    <div class="page-content">
      <!-- 买卖切换 -->
      <div class="trade-switch">
        <button :class="['switch-btn', { active: tradeType === 'buy' }]" @click="tradeType = 'buy'">买币</button>
        <button :class="['switch-btn', { active: tradeType === 'sell' }]" @click="tradeType = 'sell'">卖币</button>
      </div>

      <!-- 金额输入 -->
      <div class="amount-section">
        <div class="amount-header">
          <span class="amount-label">我要{{ tradeType === 'buy' ? '买' : '卖' }}</span>
          <div class="currency-select">
            <span>{{ selectedCoin }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
        <div class="amount-input-wrap">
          <input type="number" v-model="amount" placeholder="0.00" class="amount-input">
          <span class="amount-unit">USDT</span>
        </div>
        <div class="quick-amounts">
          <button v-for="val in [100, 500, 1000, 5000]" :key="val" class="quick-btn" @click="amount = val">
            {{ val }}
          </button>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="payment-section">
        <div class="section-title">支付方式</div>
        <div class="payment-list">
          <button 
            v-for="pay in payments" 
            :key="pay.key"
            :class="['payment-item', { active: selectedPayment === pay.key }]"
            @click="selectedPayment = pay.key"
          >
            <div class="pay-icon" :class="pay.key">
              <svg v-if="pay.key === 'alipay'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 13.19c-1.22.52-3.44-.29-5.65-1.87-1.15.73-2.69 1.39-4.56 1.39-.58 0-1.19-.06-1.82-.2.39.68 1.12 1.49 2.34 1.49.72 0 1.65-.25 2.81-.92.37-.22.76-.46 1.18-.75.54.34 1.1.66 1.68.94 2.09.99 3.93 1.13 5.02.44.5-.32.78-.83.78-1.36 0-.43-.16-.84-.45-1.16-.3-.33-.72-.53-1.17-.53-.13 0-.27.02-.41.05.67.12 1.22.55 1.22 1.13 0 .52-.35.94-.97 1.35z"/>
              </svg>
              <svg v-else-if="pay.key === 'wechat'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20" fill="none" stroke="#1e2329" stroke-width="2"/>
              </svg>
            </div>
            <span class="pay-name">{{ pay.label }}</span>
            <span v-if="selectedPayment === pay.key" class="pay-check">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </button>
        </div>
      </div>

      <!-- 商家列表 -->
      <div class="merchant-section">
        <div class="section-header">
          <span class="section-title">推荐商家</span>
          <div class="filter-controls">
            <button class="filter-btn" @click="sortMerchants('rate')">好评率</button>
            <button class="filter-btn" @click="sortMerchants('price')">价格</button>
          </div>
        </div>
        <div class="merchant-list">
          <div v-for="m in sortedMerchants" :key="m.id" class="merchant-item" @click="selectMerchant(m)">
            <div class="merchant-left">
              <div class="merchant-avatar">{{ m.name.charAt(0) }}</div>
              <div class="merchant-info">
                <div class="merchant-name">
                  {{ m.name }}
                  <span v-if="m.verified" class="verified-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  </span>
                </div>
                <div class="merchant-stats">
                  <span>成单 {{ m.orders }}</span>
                  <span>好评 {{ m.rate }}%</span>
                  <span class="online-status" :class="{ online: m.online }">
                    {{ m.online ? '在线' : '离线' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="merchant-right">
              <span class="merchant-price">¥{{ m.price }}</span>
              <span class="merchant-limit">{{ m.min }}-{{ m.max }} USDT</span>
              <span class="response-time">{{ m.responseTime }}分钟内响应</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 实时汇率 -->
      <div class="rate-section">
        <div class="section-title">实时汇率</div>
        <div class="rate-info">
          <div class="rate-item">
            <span>USDT/CNY</span>
            <span class="rate-value" :class="rateChange >= 0 ? 'up' : 'down'">
              ¥{{ currentRate }}
              <small>{{ rateChange >= 0 ? '+' : '' }}{{ rateChange }}%</small>
            </span>
          </div>
          <div class="rate-update">
            最后更新: {{ lastUpdate }}
          </div>
        </div>
      </div>

      <!-- 我的订单 -->
      <div class="orders-section">
        <div class="section-title">我的订单</div>
        <div class="order-summary">
          <div class="summary-item">
            <span class="summary-count">{{ orderStats.pending }}</span>
            <span class="summary-label">进行中</span>
          </div>
          <div class="summary-item">
            <span class="summary-count">{{ orderStats.completed }}</span>
            <span class="summary-label">已完成</span>
          </div>
          <div class="summary-item">
            <span class="summary-count">{{ orderStats.total }}</span>
            <span class="summary-label">总计</span>
          </div>
        </div>
        <button class="view-orders-btn" @click="$router.push('/otc/orders')">
          查看全部订单
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <button class="submit-btn" :class="tradeType">
          {{ tradeType === 'buy' ? '确认购买' : '确认出售' }}
        </button>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'

const tradeType = ref('buy')
const amount = ref('')
const selectedCoin = ref('USDT')
const selectedPayment = ref('alipay')

const payments = [
  { key: 'alipay', label: '支付宝' },
  { key: 'wechat', label: '微信支付' },
  { key: 'bank', label: '银行卡' }
]

const merchants = ref([
  { id: 1, name: '金牌商家', verified: true, orders: 12580, rate: 99.8, price: '7.28', min: 100, max: 50000, online: true, responseTime: 2 },
  { id: 2, name: '诚信交易', verified: true, orders: 8650, rate: 99.5, price: '7.30', min: 500, max: 100000, online: true, responseTime: 5 },
  { id: 3, name: '快速兑换', verified: false, orders: 3420, rate: 98.9, price: '7.32', min: 100, max: 20000, online: false, responseTime: 10 },
  { id: 4, name: 'USDT专家', verified: true, orders: 15620, rate: 99.9, price: '7.27', min: 1000, max: 200000, online: true, responseTime: 1 },
  { id: 5, name: '秒付秒到', verified: false, orders: 5890, rate: 98.5, price: '7.35', min: 50, max: 30000, online: true, responseTime: 3 }
])

// 实时汇率数据
const currentRate = ref('7.28')
const rateChange = ref(0.25)
const lastUpdate = ref('刚刚')

// 订单统计
const orderStats = ref({
  pending: 2,
  completed: 18,
  total: 20
})

// 排序状态
const sortBy = ref('rate')
const sortedMerchants = computed(() => {
  const sorted = [...merchants.value]
  if (sortBy.value === 'rate') {
    return sorted.sort((a, b) => b.rate - a.rate)
  } else if (sortBy.value === 'price') {
    return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
  }
  return sorted
})

// 排序方法
const sortMerchants = (criteria) => {
  sortBy.value = criteria
}

// 实时更新汇率和商家状态
const updateRealTimeData = () => {
  // 更新汇率
  const change = (Math.random() - 0.5) * 0.1
  const newRate = parseFloat(currentRate.value) + change
  currentRate.value = newRate.toFixed(3)
  rateChange.value = ((change / parseFloat(currentRate.value)) * 100).toFixed(2)
  
  // 更新最后更新时间
  lastUpdate.value = '刚刚'
  
  // 随机更新商家在线状态
  merchants.value.forEach(merchant => {
    if (Math.random() > 0.95) {
      merchant.online = !merchant.online
    }
  })
}

// 定时器
let updateTimer = null
const startRealTimeUpdates = () => {
  updateTimer = setInterval(updateRealTimeData, 10000) // 每10秒更新
}

const stopRealTimeUpdates = () => {
  if (updateTimer) {
    clearInterval(updateTimer)
    updateTimer = null
  }
}

import { computed, onMounted, onUnmounted } from 'vue'

onMounted(() => {
  startRealTimeUpdates()
})

onUnmounted(() => {
  stopRealTimeUpdates()
})

const selectMerchant = (merchant) => {
  console.log('选择商家:', merchant.name)
}
</script>

<style scoped>
.otc-page {
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
  color: #848e9c;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.back-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin: 0;
  text-align: center;
}

.header-placeholder { width: 36px; }

.page-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar { display: none; }

.trade-switch {
  display: flex;
  margin: 16px;
  padding: 4px;
  background: #1e2329;
  border-radius: 12px;
}

.switch-btn {
  flex: 1;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #848e9c;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.switch-btn.active {
  background: #0ECB81;
  color: #fff;
}

.trade-switch .switch-btn:last-child.active {
  background: #F6465D;
}

.amount-section {
  margin: 0 16px 20px;
  padding: 20px;
  background: #1e2329;
  border-radius: 16px;
}

.amount-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.amount-label {
  font-size: 14px;
  color: #848e9c;
}

.currency-select {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 16px;
  font-size: 14px;
  color: #eaecef;
  cursor: pointer;
}

.amount-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.amount-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 32px;
  font-weight: 700;
  color: #eaecef;
  font-family: 'DIN Alternate', monospace;
  outline: none;
}

.amount-input::placeholder {
  color: #5e6673;
}

.amount-unit {
  font-size: 16px;
  color: #848e9c;
}

.quick-amounts {
  display: flex;
  gap: 10px;
}

.quick-btn {
  flex: 1;
  padding: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  font-size: 13px;
  color: #848e9c;
  cursor: pointer;
}

.quick-btn:active {
  background: rgba(201,169,98,0.1);
  border-color: rgba(201,169,98,0.3);
  color: #C9A962;
}

.payment-section, .merchant-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
  margin-bottom: 12px;
}

.payment-list {
  display: flex;
  gap: 10px;
}

.payment-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 10px;
  background: #1e2329;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
}

.payment-item.active {
  border-color: #C9A962;
  background: rgba(201,169,98,0.08);
}

.pay-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.pay-icon.alipay { background: rgba(0,166,251,0.15); color: #00A6FB; }
.pay-icon.wechat { background: rgba(7,193,96,0.15); color: #07C160; }
.pay-icon.bank { background: rgba(201,169,98,0.15); color: #C9A962; }

.pay-name {
  font-size: 12px;
  color: #848e9c;
}

.pay-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #C9A962;
}

.merchant-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.merchant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #1e2329;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.merchant-item:active {
  background: #242930;
}

.merchant-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.merchant-avatar {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #C9A962, #8B7355);
  border-radius: 50%;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.merchant-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.merchant-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #eaecef;
}

.verified-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #C9A962;
  border-radius: 50%;
  color: #0f1317;
}

.merchant-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #5e6673;
}

.merchant-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.merchant-price {
  font-size: 18px;
  font-weight: 700;
  color: #0ECB81;
  font-family: 'DIN Alternate', monospace;
}

.merchant-limit {
  font-size: 11px;
  color: #5e6673;
}

.submit-section {
  padding: 20px 16px;
}

.submit-btn {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn.buy {
  background: linear-gradient(135deg, #0ECB81, #059669);
  color: #fff;
}

.submit-btn.sell {
  background: linear-gradient(135deg, #F6465D, #D4374A);
  color: #fff;
}

/* 新增功能样式 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.filter-controls {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 6px 12px;
  font-size: 11px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  color: #848E9C;
  border-radius: 6px;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: rgba(255,255,255,0.08);
  color: #EAECEF;
}

.online-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #474D57;
  color: #848E9C;
}

.online-status.online {
  background: rgba(14, 203, 129, 0.15);
  color: #0ECB81;
}

.response-time {
  font-size: 10px;
  color: #848E9C;
  margin-top: 2px;
}

.rate-section {
  background: #1E2329;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
}

.rate-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rate-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.rate-value {
  font-weight: 600;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.rate-value small {
  font-size: 11px;
}

.rate-value.up {
  color: #0ECB81;
}

.rate-value.down {
  color: #F6465D;
}

.rate-update {
  font-size: 11px;
  color: #848E9C;
}

.orders-section {
  background: #1E2329;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
}

.order-summary {
  display: flex;
  justify-content: space-around;
  margin: 12px 0;
  padding: 16px;
  background: rgba(255,255,255,0.02);
  border-radius: 10px;
}

.summary-item {
  text-align: center;
}

.summary-count {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #F0B90B;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 11px;
  color: #848E9C;
}

.view-orders-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: rgba(240, 185, 11, 0.1);
  border: 1px solid rgba(240, 185, 11, 0.2);
  color: #F0B90B;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
}

.view-orders-btn:hover {
  background: rgba(240, 185, 11, 0.15);
}
</style>
