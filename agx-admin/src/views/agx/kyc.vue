<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 150px">
            <a-option :value="0">待审核</a-option>
            <a-option :value="1">已通过</a-option>
            <a-option :value="2">已拒绝</a-option>
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
        <a-table-column title="真实姓名" data-index="realName" :width="120" />
        <a-table-column title="证件类型" data-index="idType" :width="100">
          <template #cell="{ record }">
            {{ record.idType === 1 ? '身份证' : record.idType === 2 ? '护照' : '驾照' }}
          </template>
        </a-table-column>
        <a-table-column title="证件号" data-index="idNumber" :width="180" />
        <a-table-column title="状态" data-index="status" :width="100">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 0" color="orange">待审核</a-tag>
            <a-tag v-else-if="record.status === 1" color="green">已通过</a-tag>
            <a-tag v-else color="red">已拒绝</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="提交时间" data-index="createdAt" :width="170" />
        <a-table-column title="操作" :width="200" fixed="right">
          <template #cell="{ record }">
            <a-space v-if="record.status === 0">
              <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
              <a-button type="text" status="success" size="small" @click="handleApprove(record)">通过</a-button>
              <a-button type="text" status="danger" size="small" @click="openRejectModal(record)">拒绝</a-button>
            </a-space>
            <a-button v-else type="text" size="small" @click="handleView(record)">查看</a-button>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal v-model:visible="viewVisible" title="KYC详情" :footer="false" width="600px">
      <a-descriptions :column="2">
        <a-descriptions-item label="用户名">{{ currentRecord.username }}</a-descriptions-item>
        <a-descriptions-item label="真实姓名">{{ currentRecord.realName }}</a-descriptions-item>
        <a-descriptions-item label="证件类型">{{ currentRecord.idType === 1 ? '身份证' : currentRecord.idType === 2 ? '护照' : '驾照' }}</a-descriptions-item>
        <a-descriptions-item label="证件号码">{{ currentRecord.idNumber }}</a-descriptions-item>
        <a-descriptions-item label="提交时间">{{ currentRecord.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag v-if="currentRecord.status === 0" color="orange">待审核</a-tag>
          <a-tag v-else-if="currentRecord.status === 1" color="green">已通过</a-tag>
          <a-tag v-else color="red">已拒绝</a-tag>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider>证件照片</a-divider>
      <a-row :gutter="16">
        <a-col :span="12">
          <div class="text-center">
            <p class="mb-2">正面照</p>
            <a-image :src="currentRecord.frontImage || '/not-image.png'" width="200" />
          </div>
        </a-col>
        <a-col :span="12">
          <div class="text-center">
            <p class="mb-2">反面照</p>
            <a-image :src="currentRecord.backImage || '/not-image.png'" width="200" />
          </div>
        </a-col>
      </a-row>
    </a-modal>

    <!-- 拒绝原因弹窗 -->
    <a-modal v-model:visible="rejectVisible" title="拒绝KYC" @ok="handleReject">
      <a-form layout="vertical">
        <a-form-item label="拒绝原因">
          <a-select v-model="rejectReason" placeholder="选择拒绝原因">
            <a-option value="证件照片不清晰">证件照片不清晰</a-option>
            <a-option value="证件信息不匹配">证件信息不匹配</a-option>
            <a-option value="证件已过期">证件已过期</a-option>
            <a-option value="疑似伪造证件">疑似伪造证件</a-option>
            <a-option value="其他原因">其他原因</a-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="rejectReason === '其他原因'" label="补充说明">
          <a-textarea v-model="rejectReasonExtra" placeholder="请输入具体原因" />
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
const viewVisible = ref(false)
const currentRecord = ref({})
const tableData = ref([])

const searchForm = reactive({ status: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

const rejectVisible = ref(false)
const rejectReason = ref('')
const rejectReasonExtra = ref('')
const rejectRecord = ref(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getKycList({
      page: pagination.current,
      pageSize: pagination.pageSize,
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
const handleReset = () => { searchForm.status = undefined; pagination.current = 1; fetchData() }
const onPageChange = (page) => { pagination.current = page; fetchData() }

const handleView = (record) => {
  currentRecord.value = record
  viewVisible.value = true
}

const handleApprove = async (record) => {
  try {
    const res = await agxApi.reviewKyc(record.id, { status: 1 })
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
  rejectReasonExtra.value = ''
  rejectVisible.value = true
}

const handleReject = async () => {
  if (!rejectReason.value) {
    Message.warning('请选择拒绝原因')
    return
  }
  const reason = rejectReason.value === '其他原因' ? rejectReasonExtra.value : rejectReason.value
  try {
    const res = await agxApi.reviewKyc(rejectRecord.value.id, { status: 2, remark: reason })
    if (res.code === 0) {
      Message.success('已拒绝')
      rejectVisible.value = false
      fetchData()
    }
  } catch (e) {
    Message.error('操作失败')
  }
}

onMounted(() => { fetchData() })
</script>
