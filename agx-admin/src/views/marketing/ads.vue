<!--
 - AGX Exchange - 广告位管理
-->
<template>
  <div class="ma-content-block p-4">
    <!-- 操作按钮 -->
    <a-card class="mb-4">
      <a-space>
        <a-button type="primary" @click="showAddModal">
          <template #icon><icon-plus /></template>
          新增广告
        </a-button>
        <a-button @click="loadAds">
          <template #icon><icon-refresh /></template>
          刷新
        </a-button>
      </a-space>
    </a-card>

    <!-- 广告位分类 -->
    <a-tabs v-model:active-key="activePosition" @change="handlePositionChange">
      <a-tab-pane key="all" title="全部" />
      <a-tab-pane key="banner" title="顶部横幅" />
      <a-tab-pane key="carousel" title="轮播广告" />
      <a-tab-pane key="bottom" title="底部推荐" />
    </a-tabs>

    <!-- 广告列表 -->
    <a-row :gutter="16" class="mt-4">
      <a-col :span="8" v-for="ad in adList" :key="ad.id" class="mb-4">
        <a-card :title="ad.title" hoverable>
          <template #cover>
            <div class="ad-cover" :style="{ backgroundImage: `url(${ad.image})` }">
              <a-tag :color="getPositionColor(ad.position)" class="position-tag">
                {{ getPositionText(ad.position) }}
              </a-tag>
            </div>
          </template>
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="描述">{{ ad.description }}</a-descriptions-item>
            <a-descriptions-item label="链接">{{ ad.link }}</a-descriptions-item>
            <a-descriptions-item label="排序">{{ ad.sort }}</a-descriptions-item>
            <a-descriptions-item label="状态">
              <a-switch v-model="ad.enabled" @change="toggleStatus(ad)" />
            </a-descriptions-item>
          </a-descriptions>
          <template #actions>
            <a-button type="text" @click="editAd(ad)">
              <template #icon><icon-edit /></template>
            </a-button>
            <a-button type="text" status="danger" @click="deleteAd(ad)">
              <template #icon><icon-delete /></template>
            </a-button>
          </template>
        </a-card>
      </a-col>
    </a-row>

    <!-- 新增/编辑弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑广告' : '新增广告'" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="广告标题" required>
          <a-input v-model="formData.title" placeholder="请输入广告标题" />
        </a-form-item>
        <a-form-item label="广告位置" required>
          <a-select v-model="formData.position" placeholder="请选择广告位置">
            <a-option value="banner">顶部横幅</a-option>
            <a-option value="carousel">轮播广告</a-option>
            <a-option value="bottom">底部推荐</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model="formData.description" placeholder="请输入广告描述" />
        </a-form-item>
        <a-form-item label="跳转链接">
          <a-input v-model="formData.link" placeholder="请输入跳转链接" />
        </a-form-item>
        <a-form-item label="广告图片">
          <a-upload action="/api/upload" :file-list="fileList" @change="handleUpload" list-type="picture-card" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model="formData.sort" :min="1" :max="100" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'

const activePosition = ref('all')
const modalVisible = ref(false)
const isEdit = ref(false)
const fileList = ref([])

const formData = reactive({
  id: null,
  title: '',
  position: 'banner',
  description: '',
  link: '',
  image: '',
  sort: 1
})

const adList = ref([])

const getPositionColor = (position) => {
  const colors = { banner: 'blue', carousel: 'green', bottom: 'orange' }
  return colors[position] || 'gray'
}

const getPositionText = (position) => {
  const texts = { banner: '顶部横幅', carousel: '轮播广告', bottom: '底部推荐' }
  return texts[position] || position
}

const loadAds = () => {
  // 模拟数据
  adList.value = [
    { id: 1, title: '零手续费交易', position: 'banner', description: '新用户注册即享30天零手续费', link: '/register', image: '/assets/ads/banner1.jpg', sort: 1, enabled: true },
    { id: 2, title: '新币认购', position: 'carousel', description: 'AGX代币限量认购', link: '/ieo', image: '/assets/ads/carousel1.jpg', sort: 1, enabled: true },
    { id: 3, title: '邀请返佣', position: 'carousel', description: '邀请好友最高返还50%手续费', link: '/invite', image: '/assets/ads/carousel2.jpg', sort: 2, enabled: true },
    { id: 4, title: '新手礼包', position: 'bottom', description: '注册即送$100体验金', link: '/register', image: '/assets/ads/gift.png', sort: 1, enabled: true },
    { id: 5, title: '交易学院', position: 'bottom', description: '免费学习专业交易技巧', link: '/help', image: '/assets/ads/academy.png', sort: 2, enabled: false },
  ]
  
  if (activePosition.value !== 'all') {
    adList.value = adList.value.filter(ad => ad.position === activePosition.value)
  }
}

const handlePositionChange = () => {
  loadAds()
}

const showAddModal = () => {
  isEdit.value = false
  Object.assign(formData, { id: null, title: '', position: 'banner', description: '', link: '', image: '', sort: 1 })
  modalVisible.value = true
}

const editAd = (ad) => {
  isEdit.value = true
  Object.assign(formData, ad)
  modalVisible.value = true
}

const deleteAd = (ad) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除广告「${ad.title}」吗？`,
    onOk: () => {
      adList.value = adList.value.filter(item => item.id !== ad.id)
      Message.success('删除成功')
    }
  })
}

const toggleStatus = (ad) => {
  Message.success(ad.enabled ? '广告已启用' : '广告已禁用')
}

const handleUpload = (files) => {
  fileList.value = files
}

const handleSubmit = () => {
  if (!formData.title || !formData.position) {
    Message.error('请填写必填项')
    return
  }
  
  if (isEdit.value) {
    const index = adList.value.findIndex(ad => ad.id === formData.id)
    if (index > -1) {
      adList.value[index] = { ...formData }
    }
    Message.success('修改成功')
  } else {
    adList.value.push({ ...formData, id: Date.now(), enabled: true })
    Message.success('添加成功')
  }
  
  modalVisible.value = false
}

onMounted(() => {
  loadAds()
})
</script>

<style scoped>
.ad-cover {
  height: 150px;
  background-size: cover;
  background-position: center;
  background-color: #f0f0f0;
  position: relative;
}
.position-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}
</style>
