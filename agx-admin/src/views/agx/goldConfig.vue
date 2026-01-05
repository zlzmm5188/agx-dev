<template>
  <div class="p-4">
    <a-card title="黄金规则配置" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="handleSave" :loading="saving">
          <template #icon><icon-save /></template>
          保存配置
        </a-button>
      </template>

      <a-tabs default-active-key="basic">
        <!-- 基础配置 -->
        <a-tab-pane key="basic" title="基础配置">
          <a-form :model="basicConfig" layout="vertical" class="max-w-2xl">
            <a-form-item label="黄金单位">
              <a-input v-model="basicConfig.unit" disabled />
              <template #help>系统固定为"克"</template>
            </a-form-item>
            <a-form-item label="最小购买量(克)">
              <a-input-number v-model="basicConfig.minBuy" :min="0.0001" :precision="4" style="width: 200px" />
            </a-form-item>
            <a-form-item label="最大购买量(克)">
              <a-input-number v-model="basicConfig.maxBuy" :min="0" :precision="4" style="width: 200px" />
              <template #help>0表示不限制</template>
            </a-form-item>
            <a-form-item label="购买手续费(%)">
              <a-input-number v-model="basicConfig.buyFee" :min="0" :max="100" :precision="2" style="width: 200px" />
            </a-form-item>
            <a-form-item label="卖出手续费(%)">
              <a-input-number v-model="basicConfig.sellFee" :min="0" :max="100" :precision="2" style="width: 200px" />
            </a-form-item>
            <a-form-item label="价格精度(小数位)">
              <a-input-number v-model="basicConfig.priceDecimals" :min="0" :max="8" style="width: 200px" />
            </a-form-item>
            <a-form-item label="交易状态">
              <a-switch v-model="basicConfig.tradeEnabled" />
              <span class="ml-2">{{ basicConfig.tradeEnabled ? '已开启' : '已关闭' }}</span>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 收益配置 -->
        <a-tab-pane key="income" title="收益配置">
          <a-form :model="incomeConfig" layout="vertical" class="max-w-2xl">
            <a-form-item label="每日收益开关">
              <a-switch v-model="incomeConfig.dailyEnabled" />
              <span class="ml-2">{{ incomeConfig.dailyEnabled ? '已开启' : '已关闭' }}</span>
            </a-form-item>
            <a-form-item label="每日收益率(%)" v-if="incomeConfig.dailyEnabled">
              <a-input-number v-model="incomeConfig.dailyRate" :min="0" :max="10" :precision="4" style="width: 200px" />
              <template #help>每日发放收益 = 持仓克数 × 当日金价 × 收益率</template>
            </a-form-item>
            <a-form-item label="收益结算时间" v-if="incomeConfig.dailyEnabled">
              <a-time-picker v-model="incomeConfig.settleTime" format="HH:mm" style="width: 200px" />
            </a-form-item>
            <a-form-item label="最低持仓要求(克)">
              <a-input-number v-model="incomeConfig.minHolding" :min="0" :precision="4" style="width: 200px" />
              <template #help>持仓低于此值不发放收益</template>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 玩法配置 -->
        <a-tab-pane key="gameplay" title="玩法类型">
          <a-alert type="info" class="mb-4">
            配置黄金相关的玩法类型，如秒合约、权益映射等
          </a-alert>
          <a-table :data="gameplayList" :pagination="false">
            <template #columns>
              <a-table-column title="玩法名称" data-index="name" :width="150" />
              <a-table-column title="玩法类型" data-index="type" :width="120">
                <template #cell="{ record }">
                  <a-tag>{{ record.type }}</a-tag>
                </template>
              </a-table-column>
              <a-table-column title="说明" data-index="description" />
              <a-table-column title="状态" :width="100">
                <template #cell="{ record }">
                  <a-switch v-model="record.enabled" size="small" />
                </template>
              </a-table-column>
              <a-table-column title="操作" :width="100">
                <template #cell="{ record }">
                  <a-button type="text" size="small" @click="editGameplay(record)">编辑</a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- 价格来源 -->
        <a-tab-pane key="price" title="价格来源">
          <a-form :model="priceConfig" layout="vertical" class="max-w-2xl">
            <a-form-item label="价格数据源">
              <a-select v-model="priceConfig.source" style="width: 300px">
                <a-option value="mock">Mock数据(开发测试)</a-option>
                <a-option value="reuters">路透社(Reuters)</a-option>
                <a-option value="bloomberg">彭博(Bloomberg)</a-option>
                <a-option value="goldprice">GoldPrice.org</a-option>
              </a-select>
            </a-form-item>
            <a-form-item label="更新频率(秒)">
              <a-input-number v-model="priceConfig.updateInterval" :min="1" :max="3600" style="width: 200px" />
            </a-form-item>
            <a-form-item label="Mock基准价格(美元/盎司)" v-if="priceConfig.source === 'mock'">
              <a-input-number v-model="priceConfig.mockPrice" :min="0" :precision="2" style="width: 200px" />
            </a-form-item>
            <a-form-item label="Mock波动范围(%)" v-if="priceConfig.source === 'mock'">
              <a-input-number v-model="priceConfig.mockRange" :min="0" :max="10" :precision="2" style="width: 200px" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const saving = ref(false)

const basicConfig = reactive({
  unit: '克',
  minBuy: 0.1,
  maxBuy: 10000,
  buyFee: 0.1,
  sellFee: 0.1,
  priceDecimals: 2,
  tradeEnabled: true
})

const incomeConfig = reactive({
  dailyEnabled: true,
  dailyRate: 0.05,
  settleTime: '00:00',
  minHolding: 1
})

const priceConfig = reactive({
  source: 'mock',
  updateInterval: 60,
  mockPrice: 2650,
  mockRange: 0.5
})

const gameplayList = ref([
  { id: 1, name: '黄金秒合约', type: 'contract', description: '基于黄金价格的秒合约交易', enabled: true },
  { id: 2, name: 'AGX权益映射', type: 'mapping', description: 'AGX代币与黄金价值映射', enabled: true },
  { id: 3, name: '黄金定投', type: 'dca', description: '定期自动购买黄金', enabled: false },
  { id: 4, name: '黄金借贷', type: 'lending', description: '以黄金作为抵押借贷', enabled: false },
])

const handleSave = async () => {
  saving.value = true
  setTimeout(() => {
    Message.success('配置保存成功')
    saving.value = false
  }, 1000)
}

const editGameplay = (record) => {
  Message.info(`编辑玩法: ${record.name}`)
}

onMounted(() => {
  // 加载配置
})
</script>

<style scoped>
.max-w-2xl { max-width: 42rem; }
</style>
