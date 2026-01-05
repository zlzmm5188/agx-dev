<template>
  <PageLayout :show-navbar="false" :show-back="false">
    <!-- 头部 -->
    <div class="page-header">
      <button class="close-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      <span class="header-title">发布动态</span>
      <button class="publish-btn" :disabled="!canPublish" @click="handlePublish">发布</button>
    </div>

    <div class="page-content">
      <!-- 内容输入 -->
      <div class="content-area">
        <textarea 
          v-model="content" 
          placeholder="分享你的想法、行情分析、投资心得..."
          maxlength="1000"
        ></textarea>
        <span class="char-count">{{ content.length }}/1000</span>
      </div>

      <!-- 图片上传 -->
      <div class="image-section">
        <div class="image-list">
          <div v-for="(img, index) in images" :key="index" class="image-item">
            <img :src="img" alt="">
            <button class="remove-btn" @click="removeImage(index)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <button v-if="images.length < 9" class="add-image-btn" @click="addImage">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
            </svg>
            <span>添加图片</span>
          </button>
        </div>
      </div>

      <!-- 话题标签 -->
      <div class="topic-section">
        <div class="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>
          </svg>
          <span>添加话题</span>
        </div>
        <div class="topic-list">
          <button 
            v-for="topic in topics" 
            :key="topic"
            :class="['topic-btn', { active: selectedTopics.includes(topic) }]"
            @click="toggleTopic(topic)"
          >#{{ topic }}</button>
        </div>
      </div>

      <!-- 发布设置 -->
      <div class="settings-section">
        <div class="setting-item">
          <span class="setting-label">谁可以看</span>
          <div class="setting-value">
            <span>所有人</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
        <div class="setting-item">
          <span class="setting-label">关闭评论</span>
          <label class="switch">
            <input type="checkbox" v-model="disableComments">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { alert } from '../utils/alert'
import PageLayout from '../components/layout/PageLayout.vue'

const router = useRouter()

const content = ref('')
const images = ref([])
const selectedTopics = ref([])
const disableComments = ref(false)

const topics = ['BTC', 'ETH', 'AGX', '行情分析', '投资策略', '黄金', '新币', '理财']

const canPublish = computed(() => {
  return content.value.trim().length > 0
})

const addImage = () => {
  // 模拟添加图片
  const mockImages = [
    'https://picsum.photos/200/200?random=' + Date.now()
  ]
  if (images.value.length < 9) {
    images.value.push(mockImages[0])
  }
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const toggleTopic = (topic) => {
  const index = selectedTopics.value.indexOf(topic)
  if (index > -1) {
    selectedTopics.value.splice(index, 1)
  } else if (selectedTopics.value.length < 3) {
    selectedTopics.value.push(topic)
  }
}

const handlePublish = async () => {
  if (!canPublish.value) return
  await alert('发布成功！')
  router.push('/square')
}
</script>

<style scoped>
.create-post-page {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  -webkit-tap-highlight-color: transparent;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1a1c20;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.close-btn {
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

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #eaecef;
}

.publish-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  color: #0f1317;
  cursor: pointer;
}

.publish-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.page-content::-webkit-scrollbar { display: none; }

.content-area {
  position: relative;
  margin-bottom: 20px;
}

.content-area textarea {
  width: 100%;
  min-height: 180px;
  padding: 16px;
  background: #1e2329;
  border: none;
  border-radius: 14px;
  color: #eaecef;
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.content-area textarea::placeholder { color: #5e6673; }

.char-count {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 12px;
  color: #5e6673;
}

.image-section { margin-bottom: 20px; }

.image-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: rgba(0,0,0,0.6);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
}

.add-image-btn {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1e2329;
  border: 1px dashed rgba(255,255,255,0.15);
  border-radius: 10px;
  color: #5e6673;
  font-size: 11px;
  cursor: pointer;
}

.topic-section { margin-bottom: 20px; }

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #848e9c;
  margin-bottom: 12px;
}

.topic-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-btn {
  padding: 8px 14px;
  background: #1e2329;
  border: 1px solid transparent;
  border-radius: 16px;
  font-size: 13px;
  color: #848e9c;
  cursor: pointer;
  transition: all 0.2s;
}

.topic-btn.active {
  background: rgba(201, 169, 98, 0.15);
  border-color: rgba(201, 169, 98, 0.3);
  color: #C9A962;
}

.settings-section {
  background: #1e2329;
  border-radius: 14px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.setting-item:last-child { border-bottom: none; }

.setting-label {
  font-size: 14px;
  color: #eaecef;
}

.setting-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #5e6673;
}

.switch {
  position: relative;
  width: 44px;
  height: 24px;
}

.switch input { display: none; }

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2B3139;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
}

.slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  left: 2px;
  top: 2px;
  background: #5e6673;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .slider {
  background: rgba(201, 169, 98, 0.3);
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
  background: #C9A962;
}
</style>
