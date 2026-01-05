<template>
  <div class="ma-content-block p-4">
    <a-tabs default-active-key="basic">
      <!-- 基础配置 -->
      <a-tab-pane key="basic" title="基础配置">
        <a-card :bordered="false">
          <a-form :model="basicConfig" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="平台名称">
                  <a-input v-model="basicConfig.platform_name" @blur="saveConfig('platform_name', basicConfig.platform_name)" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="客服链接">
                  <a-input v-model="basicConfig.customer_service_url" @blur="saveConfig('customer_service_url', basicConfig.customer_service_url)" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="官网地址">
                  <a-input v-model="basicConfig.website_url" @blur="saveConfig('website_url', basicConfig.website_url)" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- 提现配置 -->
      <a-tab-pane key="withdraw" title="提现配置">
        <a-card :bordered="false">
          <a-form :model="withdrawConfig" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="最小提现金额(USDT)">
                  <a-input-number v-model="withdrawConfig.withdraw_min_amount" :min="0" @blur="saveConfig('withdraw_min_amount', withdrawConfig.withdraw_min_amount)" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="提现手续费率(%)">
                  <a-input-number v-model="withdrawConfig.withdraw_fee_rate" :min="0" :max="100" :precision="2" @blur="saveConfig('withdraw_fee_rate', withdrawConfig.withdraw_fee_rate)" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="每日提现限额">
                  <a-input-number v-model="withdrawConfig.withdraw_daily_limit" :min="0" @blur="saveConfig('withdraw_daily_limit', withdrawConfig.withdraw_daily_limit)" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- 合约配置 -->
      <a-tab-pane key="contract" title="合约配置">
        <a-card :bordered="false">
          <a-form :model="contractConfig" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="默认用户胜率(%)">
                  <a-input-number v-model="contractConfig.default_win_rate" :min="0" :max="100" @blur="saveConfig('default_win_rate', contractConfig.default_win_rate)" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="最小下单金额">
                  <a-input-number v-model="contractConfig.contract_min_amount" :min="0" @blur="saveConfig('contract_min_amount', contractConfig.contract_min_amount)" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="最大下单金额">
                  <a-input-number v-model="contractConfig.contract_max_amount" :min="0" @blur="saveConfig('contract_max_amount', contractConfig.contract_max_amount)" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- 邀请配置 -->
      <a-tab-pane key="invite" title="邀请配置">
        <a-card :bordered="false">
          <a-form :model="inviteConfig" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="一级返佣比例(%)">
                  <a-input-number v-model="inviteConfig.invite_level1_rate" :min="0" :max="100" :precision="2" @blur="saveConfig('invite_level1_rate', inviteConfig.invite_level1_rate)" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="二级返佣比例(%)">
                  <a-input-number v-model="inviteConfig.invite_level2_rate" :min="0" :max="100" :precision="2" @blur="saveConfig('invite_level2_rate', inviteConfig.invite_level2_rate)" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="三级返佣比例(%)">
                  <a-input-number v-model="inviteConfig.invite_level3_rate" :min="0" :max="100" :precision="2" @blur="saveConfig('invite_level3_rate', inviteConfig.invite_level3_rate)" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-tab-pane>

      <!-- 所有配置 -->
      <a-tab-pane key="all" title="所有配置">
        <a-row class="mb-4">
          <a-col :span="24">
            <a-space>
              <a-select v-model="searchForm.group" placeholder="配置组" allow-clear style="width: 150px">
                <a-option value="basic">基础配置</a-option>
                <a-option value="withdraw">提现配置</a-option>
                <a-option value="pool">矿池配置</a-option>
                <a-option value="contract">合约配置</a-option>
                <a-option value="invite">邀请配置</a-option>
              </a-select>
              <a-button type="primary" @click="handleSearch">搜索</a-button>
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" status="success" @click="handleAdd">添加配置</a-button>
            </a-space>
          </a-col>
        </a-row>

        <a-table :data="tableData" :loading="loading" :pagination="false" row-key="key">
          <template #columns>
            <a-table-column title="配置键" data-index="key" :width="200" />
            <a-table-column title="配置值" data-index="value" :width="300">
              <template #cell="{ record }">
                <a-input v-model="record.value" @blur="handleUpdate(record)" style="max-width: 280px" />
              </template>
            </a-table-column>
            <a-table-column title="配置组" data-index="configGroup" :width="120">
              <template #cell="{ record }">
                <a-tag>{{ getGroupName(record.configGroup) }}</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="描述" data-index="description" />
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <a-modal v-model:visible="formVisible" title="添加配置" @ok="handleSubmit">
      <a-form :model="form" layout="vertical">
        <a-form-item label="配置键" required>
          <a-input v-model="form.key" placeholder="如: withdraw_min_amount" />
        </a-form-item>
        <a-form-item label="配置值" required>
          <a-input v-model="form.value" />
        </a-form-item>
        <a-form-item label="配置组">
          <a-select v-model="form.configGroup">
            <a-option value="basic">基础配置</a-option>
            <a-option value="withdraw">提现配置</a-option>
            <a-option value="pool">矿池配置</a-option>
            <a-option value="contract">合约配置</a-option>
            <a-option value="invite">邀请配置</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model="form.description" />
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
const formVisible = ref(false)
const tableData = ref([])
const searchForm = reactive({ group: undefined })
const form = reactive({ key: '', value: '', configGroup: 'basic', description: '' })

// 分组配置
const basicConfig = reactive({ platform_name: 'AGX', customer_service_url: '', website_url: '' })
const withdrawConfig = reactive({ withdraw_min_amount: 10, withdraw_fee_rate: 1, withdraw_daily_limit: 10000 })
const contractConfig = reactive({ default_win_rate: 50, contract_min_amount: 10, contract_max_amount: 10000 })
const inviteConfig = reactive({ invite_level1_rate: 10, invite_level2_rate: 5, invite_level3_rate: 2 })

const groupMap = { basic: '基础配置', withdraw: '提现配置', pool: '矿池配置', contract: '合约配置', invite: '邀请配置' }
const getGroupName = (group) => groupMap[group] || group

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getConfigList({ group: searchForm.group })
    if (res.code === 0) {
      tableData.value = res.data.list || res.data || []
      // 填充分组配置
      tableData.value.forEach(c => {
        if (basicConfig[c.key] !== undefined) basicConfig[c.key] = c.value
        if (withdrawConfig[c.key] !== undefined) withdrawConfig[c.key] = parseFloat(c.value) || c.value
        if (contractConfig[c.key] !== undefined) contractConfig[c.key] = parseFloat(c.value) || c.value
        if (inviteConfig[c.key] !== undefined) inviteConfig[c.key] = parseFloat(c.value) || c.value
      })
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => fetchData()
const handleReset = () => { searchForm.group = undefined; fetchData() }

const handleAdd = () => {
  form.key = ''
  form.value = ''
  form.configGroup = 'basic'
  form.description = ''
  formVisible.value = true
}

const handleSubmit = async () => {
  if (!form.key || !form.value) {
    Message.warning('请填写配置键和配置值')
    return
  }
  try {
    const res = await agxApi.updateConfig(form.key, {
      value: form.value,
      configGroup: form.configGroup,
      description: form.description
    })
    if (res.code === 0) {
      Message.success('保存成功')
      formVisible.value = false
      fetchData()
    }
  } catch (e) {
    Message.error('保存失败')
  }
}

const handleUpdate = async (record) => {
  try {
    await agxApi.updateConfig(record.key, { value: record.value })
    Message.success('已更新')
  } catch (e) {
    Message.error('更新失败')
  }
}

const saveConfig = async (key, value) => {
  try {
    await agxApi.updateConfig(key, { value: String(value) })
    Message.success('已保存')
  } catch (e) {
    // 静默失败
  }
}

onMounted(() => fetchData())
</script>
