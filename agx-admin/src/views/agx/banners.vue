<template>
  <div class="p-4">
    <a-card title="Banner管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showCreateModal">
          <template #icon><icon-plus /></template>
          新增Banner
        </a-button>
      </template>

      <!-- 分类tab -->
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="home" title="首页Banner" />
        <a-tab-pane key="activity" title="活动Banner" />
        <a-tab-pane key="popup" title="弹窗广告" />
      </a-tabs>

      <a-table :data="tableData" :loading="loading" :pagination="false" class="mt-4">
        <template #columns>
          <a-table-column title="预览" :width="150">
            <template #cell="{ record }">
              <a-image :src="record.imageUrl" width="120" height="60" fit="cover" />
            </template>
          </a-table-column>
          <a-table-column title="标题" data-index="title" :width="180" />
          <a-table-column title="跳转链接" data-index="linkUrl" :width="200" ellipsis />
          <a-table-column title="展示时间" :width="200">
            <template #cell="{ record }">
              <div class="text-xs">
                <div>{{ record.startAt || '不限' }}</div>
                <div>至 {{ record.endAt || '不限' }}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="排序" data-index="sortOrder" :width="80" />
          <a-table-column title="状态" :width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" size="small" />
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="120">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="editBanner(record)">编辑</a-button>
                <a-button type="text" size="small" status="danger" @click="deleteBanner(record)">删除</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑Banner' : '新增Banner'" width="600px" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="Banner图片" required>
          <a-upload list-type="picture-card" :limit="1" />
          <template #help>建议尺寸: 750x320像素</template>
        </a-form-item>
        <a-form-item label="标题">
          <a-input v-model="formData.title" placeholder="Banner标题(可选)" />
        </a-form-item>
        <a-form-item label="跳转链接">
          <a-input v-model="formData.linkUrl" placeholder="点击跳转的链接地址" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="开始时间">
              <a-date-picker v-model="formData.startAt" show-time style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间">
              <a-date-picker v-model="formData.endAt" show-time style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="排序">
              <a-input-number v-model="formData.sortOrder" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="位置">
              <a-select v-model="formData.position" style="width: 100%">
                <a-option value="home">首页Banner</a-option>
                <a-option value="activity">活动Banner</a-option>
                <a-option value="popup">弹窗广告</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'

const loading = ref(false)
const tableData = ref([])
const modalVisible = ref(false)
const isEdit = ref(false)
const activeTab = ref('home')

const formData = reactive({
  id: null,
  imageUrl: '',
  title: '',
  linkUrl: '',
  startAt: null,
  endAt: null,
  sortOrder: 0,
  position: 'home'
})

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: 1, imageUrl: 'https://via.placeholder.com/750x320/FFD700/000?text=Gold+Banner', title: '黄金投资专区', linkUrl: '/gold', startAt: null, endAt: null, sortOrder: 100, status: 1 },
      { id: 2, imageUrl: 'https://via.placeholder.com/750x320/4169E1/FFF?text=AGX+Token', title: 'AGX代币限时优惠', linkUrl: '/ieo', startAt: '2025-01-15', endAt: '2025-02-15', sortOrder: 99, status: 1 },
      { id: 3, imageUrl: 'https://via.placeholder.com/750x320/32CD32/FFF?text=New+User', title: '新用户福利', linkUrl: '/activity/new', startAt: null, endAt: null, sortOrder: 80, status: 1 },
    ]
    loading.value = false
  }, 300)
}

const handleTabChange = () => {
  fetchData()
}

const showCreateModal = () => {
  isEdit.value = false
  Object.assign(formData, { id: null, imageUrl: '', title: '', linkUrl: '', startAt: null, endAt: null, sortOrder: 0, position: activeTab.value })
  modalVisible.value = true
}

const editBanner = (record) => {
  isEdit.value = true
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleSubmit = () => {
  Message.success(isEdit.value ? '修改成功' : '新增成功')
  modalVisible.value = false
  fetchData()
}

const deleteBanner = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个Banner吗？',
    onOk: () => {
      Message.success('已删除')
      fetchData()
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>
