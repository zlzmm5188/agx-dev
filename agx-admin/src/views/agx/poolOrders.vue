<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.keyword" placeholder="用户名/订单号" allow-clear style="width: 180px" />
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 120px">
            <a-option value="holding">持有中</a-option>
            <a-option value="redeemed">已赎回</a-option>
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
        <a-table-column title="用户" data-index="username" :width="120" />
        <a-table-column title="产品名称" data-index="productName" :width="150" />
        <a-table-column title="币种" data-index="coin" :width="80" />
        <a-table-column title="本金" data-index="principal" :width="120" />
        <a-table-column title="累计收益" data-index="profit" :width="120">
          <template #cell="{ record }">
            <span class="text-green-500">+{{ record.profit }}</span>
          </template>
        </a-table-column>
        <a-table-column title="日收益率" data-index="dailyRate" :width="100">
          <template #cell="{ record }">{{ record.dailyRate }}%</template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" :width="100">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 'holding'" color="blue">持有中</a-tag>
            <a-tag v-else color="gray">已赎回</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="申购时间" data-index="createdAt" :width="170" />
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import agxApi from '@/api/agx'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({ keyword: '', status: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getPoolHoldingList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      status: searchForm.status === 'holding' ? 1 : searchForm.status === 'redeemed' ? 0 : undefined
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
const handleReset = () => { searchForm.keyword = ''; searchForm.status = undefined; pagination.current = 1; fetchData() }
const onPageChange = (page) => { pagination.current = page; fetchData() }

onMounted(() => { fetchData() })
</script>
