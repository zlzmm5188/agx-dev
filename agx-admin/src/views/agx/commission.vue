<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.userId" placeholder="用户ID" allow-clear style="width: 120px" />
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 120px">
            <a-option :value="0">待发放</a-option>
            <a-option :value="1">已发放</a-option>
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
        <a-table-column title="获佣用户" data-index="username" :width="120" />
        <a-table-column title="来源用户" data-index="fromUsername" :width="120" />
        <a-table-column title="层级" data-index="level" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.level === 1" color="blue">一级</a-tag>
            <a-tag v-else color="cyan">二级</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="来源" data-index="source" :width="100">
          <template #cell="{ record }">
            <a-tag v-if="record.source === 'pool'" color="green">矿池</a-tag>
            <a-tag v-else color="orange">合约</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="币种" data-index="coin" :width="80" />
        <a-table-column title="金额" data-index="amount" :width="120" />
        <a-table-column title="比例" data-index="rate" :width="80">
          <template #cell="{ record }">{{ (parseFloat(record.rate) * 100).toFixed(2) }}%</template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 0" color="orange">待发放</a-tag>
            <a-tag v-else color="green">已发放</a-tag>
          </template>
        </a-table-column>
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

const searchForm = reactive({ userId: '', status: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getCommissionList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      userId: searchForm.userId || undefined,
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
const handleReset = () => { 
  searchForm.userId = ''
  searchForm.status = undefined
  pagination.current = 1
  fetchData()
}
const onPageChange = (page) => { pagination.current = page; fetchData() }

onMounted(() => { fetchData() })
</script>
