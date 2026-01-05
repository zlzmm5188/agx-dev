<template>
  <PageLayout :show-navbar="false" :show-back="false">
    <!-- 头部背景 -->
    <div class="profile-header">
      <div class="header-bg"></div>
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button class="more-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
        </svg>
      </button>
    </div>

    <div class="page-content">
      <!-- 用户信息 -->
      <div class="user-card">
        <div class="user-avatar" :class="{ verified: user.verified }">
          {{ user.name.charAt(0) }}
          <span v-if="user.verified" class="verified-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </span>
        </div>
        <div class="user-name">{{ user.name }}</div>
        <div class="user-bio">{{ user.bio }}</div>
        
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ user.posts }}</span>
            <span class="stat-label">动态</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.followers }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.following }}</span>
            <span class="stat-label">关注</span>
          </div>
        </div>

        <div class="user-actions">
          <button 
            :class="['follow-btn', { following: user.isFollowing }]"
            @click="toggleFollow"
          >
            {{ user.isFollowing ? '已关注' : '关注' }}
          </button>
          <button class="chat-btn" @click="startChat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
            私信
          </button>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="profile-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 动态列表 -->
      <div class="posts-list" v-if="activeTab === 'posts'">
        <router-link 
          v-for="post in userPosts" 
          :key="post.id"
          :to="`/post/${post.id}`"
          class="post-item"
        >
          <div class="post-content">{{ post.content }}</div>
          <div class="post-meta">
            <span>{{ post.time }}</span>
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> {{ post.likes }}</span>
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> {{ post.comments }}</span>
          </div>
        </router-link>
      </div>

      <!-- 喜欢列表 -->
      <div class="likes-list" v-if="activeTab === 'likes'">
        <div class="empty-state">
          <p>暂无喜欢的内容</p>
        </div>
      </div>

      <!-- 收藏列表 -->
      <div class="favorites-list" v-if="activeTab === 'favorites'">
        <div class="empty-state">
          <p>暂无收藏的内容</p>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { alert } from '../utils/alert'
import PageLayout from '../components/layout/PageLayout.vue'

const route = useRoute()
const router = useRouter()

const activeTab = ref('posts')

const tabs = [
  { key: 'posts', label: '动态' },
  { key: 'likes', label: '喜欢' },
  { key: 'favorites', label: '收藏' }
]

const user = ref({
  id: route.params.id,
  name: '币圈大V',
  bio: '资深投资者 | 擅长技术分析 | 分享投资心得',
  verified: true,
  posts: 128,
  followers: '12.5k',
  following: 86,
  isFollowing: false
})

const userPosts = ref([
  {
    id: 1,
    content: 'BTC突破10万美元大关！牛市正式开启，下一个目标15万。建议大家持有现货，不要轻易追高。',
    time: '2小时前',
    likes: 2568,
    comments: 386
  },
  {
    id: 2,
    content: '今日行情分析：ETH表现强劲，预计将突破4000美元关口。建议持有现货观望。',
    time: '昨天',
    likes: 1856,
    comments: 234
  },
  {
    id: 3,
    content: 'AGX项目值得关注！黄金背书的代币，有实物资产支撑，长期看好。',
    time: '3天前',
    likes: 3421,
    comments: 512
  }
])

const toggleFollow = () => {
  user.value.isFollowing = !user.value.isFollowing
}

const startChat = async () => {
  if (!user.value.isFollowing) {
    await alert('请先关注后再发起私信')
    return
  }
  router.push(`/chat/${user.value.id}`)
}
</script>

<style scoped>
.user-profile-page {
  width: 100%;
  max-width: 100vw;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  overflow: hidden;
}

.profile-header {
  position: relative;
  height: 120px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.3) 0%, rgba(139, 115, 85, 0.2) 100%);
}

.back-btn, .more-btn {
  position: absolute;
  top: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.back-btn { left: 16px; color: #fff; }
.more-btn { right: 16px; color: #fff; }

.page-content {
  flex: 1;
  overflow-y: auto;
  margin-top: -40px;
  padding-bottom: 100px;
}

.page-content::-webkit-scrollbar { display: none; }

.user-card {
  text-align: center;
  padding: 0 16px 20px;
}

.user-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C9A962, #8B7355);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  border: 4px solid #181a20;
}

.verified-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #C9A962;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f1317;
  border: 3px solid #181a20;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #eaecef;
  margin-bottom: 8px;
}

.user-bio {
  font-size: 13px;
  color: #848e9c;
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
}

.stat-item { text-align: center; }

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
}

.stat-label {
  font-size: 12px;
  color: #5e6673;
}

.user-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.follow-btn {
  padding: 10px 32px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #0f1317;
  cursor: pointer;
}

.follow-btn.following {
  background: #2B3139;
  color: #848e9c;
}

.chat-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: #2B3139;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #eaecef;
  cursor: pointer;
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 0 16px;
}

.tab-btn {
  flex: 1;
  padding: 14px 0;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  color: #5e6673;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #C9A962;
  border-bottom-color: #C9A962;
}

.posts-list {
  padding: 16px;
}

.post-item {
  display: block;
  padding: 16px;
  background: #1e2329;
  border-radius: 14px;
  margin-bottom: 12px;
  text-decoration: none;
}

.post-content {
  font-size: 14px;
  color: #eaecef;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #5e6673;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #5e6673;
}

.empty-state p { font-size: 14px; }
</style>
