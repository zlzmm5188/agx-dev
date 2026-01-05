<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.adminId" placeholder="管理员ID" allow-clear style="width: 120px" />
          <a-select v-model="searchForm.module" placeholder="操作模块" allow-clear style="width: 150px">
            <a-option value="KYC审核">KYC审核</a-option>
            <a-option value="提现审核">提现审核</a-option>
            <a-option value="手动充值">手动充值</a-option>
            <a-option value="合约订单">合约订单</a-option>
            <a-option value="用户管理">用户管理</a-option>
            <a-option value="资产调整">资产调整</a-option>
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
        <a-table-column title="管理员" data-index="adminName" :width="120" />
        <a-table-column title="模块" data-index="module" :width="100">
          <template #cell="{ record }">
            <a-tag>{{ getModuleName(record.module) }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="action" :width="150" />
        <a-table-column title="详情" data-index="detail" ellipsis />
        <a-table-column title="IP" data-index="ip" :width="130" />
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

const searchForm = reactive({ adminId: '', module: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

const moduleMap = {
  'KYC审核': 'KYC审核',
  '提现审核': '提现审核',
  '手动充值': '手动充值',
  '合约订单': '合约订单',
  '用户管理': '用户管理',
  '资产调整': '资产调整'
}

const getModuleName = (module) => moduleMap[module] || module

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getAdminLogList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      adminId: searchForm.adminId || undefined,
      module: searchForm.module
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
  searchForm.adminId = ''
  searchForm.module = undefined
  pagination.current = 1
  fetchData()
}
const onPageChange = (page) => { pagination.current = page; fetchData() }

onMounted(() => { fetchData() })
</script>
