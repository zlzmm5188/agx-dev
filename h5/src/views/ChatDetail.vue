<template>
  <div class="chat-detail-page">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <div class="user-info">
        <span class="user-name">{{ chatUser.name }}</span>
        <span class="user-status" :class="{ online: chatUser.online }">
          {{ chatUser.online ? '在线' : '离线' }}
        </span>
      </div>
      <button class="more-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
        </svg>
      </button>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesContainer">
      <div class="messages-list">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          :class="['message-item', msg.self ? 'self' : 'other']"
        >
          <div v-if="!msg.self" class="msg-avatar">{{ chatUser.name.charAt(0) }}</div>
          <div class="msg-content">
            <div class="msg-bubble">
              <span v-if="msg.type === 'text'">{{ msg.content }}</span>
              <img v-else-if="msg.type === 'image'" :src="msg.content" class="msg-image">
            </div>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <button class="input-action">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
        </svg>
      </button>
      <div class="input-wrap">
        <input 
          type="text" 
          v-model="inputText" 
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
        >
      </div>
      <button class="send-btn" :class="{ active: inputText.trim() }" @click="sendMessage">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const messagesContainer = ref(null)
const inputText = ref('')

const chatUser = ref({
  id: route.params.userId,
  name: '币圈大V',
  online: true
})

const messages = ref([
  { type: 'text', content: '你好！最近行情怎么看？', self: false, time: '10:20' },
  { type: 'text', content: '今天BTC突破10万了，整体看涨', self: true, time: '10:21' },
  { type: 'text', content: '是的，我觉得还有上涨空间', self: false, time: '10:22' },
  { type: 'text', content: 'AGX项目你有关注吗？', self: true, time: '10:23' },
  { type: 'text', content: '当然，黄金背书的代币很有前景，我已经预约了', self: false, time: '10:25' },
  { type: 'text', content: '👍 等开盘的时候一起', self: true, time: '10:26' },
  { type: 'text', content: '好的，到时候群里通知大家', self: false, time: '10:30' }
])

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = () => {
  if (!inputText.value.trim()) return
  
  messages.value.push({
    type: 'text',
    content: inputText.value,
    self: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })
  
  inputText.value = ''
  scrollToBottom()
  
  // 模拟回复
  setTimeout(() => {
    messages.value.push({
      type: 'text',
      content: '好的，收到！',
      self: false,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })
    scrollToBottom()
  }, 1000)
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-detail-page {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  -webkit-tap-highlight-color: transparent;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #1a1c20;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #eaecef;
  background: none;
  border: none;
  cursor: pointer;
}

.user-info {
  flex: 1;
  text-align: center;
}

.user-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #eaecef;
}

.user-status {
  font-size: 12px;
  color: #5e6673;
}

.user-status.online { color: #0ECB81; }

.more-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5e6673;
  background: none;
  border: none;
  cursor: pointer;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  -webkit-overflow-scrolling: touch;
}

.messages-container::-webkit-scrollbar { display: none; }

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  max-width: 80%;
}

.message-item.self {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-item.other {
  align-self: flex-start;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C9A962, #8B7355);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.msg-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-item.self .msg-content { align-items: flex-end; }
.message-item.other .msg-content { align-items: flex-start; }

.msg-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  max-width: 260px;
  word-break: break-word;
}

.message-item.self .msg-bubble {
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  color: #0f1317;
  border-bottom-right-radius: 4px;
}

.message-item.other .msg-bubble {
  background: #2B3139;
  color: #eaecef;
  border-bottom-left-radius: 4px;
}

.msg-time {
  font-size: 11px;
  color: #5e6673;
  padding: 0 4px;
}

.msg-image {
  max-width: 200px;
  border-radius: 12px;
}

.input-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: #1a1c20;
  border-top: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.input-action {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5e6673;
  background: none;
  border: none;
  cursor: pointer;
}

.input-wrap {
  flex: 1;
  background: #2B3139;
  border-radius: 20px;
  padding: 0 16px;
}

.input-wrap input {
  width: 100%;
  height: 40px;
  background: none;
  border: none;
  color: #eaecef;
  font-size: 14px;
  outline: none;
}

.input-wrap input::placeholder { color: #5e6673; }

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2B3139;
  color: #5e6673;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn.active {
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  color: #0f1317;
}
</style>
