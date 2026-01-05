<template>
  <div class="ma-content-block p-4">
    <!-- 操作栏 -->
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.symbol" placeholder="交易对" allow-clear style="width: 150px" />
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 120px">
            <a-option :value="1">启用</a-option>
            <a-option :value="0">禁用</a-option>
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
            新增配置
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 表格 -->
    <a-table
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @page-change="onPageChange"
      row-key="id"
    >
      <template #columns>
        <a-table-column title="ID" data-index="id" :width="60" />
        <a-table-column title="交易对" data-index="symbol" :width="120" />
        <a-table-column title="名称" data-index="name" :width="150" />
        <a-table-column title="时长(秒)" data-index="duration" :width="100" />
        <a-table-column title="收益率" data-index="profitRate" :width="100">
          <template #cell="{ record }">{{ record.profitRate }}%</template>
        </a-table-column>
        <a-table-column title="最小金额" data-index="minAmount" :width="120" />
        <a-table-column title="最大金额" data-index="maxAmount" :width="120" />
        <a-table-column title="购买币种" data-index="payCurrencies" :width="120">
          <template #cell="{ record }">
            <a-space>
              <a-tag v-if="record.payCurrencies && record.payCurrencies.includes('USDT')" color="green">USDT</a-tag>
              <a-tag v-if="record.payCurrencies && record.payCurrencies.includes('CNY')" color="orange">CNY</a-tag>
            </a-space>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 1" color="green">启用</a-tag>
            <a-tag v-else color="red">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="创建时间" data-index="createdAt" :width="170" />
        <a-table-column title="操作" :width="150" fixed="right">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm content="确定删除该配置？" @ok="handleDelete(record)">
                <a-button type="text" status="danger" size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="isEdit ? '编辑配置' : '新增配置'"
      width="500px"
      @ok="handleSubmit"
      @cancel="modalVisible = false"
    >
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="交易对" required>
              <a-select v-model="form.symbol" :disabled="isEdit">
                <a-option value="BTCUSDT">BTC/USDT</a-option>
                <a-option value="ETHUSDT">ETH/USDT</a-option>
                <a-option value="BNBUSDT">BNB/USDT</a-option>
                <a-option value="SOLUSDT">SOL/USDT</a-option>
                <a-option value="XRPUSDT">XRP/USDT</a-option>
                <a-option value="DOGEUSDT">DOGE/USDT</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="名称" required>
              <a-input v-model="form.name" placeholder="如：BTC 30秒合约" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="时长(秒)" required>
              <a-select v-model="form.duration">
                <a-option :value="30">30秒</a-option>
                <a-option :value="60">60秒</a-option>
                <a-option :value="120">120秒</a-option>
                <a-option :value="180">180秒</a-option>
                <a-option :value="300">300秒</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收益率(%)" required>
              <a-input v-model="form.profitRate" placeholder="如：85" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="最小金额" required>
              <a-input v-model="form.minAmount" placeholder="如：10" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最大金额" required>
              <a-input v-model="form.maxAmount" placeholder="如：10000" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="购买币种" required>
              <a-checkbox-group v-model="form.payCurrencies">
                <a-checkbox value="USDT">USDT</a-checkbox>
                <a-checkbox value="CNY">人民币</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
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
const tableData = ref([])
const modalVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const searchForm = reactive({
  symbol: '',
  status: undefined
})

const form = reactive({
  symbol: 'BTCUSDT',
  name: '',
  duration: 30,
  profitRate: '',
  minAmount: '',
  maxAmount: '',
  payCurrencies: ['USDT'],
  status: 1
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getContractList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      symbol: searchForm.symbol || undefined,
      status: searchForm.status
    })
    if (res.code === 0) {
      tableData.value = res.data?.list || res.list || []
      pagination.total = res.data?.total || res.total || 0
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.symbol = ''
  searchForm.status = undefined
  pagination.current = 1
  fetchData()
}

const onPageChange = (page) => {
  pagination.current = page
  fetchData()
}

const resetForm = () => {
  Object.assign(form, {
    symbol: 'BTCUSDT',
    name: '',
    duration: 30,
    profitRate: '',
    minAmount: '',
    maxAmount: '',
    payCurrencies: ['USDT'],
    status: 1
  })
}

const handleAdd = () => {
  resetForm()
  isEdit.value = false
  editId.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  Object.assign(form, {
    symbol: record.symbol,
    name: record.name,
    duration: record.duration,
    profitRate: record.profitRate,
    minAmount: record.minAmount,
    maxAmount: record.maxAmount,
    payCurrencies: record.payCurrencies ? record.payCurrencies.split(',') : ['USDT'],
    status: record.status
  })
  isEdit.value = true
  editId.value = record.id
  modalVisible.value = true
}

const handleSubmit = async () => {
  if (!form.name || !form.profitRate || !form.minAmount || !form.maxAmount) {
    Message.warning('请填写完整信息')
    return
  }
  if (!form.payCurrencies || form.payCurrencies.length === 0) {
    Message.warning('请选择购买币种')
    return
  }
  try {
    const submitData = { ...form, payCurrencies: form.payCurrencies.join(',') }
    let res
    if (isEdit.value) {
      res = await agxApi.updateContract(editId.value, submitData)
    } else {
      res = await agxApi.createContract(submitData)
    }
    if (res.code === 0) {
      Message.success(isEdit.value ? '更新成功' : '创建成功')
      modalVisible.value = false
      fetchData()
    }
  } catch (e) {
    console.error(e)
  }
}

const handleDelete = async (record) => {
  try {
    const res = await agxApi.deleteContract(record.id)
    if (res.code === 0) {
      Message.success('删除成功')
      fetchData()
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchData()
})
</script>
