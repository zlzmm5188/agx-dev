<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.userId" placeholder="用户ID" allow-clear style="width: 120px" />
          <a-select v-model="searchForm.type" placeholder="类型" allow-clear style="width: 150px">
            <a-option value="deposit">充值</a-option>
            <a-option value="withdraw">提现</a-option>
            <a-option value="pool_subscribe">矿池认购</a-option>
            <a-option value="pool_redeem">矿池赎回</a-option>
            <a-option value="pool_profit">矿池收益</a-option>
            <a-option value="contract_bet">合约下单</a-option>
            <a-option value="contract_win">合约盈利</a-option>
            <a-option value="contract_lose">合约亏损</a-option>
            <a-option value="admin_add">后台增加</a-option>
            <a-option value="admin_sub">后台扣除</a-option>
          </a-select>
          <a-select v-model="searchForm.coin" placeholder="币种" allow-clear style="width: 120px">
            <a-option value="USDT">USDT</a-option>
            <a-option value="BTC">BTC</a-option>
            <a-option value="ETH">ETH</a-option>
          </a-select>
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

    <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="onPageChange" row-key="id">
      <template #columns>
        <a-table-column title="ID" data-index="id" :width="80" />
        <a-table-column title="用户ID" data-index="userId" :width="80" />
        <a-table-column title="币种" data-index="coin" :width="80" />
        <a-table-column title="类型" data-index="type" :width="120">
          <template #cell="{ record }">
            <a-tag :color="getTypeColor(record.type)">{{ getTypeName(record.type) }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="变动金额" data-index="amount" :width="150">
          <template #cell="{ record }">
            <span :class="parseFloat(record.amount) >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ parseFloat(record.amount) >= 0 ? '+' : '' }}{{ record.amount }}
            </span>
          </template>
        </a-table-column>
        <a-table-column title="变动前余额" data-index="balanceBefore" :width="150" />
        <a-table-column title="变动后余额" data-index="balanceAfter" :width="150" />
        <a-table-column title="备注" data-index="remark" :width="200" />
        <a-table-column title="时间" data-index="createdAt" :width="170" />
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import agxApi from '@/api/agx'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({ userId: '', type: undefined, coin: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

const typeMap = {
  deposit: '充值',
  withdraw: '提现',
  pool_subscribe: '矿池认购',
  pool_redeem: '矿池赎回',
  pool_profit: '矿池收益',
  contract_bet: '合约下单',
  contract_win: '合约盈利',
  contract_lose: '合约亏损',
  admin_add: '后台增加',
  admin_sub: '后台扣除'
}

const getTypeName = (type) => typeMap[type] || type
const getTypeColor = (type) => {
  if (['deposit', 'pool_profit', 'contract_win', 'admin_add'].includes(type)) return 'green'
  if (['withdraw', 'contract_lose', 'admin_sub'].includes(type)) return 'red'
  return 'blue'
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getAssetLogs({
      page: pagination.current,
      pageSize: pagination.pageSize,
      userId: searchForm.userId || undefined,
      type: searchForm.type,
      coin: searchForm.coin
    })
    if (res.code === 0) {
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.current = 1; fetchData() }
const handleReset = () => { 
  searchForm.userId = ''
  searchForm.type = undefined
  searchForm.coin = undefined
  pagination.current = 1
  fetchData()
}
const onPageChange = (page) => { pagination.current = page; fetchData() }

onMounted(() => { fetchData() })
</script>
