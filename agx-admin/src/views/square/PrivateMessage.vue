<template>
  <div class="private-message-page">
    <a-card class="page-card">
      <template #title>
        <div class="card-header">
          <h3>私信管理</h3>
          <a-button type="primary" @click="loadMessages">刷新</a-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="search-section">
        <a-form :model="searchForm" layout="inline">
          <a-form-item label="开始日期">
            <a-date-picker v-model="searchForm.startDate" placeholder="开始日期" />
          </a-form-item>
          <a-form-item label="结束日期">
            <a-date-picker v-model="searchForm.endDate" placeholder="结束日期" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="searchMessages">搜索</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 私信列表 -->
      <a-table 
        :columns="columns" 
        :data-source="messages" 
        :loading="loading" 
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'senderId'">
            <span @click="viewUserDetails(record.senderId)" class="user-link">
              用户{{ record.senderId }}
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'receiverId'">
            <span @click="viewUserDetails(record.receiverId)" class="user-link">
              用户{{ record.receiverId }}
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'content'">
            <div v-if="record.mediaType === 'text'">{{ record.content }}</div>
            <div v-else-if="record.mediaType === 'image'">
              <img :src="record.mediaUrl" alt="图片消息" style="max-width: 100px; max-height: 100px; border-radius: 4px;" @click="previewImage(record.mediaUrl)" />
            </div>
            <div v-else-if="record.mediaType === 'video'">
              <a-button type="text" @click="previewVideo(record.mediaUrl)">查看视频</a-button>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'isRead'">
            <a-tag :color="record.isRead === 1 ? 'green' : 'orange'">
              {{ record.isRead === 1 ? '已读' : '未读' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="text" size="small" @click="viewUserMessages(record.senderId, record.receiverId)">查看对话</a-button>
              <a-button type="text" size="small" status="danger" @click="deleteMessage(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 图片预览弹窗 -->
    <a-modal 
      v-model:visible="imageModalVisible" 
      title="图片预览" 
      width="600px"
      :footer="null"
    >
      <img :src="currentImageUrl" alt="图片消息" style="width: 100%;" />
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

    <!-- 用户对话详情弹窗 -->
    <a-modal 
      v-model:visible="dialogModalVisible" 
      title="用户对话详情" 
      width="800px"
      :footer="null"
    >
      <div class="dialog-container">
        <div class="dialog-messages" v-for="msg in dialogMessages" :key="msg.id">
          <div class="message-bubble" :class="{'from-user': msg.senderId === dialogUserId1, 'to-user': msg.senderId !== dialogUserId1}">
            <div class="message-header">
              <span class="message-user">用户{{ msg.senderId }}</span>
              <span class="message-time">{{ formatDate(msg.createdAt) }}</span>
            </div>
            <div class="message-content">
              <div v-if="msg.mediaType === 'text'">{{ msg.content }}</div>
              <div v-else-if="msg.mediaType === 'image'">
                <img :src="msg.mediaUrl" alt="图片消息" style="max-width: 200px; max-height: 200px; border-radius: 4px; cursor: pointer;" @click="previewImage(msg.mediaUrl)" />
              </div>
              <div v-else-if="msg.mediaType === 'video'">
                <a-button type="text" @click="previewVideo(msg.mediaUrl)">查看视频</a-button>
              </div>
            </div>
            <div class="message-status">
              <a-tag :color="msg.isRead === 1 ? 'green' : 'orange'">
                {{ msg.isRead === 1 ? '已读' : '未读' }}
              </a-tag>
              <a-tag :color="getStatusColor(msg.status)">
                {{ getStatusText(msg.status) }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { api } from '@/utils/api';

// 状态变量
const loading = ref(false);
const messages = ref([]);
const imageModalVisible = ref(false);
const videoModalVisible = ref(false);
const dialogModalVisible = ref(false);
const currentImageUrl = ref('');
const currentVideoUrl = ref('');
const dialogMessages = ref([]);
const dialogUserId1 = ref(null);
const dialogUserId2 = ref(null);

// 搜索表单
const searchForm = reactive({
  startDate: null,
  endDate: null
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
    title: '发送者',
    dataIndex: 'senderId',
    width: 100
  },
  {
    title: '接收者',
    dataIndex: 'receiverId',
    width: 100
  },
  {
    title: '内容',
    dataIndex: 'content',
    width: 200
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
    title: '已读',
    dataIndex: 'isRead',
    width: 80
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    width: 180,
    customRender: ({ record }) => new Date(record.createdAt).toLocaleString()
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    fixed: 'right'
  }
];

// 加载私信列表
const loadMessages = async (params = {}) => {
  loading.value = true;
  try {
    const response = await api.square.getAllMessages({
      page: params.page || pagination.value.current,
      pageSize: params.pageSize || pagination.value.pageSize,
      startDate: searchForm.startDate ? new Date(searchForm.startDate).toISOString().split('T')[0] : undefined,
      endDate: searchForm.endDate ? new Date(searchForm.endDate).toISOString().split('T')[0] : undefined
    });
    
    if (response.success) {
      messages.value = response.data.list || [];
      pagination.value.total = response.data.total || 0;
      pagination.value.current = response.data.page || 1;
      pagination.value.pageSize = response.data.pageSize || 20;
    } else {
      Message.error(response.message || '获取私信列表失败');
    }
  } catch (error) {
    console.error('获取私信列表失败:', error);
    Message.error('获取私信列表失败');
  } finally {
    loading.value = false;
  }
};

// 表格变化处理
const handleTableChange = (pagination) => {
  loadMessages({
    page: pagination.current,
    pageSize: pagination.pageSize
  });
};

// 搜索私信
const searchMessages = () => {
  loadMessages({ page: 1 });
};

// 预览图片
const previewImage = (url) => {
  currentImageUrl.value = url;
  imageModalVisible.value = true;
};

// 预览视频
const previewVideo = (url) => {
  currentVideoUrl.value = url;
  videoModalVisible.value = true;
};

// 查看用户对话
const viewUserMessages = async (userId1, userId2) => {
  dialogUserId1.value = userId1;
  dialogUserId2.value = userId2;
  
  try {
    const response = await api.square.getUserMessages(userId1, userId2, {
      page: 1,
      pageSize: 100 // 获取所有对话消息
    });
    
    if (response.success) {
      dialogMessages.value = response.data.list || [];
      dialogModalVisible.value = true;
    } else {
      Message.error(response.message || '获取对话详情失败');
    }
  } catch (error) {
    console.error('获取对话详情失败:', error);
    Message.error('获取对话详情失败');
  }
};

// 查看用户详情
const viewUserDetails = (userId) => {
  // 这里可以跳转到用户详情页面
  console.log('查看用户详情:', userId);
};

// 删除私信
const deleteMessage = async (record) => {
  if (!confirm(`确定要删除这条消息吗？`)) {
    return;
  }

  try {
    // 这里需要后端提供删除消息的API
    Message.success('删除成功');
    loadMessages();
  } catch (error) {
    console.error('删除消息失败:', error);
    Message.error('删除消息失败');
  }
};

// 状态文本
const getStatusText = (status) => {
  const statusMap = {
    '-1': '删除',
    '0': '撤回',
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
  loadMessages();
});
</script>

<style scoped>
.private-message-page {
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

.search-section {
  margin-bottom: 20px;
}

.user-link {
  color: var(--color-link);
  cursor: pointer;
}

.user-link:hover {
  text-decoration: underline;
}

.dialog-container {
  max-height: 600px;
  overflow-y: auto;
}

.message-bubble {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
}

.from-user {
  background: var(--color-primary-light-1);
  margin-right: auto;
  text-align: left;
}

.to-user {
  background: var(--color-neutral-2);
  margin-left: auto;
  text-align: right;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
  color: var(--color-text-2);
}

.message-user {
  font-weight: bold;
}

.message-time {
  color: var(--color-text-3);
}

.message-content {
  margin-bottom: 5px;
}

.message-status {
  display: flex;
  gap: 5px;
  justify-content: flex-end;
}
</style>
