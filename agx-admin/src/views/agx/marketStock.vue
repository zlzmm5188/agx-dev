<template>
  <div class="market-stock-container">
    <a-card title="股票行情管理">
      <template #extra>
        <a-space>
          <a-button @click="handleRefresh">
            <template #icon><icon-refresh /></template>
            刷新行情
          </a-button>
          <a-button type="primary" @click="handleAdd">
            <template #icon><icon-plus /></template>
            添加股票
          </a-button>
        </a-space>
      </template>

      <!-- Tab切换 - 按市场分类 -->
      <a-tabs v-model:active-key="activeTab" class="mb-4">
        <a-tab-pane key="us" title="美股" />
        <a-tab-pane key="hk" title="港股" />
        <a-tab-pane key="cn" title="A股" />
        <a-tab-pane key="index" title="指数" />
      </a-tabs>

      <!-- 搜索栏 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-input v-model="searchForm.keyword" placeholder="股票代码/名称" allow-clear />
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 100%">
            <a-option value="1">已上线</a-option>
            <a-option value="0">已下线</a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.recommend" placeholder="推荐状态" allow-clear style="width: 100%">
            <a-option value="1">推荐</a-option>
            <a-option value="0">普通</a-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-space>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
            <a-button @click="handleBatchImport">批量导入</a-button>
          </a-space>
        </a-col>
      </a-row>

      <!-- 股票列表 -->
      <a-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" row-key="id" :row-selection="rowSelection">
        <template #logo="{ record }">
          <a-avatar :size="32" shape="square">
            <img :src="record.logo" :alt="record.symbol" />
          </a-avatar>
        </template>
        <template #price="{ record }">
          <div>
            <div class="price-value">{{ record.price }}</div>
            <div :class="['price-change', record.changePercent >= 0 ? 'up' : 'down']">
              {{ record.changePercent >= 0 ? '+' : '' }}{{ record.changePercent }}%
            </div>
          </div>
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
            <a-popconfirm content="确定删除该股票？" @ok="handleDelete(record)">
              <a-button type="text" size="small" status="danger">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑股票' : '添加股票'" width="600px" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="股票代码" required>
              <a-input v-model="formData.symbol" placeholder="如 AAPL" :disabled="isEdit" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="股票名称" required>
              <a-input v-model="formData.name" placeholder="如 苹果公司" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="中文名称">
              <a-input v-model="formData.nameCn" placeholder="中文显示名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属市场" required>
              <a-select v-model="formData.market" placeholder="选择市场">
                <a-option value="us">美股</a-option>
                <a-option value="hk">港股</a-option>
                <a-option value="cn">A股</a-option>
                <a-option value="index">指数</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="所属行业">
              <a-select v-model="formData.industry" placeholder="选择行业">
                <a-option value="tech">科技</a-option>
                <a-option value="finance">金融</a-option>
                <a-option value="consumer">消费</a-option>
                <a-option value="healthcare">医疗</a-option>
                <a-option value="energy">能源</a-option>
                <a-option value="other">其他</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序权重">
              <a-input-number v-model="formData.sort" :min="0" :max="9999" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Logo URL">
          <a-input v-model="formData.logo" placeholder="股票Logo图片地址" />
        </a-form-item>
        <a-form-item label="简介">
          <a-textarea v-model="formData.description" placeholder="股票简介" :max-length="500" show-word-limit />
        </a-form-item>
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
const activeTab = ref('us')
const modalVisible = ref(false)
const isEdit = ref(false)

const searchForm = reactive({
  keyword: '',
  status: '',
  recommend: ''
})

const formData = reactive({
  symbol: '',
  name: '',
  nameCn: '',
  market: 'us',
  industry: '',
  sort: 0,
  logo: '',
  description: '',
  tradable: true,
  recommend: false,
  status: true
})

const columns = [
  { title: 'Logo', dataIndex: 'logo', slotName: 'logo', width: 60 },
  { title: '代码', dataIndex: 'symbol', width: 100 },
  { title: '名称', dataIndex: 'name', width: 150 },
  { title: '中文名', dataIndex: 'nameCn', width: 120 },
  { title: '行情', dataIndex: 'price', slotName: 'price', width: 120 },
  { title: '成交量', dataIndex: 'volume', width: 120 },
  { title: '市值', dataIndex: 'marketCap', width: 120 },
  { title: '行业', dataIndex: 'industry', width: 80 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 80 },
  { title: '推荐', dataIndex: 'recommend', slotName: 'recommend', width: 80 },
  { title: '操作', slotName: 'action', width: 150, fixed: 'right' }
]

const tableData = ref([])
const selectedKeys = ref([])

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showPageSize: true
})

const mockData = () => {
  const usStocks = [
    { id: 1, symbol: 'AAPL', name: 'Apple Inc.', nameCn: '苹果', logo: '/logo.png', price: 185.92, changePercent: 1.25, volume: '52.3M', marketCap: '2.89T', industry: '科技', sort: 100, status: 1, recommend: 1 },
    { id: 2, symbol: 'GOOGL', name: 'Alphabet Inc.', nameCn: '谷歌', logo: '/logo.png', price: 141.80, changePercent: 0.85, volume: '18.7M', marketCap: '1.78T', industry: '科技', sort: 99, status: 1, recommend: 1 },
    { id: 3, symbol: 'MSFT', name: 'Microsoft Corp.', nameCn: '微软', logo: '/logo.png', price: 378.91, changePercent: -0.32, volume: '21.5M', marketCap: '2.81T', industry: '科技', sort: 98, status: 1, recommend: 1 },
    { id: 4, symbol: 'AMZN', name: 'Amazon.com Inc.', nameCn: '亚马逊', logo: '/logo.png', price: 153.42, changePercent: 2.15, volume: '35.2M', marketCap: '1.59T', industry: '消费', sort: 97, status: 1, recommend: 0 },
    { id: 5, symbol: 'TSLA', name: 'Tesla Inc.', nameCn: '特斯拉', logo: '/logo.png', price: 248.50, changePercent: -1.85, volume: '98.6M', marketCap: '790B', industry: '消费', sort: 96, status: 1, recommend: 1 },
  ]
  const hkStocks = [
    { id: 6, symbol: '0700.HK', name: 'Tencent Holdings', nameCn: '腾讯控股', logo: '/logo.png', price: 298.40, changePercent: 0.68, volume: '12.5M', marketCap: '2.8T HKD', industry: '科技', sort: 100, status: 1, recommend: 1 },
    { id: 7, symbol: '9988.HK', name: 'Alibaba Group', nameCn: '阿里巴巴', logo: '/logo.png', price: 72.35, changePercent: -0.95, volume: '45.8M', marketCap: '1.5T HKD', industry: '消费', sort: 99, status: 1, recommend: 1 },
  ]

  if (activeTab.value === 'us') {
    tableData.value = usStocks
    pagination.total = usStocks.length
  } else if (activeTab.value === 'hk') {
    tableData.value = hkStocks
    pagination.total = hkStocks.length
  } else {
    tableData.value = []
    pagination.total = 0
  }
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    mockData()
    loading.value = false
  }, 500)
}

const handleReset = () => {
  Object.assign(searchForm, { keyword: '', status: '', recommend: '' })
  handleSearch()
}

const handleRefresh = () => {
  Message.success('行情数据已刷新')
  mockData()
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    symbol: '', name: '', nameCn: '', market: activeTab.value, industry: '',
    sort: 0, logo: '', description: '', tradable: true, recommend: false, status: true
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
  mockData()
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

const handleBatchImport = () => {
  Message.info('批量导入功能开发中')
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.market-stock-container {
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
