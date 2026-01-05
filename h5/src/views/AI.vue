<template>
  <PageLayout title="升达智能" :show-back="true">
    <template #navbar-right>
      <button class="header-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82V9a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9"/>
        </svg>
      </button>
    </template>

    <div class="page-content">
      <!-- AI 头部 -->
      <div class="ai-header">
        <div class="ai-avatar">
          <svg viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="aiGrad" x1="0" y1="0" x2="64" y2="64">
                <stop stop-color="#A855F7"/><stop offset="0.5" stop-color="#8B5CF6"/><stop offset="1" stop-color="#6366F1"/>
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="28" stroke="url(#aiGrad)" stroke-width="2" fill="none" opacity="0.3"/>
            <circle cx="32" cy="32" r="20" stroke="url(#aiGrad)" stroke-width="2" fill="url(#aiGrad)" fill-opacity="0.1"/>
            <circle cx="32" cy="32" r="10" fill="url(#aiGrad)"/>
            <path d="M32 10v8M32 46v8M10 32h8M46 32h8" stroke="url(#aiGrad)" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <div class="ai-pulse"></div>
        </div>
        <h1 class="ai-title">升达智能</h1>
        <p class="ai-desc">您的专属AI投资顾问，助您把握市场脉搏</p>
      </div>

      <!-- 功能入口 -->
      <div class="ai-features">
        <div class="feature-card" @click="activeFeature = 'analysis'">
          <div class="feature-icon analysis">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/><path d="M7 16l4-6 4 3 5-7"/>
            </svg>
          </div>
          <div class="feature-info">
            <span class="feature-name">行情分析</span>
            <span class="feature-desc">智能分析市场走势</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="feature-card" @click="activeFeature = 'strategy'">
          <div class="feature-icon strategy">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="feature-info">
            <span class="feature-name">策略推荐</span>
            <span class="feature-desc">个性化投资策略</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="feature-card" @click="activeFeature = 'risk'">
          <div class="feature-icon risk">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="feature-info">
            <span class="feature-name">风险评估</span>
            <span class="feature-desc">投资组合风险分析</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="feature-card" @click="activeFeature = 'news'">
          <div class="feature-icon news">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>
            </svg>
          </div>
          <div class="feature-info">
            <span class="feature-name">快讯解读</span>
            <span class="feature-desc">实时新闻深度分析</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>

      <!-- AI 对话区 -->
      <div class="ai-chat">
        <div class="chat-title">
          <span>智能助手</span>
          <button class="clear-btn" @click="clearChat">清空对话</button>
        </div>
        <div class="chat-messages" ref="chatContainer">
          <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
            <div v-if="msg.role === 'assistant'" class="msg-avatar">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" fill="#8B5CF6"/>
                <circle cx="12" cy="12" r="3" fill="#fff"/>
              </svg>
            </div>
            <div class="msg-content">
              <div class="msg-text" v-html="msg.content"></div>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
          </div>
          <div v-if="isTyping" class="message assistant">
            <div class="msg-avatar">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" fill="#8B5CF6"/>
                <circle cx="12" cy="12" r="3" fill="#fff"/>
              </svg>
            </div>
            <div class="msg-content">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <input 
            type="text" 
            v-model="inputText" 
            placeholder="请输入您的问题..."
            @keyup.enter="sendMessage"
          >
          <button class="send-btn" :class="{ active: inputText.trim() }" @click="sendMessage">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 热门问题 -->
      <div class="hot-questions">
        <div class="section-title">热门问题</div>
        <div class="question-list">
          <button 
            v-for="(q, index) in hotQuestions" 
            :key="index"
            class="question-btn"
            @click="askQuestion(q)"
          >{{ q }}</button>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'

const inputText = ref('')
const isTyping = ref(false)
const activeFeature = ref('')
const chatContainer = ref(null)

const messages = ref([
  {
    role: 'assistant',
    content: '您好！我是升达智能AI助手，可以为您提供<strong>行情分析</strong>、<strong>策略推荐</strong>、<strong>风险评估</strong>等服务。有什么我可以帮您的吗？',
    time: '刚刚'
  }
])

const hotQuestions = [
  '今天BTC走势如何？',
  'AGX值得投资吗？',
  '如何设置止损止盈？',
  '黄金和比特币怎么配置？'
]

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const sendMessage = () => {
  if (!inputText.value.trim()) return
  
  const userMsg = inputText.value
  messages.value.push({
    role: 'user',
    content: userMsg,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })
  
  inputText.value = ''
  isTyping.value = true
  scrollToBottom()
  
  // 模拟AI回复
  setTimeout(() => {
    isTyping.value = false
    let response = ''
    
    if (userMsg.includes('BTC') || userMsg.includes('比特币')) {
      response = '根据技术分析，BTC目前处于<strong>上升通道</strong>中：<br><br>📈 <strong>支撑位</strong>：98,500 USDT<br>📊 <strong>阻力位</strong>：102,000 USDT<br>💡 <strong>建议</strong>：可在支撑位附近逢低建仓，止损设在97,000<br><br>⚠️ 投资有风险，以上仅供参考'
    } else if (userMsg.includes('AGX')) {
      response = 'AGX升达金指币是由<strong>实物黄金背书</strong>的数字资产：<br><br>✅ 黄金储备经德勤审计<br>✅ 发行价$0.10，即将上线<br>✅ 锁仓理财年化高达128%<br><br>💡 作为黄金+区块链的创新产品，具有<strong>抗通胀</strong>和<strong>价值存储</strong>属性，值得关注！'
    } else if (userMsg.includes('止损') || userMsg.includes('止盈')) {
      response = '止损止盈设置建议：<br><br>📌 <strong>止损</strong>：一般设在买入价的3-5%以下<br>📌 <strong>止盈</strong>：根据风险偏好，可设10-20%<br>📌 <strong>移动止损</strong>：随着盈利增加逐步上移止损位<br><br>💡 建议使用<strong>1:2</strong>或<strong>1:3</strong>的盈亏比策略'
    } else if (userMsg.includes('黄金')) {
      response = '黄金配置建议：<br><br>💰 黄金是传统的避险资产<br>₿ 比特币是数字黄金<br><br>📊 <strong>建议配比</strong>：<br>- 保守型：黄金70% + BTC30%<br>- 均衡型：黄金50% + BTC50%<br>- 激进型：黄金30% + BTC70%<br><br>💡 AGX完美结合两者优势，值得关注！'
    } else {
      response = '感谢您的提问！作为您的AI投资顾问，我可以为您：<br><br>1️⃣ 分析市场行情走势<br>2️⃣ 推荐个性化投资策略<br>3️⃣ 评估投资组合风险<br>4️⃣ 解读实时金融快讯<br><br>请问您想了解哪方面的内容？'
    }
    
    messages.value.push({
      role: 'assistant',
      content: response,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })
    scrollToBottom()
  }, 1500)
}

const askQuestion = (question) => {
  inputText.value = question
  sendMessage()
}

const clearChat = () => {
  messages.value = [{
    role: 'assistant',
    content: '对话已清空，有什么我可以帮您的吗？',
    time: '刚刚'
  }]
}
</script>

<style scoped>
.ai-page {
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

/* 固定顶部栏 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, #181a20 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-right: 12px;
}

.back-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.header-actions { display: flex; gap: 8px; }

.header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
}

.header-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar { display: none; }
.page-content { scrollbar-width: none; }

.ai-header {
  text-align: center;
  padding: 30px 16px;
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%);
}

.ai-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.ai-avatar svg { width: 100%; height: 100%; }

.ai-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.ai-title {
  font-size: 24px;
  font-weight: 700;
  color: #eaecef;
  margin-bottom: 8px;
}

.ai-desc {
  font-size: 14px;
  color: #848e9c;
}

.ai-features {
  padding: 0 16px;
  margin-bottom: 20px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #1e2329;
  border-radius: 14px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.feature-card:active { transform: scale(0.99); background: #242930; }

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon.analysis { background: rgba(14, 203, 129, 0.15); color: #0ECB81; }
.feature-icon.strategy { background: rgba(96, 165, 250, 0.15); color: #60A5FA; }
.feature-icon.risk { background: rgba(246, 70, 93, 0.15); color: #F6465D; }
.feature-icon.news { background: rgba(168, 85, 247, 0.15); color: #A855F7; }

.feature-info { flex: 1; }

.feature-name {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #eaecef;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: #5e6673;
}

.feature-card > svg { color: #5e6673; }

.ai-chat {
  margin: 0 16px 20px;
  background: #1e2329;
  border-radius: 16px;
  overflow: hidden;
}

.chat-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 14px;
  font-weight: 500;
  color: #eaecef;
}

.clear-btn {
  font-size: 12px;
  color: #5e6673;
  background: none;
  border: none;
  cursor: pointer;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  padding: 16px;
}

.chat-messages::-webkit-scrollbar { display: none; }

.message {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.message.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.msg-avatar svg { width: 100%; height: 100%; }

.msg-content {
  max-width: 80%;
}

.msg-text {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
}

.message.assistant .msg-text {
  background: #2B3139;
  color: #eaecef;
  border-bottom-left-radius: 4px;
}

.message.user .msg-text {
  background: linear-gradient(135deg, #8B5CF6, #6366F1);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.msg-time {
  display: block;
  font-size: 11px;
  color: #5e6673;
  margin-top: 6px;
  padding: 0 4px;
}

.message.user .msg-time { text-align: right; }

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #2B3139;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #5e6673;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.chat-input input {
  flex: 1;
  height: 40px;
  padding: 0 16px;
  background: #2B3139;
  border: none;
  border-radius: 20px;
  color: #eaecef;
  font-size: 14px;
  outline: none;
}

.chat-input input::placeholder { color: #5e6673; }

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2B3139;
  color: #5e6673;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn.active {
  background: linear-gradient(135deg, #8B5CF6, #6366F1);
  color: #fff;
}

.hot-questions {
  padding: 0 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #848e9c;
  margin-bottom: 12px;
}

.question-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.question-btn {
  padding: 10px 16px;
  background: #1e2329;
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  font-size: 13px;
  color: #A78BFA;
  cursor: pointer;
  transition: all 0.15s;
}

.question-btn:active {
  background: rgba(139, 92, 246, 0.15);
}
</style>
