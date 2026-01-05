<template>
  <PageLayout title="帮助中心" :show-back="true">
    <div class="page-content">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="搜索问题...">
      </div>

      <!-- 常见问题分类 -->
      <div class="faq-categories">
        <button 
          v-for="cat in categories" 
          :key="cat.key"
          :class="['cat-btn', { active: activeCat === cat.key }]"
          @click="activeCat = cat.key"
        >
          <component :is="cat.icon" />
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <!-- 热门问题 -->
      <div class="hot-section">
        <div class="section-title">🔥 热门问题</div>
        <div class="faq-list">
          <div 
            v-for="faq in hotFaqs" 
            :key="faq.id" 
            :class="['faq-item', { expanded: expandedId === faq.id }]"
            @click="toggleFaq(faq.id)"
          >
            <div class="faq-header">
              <span class="faq-question">{{ faq.question }}</span>
              <svg class="faq-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div v-if="expandedId === faq.id" class="faq-answer">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- 全部问题 -->
      <div class="all-section">
        <div class="section-title">全部问题</div>
        <div class="faq-list">
          <div 
            v-for="faq in filteredFaqs" 
            :key="faq.id" 
            :class="['faq-item', { expanded: expandedId === faq.id }]"
            @click="toggleFaq(faq.id)"
          >
            <div class="faq-header">
              <span class="faq-question">{{ faq.question }}</span>
              <svg class="faq-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <div v-if="expandedId === faq.id" class="faq-answer">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- 联系客服 -->
      <div class="contact-section">
        <div class="section-title">联系我们</div>
        <div class="contact-list">
          <a href="#" class="contact-item">
            <div class="contact-icon online">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
            </div>
            <div class="contact-info">
              <span class="contact-title">在线客服</span>
              <span class="contact-desc">7×24小时在线</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <a href="mailto:support@ascenda.com" class="contact-item">
            <div class="contact-icon email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            <div class="contact-info">
              <span class="contact-title">邮件支持</span>
              <span class="contact-desc">support@ascenda.com</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </a>
          <a href="#" class="contact-item">
            <div class="contact-icon telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
              </svg>
            </div>
            <div class="contact-info">
              <span class="contact-title">Telegram</span>
              <span class="contact-desc">@AscendaOfficial</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </a>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'

const searchQuery = ref('')
const activeCat = ref('all')
const expandedId = ref(null)

const categories = [
  { key: 'all', label: '全部' },
  { key: 'account', label: '账户' },
  { key: 'trade', label: '交易' },
  { key: 'asset', label: '资产' },
  { key: 'security', label: '安全' }
]

const hotFaqs = ref([
  { id: 'h1', question: '如何进行身份认证(KYC)？', answer: '进入"我的"-"身份认证"页面，按照提示上传身份证正反面照片，填写个人信息后提交审核。审核通常在1-3个工作日内完成。', category: 'account' },
  { id: 'h2', question: '充值多久到账？', answer: 'USDT充值到账时间取决于区块链网络确认速度。TRC20通常1-5分钟，ERC20通常5-30分钟。网络拥堵时可能延迟。', category: 'asset' },
  { id: 'h3', question: '如何设置交易密码？', answer: '进入"我的"-"安全中心"-"交易密码"，设置6位数字交易密码。交易密码用于提币和资金划转等敏感操作。', category: 'security' }
])

const allFaqs = ref([
  { id: 1, question: '如何注册账号？', answer: '点击首页"注册"按钮，输入手机号或邮箱，设置密码即可完成注册。建议使用常用邮箱以便接收重要通知。', category: 'account' },
  { id: 2, question: '忘记密码怎么办？', answer: '在登录页面点击"忘记密码"，通过手机号或邮箱验证后即可重置密码。', category: 'account' },
  { id: 3, question: '如何买入数字货币？', answer: '在"交易"页面选择币种，输入购买金额，选择现货交易，确认后即可完成购买。', category: 'trade' },
  { id: 4, question: '交易手续费是多少？', answer: '现货交易手续费为0.1%，VIP用户可享受更低费率。具体费率请查看费率说明页面。', category: 'trade' },
  { id: 5, question: '如何提币？', answer: '进入"提币"页面，选择币种和网络，输入提币地址和数量，输入交易密码后提交。首次提币需完成身份认证。', category: 'asset' },
  { id: 6, question: '如何绑定谷歌验证器？', answer: '进入"安全中心"-"谷歌验证"，扫描二维码或手动输入密钥，输入6位验证码完成绑定。', category: 'security' }
])

const filteredFaqs = computed(() => {
  let result = allFaqs.value
  if (activeCat.value !== 'all') {
    result = result.filter(f => f.category === activeCat.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(f => f.question.toLowerCase().includes(query))
  }
  return result
})

const toggleFaq = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<style scoped>
.help-page {
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
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(180deg, #1e2228 0%, #181a20 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #848e9c;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-right: 12px;
}

.back-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin: 0;
}

.header-actions { display: flex; gap: 8px; }

.page-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar { display: none; }

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px;
  padding: 12px 14px;
  background: #1e2329;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
}

.search-bar svg { color: #5e6673; }

.search-bar input {
  flex: 1;
  background: none;
  border: none;
  color: #eaecef;
  font-size: 14px;
  outline: none;
}

.search-bar input::placeholder { color: #5e6673; }

.faq-categories {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.faq-categories::-webkit-scrollbar { display: none; }

.cat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  font-size: 13px;
  color: #848e9c;
  white-space: nowrap;
  cursor: pointer;
}

.cat-btn.active {
  background: linear-gradient(135deg, rgba(201,169,98,0.2), rgba(201,169,98,0.1));
  color: #C9A962;
  border-color: rgba(201,169,98,0.3);
}

.hot-section, .all-section, .contact-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #eaecef;
  margin-bottom: 14px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  background: #1e2329;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.faq-item.expanded {
  background: linear-gradient(135deg, rgba(201,169,98,0.08), #1e2329);
  border: 1px solid rgba(201,169,98,0.15);
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.faq-question {
  font-size: 14px;
  color: #eaecef;
  flex: 1;
  padding-right: 12px;
}

.faq-arrow {
  color: #5e6673;
  transition: transform 0.2s;
}

.faq-item.expanded .faq-arrow {
  transform: rotate(180deg);
  color: #C9A962;
}

.faq-answer {
  padding: 0 16px 16px;
  font-size: 13px;
  color: #848e9c;
  line-height: 1.6;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #1e2329;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.15s;
}

.contact-item:active {
  background: #242930;
}

.contact-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.contact-icon.online { background: rgba(14,203,129,0.12); color: #0ECB81; }
.contact-icon.email { background: rgba(201,169,98,0.12); color: #C9A962; }
.contact-icon.telegram { background: rgba(30,136,229,0.12); color: #1E88E5; }

.contact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-title {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
}

.contact-desc {
  font-size: 12px;
  color: #5e6673;
}

.contact-item > svg {
  color: #5e6673;
}
</style>
