<template>
  <div class="login-logs-container">
    <a-card title="登录记录">
      <!-- 搜索栏 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-input v-model="searchForm.keyword" placeholder="用户ID/手机号/邮箱" allow-clear />
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.status" placeholder="登录状态" allow-clear style="width: 100%">
            <a-option value="success">成功</a-option>
            <a-option value="failed">失败</a-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-range-picker v-model="searchForm.dateRange" style="width: 100%" />
        </a-col>
        <a-col :span="4">
          <a-space>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-col>
      </a-row>

      <!-- 统计信息 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-statistic title="今日登录次数" :value="stats.todayCount" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="今日活跃用户" :value="stats.todayActiveUsers" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="登录失败次数" :value="stats.failedCount" class="danger-stat" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="异常登录预警" :value="stats.abnormalCount" class="warning-stat" />
        </a-col>
      </a-row>

      <!-- 记录表格 -->
      <a-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading">
        <template #status="{ record }">
          <a-tag :color="record.status === 'success' ? 'green' : 'red'">
            {{ record.status === 'success' ? '成功' : '失败' }}
          </a-tag>
        </template>
        <template #device="{ record }">
          <a-space>
            <icon-mobile v-if="record.deviceType === 'mobile'" />
            <icon-desktop v-else />
            <span>{{ record.device }}</span>
          </a-space>
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleViewDetail(record)">详情</a-button>
            <a-button type="text" size="small" status="danger" @click="handleMarkAbnormal(record)">标记异常</a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 详情弹窗 -->
    <a-modal v-model:visible="detailVisible" title="登录详情" width="600px" :footer="false">
      <a-descriptions :data="detailData" :column="2" bordered />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const detailVisible = ref(false)

const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: []
})

const stats = reactive({
  todayCount: 1256,
  todayActiveUsers: 892,
  failedCount: 23,
  abnormalCount: 5
})

const columns = [
  { title: '用户ID', dataIndex: 'userId', width: 100 },
  { title: '用户名', dataIndex: 'username', width: 120 },
  { title: '登录时间', dataIndex: 'loginTime', width: 180 },
  { title: '登录状态', dataIndex: 'status', slotName: 'status', width: 100 },
  { title: 'IP地址', dataIndex: 'ip', width: 140 },
  { title: '归属地', dataIndex: 'location', width: 120 },
  { title: '设备信息', dataIndex: 'device', slotName: 'device', width: 150 },
  { title: '失败原因', dataIndex: 'failReason', width: 150 },
  { title: '操作', slotName: 'action', width: 140, fixed: 'right' }
]

const tableData = ref([])
const detailData = ref([])

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showPageSize: true
})

const mockData = () => {
  tableData.value = [
    { id: 1, userId: 10001, username: 'user001', loginTime: '2024-01-15 14:30:22', status: 'success', ip: '223.104.210.45', location: '北京市', deviceType: 'mobile', device: 'iPhone 15 Pro', failReason: '-' },
    { id: 2, userId: 10002, username: 'user002', loginTime: '2024-01-15 14:28:15', status: 'success', ip: '116.233.89.12', location: '上海市', deviceType: 'desktop', device: 'Chrome/Windows', failReason: '-' },
    { id: 3, userId: 10003, username: 'user003', loginTime: '2024-01-15 14:25:33', status: 'failed', ip: '183.62.45.78', location: '广州市', deviceType: 'mobile', device: 'Android', failReason: '密码错误' },
    { id: 4, userId: 10004, username: 'user004', loginTime: '2024-01-15 14:20:18', status: 'success', ip: '218.76.123.56', location: '深圳市', deviceType: 'mobile', device: 'iPhone 14', failReason: '-' },
    { id: 5, userId: 10005, username: 'user005', loginTime: '2024-01-15 14:18:45', status: 'failed', ip: '58.20.89.234', location: '杭州市', deviceType: 'desktop', device: 'Safari/MacOS', failReason: '验证码错误' },
  ]
  pagination.total = 1256
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    mockData()
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleViewDetail = (record) => {
  detailData.value = [
    { label: '用户ID', value: record.userId },
    { label: '用户名', value: record.username },
    { label: '登录时间', value: record.loginTime },
    { label: '登录状态', value: record.status === 'success' ? '成功' : '失败' },
    { label: 'IP地址', value: record.ip },
    { label: '归属地', value: record.location },
    { label: '设备类型', value: record.deviceType === 'mobile' ? '移动端' : '桌面端' },
    { label: '设备信息', value: record.device },
    { label: 'User-Agent', value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...' },
    { label: '失败原因', value: record.failReason },
  ]
  detailVisible.value = true
}

const handleMarkAbnormal = (record) => {
  Message.success(`已将用户 ${record.username} 的登录标记为异常`)
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.login-logs-container {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
:deep(.danger-stat .arco-statistic-value) {
  color: #f53f3f;
}
:deep(.warning-stat .arco-statistic-value) {
  color: #ff7d00;
}
</style>
