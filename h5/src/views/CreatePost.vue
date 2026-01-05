<template>
  <PageLayout :show-back="true" :title="'发布动态'">
    <div class="create-post-container">
      <div class="post-editor">
        <textarea
          v-model="content"
          placeholder="分享你的观点..."
          class="content-input"
          maxlength="500"
        ></textarea>
        <div class="char-count">{{ content.length }}/500</div>
      </div>

      <!-- 图片上传 -->
      <div class="image-upload">
        <div class="image-grid">
          <div 
            v-for="(img, index) in images" 
            :key="index" 
            class="image-item"
          >
            <img :src="img" alt="上传图片" class="image-preview">
            <button class="remove-btn" @click="removeImage(index)">×</button>
          </div>
          
          <div 
            v-if="images.length < 9" 
            class="upload-btn" 
            @click="selectImage"
          >
            <div class="upload-icon">+</div>
          </div>
        </div>
      </div>

      <!-- 话题选择 -->
      <div class="topic-section">
        <input
          v-model="topic"
          placeholder="添加话题 #话题"
          class="topic-input"
        >
      </div>

      <!-- 发布按钮 -->
      <div class="post-actions">
        <button 
          :disabled="!canPost" 
          :class="['post-btn', { disabled: !canPost }]"
          @click="submitPost"
        >
          {{ isPosting ? '发布中...' : '发布' }}
        </button>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'
import { api } from '../utils/api'
import { alert } from '../utils/alert'

const content = ref('')
const images = ref([])
const topic = ref('')
const isPosting = ref(false)

// 检查是否可以发布
const canPost = computed(() => {
  return content.value.trim().length > 0 && !isPosting.value
})

// 选择图片
const selectImage = () => {
  // 在H5环境中模拟选择图片
  // 实际应用中可以使用input[type=file]或调用原生相机
  alert('图片上传功能将在实际应用中实现')
}

// 移除图片
const removeImage = (index) => {
  images.value.splice(index, 1)
}

// 提交帖子
const submitPost = async () => {
  if (!canPost.value) return
  
  isPosting.value = true
  
  try {
    const postData = {
      content: content.value.trim(),
      images: images.value.length > 0 ? images.value : undefined,
      topic: topic.value ? topic.value.replace('#', '').trim() : undefined,
      type: 'normal'
    }
    
    const response = await api.square.createPost(postData)
    
    if (response.success) {
      alert('发布成功')
      // 清空表单
      content.value = ''
      images.value = []
      topic.value = ''
      // 返回广场页面
      window.history.back()
    } else {
      alert(response.message || '发布失败')
    }
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请重试')
  } finally {
    isPosting.value = false
  }
}
</script>

<style scoped>
.create-post-container {
  padding: 16px;
  min-height: 100vh;
  background: #0B0E11;
}

.post-editor {
  margin-bottom: 16px;
}

.content-input {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  background: #181A20;
  border: 1px solid #2B3139;
  border-radius: 8px;
  color: #EAECEF;
  font-size: 14px;
  resize: none;
  outline: none;
}

.content-input:focus {
  border-color: #F0B90B;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #848E9C;
  margin-top: 4px;
}

.image-upload {
  margin-bottom: 16px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.image-item {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-btn {
  aspect-ratio: 1/1;
  border: 1px dashed #2B3139;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-icon {
  font-size: 24px;
  color: #848E9C;
}

.topic-section {
  margin-bottom: 24px;
}

.topic-input {
  width: 100%;
  padding: 12px;
  background: #181A20;
  border: 1px solid #2B3139;
  border-radius: 8px;
  color: #EAECEF;
  font-size: 14px;
  outline: none;
}

.topic-input:focus {
  border-color: #F0B90B;
}

.post-actions {
  display: flex;
  justify-content: center;
}

.post-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #F0B90B, #DBA700);
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.post-btn.disabled {
  background: #2B3139;
  color: #848E9C;
  cursor: not-allowed;
}
</style>
</template>