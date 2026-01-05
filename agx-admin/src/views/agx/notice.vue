<template>
  <div class="ma-content-block p-4">
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-select v-model="searchForm.type" placeholder="类型" allow-clear style="width: 120px">
            <a-option value="notice">通知</a-option>
            <a-option value="announcement">公告</a-option>
            <a-option value="popup">弹窗</a-option>
          </a-select>
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 100px">
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
            新增公告
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="onPageChange" row-key="id">
      <template #columns>
        <a-table-column title="ID" data-index="id" :width="60" />
        <a-table-column title="标题" data-index="title" :width="200" />
        <a-table-column title="类型" data-index="type" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.type === 'notice'" color="blue">通知</a-tag>
            <a-tag v-else-if="record.type === 'announcement'" color="orange">公告</a-tag>
            <a-tag v-else color="purple">弹窗</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" :width="80">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 1" color="green">启用</a-tag>
            <a-tag v-else color="gray">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="排序" data-index="sortOrder" :width="60" />
        <a-table-column title="开始时间" data-index="startAt" :width="160" />
        <a-table-column title="结束时间" data-index="endAt" :width="160" />
        <a-table-column title="创建时间" data-index="createdAt" :width="160" />
        <a-table-column title="操作" :width="150" fixed="right">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm content="确定删除该公告？" @ok="handleDelete(record)">
                <a-button type="text" status="danger" size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <a-modal v-model:visible="formVisible" :title="isEdit ? '编辑公告' : '新增公告'" @ok="handleSubmit" width="700px">
      <a-form :model="form" layout="vertical">
        <a-form-item label="标题" required>
          <a-input v-model="form.title" placeholder="公告标题" />
        </a-form-item>
        <a-form-item label="类型">
          <a-radio-group v-model="form.type">
            <a-radio value="notice">通知</a-radio>
            <a-radio value="announcement">公告</a-radio>
            <a-radio value="popup">弹窗</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="内容" required>
          <a-textarea v-model="form.content" placeholder="公告内容" :auto-size="{ minRows: 5, maxRows: 10 }" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="开始时间">
              <a-date-picker v-model="form.startAt" show-time style="width: 100%" placeholder="不填则立即生效" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间">
              <a-date-picker v-model="form.endAt" show-time style="width: 100%" placeholder="不填则永久有效" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="排序">
              <a-input-number v-model="form.sortOrder" :min="0" style="width: 100%" />
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
const formVisible = ref(false)
const isEdit = ref(false)
const tableData = ref([])

const searchForm = reactive({ type: undefined, status: undefined })
const pagination = reactive({ current: 1, pageSize: 20, total: 0, showTotal: true })

const form = reactive({
  id: null,
  title: '',
  content: '',
  type: 'notice',
  status: 1,
  sortOrder: 0,
  startAt: '',
  endAt: ''
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getNoticeList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    if (res.code === 0) {
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.current = 1; fetchData() }
const handleReset = () => { 
  searchForm.type = undefined
  searchForm.status = undefined
  pagination.current = 1
  fetchData()
}
const onPageChange = (page) => { pagination.current = page; fetchData() }

const resetForm = () => {
  form.id = null
  form.title = ''
  form.content = ''
  form.type = 'notice'
  form.status = 1
  form.sortOrder = 0
  form.startAt = ''
  form.endAt = ''
}

const handleAdd = () => {
  resetForm()
  isEdit.value = false
  formVisible.value = true
}

const handleEdit = (record) => {
  form.id = record.id
  form.title = record.title
  form.content = record.content
  form.type = record.type
  form.status = record.status
  form.sortOrder = record.sortOrder
  form.startAt = record.startAt || ''
  form.endAt = record.endAt || ''
  isEdit.value = true
  formVisible.value = true
}

const handleSubmit = async () => {
  if (!form.title || !form.content) {
    Message.warning('请填写标题和内容')
    return
  }
  try {
    const data = {
      title: form.title,
      content: form.content,
      type: form.type,
      status: form.status,
      sortOrder: form.sortOrder,
      startAt: form.startAt || null,
      endAt: form.endAt || null
    }
    let res
    if (isEdit.value) {
      res = await agxApi.updateNotice(form.id, data)
    } else {
      res = await agxApi.createNotice(data)
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
    const res = await agxApi.deleteNotice(record.id)
    if (res.code === 0) {
      Message.success('删除成功')
      fetchData()
    }
  } catch (e) {
    Message.error('删除失败')
  }
}

onMounted(() => { fetchData() })
</script>
