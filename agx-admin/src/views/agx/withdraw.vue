<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.userId" placeholder="用户ID" allow-clear style="width: 100px" />
          <a-input v-model="searchForm.keyword" placeholder="用户名/提现地址" allow-clear style="width: 200px" />
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 120px">
            <a-option :value="0">待审核</a-option>
            <a-option :value="1">已通过</a-option>
            <a-option :value="2">已拒绝</a-option>
            <a-option :value="3">已打款</a-option>
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
        <a-table-column title="币种" data-index="coin" :width="80" />
        <a-table-column title="金额" data-index="amount" :width="150">
          <template #cell="{ record }">
            <span class="text-red-500 font-bold">-{{ record.amount }}</span>
          </template>
        </a-table-column>
        <a-table-column title="手续费" data-index="fee" :width="100" />
        <a-table-column title="网络" data-index="chain" :width="100" />
        <a-table-column title="提现地址" data-index="toAddress" :width="200">
          <template #cell="{ record }">
            <a-tooltip :content="record.toAddress">
              <span class="cursor-pointer">{{ record.toAddress?.slice(0, 10) }}...{{ record.toAddress?.slice(-6) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" :width="100">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 0" color="orange">待审核</a-tag>
            <a-tag v-else-if="record.status === 1" color="blue">已通过</a-tag>
            <a-tag v-else-if="record.status === 2" color="red">已拒绝</a-tag>
            <a-tag v-else color="green">已打款</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="申请时间" data-index="createdAt" :width="170" />
        <a-table-column title="操作" :width="200" fixed="right">
          <template #cell="{ record }">
            <a-space v-if="record.status === 0">
              <a-popconfirm content="确定通过该提现申请？" @ok="handleApprove(record)">
                <a-button type="text" status="success" size="small">通过</a-button>
              </a-popconfirm>
              <a-button type="text" status="danger" size="small" @click="openRejectModal(record)">拒绝</a-button>
            </a-space>
            <a-space v-else-if="record.status === 1">
              <a-popconfirm content="确认已完成打款？" @ok="handlePaid(record)">
                <a-button type="text" status="success" size="small">确认打款</a-button>
              </a-popconfirm>
            </a-space>
            <span v-else class="text-gray-400">-</span>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 拒绝原因弹窗 -->
    <a-modal v-model:visible="rejectVisible" title="拒绝提现" @ok="handleReject">
      <a-form layout="vertical">
        <a-form-item label="拒绝原因">
          <a-textarea v-model="rejectReason" placeholder="请输入拒绝原因" :max-length="200" show-word-limit />
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

const searchForm = reactive({ userId: '', keyword: '', status: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

// 拒绝弹窗
const rejectVisible = ref(false)
const rejectReason = ref('')
const rejectRecord = ref(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getWithdrawList({
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
const handleReset = () => { searchForm.userId = ''; searchForm.keyword = ''; searchForm.status = undefined; pagination.current = 1; fetchData() }
const onPageChange = (page) => { pagination.current = page; fetchData() }

const handleApprove = async (record) => {
  try {
    const res = await agxApi.reviewWithdraw(record.id, { status: 1 })
    if (res.code === 0) {
      Message.success('已通过')
      fetchData()
    }
  } catch (e) {
    Message.error('操作失败')
  }
}

const openRejectModal = (record) => {
  rejectRecord.value = record
  rejectReason.value = ''
  rejectVisible.value = true
}

const handleReject = async () => {
  if (!rejectReason.value.trim()) {
    Message.warning('请输入拒绝原因')
    return
  }
  try {
    const res = await agxApi.reviewWithdraw(rejectRecord.value.id, { status: 2, remark: rejectReason.value })
    if (res.code === 0) {
      Message.success('已拒绝')
      rejectVisible.value = false
      fetchData()
    }
  } catch (e) {
    Message.error('操作失败')
  }
}

const handlePaid = async (record) => {
  try {
    const res = await agxApi.reviewWithdraw(record.id, { status: 2 })
    if (res.code === 0) {
      Message.success('已确认打款')
      fetchData()
    }
  } catch (e) {
    Message.error('操作失败')
  }
}

onMounted(() => { fetchData() })
</script>
