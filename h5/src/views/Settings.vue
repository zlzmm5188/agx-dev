<template>
  <PageLayout title="设置" :show-back="true">
    <div class="page-content">
    <div class="settings-section">
      <div class="section-title">通用设置</div>
      <div class="settings-list">
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">🌐</span>
            <span class="item-text">语言</span>
          </div>
          <div class="item-right">
            <span class="item-value">简体中文</span>
            <span class="arrow">›</span>
          </div>
        </div>
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">💱</span>
            <span class="item-text">法币单位</span>
          </div>
          <div class="item-right">
            <span class="item-value">USD</span>
            <span class="arrow">›</span>
          </div>
        </div>
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">🎨</span>
            <span class="item-text">深色模式</span>
          </div>
          <div class="item-right">
            <label class="switch">
              <input type="checkbox" v-model="darkMode" disabled>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="section-title">消息通知</div>
      <div class="settings-list">
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">🔔</span>
            <span class="item-text">推送通知</span>
          </div>
          <div class="item-right">
            <label class="switch">
              <input type="checkbox" v-model="pushNotify">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">📧</span>
            <span class="item-text">邮件通知</span>
          </div>
          <div class="item-right">
            <label class="switch">
              <input type="checkbox" v-model="emailNotify">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">📱</span>
            <span class="item-text">短信通知</span>
          </div>
          <div class="item-right">
            <label class="switch">
              <input type="checkbox" v-model="smsNotify">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="section-title">其他</div>
      <div class="settings-list">
        <div class="settings-item" @click="clearCache">
          <div class="item-left">
            <span class="item-icon">🗑️</span>
            <span class="item-text">清除缓存</span>
          </div>
          <div class="item-right">
            <span class="item-value">2.5MB</span>
            <span class="arrow">›</span>
          </div>
        </div>
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">📄</span>
            <span class="item-text">用户协议</span>
          </div>
          <div class="item-right">
            <span class="arrow">›</span>
          </div>
        </div>
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">🔒</span>
            <span class="item-text">隐私政策</span>
          </div>
          <div class="item-right">
            <span class="arrow">›</span>
          </div>
        </div>
        <div class="settings-item">
          <div class="item-left">
            <span class="item-icon">ℹ️</span>
            <span class="item-text">关于我们</span>
          </div>
          <div class="item-right">
            <span class="item-value">v1.0.0</span>
            <span class="arrow">›</span>
          </div>
        </div>
      </div>
    </div>

    <div class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { alert } from '../utils/alert'
import PageLayout from '../components/layout/PageLayout.vue'

const darkMode = ref(true)
const pushNotify = ref(true)
const emailNotify = ref(false)
const smsNotify = ref(false)

const clearCache = async () => {
  await alert('缓存已清除')
}

const handleLogout = async () => {
  await alert('请先登录')
}
</script>

<style scoped>
/* 页面容器 */
.settings-page {
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

/* 可滚动内容区 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(40px, env(safe-area-inset-bottom));
}

/* 隐藏滚动条 */
.page-content::-webkit-scrollbar {
  display: none;
}

.page-content {
  scrollbar-width: none;
}

.settings-section {
  padding: 0 16px;
  margin-top: 16px;
}

.section-title {
  font-size: 14px;
  color: #848e9c;
  margin-bottom: 12px;
}

.settings-list {
  background: #1e2329;
  border-radius: 12px;
  overflow: hidden;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #2b3139;
  cursor: pointer;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  font-size: 20px;
}

.item-text {
  font-size: 15px;
  color: #eaecef;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-value {
  font-size: 14px;
  color: #5e6673;
}

.arrow {
  font-size: 16px;
  color: #5e6673;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2b3139;
  border-radius: 26px;
  transition: 0.3s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: #5e6673;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: #D4B872;
}

input:checked + .slider::before {
  transform: translateX(22px);
  background-color: #fff;
}

.logout-section {
  padding: 40px 16px 20px;
}

.logout-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 1px solid #f6465d;
  border-radius: 10px;
  color: #f6465d;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}
</style>
