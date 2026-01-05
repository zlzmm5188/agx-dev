<template>
  <div class="p-4">
    <a-card title="用户内容管理" :bordered="false">
      <template #extra>
        <a-space>
          <a-radio-group v-model="searchForm.tab" type="button">
            <a-radio value="all">全部</a-radio>
            <a-radio value="pending">待审核</a-radio>
            <a-radio value="reported">被举报</a-radio>
          </a-radio-group>
        </a-space>
      </template>

      <!-- 搜索 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="5">
          <a-input-search v-model="searchForm.keyword" placeholder="搜索内容/用户" @search="handleSearch" />
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 100%">
            <a-option :value="1">正常</a-option>
            <a-option :value="0">待审核</a-option>
            <a-option :value="2">已删除</a-option>
            <a-option :value="3">已屏蔽</a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-range-picker v-model="searchForm.dateRange" style="width: 100%" />
        </a-col>
      </a-row>

      <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="handlePageChange" :row-selection="rowSelection">
        <template #columns>
          <a-table-column title="用户" :width="140">
            <template #cell="{ record }">
              <div class="flex items-center gap-2">
                <a-avatar :size="32">{{ record.username.charAt(0) }}</a-avatar>
                <div>
                  <div class="font-medium">{{ record.username }}</div>
                  <div class="text-gray-400 text-xs">{{ record.uid }}</div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="内容" :width="280">
            <template #cell="{ record }">
              <div>
                <div class="line-clamp-2">{{ record.content }}</div>
                <div class="text-gray-400 text-xs mt-1" v-if="record.images && record.images.length">
                  [{{ record.images.length }}张图片]
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="数据" :width="120">
            <template #cell="{ record }">
              <div class="text-xs">
                <span>点赞 {{ record.likeCount }}</span>
                <span class="mx-1">·</span>
                <span>评论 {{ record.commentCount }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="状态" :width="90">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
              <div v-if="record.reportCount > 0" class="text-red-500 text-xs mt-1">
                {{ record.reportCount }}次举报
              </div>
            </template>
          </a-table-column>
          <a-table-column title="发布时间" data-index="createdAt" :width="150" />
          <a-table-column title="操作" :width="200" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="viewDetail(record)">查看</a-button>
                <a-button v-if="record.status === 0" type="text" size="small" status="success" @click="approvePost(record)">通过</a-button>
                <a-button v-if="record.status === 1" type="text" size="small" status="warning" @click="featurePost(record)">推荐</a-button>
                <a-dropdown>
                  <a-button type="text" size="small">更多</a-button>
                  <template #content>
                    <a-doption @click="blockPost(record)">屏蔽</a-doption>
                    <a-doption @click="warnUser(record)">警告用户</a-doption>
                    <a-doption status="danger" @click="deletePost(record)">删除</a-doption>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>

      <!-- 批量操作 -->
      <div v-if="selectedKeys.length > 0" class="mt-4 p-3 bg-gray-100 rounded flex items-center gap-4">
        <span>已选择 {{ selectedKeys.length }} 项</span>
        <a-button size="small" @click="batchApprove">批量通过</a-button>
        <a-button size="small" status="warning" @click="batchBlock">批量屏蔽</a-button>
        <a-button size="small" status="danger" @click="batchDelete">批量删除</a-button>
      </div>
    </a-card>

    <!-- 详情弹窗 -->
    <a-modal v-model:visible="detailVisible" title="内容详情" width="600px" :footer="false">
      <div v-if="currentPost">
        <div class="flex items-center gap-3 mb-4">
          <a-avatar :size="48">{{ currentPost.username.charAt(0) }}</a-avatar>
          <div>
            <div class="font-medium">{{ currentPost.username }}</div>
            <div class="text-gray-400 text-sm">{{ currentPost.createdAt }}</div>
          </div>
        </div>
        <div class="mb-4">{{ currentPost.content }}</div>
        <div v-if="currentPost.images && currentPost.images.length" class="mb-4">
          <a-image-preview-group>
            <a-space>
              <a-image v-for="(img, i) in currentPost.images" :key="i" :src="img" width="100" height="100" fit="cover" />
            </a-space>
          </a-image-preview-group>
        </div>
        <a-divider />
        <div class="flex justify-between">
          <span>点赞: {{ currentPost.likeCount }} · 评论: {{ currentPost.commentCount }} · 分享: {{ currentPost.shareCount || 0 }}</span>
          <a-space>
            <a-button v-if="currentPost.status === 0" type="primary" size="small" @click="approvePost(currentPost); detailVisible = false">通过</a-button>
            <a-button size="small" status="warning" @click="blockPost(currentPost); detailVisible = false">屏蔽</a-button>
            <a-button size="small" status="danger" @click="deletePost(currentPost); detailVisible = false">删除</a-button>
          </a-space>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const currentPost = ref(null)
const selectedKeys = ref([])

const searchForm = reactive({
  tab: 'all',
  keyword: '',
  status: null,
  dateRange: []
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
  onChange: (keys) => { selectedKeys.value = keys }
})

const getStatusColor = (status) => {
  const colors = { 0: 'orange', 1: 'green', 2: 'gray', 3: 'red' }
  return colors[status] || 'gray'
}

const getStatusText = (status) => {
  const texts = { 0: '待审核', 1: '正常', 2: '已删除', 3: '已屏蔽' }
  return texts[status] || '未知'
}

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: 1, username: 'trader88', uid: 'U10088', content: '今天黄金涨势不错，准备加仓！大家怎么看？', images: [], likeCount: 56, commentCount: 12, reportCount: 0, status: 1, createdAt: '2025-01-25 14:30' },
      { id: 2, username: 'gold_fan', uid: 'U10099', content: '分享一个技术分析图表...', images: ['https://via.placeholder.com/200'], likeCount: 128, commentCount: 34, reportCount: 0, status: 1, createdAt: '2025-01-25 12:15' },
      { id: 3, username: 'newbie01', uid: 'U10156', content: '请问怎么购买黄金？有教程吗？', images: [], likeCount: 8, commentCount: 5, reportCount: 0, status: 0, createdAt: '2025-01-25 11:00' },
      { id: 4, username: 'spammer', uid: 'U10200', content: '加我微信xxxxx，带你赚钱...', images: [], likeCount: 0, commentCount: 0, reportCount: 15, status: 1, createdAt: '2025-01-25 10:30' },
    ]
    pagination.total = 256
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

const viewDetail = (record) => {
  currentPost.value = record
  detailVisible.value = true
}

const approvePost = (record) => {
  record.status = 1
  Message.success('已通过')
}

const featurePost = (record) => {
  Message.success('已推荐')
}

const blockPost = (record) => {
  Modal.confirm({
    title: '确认屏蔽',
    content: '屏蔽后内容将不再展示，确定吗？',
    onOk: () => {
      record.status = 3
      Message.success('已屏蔽')
    }
  })
}

const warnUser = (record) => {
  Message.info('警告用户功能开发中')
}

const deletePost = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: '删除后无法恢复，确定吗？',
    onOk: () => {
      record.status = 2
      Message.success('已删除')
    }
  })
}

const batchApprove = () => {
  Message.success(`已批量通过 ${selectedKeys.value.length} 条内容`)
  selectedKeys.value = []
}

const batchBlock = () => {
  Message.success(`已批量屏蔽 ${selectedKeys.value.length} 条内容`)
  selectedKeys.value = []
}

const batchDelete = () => {
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的 ${selectedKeys.value.length} 条内容吗？`,
    onOk: () => {
      Message.success('已批量删除')
      selectedKeys.value = []
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
.text-red-500 { color: #f5222d; }
</style>
