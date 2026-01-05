<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-select v-model="searchForm.coinId" placeholder="选择币种" allow-clear style="width: 150px">
            <a-option v-for="coin in coinList" :key="coin.id" :value="coin.id">{{ coin.symbol }}</a-option>
          </a-select>
          <a-button type="primary" @click="handleSearch">
            <template #icon><icon-search /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon><icon-refresh /></template>
            重置
          </a-button>
          <a-button type="primary" status="success" @click="handleAdd">
            <template #icon><icon-plus /></template>
            添加链配置
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <a-table :data="tableData" :loading="loading" :pagination="false" row-key="id">
      <template #columns>
        <a-table-column title="ID" data-index="id" :width="60" />
        <a-table-column title="币种" data-index="coinSymbol" :width="80" />
        <a-table-column title="链名称" data-index="chain" :width="120" />
        <a-table-column title="链标识" data-index="chainSymbol" :width="100" />
        <a-table-column title="提现手续费" data-index="withdrawFee" :width="120" />
        <a-table-column title="最小提现" data-index="minWithdraw" :width="120" />
        <a-table-column title="确认数" data-index="confirmations" :width="80" />
        <a-table-column title="状态" data-index="status" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 1" color="green">启用</a-tag>
            <a-tag v-else color="gray">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="操作" :width="150" fixed="right">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm content="确定删除？" @ok="handleDelete(record)">
                <a-button type="text" status="danger" size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal v-model:visible="formVisible" :title="isEdit ? '编辑链配置' : '添加链配置'" @ok="handleSubmit" width="600px">
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="币种" required>
              <a-select v-model="form.coinId" placeholder="选择币种" :disabled="isEdit">
                <a-option v-for="coin in coinList" :key="coin.id" :value="coin.id">{{ coin.symbol }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="链名称" required>
              <a-input v-model="form.chain" placeholder="如: Tron" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="链标识" required>
              <a-input v-model="form.chainSymbol" placeholder="如: TRC20" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合约地址">
              <a-input v-model="form.contractAddress" placeholder="代币合约地址" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="提现手续费">
              <a-input-number v-model="form.withdrawFee" :min="0" :precision="8" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="最小提现">
              <a-input-number v-model="form.minWithdraw" :min="0" :precision="8" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="最大提现">
              <a-input-number v-model="form.maxWithdraw" :min="0" :precision="8" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="确认数">
              <a-input-number v-model="form.confirmations" :min="1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="排序">
              <a-input-number v-model="form.sortOrder" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="状态">
              <a-switch v-model="form.status" :checked-value="1" :unchecked-value="0" />
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
import agxApi from '@/api/agx'

const loading = ref(false)
const formVisible = ref(false)
const isEdit = ref(false)
const tableData = ref([])
const coinList = ref([])

const searchForm = reactive({ coinId: undefined })
const form = reactive({
  id: null, coinId: null, chain: '', chainSymbol: '', contractAddress: '',
  withdrawFee: 0, minWithdraw: 0, maxWithdraw: 0, confirmations: 6, sortOrder: 0, status: 1
})

const fetchCoins = async () => {
  const res = await agxApi.getCurrencyList({ pageSize: 100 })
  if (res.code === 0) coinList.value = res.data.list || []
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getCoinChainList(searchForm.coinId)
    if (res.code === 0) tableData.value = res.data.list || []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => fetchData()
const handleReset = () => { searchForm.coinId = undefined; fetchData() }

const resetForm = () => {
  form.id = null; form.coinId = null; form.chain = ''; form.chainSymbol = ''; form.contractAddress = ''
  form.withdrawFee = 0; form.minWithdraw = 0; form.maxWithdraw = 0; form.confirmations = 6; form.sortOrder = 0; form.status = 1
}

const handleAdd = () => { resetForm(); isEdit.value = false; formVisible.value = true }

const handleEdit = (record) => {
  Object.assign(form, record)
  isEdit.value = true
  formVisible.value = true
}

const handleSubmit = async () => {
  if (!form.coinId || !form.chain || !form.chainSymbol) {
    Message.warning('请填写必填项')
    return
  }
  try {
    const data = { ...form }
    let res
    if (isEdit.value) {
      res = await agxApi.updateCoinChain(form.id, data)
    } else {
      res = await agxApi.createCoinChain(data)
    }
    if (res.code === 0) {
      Message.success(isEdit.value ? '更新成功' : '创建成功')
      formVisible.value = false
      fetchData()
    }
  } catch (e) {
    Message.error('操作失败')
  }
}

const handleDelete = async (record) => {
  try {
    const res = await agxApi.deleteCoinChain(record.id)
    if (res.code === 0) { Message.success('删除成功'); fetchData() }
  } catch (e) { Message.error('删除失败') }
}

onMounted(() => { fetchCoins(); fetchData() })
</script>
