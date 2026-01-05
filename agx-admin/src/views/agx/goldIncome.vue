<template>
  <div class="p-4">
    <a-card title="黄金收益记录" :bordered="false">
      <template #extra>
        <a-space>
          <a-range-picker v-model="searchForm.dateRange" style="width: 240px" />
          <a-input-search v-model="searchForm.keyword" placeholder="用户名/UID" @search="handleSearch" style="width: 180px" />
          <a-select v-model="searchForm.type" placeholder="收益类型" style="width: 140px" allow-clear>
            <a-option value="daily">每日收益</a-option>
            <a-option value="trade">交易收益</a-option>
            <a-option value="bonus">活动奖励</a-option>
          </a-select>
        </a-space>
      </template>

      <!-- 统计 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-statistic title="今日发放" :value="stats.todayTotal" :precision="2">
            <template #suffix>USDT</template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic title="本周发放" :value="stats.weekTotal" :precision="2">
            <template #suffix>USDT</template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic title="本月发放" :value="stats.monthTotal" :precision="2">
            <template #suffix>USDT</template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic title="累计发放" :value="stats.allTotal" :precision="2">
            <template #suffix>USDT</template>
          </a-statistic>
        </a-col>
      </a-row>

      <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="handlePageChange">
        <template #columns>
          <a-table-column title="用户" :width="140">
            <template #cell="{ record }">
              <div>
                <div class="font-medium">{{ record.username }}</div>
                <div class="text-gray-400 text-xs">{{ record.uid }}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="收益类型" data-index="incomeType" :width="100">
            <template #cell="{ record }">
              <a-tag :color="getTypeColor(record.incomeType)">{{ getTypeName(record.incomeType) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="收益金额(USDT)" :width="140">
            <template #cell="{ record }">
              <span class="text-green-500 font-medium">+{{ formatNumber(record.amount) }}</span>
            </template>
          </a-table-column>
          <a-table-column title="持仓克数" data-index="holdingGrams" :width="120">
            <template #cell="{ record }">
              {{ record.holdingGrams }} 克
            </template>
          </a-table-column>
          <a-table-column title="收益率" :width="100">
            <template #cell="{ record }">
              <span class="text-blue-500">{{ record.rate }}%</span>
            </template>
          </a-table-column>
          <a-table-column title="金价(当时)" data-index="goldPrice" :width="120">
            <template #cell="{ record }">
              ${{ formatNumber(record.goldPrice) }}
            </template>
          </a-table-column>
          <a-table-column title="发放时间" data-index="createdAt" :width="160" />
          <a-table-column title="备注" data-index="remark" :width="150" ellipsis />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  keyword: '',
  type: '',
  dateRange: []
})

const stats = reactive({
  todayTotal: 0,
  weekTotal: 0,
  monthTotal: 0,
  allTotal: 0
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getTypeColor = (type) => {
  const colors = { daily: 'green', trade: 'blue', bonus: 'orange' }
  return colors[type] || 'gray'
}

const getTypeName = (type) => {
  const names = { daily: '每日收益', trade: '交易收益', bonus: '活动奖励' }
  return names[type] || type
}

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    stats.todayTotal = 12580.50
    stats.weekTotal = 85620.80
    stats.monthTotal = 356280.45
    stats.allTotal = 1256890.00

    tableData.value = [
      { id: 1, username: 'user001', uid: 'U10001', incomeType: 'daily', amount: 42.80, holdingGrams: 50.5, rate: 0.05, goldPrice: 2650.00, createdAt: '2025-01-25 00:00', remark: '每日收益结算' },
      { id: 2, username: 'user002', uid: 'U10002', incomeType: 'daily', amount: 106.21, holdingGrams: 125.25, rate: 0.05, goldPrice: 2650.00, createdAt: '2025-01-25 00:00', remark: '每日收益结算' },
      { id: 3, username: 'user003', uid: 'U10003', incomeType: 'trade', amount: 256.00, holdingGrams: 30.0, rate: 8.53, goldPrice: 2645.00, createdAt: '2025-01-24 15:30', remark: '黄金交易盈利' },
      { id: 4, username: 'user001', uid: 'U10001', incomeType: 'bonus', amount: 100.00, holdingGrams: 50.5, rate: 0, goldPrice: 2650.00, createdAt: '2025-01-24 10:00', remark: '新用户奖励' },
    ]
    pagination.total = 1560
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

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.text-green-500 { color: #52c41a; }
.text-blue-500 { color: #1890ff; }
</style>
