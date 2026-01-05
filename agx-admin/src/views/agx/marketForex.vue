<template>
  <div class="market-forex-container">
    <a-card title="外汇行情管理">
      <template #extra>
        <a-space>
          <a-button @click="handleRefresh">
            <template #icon><icon-refresh /></template>
            刷新行情
          </a-button>
          <a-button type="primary" @click="handleAdd">
            <template #icon><icon-plus /></template>
            添加货币对
          </a-button>
        </a-space>
      </template>

      <!-- Tab切换 - 按类型分类 -->
      <a-tabs v-model:active-key="activeTab" class="mb-4">
        <a-tab-pane key="major" title="主要货币对" />
        <a-tab-pane key="minor" title="次要货币对" />
        <a-tab-pane key="exotic" title="新兴货币对" />
      </a-tabs>

      <!-- 搜索栏 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-input v-model="searchForm.keyword" placeholder="货币对代码" allow-clear />
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 100%">
            <a-option value="1">已上线</a-option>
            <a-option value="0">已下线</a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </a-col>
      </a-row>

      <!-- 货币对列表 -->
      <a-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading">
        <template #price="{ record }">
          <div>
            <div class="price-value">{{ record.price }}</div>
            <div :class="['price-change', record.changePercent >= 0 ? 'up' : 'down']">
              {{ record.changePercent >= 0 ? '+' : '' }}{{ record.changePercent }}%
            </div>
          </div>
        </template>
        <template #spread="{ record }">
          <a-tag color="blue">{{ record.spread }} pips</a-tag>
        </template>
        <template #status="{ record }">
          <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" @change="(val) => handleStatusChange(record, val)" />
        </template>
        <template #recommend="{ record }">
          <a-switch v-model="record.recommend" :checked-value="1" :unchecked-value="0" @change="(val) => handleRecommendChange(record, val)" />
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="text" size="small" @click="handleViewChart(record)">K线</a-button>
            <a-popconfirm content="确定删除该货币对？" @ok="handleDelete(record)">
              <a-button type="text" size="small" status="danger">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑货币对' : '添加货币对'" width="600px" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="货币对代码" required>
              <a-input v-model="formData.symbol" placeholder="如 EUR/USD" :disabled="isEdit" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="显示名称" required>
              <a-input v-model="formData.name" placeholder="如 欧元/美元" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="类型" required>
              <a-select v-model="formData.type" placeholder="选择类型">
                <a-option value="major">主要货币对</a-option>
                <a-option value="minor">次要货币对</a-option>
                <a-option value="exotic">新兴货币对</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="点差(pips)">
              <a-input-number v-model="formData.spread" :min="0" :precision="1" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="杠杆倍数">
              <a-select v-model="formData.leverage" placeholder="选择杠杆">
                <a-option :value="50">1:50</a-option>
                <a-option :value="100">1:100</a-option>
                <a-option :value="200">1:200</a-option>
                <a-option :value="500">1:500</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序权重">
              <a-input-number v-model="formData.sort" :min="0" :max="9999" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="允许交易">
              <a-switch v-model="formData.tradable" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="首页推荐">
              <a-switch v-model="formData.recommend" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="上线状态">
              <a-switch v-model="formData.status" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const activeTab = ref('major')
const modalVisible = ref(false)
const isEdit = ref(false)

const searchForm = reactive({
  keyword: '',
  status: ''
})

const formData = reactive({
  symbol: '',
  name: '',
  type: 'major',
  spread: 0,
  leverage: 100,
  sort: 0,
  tradable: true,
  recommend: false,
  status: true
})

const columns = [
  { title: '货币对', dataIndex: 'symbol', width: 120 },
  { title: '名称', dataIndex: 'name', width: 150 },
  { title: '买入价', dataIndex: 'bid', width: 100 },
  { title: '卖出价', dataIndex: 'ask', width: 100 },
  { title: '行情', dataIndex: 'price', slotName: 'price', width: 120 },
  { title: '点差', dataIndex: 'spread', slotName: 'spread', width: 100 },
  { title: '杠杆', dataIndex: 'leverage', width: 80 },
  { title: '24H成交量', dataIndex: 'volume', width: 120 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 80 },
  { title: '推荐', dataIndex: 'recommend', slotName: 'recommend', width: 80 },
  { title: '操作', slotName: 'action', width: 150, fixed: 'right' }
]

const tableData = ref([])

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showPageSize: true
})

const mockData = () => {
  const majorPairs = [
    { id: 1, symbol: 'EUR/USD', name: '欧元/美元', bid: 1.0865, ask: 1.0867, price: 1.0866, changePercent: 0.15, spread: 2, leverage: '1:100', volume: '5.2B', sort: 100, status: 1, recommend: 1 },
    { id: 2, symbol: 'GBP/USD', name: '英镑/美元', bid: 1.2695, ask: 1.2698, price: 1.2696, changePercent: -0.08, spread: 3, leverage: '1:100', volume: '3.8B', sort: 99, status: 1, recommend: 1 },
    { id: 3, symbol: 'USD/JPY', name: '美元/日元', bid: 148.52, ask: 148.55, price: 148.53, changePercent: 0.25, spread: 3, leverage: '1:100', volume: '4.5B', sort: 98, status: 1, recommend: 1 },
    { id: 4, symbol: 'USD/CHF', name: '美元/瑞郎', bid: 0.8725, ask: 0.8728, price: 0.8726, changePercent: -0.12, spread: 2, leverage: '1:100', volume: '1.2B', sort: 97, status: 1, recommend: 0 },
    { id: 5, symbol: 'AUD/USD', name: '澳元/美元', bid: 0.6542, ask: 0.6545, price: 0.6543, changePercent: 0.32, spread: 2, leverage: '1:100', volume: '2.1B', sort: 96, status: 1, recommend: 0 },
  ]
  
  tableData.value = majorPairs
  pagination.total = majorPairs.length
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    mockData()
    loading.value = false
  }, 500)
}

const handleRefresh = () => {
  Message.success('行情数据已刷新')
  mockData()
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    symbol: '', name: '', type: activeTab.value, spread: 0,
    leverage: 100, sort: 0, tradable: true, recommend: false, status: true
  })
  modalVisible.value = true
}

const handleEdit = (record) => {
  isEdit.value = true
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleSubmit = () => {
  Message.success(isEdit.value ? '更新成功' : '添加成功')
  modalVisible.value = false
  mockData()
}

const handleDelete = (record) => {
  Message.success(`已删除 ${record.symbol}`)
}

const handleStatusChange = (record, val) => {
  Message.success(val ? '已上线' : '已下线')
}

const handleRecommendChange = (record, val) => {
  Message.success(val ? '已推荐' : '已取消推荐')
}

const handleViewChart = (record) => {
  Message.info(`查看 ${record.symbol} K线图`)
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.market-forex-container {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
.price-value {
  font-weight: 600;
}
.price-change {
  font-size: 12px;
}
.price-change.up {
  color: #00b42a;
}
.price-change.down {
  color: #f53f3f;
}
</style>
