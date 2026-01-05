<template>
  <div class="trade-spot-container">
    <a-card title="现货交易配置">
      <!-- Tab切换 -->
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="pairs" title="交易对管理" />
        <a-tab-pane key="fees" title="手续费配置" />
        <a-tab-pane key="limits" title="交易限制" />
        <a-tab-pane key="settings" title="全局设置" />
      </a-tabs>

      <!-- 交易对管理 -->
      <template v-if="activeTab === 'pairs'">
        <div class="mb-4">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-input v-model="searchForm.keyword" placeholder="交易对名称" allow-clear />
            </a-col>
            <a-col :span="4">
              <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 100%">
                <a-option value="1">已开放</a-option>
                <a-option value="0">已关闭</a-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-space>
                <a-button type="primary" @click="handleSearch">搜索</a-button>
                <a-button type="primary" status="success" @click="handleAddPair">添加交易对</a-button>
              </a-space>
            </a-col>
          </a-row>
        </div>
        
        <a-table :columns="pairColumns" :data="pairData" :loading="loading">
          <template #status="{ record }">
            <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" @change="(val) => handlePairStatusChange(record, val)" />
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEditPair(record)">编辑</a-button>
              <a-popconfirm content="确定删除该交易对？" @ok="handleDeletePair(record)">
                <a-button type="text" size="small" status="danger">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </template>

      <!-- 手续费配置 -->
      <template v-if="activeTab === 'fees'">
        <a-alert class="mb-4">手续费按用户等级区分，等级越高手续费越低</a-alert>
        <a-table :columns="feeColumns" :data="feeData">
          <template #makerFee="{ record }">
            <a-input-number v-model="record.makerFee" :precision="4" :min="0" :max="1" size="small" style="width: 100px" />
          </template>
          <template #takerFee="{ record }">
            <a-input-number v-model="record.takerFee" :precision="4" :min="0" :max="1" size="small" style="width: 100px" />
          </template>
        </a-table>
        <div class="mt-4">
          <a-button type="primary" @click="handleSaveFees">保存手续费配置</a-button>
        </div>
      </template>

      <!-- 交易限制 -->
      <template v-if="activeTab === 'limits'">
        <a-form :model="limitForm" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="单笔最小交易额(USDT)">
                <a-input-number v-model="limitForm.minOrderAmount" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="单笔最大交易额(USDT)">
                <a-input-number v-model="limitForm.maxOrderAmount" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="24小时最大交易次数">
                <a-input-number v-model="limitForm.maxDailyOrders" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="24小时最大交易额(USDT)">
                <a-input-number v-model="limitForm.maxDailyAmount" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="新用户交易冷却期(小时)">
                <a-input-number v-model="limitForm.newUserCooldown" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="未KYC用户限制">
                <a-switch v-model="limitForm.kycRequired" />
                <span class="ml-2">{{ limitForm.kycRequired ? '需要KYC才能交易' : '无需KYC' }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button type="primary" @click="handleSaveLimits">保存限制配置</a-button>
          </a-form-item>
        </a-form>
      </template>

      <!-- 全局设置 -->
      <template v-if="activeTab === 'settings'">
        <a-form :model="settingsForm" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="现货交易开关">
                <a-switch v-model="settingsForm.spotEnabled" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="市价单开关">
                <a-switch v-model="settingsForm.marketOrderEnabled" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="限价单开关">
                <a-switch v-model="settingsForm.limitOrderEnabled" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="价格精度(小数位)">
                <a-input-number v-model="settingsForm.pricePrecision" :min="0" :max="18" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="数量精度(小数位)">
                <a-input-number v-model="settingsForm.amountPrecision" :min="0" :max="18" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="撮合模式">
                <a-radio-group v-model="settingsForm.matchMode">
                  <a-radio value="mock">模拟撮合(Mock)</a-radio>
                  <a-radio value="real">真实撮合</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="行情数据源">
                <a-select v-model="settingsForm.dataSource" style="width: 100%">
                  <a-option value="mock">Mock数据</a-option>
                  <a-option value="binance">Binance</a-option>
                  <a-option value="okx">OKX</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button type="primary" @click="handleSaveSettings">保存全局设置</a-button>
          </a-form-item>
        </a-form>
      </template>
    </a-card>

    <!-- 添加/编辑交易对弹窗 -->
    <a-modal v-model:visible="pairModalVisible" :title="isEditPair ? '编辑交易对' : '添加交易对'" @ok="handleSubmitPair">
      <a-form :model="pairForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="基础货币" required>
              <a-select v-model="pairForm.baseCurrency" placeholder="选择基础货币">
                <a-option value="BTC">BTC</a-option>
                <a-option value="ETH">ETH</a-option>
                <a-option value="USDT">USDT</a-option>
                <a-option value="AGX">AGX</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计价货币" required>
              <a-select v-model="pairForm.quoteCurrency" placeholder="选择计价货币">
                <a-option value="USDT">USDT</a-option>
                <a-option value="BTC">BTC</a-option>
                <a-option value="ETH">ETH</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="最小交易量">
              <a-input-number v-model="pairForm.minAmount" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序权重">
              <a-input-number v-model="pairForm.sort" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="开放状态">
          <a-switch v-model="pairForm.status" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const activeTab = ref('pairs')
const pairModalVisible = ref(false)
const isEditPair = ref(false)

const searchForm = reactive({
  keyword: '',
  status: ''
})

const pairForm = reactive({
  baseCurrency: '',
  quoteCurrency: '',
  minAmount: 0,
  sort: 0,
  status: true
})

const limitForm = reactive({
  minOrderAmount: 10,
  maxOrderAmount: 100000,
  maxDailyOrders: 100,
  maxDailyAmount: 500000,
  newUserCooldown: 24,
  kycRequired: true
})

const settingsForm = reactive({
  spotEnabled: true,
  marketOrderEnabled: true,
  limitOrderEnabled: true,
  pricePrecision: 8,
  amountPrecision: 8,
  matchMode: 'mock',
  dataSource: 'mock'
})

const pairColumns = [
  { title: '交易对', dataIndex: 'symbol', width: 120 },
  { title: '基础货币', dataIndex: 'baseCurrency', width: 100 },
  { title: '计价货币', dataIndex: 'quoteCurrency', width: 100 },
  { title: '最新价格', dataIndex: 'price', width: 120 },
  { title: '24H成交量', dataIndex: 'volume24h', width: 120 },
  { title: '24H涨跌', dataIndex: 'change24h', width: 100 },
  { title: '最小交易量', dataIndex: 'minAmount', width: 120 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 100 },
  { title: '操作', slotName: 'action', width: 120, fixed: 'right' }
]

const feeColumns = [
  { title: '用户等级', dataIndex: 'level', width: 120 },
  { title: 'Maker手续费', dataIndex: 'makerFee', slotName: 'makerFee', width: 150 },
  { title: 'Taker手续费', dataIndex: 'takerFee', slotName: 'takerFee', width: 150 },
  { title: '说明', dataIndex: 'description', width: 200 }
]

const pairData = ref([])
const feeData = ref([])

const mockData = () => {
  pairData.value = [
    { id: 1, symbol: 'BTC/USDT', baseCurrency: 'BTC', quoteCurrency: 'USDT', price: '43256.50', volume24h: '1,256 BTC', change24h: '+2.35%', minAmount: 0.0001, sort: 100, status: 1 },
    { id: 2, symbol: 'ETH/USDT', baseCurrency: 'ETH', quoteCurrency: 'USDT', price: '2285.80', volume24h: '8,520 ETH', change24h: '+1.82%', minAmount: 0.001, sort: 99, status: 1 },
    { id: 3, symbol: 'AGX/USDT', baseCurrency: 'AGX', quoteCurrency: 'USDT', price: '1.2500', volume24h: '500,000 AGX', change24h: '+0.56%', minAmount: 1, sort: 98, status: 1 },
    { id: 4, symbol: 'ETH/BTC', baseCurrency: 'ETH', quoteCurrency: 'BTC', price: '0.05285', volume24h: '2,150 ETH', change24h: '-0.42%', minAmount: 0.001, sort: 97, status: 1 },
  ]

  feeData.value = [
    { level: '普通用户', makerFee: 0.001, takerFee: 0.001, description: '基础手续费' },
    { level: '银牌会员', makerFee: 0.0009, takerFee: 0.0009, description: '9折优惠' },
    { level: '金牌会员', makerFee: 0.0008, takerFee: 0.0008, description: '8折优惠' },
    { level: '钻石会员', makerFee: 0.0006, takerFee: 0.0006, description: '6折优惠' },
    { level: '黑金会员', makerFee: 0.0004, takerFee: 0.0004, description: '4折优惠' },
  ]
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    mockData()
    loading.value = false
  }, 500)
}

const handleAddPair = () => {
  isEditPair.value = false
  Object.assign(pairForm, { baseCurrency: '', quoteCurrency: '', minAmount: 0, sort: 0, status: true })
  pairModalVisible.value = true
}

const handleEditPair = (record) => {
  isEditPair.value = true
  Object.assign(pairForm, record)
  pairModalVisible.value = true
}

const handleSubmitPair = () => {
  Message.success(isEditPair.value ? '更新成功' : '添加成功')
  pairModalVisible.value = false
  mockData()
}

const handleDeletePair = (record) => {
  Message.success(`已删除 ${record.symbol}`)
}

const handlePairStatusChange = (record, val) => {
  Message.success(val ? '已开放交易' : '已关闭交易')
}

const handleSaveFees = () => {
  Message.success('手续费配置已保存')
}

const handleSaveLimits = () => {
  Message.success('交易限制配置已保存')
}

const handleSaveSettings = () => {
  Message.success('全局设置已保存')
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.trade-spot-container {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 16px;
}
.ml-2 {
  margin-left: 8px;
}
</style>
