<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.userId" placeholder="用户ID" allow-clear style="width: 100px" />
          <a-input v-model="searchForm.keyword" placeholder="用户名/交易哈希" allow-clear style="width: 200px" />
          <a-select v-model="searchForm.coin" placeholder="币种" allow-clear style="width: 120px">
            <a-option value="USDT">USDT</a-option>
            <a-option value="BTC">BTC</a-option>
            <a-option value="ETH">ETH</a-option>
          </a-select>
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 120px">
            <a-option :value="0">待确认</a-option>
            <a-option :value="1">已到账</a-option>
            <a-option :value="2">已失败</a-option>
          </a-select>
          <a-button type="primary" @click="handleSearch">
            <template #icon><icon-search /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon><icon-refresh /></template>
            重置
          </a-button>
          <a-button type="primary" status="success" @click="openManualRecharge">
            <template #icon><icon-plus /></template>
            手动充值
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="onPageChange" row-key="id">
      <template #columns>
        <a-table-column title="ID" data-index="id" :width="60" />
        <a-table-column title="用户" data-index="username" :width="120" />
        <a-table-column title="币种" data-index="coin" :width="80" />
        <a-table-column title="金额" data-index="amount" :width="150">
          <template #cell="{ record }">
            <span class="text-green-500 font-bold">+{{ record.amount }}</span>
          </template>
        </a-table-column>
        <a-table-column title="网络" data-index="chain" :width="100" />
        <a-table-column title="交易哈希" data-index="txHash" :width="200">
          <template #cell="{ record }">
            <a-tooltip :content="record.txHash">
              <span class="cursor-pointer text-blue-500">{{ record.txHash?.slice(0, 20) }}...</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" :width="100">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 0" color="orange">待确认</a-tag>
            <a-tag v-else-if="record.status === 1" color="green">已到账</a-tag>
            <a-tag v-else color="red">已失败</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="充值时间" data-index="createdAt" :width="170" />
      </template>
    </a-table>

    <!-- 手动充值弹窗 -->
    <a-modal v-model:visible="manualVisible" title="手动充值" @ok="submitManualRecharge">
      <a-form :model="manualForm" layout="vertical">
        <a-form-item label="用户ID" required>
          <a-input-number v-model="manualForm.userId" :min="1" style="width: 100%" placeholder="输入用户ID" />
        </a-form-item>
        <a-form-item label="币种" required>
          <a-select v-model="manualForm.coin">
            <a-option value="USDT">USDT</a-option>
            <a-option value="BTC">BTC</a-option>
            <a-option value="ETH">ETH</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="金额" required>
          <a-input-number v-model="manualForm.amount" :min="0" :precision="8" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model="manualForm.remark" placeholder="充值备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import agxApi from '@/api/agx'

const loading = ref(false)
const tableData = ref([])
const manualVisible = ref(false)

const searchForm = reactive({ userId: '', keyword: '', coin: undefined, status: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })
const manualForm = reactive({ userId: null, coin: 'USDT', amount: 0, remark: '' })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getRechargeList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      userId: searchForm.userId || undefined,
      keyword: searchForm.keyword,
      status: searchForm.status
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
const handleReset = () => { searchForm.userId = ''; searchForm.keyword = ''; searchForm.coin = undefined; searchForm.status = undefined; pagination.current = 1; fetchData() }
const onPageChange = (page) => { pagination.current = page; fetchData() }

const openManualRecharge = () => {
  manualForm.userId = null
  manualForm.coin = 'USDT'
  manualForm.amount = 0
  manualForm.remark = ''
  manualVisible.value = true
}

const submitManualRecharge = async () => {
  if (!manualForm.userId || !manualForm.amount) {
    Message.warning('请填写完整信息')
    return
  }
  try {
    const res = await agxApi.manualRecharge(manualForm)
    if (res.code === 0) {
      Message.success('充值成功')
      manualVisible.value = false
      fetchData()
    }
  } catch (e) {
    Message.error('充值失败')
  }
}

onMounted(() => { fetchData() })
</script>
