<template>
  <div class="p-4">
    <a-card title="官方内容发布" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showCreateModal">
          <template #icon><icon-plus /></template>
          发布内容
        </a-button>
      </template>

      <!-- 搜索筛选 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-input-search v-model="searchForm.keyword" placeholder="搜索标题/内容" @search="handleSearch" />
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 100%">
            <a-option :value="1">已发布</a-option>
            <a-option :value="0">草稿</a-option>
            <a-option :value="2">已下架</a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.topicId" placeholder="话题" allow-clear style="width: 100%">
            <a-option v-for="t in topicList" :key="t.id" :value="t.id">{{ t.name }}</a-option>
          </a-select>
        </a-col>
      </a-row>

      <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="handlePageChange">
        <template #columns>
          <a-table-column title="内容" :width="300">
            <template #cell="{ record }">
              <div class="flex items-start gap-2">
                <a-image v-if="record.images && record.images.length" :src="record.images[0]" width="60" height="60" fit="cover" />
                <div>
                  <div class="font-medium line-clamp-2">{{ record.content }}</div>
                  <div class="text-gray-400 text-xs mt-1">
                    <a-tag v-if="record.isTop" color="red" size="small">置顶</a-tag>
                    <a-tag v-if="record.isFeatured" color="orange" size="small">精华</a-tag>
                    <a-tag v-if="record.topic" size="small">#{{ record.topic }}</a-tag>
                  </div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="权重" data-index="weight" :width="80" />
          <a-table-column title="数据" :width="140">
            <template #cell="{ record }">
              <div class="text-xs text-gray-400">
                <div>浏览 {{ record.viewCount }}</div>
                <div>点赞 {{ record.likeCount }} · 评论 {{ record.commentCount }}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="状态" :width="80">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="发布时间" data-index="createdAt" :width="160" />
          <a-table-column title="操作" :width="180" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="editPost(record)">编辑</a-button>
                <a-button type="text" size="small" :status="record.isTop ? 'warning' : 'normal'" @click="toggleTop(record)">
                  {{ record.isTop ? '取消置顶' : '置顶' }}
                </a-button>
                <a-dropdown>
                  <a-button type="text" size="small">更多</a-button>
                  <template #content>
                    <a-doption @click="toggleFeatured(record)">{{ record.isFeatured ? '取消精华' : '设为精华' }}</a-doption>
                    <a-doption @click="setWeight(record)">设置权重</a-doption>
                    <a-doption v-if="record.status === 1" @click="offlinePost(record)">下架</a-doption>
                    <a-doption v-if="record.status !== 1" @click="publishPost(record)">发布</a-doption>
                    <a-doption status="danger" @click="deletePost(record)">删除</a-doption>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 发布/编辑弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑内容' : '发布内容'" width="700px" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="内容" required>
          <a-textarea v-model="formData.content" :max-length="1000" show-word-limit :auto-size="{ minRows: 4, maxRows: 8 }" placeholder="请输入内容" />
        </a-form-item>
        <a-form-item label="图片">
          <a-upload list-type="picture-card" :limit="9" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="话题">
              <a-select v-model="formData.topicId" placeholder="选择话题" allow-clear>
                <a-option v-for="t in topicList" :key="t.id" :value="t.id">{{ t.name }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="权重">
              <a-input-number v-model="formData.weight" :min="0" :max="9999" style="width: 100%" />
              <template #help>权重越高，排序越靠前</template>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="置顶">
              <a-switch v-model="formData.isTop" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="精华">
              <a-switch v-model="formData.isFeatured" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="立即发布">
              <a-switch v-model="formData.publishNow" />
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

const searchForm = reactive({
  keyword: '',
  status: null,
  topicId: null
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const formData = reactive({
  id: null,
  content: '',
  images: [],
  topicId: null,
  weight: 0,
  isTop: false,
  isFeatured: false,
  publishNow: true
})

const topicList = ref([
  { id: 1, name: '黄金行情' },
  { id: 2, name: 'AGX讨论' },
  { id: 3, name: '市场快讯' },
  { id: 4, name: '技术分析' }
])

const getStatusColor = (status) => {
  const colors = { 0: 'gray', 1: 'green', 2: 'red' }
  return colors[status] || 'gray'
}

const getStatusText = (status) => {
  const texts = { 0: '草稿', 1: '已发布', 2: '已下架' }
  return texts[status] || '未知'
}

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: 1, content: '【重要公告】AGX代币与黄金挂钩机制正式上线，持有AGX即持有黄金权益！', images: [], topic: 'AGX讨论', weight: 100, isTop: true, isFeatured: true, viewCount: 15680, likeCount: 856, commentCount: 128, status: 1, createdAt: '2025-01-25 10:00' },
      { id: 2, content: '今日黄金价格分析：国际金价突破2650美元关口，短期看涨趋势明显...', images: [], topic: '黄金行情', weight: 50, isTop: false, isFeatured: true, viewCount: 8520, likeCount: 425, commentCount: 67, status: 1, createdAt: '2025-01-25 08:30' },
      { id: 3, content: '新手入门指南：如何在AGX平台购买黄金？', images: [], topic: null, weight: 0, isTop: false, isFeatured: false, viewCount: 3250, likeCount: 156, commentCount: 23, status: 1, createdAt: '2025-01-24 15:00' },
    ]
    pagination.total = 56
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handlePageChange = (page) => {
  pagination.current = page
  fetchData()
}

const showCreateModal = () => {
  isEdit.value = false
  Object.assign(formData, { id: null, content: '', images: [], topicId: null, weight: 0, isTop: false, isFeatured: false, publishNow: true })
  modalVisible.value = true
}

const editPost = (record) => {
  isEdit.value = true
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleSubmit = () => {
  if (!formData.content) {
    Message.warning('请输入内容')
    return
  }
  Message.success(isEdit.value ? '修改成功' : '发布成功')
  modalVisible.value = false
  fetchData()
}

const toggleTop = (record) => {
  Message.success(record.isTop ? '已取消置顶' : '已置顶')
  record.isTop = !record.isTop
}

const toggleFeatured = (record) => {
  Message.success(record.isFeatured ? '已取消精华' : '已设为精华')
  record.isFeatured = !record.isFeatured
}

const setWeight = (record) => {
  Message.info('设置权重功能开发中')
}

const offlinePost = (record) => {
  Modal.confirm({
    title: '确认下架',
    content: '确定要下架这条内容吗？',
    onOk: () => {
      record.status = 2
      Message.success('已下架')
    }
  })
}

const publishPost = (record) => {
  record.status = 1
  Message.success('已发布')
}

const deletePost = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: '删除后无法恢复，确定要删除吗？',
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
