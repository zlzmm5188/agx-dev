<template>
  <div class="p-4">
    <a-card title="话题管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showCreateModal">
          <template #icon><icon-plus /></template>
          新增话题
        </a-button>
      </template>

      <a-table :data="tableData" :loading="loading" :pagination="false">
        <template #columns>
          <a-table-column title="话题" :width="200">
            <template #cell="{ record }">
              <div class="flex items-center gap-2">
                <span class="text-lg">#</span>
                <span class="font-medium">{{ record.name }}</span>
                <a-tag v-if="record.isHot" color="red" size="small">热门</a-tag>
                <a-tag v-if="record.isOfficial" color="blue" size="small">官方</a-tag>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="描述" data-index="description" :width="250" ellipsis />
          <a-table-column title="帖子数" data-index="postCount" :width="100" />
          <a-table-column title="浏览量" data-index="viewCount" :width="100" />
          <a-table-column title="排序" data-index="sortOrder" :width="80" />
          <a-table-column title="状态" :width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" size="small" @change="updateStatus(record)" />
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="150">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="editTopic(record)">编辑</a-button>
                <a-button type="text" size="small" :status="record.isHot ? 'warning' : 'normal'" @click="toggleHot(record)">
                  {{ record.isHot ? '取消热门' : '设为热门' }}
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑话题' : '新增话题'" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="话题名称" required>
          <a-input v-model="formData.name" placeholder="请输入话题名称" :max-length="50" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model="formData.description" placeholder="请输入话题描述" :max-length="200" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="排序">
              <a-input-number v-model="formData.sortOrder" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="热门">
              <a-switch v-model="formData.isHot" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="官方">
              <a-switch v-model="formData.isOfficial" />
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

const loading = ref(false)
const tableData = ref([])
const modalVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: null,
  name: '',
  description: '',
  sortOrder: 0,
  isHot: false,
  isOfficial: false
})

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: 1, name: '黄金行情', description: '黄金市场行情分析与讨论', postCount: 1256, viewCount: 85600, sortOrder: 100, isHot: true, isOfficial: true, status: 1 },
      { id: 2, name: 'AGX讨论', description: 'AGX代币相关话题', postCount: 2580, viewCount: 156000, sortOrder: 99, isHot: true, isOfficial: true, status: 1 },
      { id: 3, name: '技术分析', description: 'K线与技术指标分析', postCount: 856, viewCount: 42500, sortOrder: 80, isHot: true, isOfficial: false, status: 1 },
      { id: 4, name: '市场快讯', description: '最新市场资讯', postCount: 3250, viewCount: 256000, sortOrder: 90, isHot: true, isOfficial: true, status: 1 },
      { id: 5, name: '新手入门', description: '新手学习与交流', postCount: 625, viewCount: 28000, sortOrder: 70, isHot: false, isOfficial: true, status: 1 },
      { id: 6, name: '理财心得', description: '投资理财经验分享', postCount: 425, viewCount: 18500, sortOrder: 60, isHot: false, isOfficial: false, status: 1 },
    ]
    loading.value = false
  }, 300)
}

const showCreateModal = () => {
  isEdit.value = false
  Object.assign(formData, { id: null, name: '', description: '', sortOrder: 0, isHot: false, isOfficial: false })
  modalVisible.value = true
}

const editTopic = (record) => {
  isEdit.value = true
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleSubmit = () => {
  if (!formData.name) {
    Message.warning('请输入话题名称')
    return
  }
  Message.success(isEdit.value ? '修改成功' : '新增成功')
  modalVisible.value = false
  fetchData()
}

const toggleHot = (record) => {
  record.isHot = !record.isHot
  Message.success(record.isHot ? '已设为热门' : '已取消热门')
}

const updateStatus = (record) => {
  Message.success(record.status ? '已启用' : '已禁用')
}

onMounted(() => {
  fetchData()
})
</script>
