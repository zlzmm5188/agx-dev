<template>
  <div class="p-4">
    <a-card title="黄金持仓管理" :bordered="false">
      <template #extra>
        <a-space>
          <a-input-search v-model="searchForm.keyword" placeholder="用户名/UID" @search="handleSearch" style="width: 200px" />
          <a-button type="primary" @click="handleExport">
            <template #icon><icon-download /></template>
            导出
          </a-button>
        </a-space>
      </template>

      <!-- 统计卡片 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-statistic title="总持仓用户" :value="stats.totalUsers" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="总持仓克数" :value="stats.totalGrams" :precision="4">
            <template #suffix>克</template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic title="总持仓价值" :value="stats.totalValue" :precision="2">
            <template #suffix>USDT</template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic title="今日新增" :value="stats.todayNew" :precision="4">
            <template #suffix>克</template>
          </a-statistic>
        </a-col>
      </a-row>

      <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="handlePageChange">
        <template #columns>
          <a-table-column title="用户" :width="150">
            <template #cell="{ record }">
              <div>
                <div class="font-medium">{{ record.username }}</div>
                <div class="text-gray-400 text-xs">UID: {{ record.uid }}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="持仓克数" data-index="holdingGrams" :width="120">
            <template #cell="{ record }">
              <span class="text-yellow-500 font-medium">{{ record.holdingGrams }} 克</span>
            </template>
          </a-table-column>
          <a-table-column title="持仓价值(USDT)" data-index="holdingValue" :width="140">
            <template #cell="{ record }">
              {{ formatNumber(record.holdingValue) }}
            </template>
          </a-table-column>
          <a-table-column title="成本均价" data-index="avgCost" :width="120">
            <template #cell="{ record }">
              ${{ formatNumber(record.avgCost) }}/克
            </template>
          </a-table-column>
          <a-table-column title="浮动盈亏" :width="120">
            <template #cell="{ record }">
              <span :class="record.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ record.profitLoss >= 0 ? '+' : '' }}{{ formatNumber(record.profitLoss) }}
              </span>
            </template>
          </a-table-column>
          <a-table-column title="累计收益" data-index="totalIncome" :width="120">
            <template #cell="{ record }">
              <span class="text-green-500">+{{ formatNumber(record.totalIncome) }}</span>
            </template>
          </a-table-column>
          <a-table-column title="首次购入" data-index="firstBuyAt" :width="160" />
          <a-table-column title="操作" :width="120" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="viewDetail(record)">详情</a-button>
                <a-button type="text" size="small" status="warning" @click="adjustHolding(record)">调整</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 调整持仓弹窗 -->
    <a-modal v-model:visible="adjustVisible" title="调整黄金持仓" @ok="handleAdjust">
      <a-form :model="adjustForm" layout="vertical">
        <a-form-item label="用户">
          <a-input :model-value="adjustForm.username" disabled />
        </a-form-item>
        <a-form-item label="当前持仓">
          <a-input :model-value="adjustForm.currentHolding + ' 克'" disabled />
        </a-form-item>
        <a-form-item label="调整类型">
          <a-radio-group v-model="adjustForm.type">
            <a-radio value="add">增加</a-radio>
            <a-radio value="reduce">减少</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="调整数量(克)">
          <a-input-number v-model="adjustForm.amount" :min="0" :precision="4" style="width: 100%" />
        </a-form-item>
        <a-form-item label="调整原因">
          <a-textarea v-model="adjustForm.reason" placeholder="请输入调整原因" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const tableData = ref([])
const adjustVisible = ref(false)

const searchForm = reactive({
  keyword: ''
})

const stats = reactive({
  totalUsers: 0,
  totalGrams: 0,
  totalValue: 0,
  todayNew: 0
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const adjustForm = reactive({
  userId: null,
  username: '',
  currentHolding: 0,
  type: 'add',
  amount: 0,
  reason: ''
})

const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchData = async () => {
  loading.value = true
  // Mock数据
  setTimeout(() => {
    stats.totalUsers = 1256
    stats.totalGrams = 8542.3456
    stats.totalValue = 723456.78
    stats.todayNew = 125.8

    tableData.value = [
      { id: 1, username: 'user001', uid: 'U10001', holdingGrams: 50.5000, holdingValue: 4280.50, avgCost: 82.50, profitLoss: 356.25, totalIncome: 1250.00, firstBuyAt: '2025-01-15 10:30' },
      { id: 2, username: 'user002', uid: 'U10002', holdingGrams: 125.2500, holdingValue: 10621.25, avgCost: 81.20, profitLoss: 892.75, totalIncome: 3560.00, firstBuyAt: '2025-01-10 14:20' },
      { id: 3, username: 'user003', uid: 'U10003', holdingGrams: 30.0000, holdingValue: 2544.00, avgCost: 85.00, profitLoss: -36.00, totalIncome: 450.00, firstBuyAt: '2025-01-20 09:15' },
    ]
    pagination.total = 156
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handlePageChange = (page) => {
  pagination.current = page
  fetchData()
}

const handleExport = () => {
  Message.info('导出功能开发中')
}

const viewDetail = (record) => {
  Message.info(`查看用户 ${record.username} 黄金持仓详情`)
}

const adjustHolding = (record) => {
  adjustForm.userId = record.id
  adjustForm.username = record.username
  adjustForm.currentHolding = record.holdingGrams
  adjustForm.type = 'add'
  adjustForm.amount = 0
  adjustForm.reason = ''
  adjustVisible.value = true
}

const handleAdjust = () => {
  if (!adjustForm.amount || adjustForm.amount <= 0) {
    Message.warning('请输入调整数量')
    return
  }
  if (!adjustForm.reason) {
    Message.warning('请输入调整原因')
    return
  }
  Message.success('调整成功')
  adjustVisible.value = false
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.text-yellow-500 { color: #faad14; }
.text-green-500 { color: #52c41a; }
.text-red-500 { color: #f5222d; }
</style>
