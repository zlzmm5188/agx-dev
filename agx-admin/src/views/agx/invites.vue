<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.inviterId" placeholder="邀请人ID" allow-clear style="width: 120px" />
          <a-input v-model="searchForm.userId" placeholder="被邀请人ID" allow-clear style="width: 120px" />
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
        <a-table-column title="邀请人ID" data-index="inviterId" :width="100" />
        <a-table-column title="邀请人" data-index="inviterName" :width="150" />
        <a-table-column title="被邀请人ID" data-index="userId" :width="100" />
        <a-table-column title="被邀请人" data-index="username" :width="150" />
        <a-table-column title="层级" data-index="level" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.level === 1" color="blue">一级</a-tag>
            <a-tag v-else color="cyan">二级</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="邀请时间" data-index="createdAt" :width="170" />
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import agxApi from '@/api/agx'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({ inviterId: '', userId: '' })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getInviteList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      inviterId: searchForm.inviterId || undefined,
      userId: searchForm.userId || undefined
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
  searchForm.inviterId = ''
  searchForm.userId = ''
  pagination.current = 1
  fetchData()
}
const onPageChange = (page) => { pagination.current = page; fetchData() }

onMounted(() => { fetchData() })
</script>
