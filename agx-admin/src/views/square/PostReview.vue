<template>
  <div class="post-review-page">
    <a-card class="page-card">
      <template #title>
        <div class="card-header">
          <h3>帖子审核</h3>
          <a-button type="primary" @click="loadPendingPosts">刷新</a-button>
        </div>
      </template>

      <!-- 待审核帖子列表 -->
      <a-table 
        :columns="columns" 
        :data-source="pendingPosts" 
        :loading="loading" 
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'content'">
            <div class="post-content">
              <p>{{ record.content }}</p>
              <div v-if="record.images" class="post-images">
                <img 
                  v-for="(image, index) in JSON.parse(record.images)" 
                  :key="index" 
                  :src="image" 
                  alt="帖子图片" 
                  style="width: 50px; height: 50px; margin-right: 5px; border-radius: 4px;"
                />
              </div>
              <div v-if="record.videoUrl" class="post-video">
                <a href="#" @click.prevent="openVideo(record.videoUrl)">查看视频</a>
              </div>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="text" size="small" @click="approvePost(record)">通过</a-button>
              <a-button type="text" size="small" status="danger" @click="showRejectModal(record)">拒绝</a-button>
              <a-button type="text" size="small" @click="viewPostDetails(record)">详情</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 拒绝原因弹窗 -->
    <a-modal 
      v-model:visible="rejectModalVisible" 
      title="拒绝帖子" 
      @ok="confirmReject"
      :confirm-loading="rejectSubmitting"
    >
      <a-form :model="rejectForm">
        <a-form-item label="拒绝原因">
          <a-textarea 
            v-model="rejectForm.reason" 
            placeholder="请输入拒绝原因"
            :auto-size="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 帖子详情弹窗 -->
    <a-modal 
      v-model:visible="detailModalVisible" 
      title="帖子详情" 
      width="800px"
      :footer="null"
    >
      <div v-if="selectedPost" class="post-detail">
        <div class="post-header">
          <div class="user-info">
            <span class="username">{{ selectedPost.author?.nickname || '用户' }}</span>
            <span class="post-time">{{ formatDate(selectedPost.createdAt) }}</span>
          </div>
        </div>
        <div class="post-content">
          <p>{{ selectedPost.content }}</p>
          <div v-if="selectedPost.images" class="post-images">
            <img 
              v-for="(image, index) in JSON.parse(selectedPost.images)" 
              :key="index" 
              :src="image" 
              alt="帖子图片" 
              style="max-width: 200px; max-height: 200px; margin: 5px; border-radius: 8px;"
            />
          </div>
          <div v-if="selectedPost.videoUrl" class="post-video">
            <video :src="selectedPost.videoUrl" controls style="max-width: 100%; max-height: 300px;"></video>
          </div>
        </div>
        <div class="post-stats">
          <span>浏览: {{ selectedPost.viewCount }}</span>
          <span>点赞: {{ selectedPost.likeCount }}</span>
          <span>评论: {{ selectedPost.commentCount }}</span>
        </div>
      </div>
    </a-modal>

    <!-- 视频预览弹窗 -->
    <a-modal 
      v-model:visible="videoModalVisible" 
      title="视频预览" 
      width="600px"
      :footer="null"
    >
      <video :src="currentVideoUrl" controls style="width: 100%;"></video>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { api } from '@/utils/api';

// 状态变量
const loading = ref(false);
const rejectSubmitting = ref(false);
const pendingPosts = ref([]);
const rejectModalVisible = ref(false);
const detailModalVisible = ref(false);
const videoModalVisible = ref(false);
const currentVideoUrl = ref('');

// 选中的帖子
const selectedPost = ref(null);

// 拒绝表单
const rejectForm = reactive({
  postId: null,
  reason: ''
});

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true
});

// 表格列配置
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '作者',
    dataIndex: 'author',
    width: 120,
    customRender: ({ record }) => record.author?.nickname || '用户'
  },
  {
    title: '内容',
    dataIndex: 'content',
    width: 300
  },
  {
    title: '类型',
    dataIndex: 'mediaType',
    width: 100,
    customRender: ({ record }) => {
      const typeMap = {
        'text': '文本',
        'image': '图片',
        'video': '视频'
      };
      return typeMap[record.mediaType] || record.mediaType;
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    customRender: ({ record }) => new Date(record.createdAt).toLocaleString()
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 180,
    fixed: 'right'
  }
];

// 加载待审核帖子
const loadPendingPosts = async (params = {}) => {
  loading.value = true;
  try {
    const response = await api.square.getPendingPosts({
      page: params.page || pagination.value.current,
      pageSize: params.pageSize || pagination.value.pageSize
    });
    
    if (response.success) {
      pendingPosts.value = response.data.list || [];
      pagination.value.total = response.data.total || 0;
      pagination.value.current = response.data.page || 1;
      pagination.value.pageSize = response.data.pageSize || 20;
    } else {
      Message.error(response.message || '获取待审核帖子失败');
    }
  } catch (error) {
    console.error('获取待审核帖子失败:', error);
    Message.error('获取待审核帖子失败');
  } finally {
    loading.value = false;
  }
};

// 表格变化处理
const handleTableChange = (pagination) => {
  loadPendingPosts({
    page: pagination.current,
    pageSize: pagination.pageSize
  });
};

// 通过帖子
const approvePost = async (record) => {
  if (!confirm(`确定要通过帖子 "${record.content.substring(0, 20)}..." 吗？`)) {
    return;
  }

  try {
    const response = await api.square.reviewPost({
      postId: record.id,
      action: 'approve'
    });

    if (response.success) {
      Message.success('审核通过');
      loadPendingPosts();
    } else {
      Message.error(response.message || '审核失败');
    }
  } catch (error) {
    console.error('审核失败:', error);
    Message.error('审核失败');
  }
};

// 显示拒绝弹窗
const showRejectModal = (record) => {
  rejectForm.postId = record.id;
  rejectForm.reason = '';
  rejectModalVisible.value = true;
};

// 确认拒绝
const confirmReject = async () => {
  if (!rejectForm.reason.trim()) {
    Message.error('请输入拒绝原因');
    return;
  }

  try {
    const response = await api.square.reviewPost({
      postId: rejectForm.postId,
      action: 'reject',
      reason: rejectForm.reason
    });

    if (response.success) {
      Message.success('已拒绝');
      rejectModalVisible.value = false;
      loadPendingPosts();
    } else {
      Message.error(response.message || '拒绝失败');
    }
  } catch (error) {
    console.error('拒绝失败:', error);
    Message.error('拒绝失败');
  }
};

// 查看帖子详情
const viewPostDetails = (record) => {
  selectedPost.value = record;
  detailModalVisible.value = true;
};

// 打开视频预览
const openVideo = (videoUrl) => {
  currentVideoUrl.value = videoUrl;
  videoModalVisible.value = true;
};

// 状态文本
const getStatusText = (status) => {
  const statusMap = {
    '-1': '已下架',
    '0': '审核中',
    '1': '正常'
  };
  return statusMap[status] || '未知';
};

// 状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    '-1': 'red',
    '0': 'orange',
    '1': 'green'
  };
  return colorMap[status] || 'default';
};

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

onMounted(() => {
  loadPendingPosts();
});
</script>

<style scoped>
.post-review-page {
  padding: 20px;
  background: var(--color-bg-2);
  min-height: calc(100vh - 64px);
}

.page-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-content {
  max-height: 100px;
  overflow: hidden;
  position: relative;
}

.post-content p {
  margin: 0;
  line-height: 1.4;
}

.post-images {
  margin-top: 5px;
}

.post-video {
  margin-top: 5px;
}

.post-detail .post-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.post-detail .user-info {
  display: flex;
  justify-content: space-between;
}

.post-detail .post-content {
  margin-bottom: 15px;
}

.post-detail .post-stats {
  display: flex;
  gap: 15px;
  color: var(--color-text-2);
}

.post-stats span {
  padding: 4px 8px;
  background: var(--color-fill-2);
  border-radius: 4px;
}
</style>
