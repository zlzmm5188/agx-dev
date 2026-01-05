<template>
  <div class="trade-gold-container">
    <a-card title="黄金玩法配置">
      <a-alert class="mb-4" type="info">
        黄金玩法是AGX平台的核心资产模块，支持多种玩法类型。当前为Mock阶段，所有规则可配置。
      </a-alert>

      <!-- Tab切换 -->
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="types" title="玩法类型" />
        <a-tab-pane key="contract" title="黄金秒合约" />
        <a-tab-pane key="mapping" title="AGX权益映射" />
        <a-tab-pane key="invest" title="黄金定投" />
        <a-tab-pane key="loan" title="黄金借贷" />
      </a-tabs>

      <!-- 玩法类型管理 -->
      <template v-if="activeTab === 'types'">
        <a-table :columns="typeColumns" :data="typeData" :loading="loading">
          <template #status="{ record }">
            <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" @change="(val) => handleTypeStatusChange(record, val)" />
          </template>
          <template #action="{ record }">
            <a-button type="text" size="small" @click="handleConfigType(record)">配置</a-button>
          </template>
        </a-table>
      </template>

      <!-- 黄金秒合约配置 -->
      <template v-if="activeTab === 'contract'">
        <a-form :model="contractForm" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="功能开关">
                <a-switch v-model="contractForm.enabled" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="交易时间">
                <a-select v-model="contractForm.tradingHours" style="width: 100%">
                  <a-option value="24h">24小时交易</a-option>
                  <a-option value="market">跟随市场时间</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="结算周期">
                <a-select v-model="contractForm.settlementPeriod" style="width: 100%">
                  <a-option :value="30">30秒</a-option>
                  <a-option :value="60">60秒</a-option>
                  <a-option :value="180">3分钟</a-option>
                  <a-option :value="300">5分钟</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider>收益率配置</a-divider>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="看涨收益率(%)">
                <a-input-number v-model="contractForm.upRate" :min="0" :max="100" :precision="1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="看跌收益率(%)">
                <a-input-number v-model="contractForm.downRate" :min="0" :max="100" :precision="1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="平局处理">
                <a-select v-model="contractForm.tieAction" style="width: 100%">
                  <a-option value="refund">退还本金</a-option>
                  <a-option value="lose">判定输</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider>下注限制</a-divider>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="最小下注额(USDT)">
                <a-input-number v-model="contractForm.minBet" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="最大下注额(USDT)">
                <a-input-number v-model="contractForm.maxBet" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="每日最大下注次数">
                <a-input-number v-model="contractForm.maxDailyBets" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button type="primary" @click="handleSaveContract">保存秒合约配置</a-button>
          </a-form-item>
        </a-form>
      </template>

      <!-- AGX权益映射配置 -->
      <template v-if="activeTab === 'mapping'">
        <a-form :model="mappingForm" layout="vertical">
          <a-alert class="mb-4">AGX代币与黄金克数的映射关系，决定AGX的内在价值</a-alert>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="功能开关">
                <a-switch v-model="mappingForm.enabled" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="映射比例">
                <a-input-number v-model="mappingForm.ratio" :min="0" :precision="6" style="width: 100%">
                  <template #suffix>克/AGX</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="每日收益率(%)">
                <a-input-number v-model="mappingForm.dailyRate" :min="0" :max="10" :precision="4" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="最低持仓(AGX)">
                <a-input-number v-model="mappingForm.minHolding" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="收益结算时间">
                <a-time-picker v-model="mappingForm.settlementTime" format="HH:mm" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="收益发放方式">
                <a-select v-model="mappingForm.payoutType" style="width: 100%">
                  <a-option value="gold">发放黄金</a-option>
                  <a-option value="agx">发放AGX</a-option>
                  <a-option value="usdt">折算USDT</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button type="primary" @click="handleSaveMapping">保存映射配置</a-button>
          </a-form-item>
        </a-form>
      </template>

      <!-- 黄金定投配置 -->
      <template v-if="activeTab === 'invest'">
        <a-form :model="investForm" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="功能开关">
                <a-switch v-model="investForm.enabled" />
              </a-form-item>
            </a-col>
            <a-col :span="16">
              <a-form-item label="定投周期">
                <a-checkbox-group v-model="investForm.periods">
                  <a-checkbox value="daily">每日</a-checkbox>
                  <a-checkbox value="weekly">每周</a-checkbox>
                  <a-checkbox value="biweekly">每两周</a-checkbox>
                  <a-checkbox value="monthly">每月</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="最小定投额(USDT)">
                <a-input-number v-model="investForm.minAmount" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="最大定投额(USDT)">
                <a-input-number v-model="investForm.maxAmount" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="定投手续费(%)">
                <a-input-number v-model="investForm.feeRate" :min="0" :max="10" :precision="2" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button type="primary" @click="handleSaveInvest">保存定投配置</a-button>
          </a-form-item>
        </a-form>
      </template>

      <!-- 黄金借贷配置 -->
      <template v-if="activeTab === 'loan'">
        <a-form :model="loanForm" layout="vertical">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="功能开关">
                <a-switch v-model="loanForm.enabled" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="质押率(%)">
                <a-input-number v-model="loanForm.pledgeRate" :min="0" :max="100" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="强平线(%)">
                <a-input-number v-model="loanForm.liquidationRate" :min="0" :max="100" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="日利率(%)">
                <a-input-number v-model="loanForm.dailyInterest" :min="0" :precision="4" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="最长借贷天数">
                <a-input-number v-model="loanForm.maxDays" :min="1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="最小借贷额(USDT)">
                <a-input-number v-model="loanForm.minLoan" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button type="primary" @click="handleSaveLoan">保存借贷配置</a-button>
          </a-form-item>
        </a-form>
      </template>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const activeTab = ref('types')

const typeColumns = [
  { title: '玩法名称', dataIndex: 'name', width: 150 },
  { title: '玩法代码', dataIndex: 'code', width: 120 },
  { title: '描述', dataIndex: 'description', width: 300 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 100 },
  { title: '操作', slotName: 'action', width: 100, fixed: 'right' }
]

const typeData = ref([])

const contractForm = reactive({
  enabled: true,
  tradingHours: '24h',
  settlementPeriod: 60,
  upRate: 85,
  downRate: 85,
  tieAction: 'refund',
  minBet: 10,
  maxBet: 10000,
  maxDailyBets: 100
})

const mappingForm = reactive({
  enabled: true,
  ratio: 0.001,
  dailyRate: 0.05,
  minHolding: 100,
  settlementTime: '00:00',
  payoutType: 'gold'
})

const investForm = reactive({
  enabled: true,
  periods: ['daily', 'weekly', 'monthly'],
  minAmount: 100,
  maxAmount: 100000,
  feeRate: 0.1
})

const loanForm = reactive({
  enabled: false,
  pledgeRate: 70,
  liquidationRate: 85,
  dailyInterest: 0.05,
  maxDays: 90,
  minLoan: 1000
})

const mockData = () => {
  typeData.value = [
    { id: 1, name: '黄金秒合约', code: 'gold_contract', description: '预测黄金价格涨跌，周期30秒-5分钟', sort: 100, status: 1 },
    { id: 2, name: 'AGX权益映射', code: 'agx_mapping', description: 'AGX代币映射黄金克数，享受每日收益', sort: 99, status: 1 },
    { id: 3, name: '黄金定投', code: 'gold_invest', description: '定期定额购买黄金，平摊成本', sort: 98, status: 1 },
    { id: 4, name: '黄金借贷', code: 'gold_loan', description: '质押黄金借出USDT', sort: 97, status: 0 },
  ]
}

const handleTypeStatusChange = (record, val) => {
  Message.success(val ? `已开启 ${record.name}` : `已关闭 ${record.name}`)
}

const handleConfigType = (record) => {
  const tabMap = {
    gold_contract: 'contract',
    agx_mapping: 'mapping',
    gold_invest: 'invest',
    gold_loan: 'loan'
  }
  activeTab.value = tabMap[record.code] || 'types'
}

const handleSaveContract = () => {
  Message.success('黄金秒合约配置已保存')
}

const handleSaveMapping = () => {
  Message.success('AGX权益映射配置已保存')
}

const handleSaveInvest = () => {
  Message.success('黄金定投配置已保存')
}

const handleSaveLoan = () => {
  Message.success('黄金借贷配置已保存')
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.trade-gold-container {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
