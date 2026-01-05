<template>
  <div class="p-4">
    <a-card title="新币管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showCreateModal">
          <template #icon><icon-plus /></template>
          添加新币
        </a-button>
      </template>

      <a-table :data="tableData" :loading="loading" :pagination="false">
        <template #columns>
          <a-table-column title="币种信息" :width="200">
            <template #cell="{ record }">
              <div class="flex items-center gap-2">
                <a-avatar :size="40" :style="{ backgroundColor: '#1890ff' }">
                  {{ record.symbol.substring(0, 2) }}
                </a-avatar>
                <div>
                  <div class="font-medium">{{ record.symbol }}</div>
                  <div class="text-gray-400 text-xs">{{ record.name }}</div>
                </div>
                <a-tag v-if="record.isNew" color="green" size="small">新币</a-tag>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="上线时间" :width="180">
            <template #cell="{ record }">
              <div>{{ record.launchTime }}</div>
              <div class="text-xs" :class="record.countdown > 0 ? 'text-orange-500' : 'text-green-500'">
                {{ record.countdown > 0 ? `倒计时: ${formatCountdown(record.countdown)}` : '已上线' }}
              </div>
            </template>
          </a-table-column>
          <a-table-column title="发行价" :width="100">
            <template #cell="{ record }">
              ${{ record.issuePrice }}
            </template>
          </a-table-column>
          <a-table-column title="总供应量" :width="140">
            <template #cell="{ record }">
              {{ formatNumber(record.totalSupply) }}
            </template>
          </a-table-column>
          <a-table-column title="前端展示" :width="100">
            <template #cell="{ record }">
              <a-switch v-model="record.showInFrontend" size="small" @change="updateShow(record)" />
            </template>
          </a-table-column>
          <a-table-column title="倒计时展示" :width="100">
            <template #cell="{ record }">
              <a-switch v-model="record.showCountdown" size="small" />
            </template>
          </a-table-column>
          <a-table-column title="排序" data-index="sortOrder" :width="80" />
          <a-table-column title="状态" :width="80">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="150">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="editCoin(record)">编辑</a-button>
                <a-button type="text" size="small" status="danger" @click="deleteCoin(record)">删除</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑新币' : '添加新币'" width="600px" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="币种符号" required>
              <a-input v-model="formData.symbol" placeholder="如: AGX" :disabled="isEdit" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="币种名称" required>
              <a-input v-model="formData.name" placeholder="如: AGX Token" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="上线时间">
              <a-date-picker v-model="formData.launchTime" show-time style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="发行价(USDT)">
              <a-input-number v-model="formData.issuePrice" :min="0" :precision="6" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="总供应量">
              <a-input-number v-model="formData.totalSupply" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序">
              <a-input-number v-model="formData.sortOrder" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="简介">
          <a-textarea v-model="formData.description" :max-length="500" show-word-limit />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="前端展示">
              <a-switch v-model="formData.showInFrontend" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="展示倒计时">
              <a-switch v-model="formData.showCountdown" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="标记为新币">
              <a-switch v-model="formData.isNew" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'

const loading = ref(false)
const tableData = ref([])
const modalVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: null,
  symbol: '',
  name: '',
  launchTime: null,
  issuePrice: 0,
  totalSupply: 0,
  sortOrder: 0,
  description: '',
  showInFrontend: true,
  showCountdown: true,
  isNew: true
})

const formatNumber = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  return num.toLocaleString()
}

const formatCountdown = (seconds) => {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${d}天${h}时${m}分`
}

const getStatusColor = (status) => {
  const colors = { pending: 'orange', active: 'green', ended: 'gray' }
  return colors[status] || 'gray'
}

const getStatusText = (status) => {
  const texts = { pending: '待上线', active: '进行中', ended: '已结束' }
  return texts[status] || status
}

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: 1, symbol: 'AGX', name: 'AGX Token', launchTime: '2025-01-15 00:00', countdown: 0, issuePrice: 0.50, totalSupply: 1000000000, showInFrontend: true, showCountdown: false, isNew: true, sortOrder: 1, status: 'active' },
      { id: 2, symbol: 'GLD', name: 'Gold Token', launchTime: '2025-02-01 12:00', countdown: 518400, issuePrice: 0.10, totalSupply: 500000000, showInFrontend: true, showCountdown: true, isNew: true, sortOrder: 2, status: 'pending' },
      { id: 3, symbol: 'SLV', name: 'Silver Token', launchTime: '2025-02-15 00:00', countdown: 1728000, issuePrice: 0.05, totalSupply: 2000000000, showInFrontend: true, showCountdown: true, isNew: true, sortOrder: 3, status: 'pending' },
    ]
    loading.value = false
  }, 300)
}

const showCreateModal = () => {
  isEdit.value = false
  Object.assign(formData, { id: null, symbol: '', name: '', launchTime: null, issuePrice: 0, totalSupply: 0, sortOrder: 0, description: '', showInFrontend: true, showCountdown: true, isNew: true })
  modalVisible.value = true
}

const editCoin = (record) => {
  isEdit.value = true
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleSubmit = () => {
  if (!formData.symbol || !formData.name) {
    Message.warning('请填写完整信息')
    return
  }
  Message.success(isEdit.value ? '修改成功' : '添加成功')
  modalVisible.value = false
  fetchData()
}

const updateShow = (record) => {
  Message.success(record.showInFrontend ? '已显示' : '已隐藏')
}

const deleteCoin = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 ${record.symbol} 吗？`,
    onOk: () => {
      Message.success('已删除')
      fetchData()
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.text-orange-500 { color: #fa8c16; }
.text-green-500 { color: #52c41a; }
</style>
