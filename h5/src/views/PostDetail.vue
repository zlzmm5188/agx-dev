<template>
  <PageLayout :show-navbar="false" :show-back="false">
    <!-- 头部 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <span class="header-title">动态详情</span>
      <button class="more-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
        </svg>
      </button>
    </div>

    <div class="page-content">
      <!-- 帖子内容 -->
      <div class="post-card">
        <div class="post-header">
          <router-link :to="`/user/${post.authorId}`" class="author-avatar">
            {{ post.author.charAt(0) }}
          </router-link>
          <div class="author-info">
            <div class="author-row">
              <router-link :to="`/user/${post.authorId}`" class="author-name">{{ post.author }}</router-link>
              <span v-if="post.verified" class="verified-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </span>
            </div>
            <span class="post-time">{{ post.time }}</span>
          </div>
          <button v-if="!post.isFollowing" class="follow-btn" @click="toggleFollow">关注</button>
          <span v-else class="following-tag">已关注</span>
        </div>

        <div class="post-content">{{ post.content }}</div>

        <div v-if="post.images && post.images.length" class="post-images">
          <img v-for="(img, index) in post.images" :key="index" :src="img" alt="">
        </div>

        <div class="post-topics">
          <span v-for="topic in post.topics" :key="topic" class="topic-tag">#{{ topic }}</span>
        </div>

        <div class="post-stats">
          <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> {{ post.views }}</span>
          <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> {{ post.likes }}</span>
          <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> {{ comments.length }}</span>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comments-section">
        <div class="section-header">
          <span class="section-title">评论 ({{ comments.length }})</span>
        </div>

        <div class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <router-link :to="`/user/${comment.userId}`" class="comment-avatar">
              {{ comment.userName.charAt(0) }}
            </router-link>
            <div class="comment-body">
              <div class="comment-header">
                <router-link :to="`/user/${comment.userId}`" class="comment-name">{{ comment.userName }}</router-link>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <button :class="['action-btn', { liked: comment.liked }]" @click="toggleCommentLike(comment)">
                  <svg width="14" height="14" viewBox="0 0 24 24" :fill="comment.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {{ comment.likes }}
                </button>
                <button class="action-btn" @click="replyTo(comment)">回复</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="comments.length === 0" class="empty-comments">
          <p>暂无评论</p>
          <span>快来发表第一条评论吧</span>
        </div>
      </div>
    </div>

    <!-- 底部评论输入 -->
    <div class="comment-input-area">
      <div class="input-wrap">
        <input 
          type="text" 
          v-model="commentText" 
          :placeholder="replyTarget ? `回复 @${replyTarget.userName}` : '说点什么...'"
        >
      </div>
      <button class="send-btn" :class="{ active: commentText.trim() }" @click="sendComment">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
        </svg>
      </button>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '../components/layout/PageLayout.vue'

const route = useRoute()

const commentText = ref('')
const replyTarget = ref(null)

const post = ref({
  id: route.params.id,
  authorId: 1,
  author: '币圈大V',
  verified: true,
  time: '2小时前',
  content: 'BTC突破10万美元大关！牛市正式开启，下一个目标15万。建议大家持有现货，不要轻易追高。注意风险控制，合理分配仓位。\n\n目前市场情绪高涨，但也要注意回调风险。个人建议配置：BTC 50%，ETH 30%，其他山寨 20%。\n\n#投资有风险 #入市需谨慎',
  images: ['https://picsum.photos/400/300?random=1'],
  topics: ['BTC', '行情分析'],
  views: '12.5k',
  likes: 2568,
  isFollowing: false
})

const comments = ref([
  {
    id: 1,
    userId: 2,
    userName: '交易小王',
    content: '大佬分析得太到位了！已经按照建议调整仓位',
    time: '1小时前',
    likes: 56,
    liked: false
  },
  {
    id: 2,
    userId: 3,
    userName: '量化策略',
    content: '技术面看确实是这样，不过要注意美联储的动向',
    time: '30分钟前',
    likes: 23,
    liked: true
  },
  {
    id: 3,
    userId: 4,
    userName: '新韭菜',
    content: '刚入圈，学习了！',
    time: '10分钟前',
    likes: 5,
    liked: false
  }
])

const toggleFollow = () => {
  post.value.isFollowing = !post.value.isFollowing
}

const toggleCommentLike = (comment) => {
  comment.liked = !comment.liked
  comment.likes += comment.liked ? 1 : -1
}

const replyTo = (comment) => {
  replyTarget.value = comment
}

const sendComment = () => {
  if (!commentText.value.trim()) return
  
  comments.value.push({
    id: Date.now(),
    userId: 999,
    userName: '我',
    content: replyTarget.value ? `@${replyTarget.value.userName} ${commentText.value}` : commentText.value,
    time: '刚刚',
    likes: 0,
    liked: false
  })
  
  commentText.value = ''
  replyTarget.value = null
}
</script>

<style scoped>
.post-detail-page {
  width: 100%;
  max-width: 428px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1a1c20;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.back-btn, .more-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}

.back-btn { color: #eaecef; }
.more-btn { color: #5e6673; }

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #eaecef;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.page-content::-webkit-scrollbar { display: none; }

.post-card {
  padding: 16px;
  background: #1e2329;
  margin-bottom: 10px;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C9A962, #8B7355);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
}

.author-info { flex: 1; }

.author-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-size: 15px;
  font-weight: 500;
  color: #eaecef;
  text-decoration: none;
}

.verified-badge {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #C9A962;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f1317;
}

.post-time {
  font-size: 12px;
  color: #5e6673;
}

.follow-btn {
  padding: 6px 16px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #0f1317;
  cursor: pointer;
}

.following-tag {
  padding: 6px 16px;
  background: #2B3139;
  border-radius: 16px;
  font-size: 12px;
  color: #5e6673;
}

.post-content {
  font-size: 15px;
  line-height: 1.7;
  color: #eaecef;
  white-space: pre-wrap;
  margin-bottom: 14px;
}

.post-images {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

.post-images img {
  width: 100%;
  border-radius: 10px;
}

.post-topics {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.topic-tag {
  padding: 4px 10px;
  background: rgba(201, 169, 98, 0.1);
  border-radius: 12px;
  font-size: 12px;
  color: #C9A962;
}

.post-stats {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.post-stats span {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #5e6673;
}

.comments-section { padding: 16px; }

.section-header { margin-bottom: 16px; }

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #eaecef;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  flex-shrink: 0;
}

.comment-body { flex: 1; }

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.comment-name {
  font-size: 13px;
  font-weight: 500;
  color: #eaecef;
  text-decoration: none;
}

.comment-time {
  font-size: 11px;
  color: #5e6673;
}

.comment-content {
  font-size: 14px;
  color: #eaecef;
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #5e6673;
  background: none;
  border: none;
  cursor: pointer;
}

.action-btn.liked { color: #F6465D; }

.empty-comments {
  text-align: center;
  padding: 40px 20px;
  color: #5e6673;
}

.empty-comments p { font-size: 14px; color: #848e9c; margin-bottom: 6px; }
.empty-comments span { font-size: 12px; }

.comment-input-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  background: #1a1c20;
  border-top: 1px solid rgba(255,255,255,0.06);
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
  background: #2B3139;
  color: #5e6673;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.send-btn.active {
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  color: #0f1317;
}
</style>
