<template>
  <div class="ma-content-block p-4">
    <!-- 操作栏 -->
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.keyword" placeholder="名称/符号" allow-clear style="width: 200px" />
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
            新增币种
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
        <a-table-column title="ID" data-index="id" :width="80" />
        <a-table-column title="图标" :width="80">
          <template #cell="{ record }">
            <a-avatar v-if="record.icon" :image-url="record.icon" :size="32" />
            <a-avatar v-else :size="32">{{ record.symbol?.charAt(0) }}</a-avatar>
          </template>
        </a-table-column>
        <a-table-column title="名称" data-index="name" :width="150" />
        <a-table-column title="符号" data-index="symbol" :width="100" />
        <a-table-column title="排序" data-index="sort" :width="80" />
        <a-table-column title="状态" data-index="status" :width="100">
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
              <a-popconfirm content="确定删除该币种？" @ok="handleDelete(record)">
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
      :title="isEdit ? '编辑币种' : '新增币种'"
      @ok="handleSubmit"
      @cancel="modalVisible = false"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item label="名称" required>
          <a-input v-model="form.name" placeholder="请输入币种名称" />
        </a-form-item>
        <a-form-item label="符号" required>
          <a-input v-model="form.symbol" placeholder="请输入币种符号，如 BTC" :disabled="isEdit" />
        </a-form-item>
        <a-form-item label="图标URL">
          <a-input v-model="form.icon" placeholder="请输入图标URL" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model="form.sort" :min="0" />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-model="form.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
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
const tableData = ref([])
const modalVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const searchForm = reactive({
  keyword: ''
})

const form = reactive({
  name: '',
  symbol: '',
  icon: '',
  sort: 0,
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
    const res = await agxApi.getCurrencyList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined
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
  searchForm.keyword = ''
  pagination.current = 1
  fetchData()
}

const onPageChange = (page) => {
  pagination.current = page
  fetchData()
}

const resetForm = () => {
  form.name = ''
  form.symbol = ''
  form.icon = ''
  form.sort = 0
  form.status = 1
}

const handleAdd = () => {
  resetForm()
  isEdit.value = false
  editId.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  form.name = record.name
  form.symbol = record.symbol
  form.icon = record.icon || ''
  form.sort = record.sort || 0
  form.status = record.status
  isEdit.value = true
  editId.value = record.id
  modalVisible.value = true
}

const handleSubmit = async () => {
  if (!form.name || !form.symbol) {
    Message.warning('请填写完整信息')
    return
  }
  try {
    let res
    if (isEdit.value) {
      res = await agxApi.updateCurrency(editId.value, form)
    } else {
      res = await agxApi.createCurrency(form)
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
    const res = await agxApi.deleteCurrency(record.id)
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
