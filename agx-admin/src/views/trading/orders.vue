<!--
 - AGX Exchange - 交易订单管理
-->
<template>
  <div class="ma-content-block p-4">
    <!-- 搜索区域 -->
    <a-card class="mb-4">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input v-model="searchForm.order_id" placeholder="订单号" allow-clear />
        </a-col>
        <a-col :span="6">
          <a-select v-model="searchForm.status" placeholder="订单状态" allow-clear>
            <a-option value="pending">待处理</a-option>
            <a-option value="filled">已成交</a-option>
            <a-option value="cancelled">已取消</a-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-select v-model="searchForm.type" placeholder="交易类型" allow-clear>
            <a-option value="crypto">加密货币</a-option>
            <a-option value="forex">外汇</a-option>
            <a-option value="stocks">股票</a-option>
            <a-option value="bonds">债券</a-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><icon-search /></template>
              搜索
            </a-button>
            <a-button @click="handleReset">
              <template #icon><icon-refresh /></template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <!-- 数据统计 -->
    <a-row :gutter="16" class="mb-4">
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic title="今日订单" :value="stats.todayOrders" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic title="今日成交额" :value="stats.todayVolume" :precision="2" prefix="$" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic title="待处理订单" :value="stats.pendingOrders" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic title="成交率" :value="stats.fillRate" suffix="%" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 订单列表 -->
    <a-card title="订单列表">
      <a-table :columns="columns" :data="orderList" :pagination="pagination" :loading="loading">
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
        </template>
        <template #side="{ record }">
          <a-tag :color="record.side === 'buy' ? 'green' : 'red'">
            {{ record.side === 'buy' ? '买入' : '卖出' }}
          </a-tag>
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="viewOrder(record)">查看</a-button>
            <a-button type="text" size="small" status="danger" v-if="record.status === 'pending'" @click="cancelOrder(record)">取消</a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const searchForm = reactive({
  order_id: '',
  status: '',
  type: ''
})

const stats = reactive({
  todayOrders: 1258,
  todayVolume: 2580000,
  pendingOrders: 45,
  fillRate: 92.5
})

const columns = [
  { title: '订单号', dataIndex: 'order_id', width: 180 },
  { title: '交易对', dataIndex: 'symbol', width: 120 },
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '方向', slotName: 'side', width: 80 },
  { title: '数量', dataIndex: 'amount', width: 120 },
  { title: '价格', dataIndex: 'price', width: 120 },
  { title: '状态', slotName: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'created_at', width: 180 },
  { title: '操作', slotName: 'operations', width: 120, fixed: 'right' }
]

const orderList = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const getStatusColor = (status) => {
  const colors = { pending: 'orange', filled: 'green', cancelled: 'gray' }
  return colors[status] || 'blue'
}

const getStatusText = (status) => {
  const texts = { pending: '待处理', filled: '已成交', cancelled: '已取消' }
  return texts[status] || status
}

const loadOrders = () => {
  loading.value = true
  // 模拟数据
  setTimeout(() => {
    orderList.value = Array(20).fill(null).map((_, i) => ({
      order_id: `ORD${Date.now()}${i}`,
      symbol: ['BTCUSDT', 'ETHUSDT', 'EURUSD', 'AAPL'][i % 4],
      type: ['crypto', 'crypto', 'forex', 'stocks'][i % 4],
      side: i % 2 === 0 ? 'buy' : 'sell',
      amount: (Math.random() * 10).toFixed(4),
      price: (Math.random() * 50000).toFixed(2),
      status: ['pending', 'filled', 'cancelled'][i % 3],
      created_at: new Date(Date.now() - i * 3600000).toISOString().slice(0, 19).replace('T', ' ')
    }))
    pagination.total = 200
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  loadOrders()
}

const handleReset = () => {
  Object.assign(searchForm, { order_id: '', status: '', type: '' })
  loadOrders()
}

const viewOrder = (record) => {
  Message.info(`查看订单: ${record.order_id}`)
}

const cancelOrder = (record) => {
  Message.success(`订单已取消: ${record.order_id}`)
  record.status = 'cancelled'
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.stat-card {
  text-align: center;
}
</style>
