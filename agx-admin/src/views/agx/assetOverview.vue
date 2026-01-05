<template>
  <div class="p-4">
    <a-card title="资产总览" :bordered="false">
      <!-- 总览统计 -->
      <a-row :gutter="16" class="mb-6">
        <a-col :span="6">
          <a-card class="stat-card" :bordered="false">
            <a-statistic title="平台总资产(USDT)" :value="stats.totalAssets" :precision="2" show-group-separator>
              <template #prefix><icon-wallet class="text-blue-500" /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" :bordered="false">
            <a-statistic title="用户黄金持仓(克)" :value="stats.goldHolding" :precision="4" show-group-separator>
              <template #prefix><span class="text-yellow-500">🥇</span></template>
            </a-statistic>
            <div class="text-xs text-gray-400 mt-1">≈ ${{ formatNumber(stats.goldValue) }}</div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" :bordered="false">
            <a-statistic title="矿池锁仓(USDT)" :value="stats.poolLocked" :precision="2" show-group-separator>
              <template #prefix><icon-storage class="text-green-500" /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" :bordered="false">
            <a-statistic title="合约保证金(USDT)" :value="stats.contractMargin" :precision="2" show-group-separator>
              <template #prefix><icon-thunderbolt class="text-orange-500" /></template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>

      <!-- 资产分布 -->
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="资产类型分布" :bordered="false">
            <div class="asset-chart">
              <div v-for="item in assetDistribution" :key="item.type" class="asset-bar-item">
                <div class="flex justify-between mb-1">
                  <span>{{ item.name }}</span>
                  <span class="font-medium">{{ formatNumber(item.value) }} USDT ({{ item.percent }}%)</span>
                </div>
                <a-progress :percent="item.percent" :show-text="false" :color="item.color" />
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="币种持仓TOP10" :bordered="false">
            <a-table :data="coinHoldingTop" :pagination="false" size="small">
              <template #columns>
                <a-table-column title="币种" data-index="coin" :width="100" />
                <a-table-column title="持仓用户" data-index="users" :width="100" />
                <a-table-column title="总持仓" :width="150">
                  <template #cell="{ record }">
                    {{ formatNumber(record.amount) }} {{ record.coin }}
                  </template>
                </a-table-column>
                <a-table-column title="价值(USDT)" :width="120">
                  <template #cell="{ record }">
                    {{ formatNumber(record.valueUsdt) }}
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>

      <!-- 资产变动趋势 -->
      <a-card title="近7日资产变动" :bordered="false" class="mt-4">
        <a-alert type="info">资产趋势图表开发中，当前显示Mock数据</a-alert>
        <div class="trend-placeholder">
          <div v-for="(day, i) in last7Days" :key="i" class="trend-bar" :style="{ height: day.percent + '%' }">
            <span class="trend-label">{{ day.date }}</span>
          </div>
        </div>
      </a-card>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const stats = reactive({
  totalAssets: 0,
  goldHolding: 0,
  goldValue: 0,
  poolLocked: 0,
  contractMargin: 0
})

const assetDistribution = ref([])
const coinHoldingTop = ref([])
const last7Days = ref([])

const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchData = async () => {
  // Mock数据
  stats.totalAssets = 15680000
  stats.goldHolding = 8542.3456
  stats.goldValue = 723456.78
  stats.poolLocked = 3560000
  stats.contractMargin = 1250000

  assetDistribution.value = [
    { type: 'wallet', name: '钱包余额', value: 8560000, percent: 55, color: '#1890ff' },
    { type: 'pool', name: '矿池锁仓', value: 3560000, percent: 23, color: '#52c41a' },
    { type: 'contract', name: '合约保证金', value: 1250000, percent: 8, color: '#faad14' },
    { type: 'gold', name: '黄金资产', value: 723456, percent: 5, color: '#FFD700' },
    { type: 'other', name: '其他', value: 1586544, percent: 9, color: '#722ed1' },
  ]

  coinHoldingTop.value = [
    { coin: 'USDT', users: 12560, amount: 8560000, valueUsdt: 8560000 },
    { coin: 'AGX', users: 8560, amount: 25600000, valueUsdt: 2176000 },
    { coin: 'BTC', users: 856, amount: 15.6, valueUsdt: 1537296 },
    { coin: 'ETH', users: 1250, amount: 256, valueUsdt: 833740.8 },
    { coin: 'GOLD', users: 3250, amount: 8542.35, valueUsdt: 723456.78 },
  ]

  last7Days.value = [
    { date: '01-19', value: 15200000, percent: 92 },
    { date: '01-20', value: 15350000, percent: 93 },
    { date: '01-21', value: 15450000, percent: 94 },
    { date: '01-22', value: 15520000, percent: 95 },
    { date: '01-23', value: 15600000, percent: 96 },
    { date: '01-24', value: 15650000, percent: 97 },
    { date: '01-25', value: 15680000, percent: 100 },
  ]
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.stat-card { text-align: center; }
.asset-bar-item { margin-bottom: 16px; }
.trend-placeholder {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 20px 0;
}
.trend-bar {
  width: 60px;
  background: linear-gradient(180deg, #1890ff 0%, #52c41a 100%);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
}
.trend-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #999;
}
.text-yellow-500 { color: #faad14; }
.text-blue-500 { color: #1890ff; }
.text-green-500 { color: #52c41a; }
.text-orange-500 { color: #fa8c16; }
</style>
