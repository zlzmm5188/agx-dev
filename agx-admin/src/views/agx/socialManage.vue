<template>
  <div class="social-manage-container">
    <a-card title="社交关系管理">
      <!-- Tab切换 -->
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="friends" title="好友关系" />
        <a-tab-pane key="messages" title="私聊记录" />
        <a-tab-pane key="users" title="用户社交状态" />
      </a-tabs>

      <!-- 好友关系 -->
      <template v-if="activeTab === 'friends'">
        <a-row :gutter="16" class="mb-4">
          <a-col :span="6">
            <a-input v-model="searchForm.userId" placeholder="用户ID" allow-clear />
          </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="handleSearchFriends">搜索</a-button>
          </a-col>
        </a-row>

        <a-table :columns="friendColumns" :data="friendData" :loading="loading">
          <template #userA="{ record }">
            <a-space>
              <a-avatar :size="32">{{ record.userAName?.charAt(0) }}</a-avatar>
              <span>{{ record.userAName }} (ID: {{ record.userId }})</span>
            </a-space>
          </template>
          <template #userB="{ record }">
            <a-space>
              <a-avatar :size="32">{{ record.userBName?.charAt(0) }}</a-avatar>
              <span>{{ record.userBName }} (ID: {{ record.friendId }})</span>
            </a-space>
          </template>
          <template #action="{ record }">
            <a-popconfirm content="确定强制解除好友关系？" @ok="handleRemoveFriend(record)">
              <a-button type="text" size="small" status="danger">强制解除</a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </template>

      <!-- 私聊记录 -->
      <template v-if="activeTab === 'messages'">
        <a-alert class="mb-4" type="warning">私聊记录仅用于投诉处理和风控审查，请谨慎使用</a-alert>
        <a-row :gutter="16" class="mb-4">
          <a-col :span="5">
            <a-input v-model="searchForm.senderId" placeholder="发送者ID" allow-clear />
          </a-col>
          <a-col :span="5">
            <a-input v-model="searchForm.receiverId" placeholder="接收者ID" allow-clear />
          </a-col>
          <a-col :span="6">
            <a-range-picker v-model="searchForm.dateRange" style="width: 100%" />
          </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="handleSearchMessages">搜索</a-button>
          </a-col>
        </a-row>

        <a-table :columns="messageColumns" :data="messageData" :loading="loading">
          <template #content="{ record }">
            <a-typography-paragraph :ellipsis="{ rows: 2 }" style="margin: 0">
              {{ record.content }}
            </a-typography-paragraph>
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleViewMessage(record)">查看</a-button>
            </a-space>
          </template>
        </a-table>
      </template>

      <!-- 用户社交状态 -->
      <template v-if="activeTab === 'users'">
        <a-row :gutter="16" class="mb-4">
          <a-col :span="6">
            <a-input v-model="searchForm.userKeyword" placeholder="用户ID/用户名" allow-clear />
          </a-col>
          <a-col :span="4">
            <a-select v-model="searchForm.socialStatus" placeholder="社交状态" allow-clear style="width: 100%">
              <a-option :value="1">正常</a-option>
              <a-option :value="0">禁言</a-option>
              <a-option :value="-1">社交封禁</a-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="handleSearchUsers">搜索</a-button>
          </a-col>
        </a-row>

        <a-table :columns="userColumns" :data="userData" :loading="loading">
          <template #socialStatus="{ record }">
            <a-tag :color="getSocialStatusColor(record.socialStatus)">
              {{ getSocialStatusText(record.socialStatus) }}
            </a-tag>
          </template>
          <template #canBeFriended="{ record }">
            <a-switch v-model="record.canBeFriended" :checked-value="1" :unchecked-value="0" @change="(val) => handleCanBeFriendedChange(record, val)" />
          </template>
          <template #canChat="{ record }">
            <a-switch v-model="record.canChat" :checked-value="1" :unchecked-value="0" @change="(val) => handleCanChatChange(record, val)" />
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleMuteUser(record)">禁言</a-button>
              <a-button v-if="record.socialStatus === 0" type="text" size="small" status="success" @click="handleUnmuteUser(record)">解除禁言</a-button>
              <a-popconfirm content="确定封禁该用户社交功能？" @ok="handleBanSocial(record)">
                <a-button type="text" size="small" status="danger">社交封禁</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </template>
    </a-card>

    <!-- 禁言弹窗 -->
    <a-modal v-model:visible="muteVisible" title="禁言用户" @ok="handleMuteSubmit">
      <a-form :model="muteForm" layout="vertical">
        <a-form-item label="用户">
          <a-input :model-value="muteForm.username" disabled />
        </a-form-item>
        <a-form-item label="禁言时长" required>
          <a-select v-model="muteForm.duration" style="width: 100%">
            <a-option :value="1">1小时</a-option>
            <a-option :value="24">24小时</a-option>
            <a-option :value="72">3天</a-option>
            <a-option :value="168">7天</a-option>
            <a-option :value="720">30天</a-option>
            <a-option :value="-1">永久</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="禁言原因">
          <a-textarea v-model="muteForm.reason" placeholder="请输入禁言原因" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 消息详情弹窗 -->
    <a-modal v-model:visible="messageDetailVisible" title="消息详情" :footer="false" width="600px">
      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="发送者">{{ currentMessage.senderName }} (ID: {{ currentMessage.senderId }})</a-descriptions-item>
        <a-descriptions-item label="接收者">{{ currentMessage.receiverName }} (ID: {{ currentMessage.receiverId }})</a-descriptions-item>
        <a-descriptions-item label="发送时间">{{ currentMessage.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="消息内容">{{ currentMessage.content }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const activeTab = ref('friends')
const muteVisible = ref(false)
const messageDetailVisible = ref(false)

const searchForm = reactive({
  userId: '',
  senderId: '',
  receiverId: '',
  dateRange: [],
  userKeyword: '',
  socialStatus: ''
})

const muteForm = reactive({
  userId: 0,
  username: '',
  duration: 24,
  reason: ''
})

const currentMessage = ref({})

const friendColumns = [
  { title: '用户A', dataIndex: 'userA', slotName: 'userA', width: 200 },
  { title: '用户B', dataIndex: 'userB', slotName: 'userB', width: 200 },
  { title: '成为好友时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', slotName: 'action', width: 120, fixed: 'right' }
]

const messageColumns = [
  { title: '发送者', dataIndex: 'senderName', width: 120 },
  { title: '接收者', dataIndex: 'receiverName', width: 120 },
  { title: '消息内容', dataIndex: 'content', slotName: 'content', width: 300 },
  { title: '发送时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', slotName: 'action', width: 80, fixed: 'right' }
]

const userColumns = [
  { title: '用户ID', dataIndex: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username', width: 120 },
  { title: '昵称', dataIndex: 'nickname', width: 120 },
  { title: '好友数', dataIndex: 'friendCount', width: 80 },
  { title: '社交状态', dataIndex: 'socialStatus', slotName: 'socialStatus', width: 100 },
  { title: '禁言至', dataIndex: 'muteUntil', width: 180 },
  { title: '允许被加好友', dataIndex: 'canBeFriended', slotName: 'canBeFriended', width: 120 },
  { title: '允许私聊', dataIndex: 'canChat', slotName: 'canChat', width: 100 },
  { title: '操作', slotName: 'action', width: 200, fixed: 'right' }
]

const friendData = ref([])
const messageData = ref([])
const userData = ref([])

const getSocialStatusColor = (status) => {
  const colors = { 1: 'green', 0: 'orange', '-1': 'red' }
  return colors[status] || 'gray'
}

const getSocialStatusText = (status) => {
  const texts = { 1: '正常', 0: '禁言中', '-1': '社交封禁' }
  return texts[status] || '未知'
}

const mockData = () => {
  friendData.value = [
    { id: 1, userId: 10001, userAName: 'user001', friendId: 10002, userBName: 'user002', createdAt: '2024-01-15 10:30:00' },
    { id: 2, userId: 10001, userAName: 'user001', friendId: 10003, userBName: 'user003', createdAt: '2024-01-14 15:20:00' },
    { id: 3, userId: 10004, userAName: 'user004', friendId: 10005, userBName: 'user005', createdAt: '2024-01-13 09:15:00' },
  ]

  messageData.value = [
    { id: 1, senderId: 10001, senderName: 'user001', receiverId: 10002, receiverName: 'user002', content: '你好，最近怎么样？', createdAt: '2024-01-15 14:30:00' },
    { id: 2, senderId: 10002, senderName: 'user002', receiverId: 10001, receiverName: 'user001', content: '挺好的，你呢？', createdAt: '2024-01-15 14:31:00' },
  ]

  userData.value = [
    { id: 10001, username: 'user001', nickname: '用户1', friendCount: 25, socialStatus: 1, muteUntil: '-', canBeFriended: 1, canChat: 1 },
    { id: 10002, username: 'user002', nickname: '用户2', friendCount: 18, socialStatus: 0, muteUntil: '2024-01-16 14:30:00', canBeFriended: 1, canChat: 0 },
    { id: 10003, username: 'user003', nickname: '用户3', friendCount: 5, socialStatus: -1, muteUntil: '-', canBeFriended: 0, canChat: 0 },
  ]
}

const handleSearchFriends = () => {
  loading.value = true
  setTimeout(() => {
    mockData()
    loading.value = false
  }, 500)
}

const handleSearchMessages = () => {
  loading.value = true
  setTimeout(() => {
    mockData()
    loading.value = false
  }, 500)
}

const handleSearchUsers = () => {
  loading.value = true
  setTimeout(() => {
    mockData()
    loading.value = false
  }, 500)
}

const handleRemoveFriend = (record) => {
  Message.success(`已强制解除 ${record.userAName} 和 ${record.userBName} 的好友关系`)
}

const handleViewMessage = (record) => {
  currentMessage.value = record
  messageDetailVisible.value = true
}

const handleMuteUser = (record) => {
  muteForm.userId = record.id
  muteForm.username = record.username
  muteForm.duration = 24
  muteForm.reason = ''
  muteVisible.value = true
}

const handleMuteSubmit = () => {
  Message.success(`用户 ${muteForm.username} 已被禁言`)
  muteVisible.value = false
  mockData()
}

const handleUnmuteUser = (record) => {
  Message.success(`用户 ${record.username} 已解除禁言`)
}

const handleBanSocial = (record) => {
  Message.success(`用户 ${record.username} 已被社交封禁`)
}

const handleCanBeFriendedChange = (record, val) => {
  Message.success(val ? '已允许被加好友' : '已禁止被加好友')
}

const handleCanChatChange = (record, val) => {
  Message.success(val ? '已允许私聊' : '已禁止私聊')
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.social-manage-container {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
