<template>
  <div class="ma-content-block p-4">
    <!-- 操作栏 -->
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-select v-model="searchForm.type" placeholder="类型" allow-clear style="width: 120px">
            <a-option value="flexible">活期</a-option>
            <a-option value="fixed">定期</a-option>
          </a-select>
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
            新增产品
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
        <a-table-column title="产品名称" data-index="name" :width="150" />
        <a-table-column title="币种ID" data-index="coinId" :width="80" />
        <a-table-column title="类型" data-index="type" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.type === 'flexible'" color="blue">活期</a-tag>
            <a-tag v-else color="purple">定期</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="锁定天数" data-index="lockDays" :width="90" />
        <a-table-column title="日收益率" data-index="dailyRate" :width="100">
          <template #cell="{ record }">{{ record.dailyRate }}%</template>
        </a-table-column>
        <a-table-column title="最小金额" data-index="minAmount" :width="120" />
        <a-table-column title="总额度" data-index="totalQuota" :width="120" />
        <a-table-column title="已售" data-index="soldAmount" :width="120" />
        <a-table-column title="购买币种" data-index="payCurrencies" :width="120">
          <template #cell="{ record }">
            <a-space>
              <a-tag v-if="record.payCurrencies && record.payCurrencies.includes('USDT')" color="green">USDT</a-tag>
              <a-tag v-if="record.payCurrencies && record.payCurrencies.includes('CNY')" color="orange">CNY</a-tag>
            </a-space>
          </template>
        </a-table-column>
        <a-table-column title="热门" data-index="isHot" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.isHot" color="red">HOT</a-tag>
            <span v-else>-</span>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 1" color="green">启用</a-tag>
            <a-tag v-else color="red">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="操作" :width="150" fixed="right">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm content="确定删除该产品？" @ok="handleDelete(record)">
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
      :title="isEdit ? '编辑产品' : '新增产品'"
      width="600px"
      @ok="handleSubmit"
      @cancel="modalVisible = false"
    >
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="产品名称" required>
              <a-input v-model="form.name" placeholder="如：USDT活期宝" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="币种ID" required>
              <a-input-number v-model="form.coinId" :min="1" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="类型" required>
              <a-select v-model="form.type">
                <a-option value="flexible">活期</a-option>
                <a-option value="fixed">定期</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="锁定天数">
              <a-input-number v-model="form.lockDays" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="日收益率(%)" required>
              <a-input v-model="form.dailyRate" placeholder="如：0.5" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最小金额" required>
              <a-input v-model="form.minAmount" placeholder="如：100" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="最大金额">
              <a-input v-model="form.maxAmount" placeholder="不限制留空" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="总额度">
              <a-input v-model="form.totalQuota" placeholder="不限制留空" />
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
          <a-col :span="4">
            <a-form-item label="热门">
              <a-switch v-model="form.isHot" :checked-value="1" :unchecked-value="0" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item label="排序">
              <a-input-number v-model="form.sortOrder" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
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
  type: undefined,
  status: undefined
})

const form = reactive({
  name: '',
  coinId: 1,
  type: 'flexible',
  lockDays: 0,
  dailyRate: '',
  minAmount: '',
  maxAmount: '',
  totalQuota: '',
  payCurrencies: ['USDT'],
  isHot: 0,
  sortOrder: 0,
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
    const res = await agxApi.getPoolList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      type: searchForm.type || undefined,
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
  searchForm.type = undefined
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
    name: '',
    coinId: 1,
    type: 'flexible',
    lockDays: 0,
    dailyRate: '',
    minAmount: '',
    maxAmount: '',
    totalQuota: '',
    payCurrencies: ['USDT'],
    isHot: 0,
    sortOrder: 0,
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
    name: record.name,
    coinId: record.coinId,
    type: record.type,
    lockDays: record.lockDays,
    dailyRate: record.dailyRate,
    minAmount: record.minAmount,
    maxAmount: record.maxAmount || '',
    totalQuota: record.totalQuota || '',
    payCurrencies: record.payCurrencies ? record.payCurrencies.split(',') : ['USDT'],
    isHot: record.isHot,
    sortOrder: record.sortOrder,
    status: record.status
  })
  isEdit.value = true
  editId.value = record.id
  modalVisible.value = true
}

const handleSubmit = async () => {
  if (!form.name || !form.dailyRate || !form.minAmount) {
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
      res = await agxApi.updatePool(editId.value, submitData)
    } else {
      res = await agxApi.createPool(submitData)
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
    const res = await agxApi.deletePool(record.id)
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
