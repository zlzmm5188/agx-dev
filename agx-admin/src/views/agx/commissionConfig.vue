<template>
  <div class="p-4">
    <a-card title="收益比例配置" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="handleSave" :loading="saving">
          <template #icon><icon-save /></template>
          保存配置
        </a-button>
      </template>

      <a-tabs default-active-key="commission">
        <!-- 返佣配置 -->
        <a-tab-pane key="commission" title="返佣比例">
          <a-alert type="info" class="mb-4">
            返佣基数 = 被邀请人产生的手续费 × 对应比例
          </a-alert>

          <a-form :model="commissionConfig" layout="vertical" class="max-w-xl">
            <a-form-item label="返佣来源">
              <a-checkbox-group v-model="commissionConfig.sources">
                <a-checkbox value="contract">秒合约交易</a-checkbox>
                <a-checkbox value="spot">现货交易</a-checkbox>
                <a-checkbox value="pool">矿池收益</a-checkbox>
                <a-checkbox value="gold">黄金交易</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item label="默认一级返佣(%)">
              <a-slider v-model="commissionConfig.level1" :min="0" :max="50" :marks="{ 0: '0%', 20: '20%', 50: '50%' }" />
              <div class="text-right">{{ commissionConfig.level1 }}%</div>
            </a-form-item>
            <a-form-item label="默认二级返佣(%)">
              <a-slider v-model="commissionConfig.level2" :min="0" :max="30" :marks="{ 0: '0%', 10: '10%', 30: '30%' }" />
              <div class="text-right">{{ commissionConfig.level2 }}%</div>
            </a-form-item>
            <a-form-item label="最高层级">
              <a-radio-group v-model="commissionConfig.maxLevel">
                <a-radio :value="1">仅一级</a-radio>
                <a-radio :value="2">二级</a-radio>
                <a-radio :value="3">三级</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="返佣结算周期">
              <a-select v-model="commissionConfig.settleCycle" style="width: 200px">
                <a-option value="realtime">实时结算</a-option>
                <a-option value="daily">每日结算</a-option>
                <a-option value="weekly">每周结算</a-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 分成配置 -->
        <a-tab-pane key="share" title="平台分成">
          <a-form :model="shareConfig" layout="vertical" class="max-w-xl">
            <a-form-item label="秒合约手续费率(%)">
              <a-input-number v-model="shareConfig.contractFee" :min="0" :max="10" :precision="2" style="width: 200px" />
            </a-form-item>
            <a-form-item label="现货交易手续费率(%)">
              <a-input-number v-model="shareConfig.spotFee" :min="0" :max="1" :precision="3" style="width: 200px" />
            </a-form-item>
            <a-form-item label="黄金交易手续费率(%)">
              <a-input-number v-model="shareConfig.goldFee" :min="0" :max="1" :precision="2" style="width: 200px" />
            </a-form-item>
            <a-form-item label="提现手续费(USDT)">
              <a-input-number v-model="shareConfig.withdrawFee" :min="0" :precision="2" style="width: 200px" />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 特殊规则 -->
        <a-tab-pane key="special" title="特殊规则">
          <a-form :model="specialConfig" layout="vertical" class="max-w-xl">
            <a-form-item label="新用户邀请奖励(USDT)">
              <a-input-number v-model="specialConfig.newUserBonus" :min="0" :precision="2" style="width: 200px" />
              <template #help>被邀请人注册后，邀请人获得奖励</template>
            </a-form-item>
            <a-form-item label="首充奖励比例(%)">
              <a-input-number v-model="specialConfig.firstDepositBonus" :min="0" :max="50" :precision="2" style="width: 200px" />
              <template #help>被邀请人首次充值后，邀请人按比例获得奖励</template>
            </a-form-item>
            <a-form-item label="最低返佣金额(USDT)">
              <a-input-number v-model="specialConfig.minCommission" :min="0" :precision="4" style="width: 200px" />
              <template #help>低于此金额不发放返佣</template>
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

const commissionConfig = reactive({
  sources: ['contract', 'gold'],
  level1: 20,
  level2: 10,
  maxLevel: 2,
  settleCycle: 'realtime'
})

const shareConfig = reactive({
  contractFee: 0.5,
  spotFee: 0.1,
  goldFee: 0.1,
  withdrawFee: 5
})

const specialConfig = reactive({
  newUserBonus: 5,
  firstDepositBonus: 5,
  minCommission: 0.01
})

const handleSave = async () => {
  saving.value = true
  setTimeout(() => {
    Message.success('配置保存成功')
    saving.value = false
  }, 1000)
}

onMounted(() => {})
</script>

<style scoped>
.max-w-xl { max-width: 36rem; }
</style>
