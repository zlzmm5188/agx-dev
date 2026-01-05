<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.userId" placeholder="用户ID" allow-clear style="width: 100px" />
          <a-input v-model="searchForm.keyword" placeholder="用户名" allow-clear style="width: 150px" />
          <a-select v-model="searchForm.symbol" placeholder="交易对" allow-clear style="width: 130px">
            <a-option value="BTCUSDT">BTC/USDT</a-option>
            <a-option value="ETHUSDT">ETH/USDT</a-option>
          </a-select>
          <a-select v-model="searchForm.result" placeholder="结果" allow-clear style="width: 120px">
            <a-option value="win">盈利</a-option>
            <a-option value="lose">亏损</a-option>
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
        <a-table-column title="ID" data-index="id" :width="60" />
        <a-table-column title="用户" data-index="username" :width="100" />
        <a-table-column title="交易对" data-index="symbol" :width="100" />
        <a-table-column title="方向" data-index="direction" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.direction === 'up'" color="green">看涨</a-tag>
            <a-tag v-else color="red">看跌</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="金额" data-index="amount" :width="100" />
        <a-table-column title="时长" data-index="duration" :width="80">
          <template #cell="{ record }">{{ record.duration }}秒</template>
        </a-table-column>
        <a-table-column title="开仓价" data-index="openPrice" :width="120" />
        <a-table-column title="结算价" data-index="closePrice" :width="120" />
        <a-table-column title="盈亏" data-index="profit" :width="100">
          <template #cell="{ record }">
            <span :class="record.profit >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ record.profit >= 0 ? '+' : '' }}{{ record.profit }}
            </span>
          </template>
        </a-table-column>
        <a-table-column title="结果" data-index="result" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.result === 'win'" color="green">盈利</a-tag>
            <a-tag v-else-if="record.result === 'lose'" color="red">亏损</a-tag>
            <a-tag v-else color="orange">进行中</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="下单时间" data-index="createdAt" :width="170" />
        <a-table-column title="操作" :width="120" fixed="right">
          <template #cell="{ record }">
            <a-space v-if="record.result === 'pending'">
              <a-button type="text" status="success" size="small" @click="handleSettle(record, 1)">设赢</a-button>
              <a-button type="text" status="danger" size="small" @click="handleSettle(record, 2)">设输</a-button>
            </a-space>
            <span v-else class="text-gray-400">已结算</span>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import agxApi from '@/api/agx'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({ userId: '', keyword: '', symbol: undefined, result: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getContractOrderList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      userId: searchForm.userId || undefined,
      symbol: searchForm.symbol || undefined,
      result: searchForm.result === 'win' ? 1 : searchForm.result === 'lose' ? 2 : undefined
    })
    if (res.code === 0) {
      tableData.value = res.data?.list || res.list || []
      pagination.total = res.data?.total || res.total || 0
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.current = 1; fetchData() }
const handleReset = () => { searchForm.userId = ''; searchForm.keyword = ''; searchForm.symbol = undefined; searchForm.result = undefined; pagination.current = 1; fetchData() }
const onPageChange = (page) => { pagination.current = page; fetchData() }

const handleSettle = async (record, result) => {
  try {
    const res = await agxApi.settleContractOrder(record.id, { result })
    if (res.code === 0) {
      Message.success('结算成功')
      fetchData()
    }
  } catch (e) {
    Message.error('结算失败')
  }
}

onMounted(() => { fetchData() })
</script>
