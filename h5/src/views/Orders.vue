<template>
  <PageLayout title="订单记录" :show-back="true">
    <div class="page-content">
      <!-- 订单类型筛选 -->
      <div class="order-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >{{ tab.label }}</button>
      </div>

      <!-- 状态筛选 -->
      <div class="status-filter">
        <button 
          v-for="status in statuses" 
          :key="status.key"
          :class="['status-btn', { active: activeStatus === status.key }]"
          @click="activeStatus = status.key"
        >{{ status.label }}</button>
      </div>

      <!-- 订单列表 -->
      <div class="order-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-type">
              <span :class="['type-tag', order.type]">{{ order.typeLabel }}</span>
              <span class="order-pair">{{ order.pair }}</span>
            </div>
            <span :class="['order-status', order.status]">{{ order.statusLabel }}</span>
          </div>
          <div class="order-body">
            <div class="order-row">
              <span class="label">方向</span>
              <span :class="['value', order.side]">{{ order.sideLabel }}</span>
            </div>
            <div class="order-row">
              <span class="label">价格</span>
              <span class="value">{{ order.price }} USDT</span>
            </div>
            <div class="order-row">
              <span class="label">数量</span>
              <span class="value">{{ order.amount }}</span>
            </div>
            <div class="order-row">
              <span class="label">成交额</span>
              <span class="value gold">{{ order.total }} USDT</span>
            </div>
          </div>
          <div class="order-footer">
            <span class="order-time">{{ order.time }}</span>
            <button v-if="order.status === 'pending'" class="cancel-btn" @click="cancelOrder(order)">取消</button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>
        </svg>
        <p>暂无订单记录</p>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'

const activeTab = ref('all')
const activeStatus = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'spot', label: '现货' },
  { key: 'earn', label: '理财' },
  { key: 'ieo', label: '新币' },
  { key: 'mining', label: '矿池' }
]

const statuses = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
]

const orders = ref([
  {
    id: 1,
    type: 'spot',
    typeLabel: '现货',
    pair: 'BTC/USDT',
    side: 'buy',
    sideLabel: '买入',
    price: '99,500.00',
    amount: '0.05 BTC',
    total: '4,975.00',
    status: 'completed',
    statusLabel: '已完成',
    time: '2026-01-02 15:30:25'
  },
  {
    id: 2,
    type: 'earn',
    typeLabel: '理财',
    pair: 'USDT活期',
    side: 'buy',
    sideLabel: '申购',
    price: '-',
    amount: '10,000 USDT',
    total: '10,000.00',
    status: 'pending',
    statusLabel: '收益中',
    time: '2026-01-01 10:00:00'
  },
  {
    id: 3,
    type: 'ieo',
    typeLabel: '新币',
    pair: 'AGX预约',
    side: 'buy',
    sideLabel: '预约',
    price: '0.10',
    amount: '50,000 AGX',
    total: '5,000.00',
    status: 'pending',
    statusLabel: '待发放',
    time: '2025-12-28 09:00:00'
  },
  {
    id: 4,
    type: 'mining',
    typeLabel: '矿池',
    pair: '专业矿机',
    side: 'buy',
    sideLabel: '购买',
    price: '-',
    amount: '50 TH/s',
    total: '5,000.00',
    status: 'pending',
    statusLabel: '挖矿中',
    time: '2025-12-25 14:20:00'
  },
  {
    id: 5,
    type: 'spot',
    typeLabel: '现货',
    pair: 'ETH/USDT',
    side: 'sell',
    sideLabel: '卖出',
    price: '3,580.00',
    amount: '1 ETH',
    total: '3,580.00',
    status: 'completed',
    statusLabel: '已完成',
    time: '2025-12-20 11:45:30'
  }
])

const filteredOrders = computed(() => {
  let result = orders.value
  if (activeTab.value !== 'all') {
    result = result.filter(o => o.type === activeTab.value)
  }
  if (activeStatus.value !== 'all') {
    result = result.filter(o => o.status === activeStatus.value)
  }
  return result
})

const cancelOrder = (order) => {
  if (confirm('确定要取消此订单吗？')) {
    order.status = 'cancelled'
    order.statusLabel = '已取消'
  }
}
</script>

<style scoped>
.orders-page {
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
  border-radius: 10px;
  margin-right: 12px;
}

.back-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin: 0;
}

.header-actions { display: flex; gap: 8px; }

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar { display: none; }
.page-content { scrollbar-width: none; }

.order-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  overflow-x: auto;
}

.order-tabs::-webkit-scrollbar { display: none; }

.tab-btn {
  padding: 10px 18px;
  background: #1e2329;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  color: #848e9c;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: linear-gradient(135deg, rgba(201,169,98,0.2), rgba(201,169,98,0.1));
  color: #C9A962;
  border: 1px solid rgba(201,169,98,0.3);
}

.status-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.status-btn {
  padding: 6px 14px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  font-size: 12px;
  color: #5e6673;
  cursor: pointer;
}

.status-btn.active {
  border-color: #C9A962;
  color: #C9A962;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-card {
  background: #1e2329;
  border-radius: 14px;
  padding: 16px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.order-type {
  display: flex;
  align-items: center;
  gap: 10px;
}

.type-tag {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.type-tag.spot { background: rgba(96, 165, 250, 0.15); color: #60A5FA; }
.type-tag.earn { background: rgba(14, 203, 129, 0.15); color: #0ECB81; }
.type-tag.ieo { background: rgba(168, 85, 247, 0.15); color: #A855F7; }
.type-tag.mining { background: rgba(201, 169, 98, 0.15); color: #C9A962; }

.order-pair {
  font-size: 14px;
  font-weight: 500;
  color: #eaecef;
}

.order-status {
  font-size: 12px;
  font-weight: 500;
}

.order-status.pending { color: #F0B90B; }
.order-status.completed { color: #0ECB81; }
.order-status.cancelled { color: #5e6673; }

.order-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.order-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-row .label {
  font-size: 12px;
  color: #5e6673;
}

.order-row .value {
  font-size: 14px;
  color: #eaecef;
}

.order-row .value.buy { color: #0ECB81; }
.order-row .value.sell { color: #F6465D; }
.order-row .value.gold { color: #C9A962; }

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.order-time {
  font-size: 12px;
  color: #5e6673;
}

.cancel-btn {
  padding: 6px 14px;
  background: rgba(246, 70, 93, 0.15);
  border: none;
  border-radius: 14px;
  font-size: 12px;
  color: #F6465D;
  cursor: pointer;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #5e6673;
}

.empty-state svg { margin-bottom: 16px; opacity: 0.4; }
.empty-state p { font-size: 14px; color: #848e9c; }
</style>
