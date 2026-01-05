<template>
  <PageLayout title="广场" :show-back="false">
    <template #navbar-right>
      <button class="header-btn" @click="$router.push('/chat')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
        </svg>
        <span class="badge" v-if="unreadMessages > 0">{{ unreadMessages > 99 ? '99+' : unreadMessages }}</span>
      </button>
      <button class="header-btn" @click="$router.push('/notifications')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span class="badge" v-if="unreadNotifications > 0">{{ unreadNotifications }}</span>
      </button>
    </template>

    <div class="page-content">
    <!-- 分类Tab -->
    <div class="square-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <!-- 置顶公告 -->
    <div class="pinned-notice" v-if="activeTab === 'recommend'">
      <div class="notice-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-15a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm0 10a1 1 0 100-2 1 1 0 000 2z"/>
        </svg>
      </div>
      <span class="notice-text">AGX v2.0版本即将上线，新增多个重磅功能！</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    </div>

    <!-- 动态列表 -->
    <div class="feed-list">
      <div v-for="post in posts" :key="post.id" class="feed-card">
        <div class="feed-header">
          <div class="feed-avatar" :class="{ verified: post.verified }">
            <img :src="post.avatar" :alt="post.author" @error="handleAvatarError">
            <span v-if="post.verified" class="verified-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            </span>
          </div>
          <div class="feed-user">
            <div class="feed-name-row">
              <span class="feed-name">{{ post.author }}</span>
              <span class="feed-tag" v-if="post.tag">{{ post.tag }}</span>
            </div>
            <span class="feed-time">{{ post.time }}</span>
          </div>
          <button class="feed-follow" v-if="!post.verified">关注</button>
        </div>
        <div class="feed-content">{{ post.content }}</div>
        <div class="feed-image" v-if="post.image">
          <img :src="post.image" alt="动态图片">
        </div>
        <div class="feed-stats">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> {{ post.views || '1.2k' }}</span>
        </div>
        <div class="feed-actions">
          <button class="action-btn" :class="{ liked: post.liked }" @click="toggleLike(post)">
            <svg width="18" height="18" viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span>{{ post.likes }}</span>
          </button>
          <button class="action-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
            <span>{{ post.comments }}</span>
          </button>
          <button class="action-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span>分享</span>
          </button>
          <button class="action-btn bookmark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 发布按钮 -->
    <router-link to="/post/create" class="fab-btn">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </router-link>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'

const activeTab = ref('recommend')
const unreadMessages = ref(3)
const unreadNotifications = ref(2)

// 实时更新未读消息数
const updateNotificationCounts = () => {
  // 模拟新消息和通知
  if (Math.random() > 0.7) {
    unreadMessages.value += Math.floor(Math.random() * 2) + 1
  }
  if (Math.random() > 0.8) {
    unreadNotifications.value += 1
  }
}

const tabs = [
  { key: 'recommend', label: '推荐' },
  { key: 'finance', label: '金融' },
  { key: 'crypto', label: '加密货币' },
  { key: 'gold', label: '黄金资讯' },
  { key: 'agx', label: 'AGX动态' }
]

const posts = ref([
  {
    id: 1,
    author: '财经分析师',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=analyst',
    verified: true,
    tag: '金融专家',
    time: '5分钟前',
    content: '🏆 美联储会议纪要显示：官员们对通胀回落感到鼓舞，但仍需谨慧观察。黄金价格有望延续上涨趋势，AGX作为黄金背书数字资产迎来重大机遇！',
    image: 'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=400&h=250&fit=crop',
    likes: 289,
    comments: 67,
    views: '3.8k',
    liked: false
  },
  {
    id: 2,
    author: '投资顾问Lisa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    verified: true,
    tag: '投资顾问',
    time: '18分钟前',
    content: '📈 全球央行持续增持黄金储备，第三季度净购买量达400吨！传统避险资产需求强劲，数字黄金AGX为投资者提供更灵活的配置方案。',
    image: null,
    likes: 156,
    comments: 32,
    views: '2.1k',
    liked: true
  },
  {
    id: 3,
    author: '区块链观察家',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blockchain',
    verified: false,
    tag: '区块链专家',
    time: '35分钟前',
    content: '🔥 RWA（现实世界资产）赛道持续升温，黄金资产上链成为热点。AGX通过实物黄金背书，打通传统金融与DeFi世界的桥梁，前景看好。',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    likes: 203,
    comments: 48,
    views: '2.7k',
    liked: false
  },
  {
    id: 4,
    author: '华尔街日报',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wsj',
    verified: true,
    tag: '财经媒体',
    time: '1小时前',
    content: '📊 最新报告：机构投资者对数字资产配置比例提升至5-10%。黄金类数字资产因其稳定性和保值功能，成为机构青睐的重要选择。',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
    likes: 412,
    comments: 89,
    views: '5.2k',
    liked: true
  },
  {
    id: 5,
    author: 'DeFi研究院',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defi',
    verified: true,
    tag: 'DeFi专家',
    time: '2小时前',
    content: '⚡ 质押挖矿新玩法：AGX推出创新质押机制，年化收益最高可达25%！质押AGX不仅能获得代币收益，还能挖取实物黄金，真正实现“挖黄金”！',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=250&fit=crop',
    likes: 324,
    comments: 76,
    views: '4.1k',
    liked: false
  },
  {
    id: 6,
    author: '金融科技观察',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fintech',
    verified: false,
    tag: 'FinTech分析师',
    time: '3小时前',
    content: '💡 秒合约交易成为新趋势：30秒预测黄金价格走势，胜率85%可获得收益。AGX平台即将推出黄金秒合约，为用户提供更多盈利机会。',
    image: null,
    likes: 178,
    comments: 41,
    views: '2.9k',
    liked: false
  }
])

// 模拟新动态推送
const addNewPost = () => {
  const avatarSeeds = ['trader', 'crypto', 'bull', 'whale', 'hodler']
  const randomSeed = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)]
  const newPosts = [
    {
      id: posts.value.length + 1,
      author: 'TechAnalyst',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`,
      verified: false,
      time: '刚刚',
      content: '🔥 大资金入场信号明显，AGX交易量暴增300%！',
      image: null,
      likes: Math.floor(Math.random() * 50) + 10,
      comments: Math.floor(Math.random() * 20) + 3,
      views: (Math.random() * 2 + 0.5).toFixed(1) + 'k',
      liked: false
    }
  ]
  posts.value = [...newPosts, ...posts.value]
}

// 模拟实时更新
let updateTimer = null
const startRealTimeUpdates = () => {
  updateTimer = setInterval(() => {
    // 随机更新点赞数和评论数
    posts.value.forEach(post => {
      if (Math.random() > 0.8) {
        post.likes += Math.floor(Math.random() * 3)
        post.comments += Math.floor(Math.random() * 2)
      }
    })
    
    // 偶尔添加新动态
    if (Math.random() > 0.95) {
      addNewPost()
    }
    
    // 更新通知计数
    updateNotificationCounts()
  }, 5000)
}

const stopRealTimeUpdates = () => {
  if (updateTimer) {
    clearInterval(updateTimer)
    updateTimer = null
  }
}

import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  startRealTimeUpdates()
})

onUnmounted(() => {
  stopRealTimeUpdates()
})

const toggleLike = (post) => {
  post.liked = !post.liked
  post.likes += post.liked ? 1 : -1
}

const handleAvatarError = (e) => {
  e.target.style.display = 'none'
  e.target.parentElement.textContent = e.target.alt.charAt(0)
}
</script>

<style scoped>

.header-btn {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: var(--text-secondary);
}

.header-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  background: #F6465D;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-content {
  min-height: calc(100vh - 44px);
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  padding-bottom: 150px;
}

/* 分类Tab */
.square-tabs {
  margin-top: 8px;
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  overflow-x: auto;
  border-bottom: 1px solid var(--border-color);
}

.square-tabs::-webkit-scrollbar { display: none; }

.tab-btn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-tertiary);
  border-radius: 20px;
  white-space: nowrap;
  transition: all 150ms ease;
}

.tab-btn.active {
  color: var(--text-primary);
  background: var(--bg-card);
}

/* 热门话题 */
.hot-topics {
  padding: 16px;
  background: var(--bg-primary);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.section-label svg {
  color: var(--color-brand);
}

.topic-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.topic-scroll::-webkit-scrollbar { display: none; }

.topic-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 140px;
}

.topic-icon {
  font-size: 20px;
}

.topic-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.topic-name {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
}

.topic-count {
  font-size: 11px;
  color: var(--text-tertiary);
}

/* 置顶公告 */
.pinned-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 16px;
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(201, 169, 98, 0.05) 100%);
  border-radius: 10px;
  border: 1px solid rgba(201, 169, 98, 0.2);
}

.notice-icon {
  color: var(--color-brand);
}

.notice-text {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
}

.pinned-notice > svg:last-child {
  color: var(--text-tertiary);
}

.feed-list {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feed-card {
  background: linear-gradient(145deg, rgba(30, 35, 41, 0.9) 0%, rgba(24, 26, 32, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feed-card:active {
  transform: scale(0.995);
}

.feed-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.feed-avatar {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3a3f47 0%, #25282e 100%);
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 600;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.feed-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.feed-avatar.verified {
  background: linear-gradient(135deg, var(--color-brand) 0%, #a88a4a 100%);
  color: #fff;
}

.verified-badge {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 16px;
  height: 16px;
  background: var(--color-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-card);
  color: #fff;
}

.feed-user {
  flex: 1;
  min-width: 0;
}

.feed-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.feed-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.feed-tag {
  padding: 2px 8px;
  font-size: 10px;
  color: var(--color-brand);
  background: rgba(201, 169, 98, 0.1);
  border-radius: 10px;
}

.feed-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.feed-follow {
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-brand);
  background: rgba(201, 169, 98, 0.1);
  border: 1px solid rgba(201, 169, 98, 0.3);
  border-radius: 16px;
}

.feed-content {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.feed-image {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.feed-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.feed-image img:active {
  transform: scale(0.98);
}

.feed-stats {
  display: flex;
  gap: 16px;
  padding-bottom: 12px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.feed-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.feed-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.04);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  font-size: 12px;
  color: var(--text-tertiary);
  background: rgba(255,255,255,0.02);
  border-radius: 10px;
  transition: all 100ms ease;
}

.action-btn:active {
  background: rgba(255,255,255,0.06);
}

.action-btn.liked {
  color: #F6465D;
  background: rgba(246, 70, 93, 0.1);
}

.action-btn.bookmark {
  flex: 0;
  padding: 10px 14px;
}

/* 浮动发布按钮 */
.fab-btn {
  position: fixed;
  right: 20px;
  bottom: 100px;
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, var(--color-brand) 0%, #a88a4a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 20px rgba(201, 169, 98, 0.4);
  z-index: 100;
}

.fab-btn:active {
  transform: scale(0.95);
}
</style>
