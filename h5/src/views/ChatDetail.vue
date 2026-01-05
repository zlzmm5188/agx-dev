<template>
  <PageLayout :show-back="true" :title="chatUser?.nickname || '聊天'">
    <div class="chat-container">
      <!-- 消息列表 -->
      <div class="messages-container" ref="messagesContainer">
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="['message-item', { 'self-message': message.senderId === currentUserId }]"
        >
          <div class="message-avatar">
            <img 
              :src="message.senderId === currentUserId ? currentUserAvatar : chatUser?.avatar" 
              alt="头像"
              class="avatar"
            >
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <span class="message-text">{{ message.content }}</span>
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <div class="input-box">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="输入消息..."
            class="message-input"
            @keyup.enter="sendMessage"
          >
          <button 
            class="send-btn" 
            :disabled="!canSendMessage"
            @click="sendMessage"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '../components/layout/PageLayout.vue'
import { api } from '../utils/api'
import { alert } from '../utils/alert'

const route = useRoute()
const chatUserId = ref(parseInt(route.params.userId))
const messages = ref([])
const inputMessage = ref('')
const messagesContainer = ref(null)
const currentUserId = ref(1) // 从用户信息获取
const chatUser = ref(null)

// 检查是否可以发送消息
const canSendMessage = computed(() => {
  return inputMessage.value.trim().length > 0
})

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 加载聊天用户信息
const loadChatUser = async () => {
  // 实际应用中应该通过API获取用户信息
  chatUser.value = { id: chatUserId.value, nickname: '好友', avatar: null }
}

// 加载消息历史
const loadMessages = async () => {
  try {
    const response = await api.social.getMessages(chatUserId.value, { limit: 50 })
    if (response.success) {
      messages.value = response.data.list || []
      // 滚动到底部
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('加载消息失败:', error)
  }
}

// 发送消息
const sendMessage = async () => {
  if (!canSendMessage.value) return

  const content = inputMessage.value.trim()
  if (!content) return

  try {
    const response = await api.social.sendMessage({
      receiverId: chatUserId.value,
      content: content
    })

    if (response.success) {
      // 添加到消息列表
      const newMessage = {
        id: Date.now(), // 临时ID
        senderId: currentUserId.value,
        receiverId: chatUserId.value,
        content: content,
        createdAt: new Date().toISOString()
      }
      messages.value.push(newMessage)
      inputMessage.value = ''
      await nextTick()
      scrollToBottom()
    } else {
      alert(response.message || '发送失败')
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    alert('发送失败，请重试')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  const container = messagesContainer.value
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

onMounted(async () => {
  await loadChatUser()
  await loadMessages()
})

onUnmounted(() => {
  // 清理资源
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0B0E11;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-item.self-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #2B3139;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-bubble {
  max-width: 70%;
  background: #181A20;
  border-radius: 12px;
  padding: 8px 12px;
  position: relative;
}

.self-message .message-bubble {
  background: #F0B90B;
  color: #000;
}

.message-text {
  display: block;
  margin-bottom: 4px;
  word-wrap: break-word;
}

.message-time {
  font-size: 10px;
  color: #848E9C;
  text-align: right;
}

.self-message .message-time {
  color: rgba(0, 0, 0, 0.6);
}

.input-container {
  padding: 12px 16px;
  border-top: 1px solid #2B3139;
  background: #0B0E11;
}

.input-box {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 10px 12px;
  background: #181A20;
  border: 1px solid #2B3139;
  border-radius: 20px;
  color: #EAECEF;
  font-size: 14px;
  outline: none;
}

.message-input:focus {
  border-color: #F0B90B;
}

.send-btn {
  padding: 10px 16px;
  background: #F0B90B;
  color: #000;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.send-btn:disabled {
  background: #2B3139;
  color: #848E9C;
  cursor: not-allowed;
}

/* 消息列表滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #2B3139;
  border-radius: 3px;
}
</style>
</template>