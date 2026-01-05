<template>
  <div class="kyc-page">
    <!-- 固定顶部栏 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h1 class="page-title">身份认证</h1>
      <div class="header-placeholder"></div>
    </div>

    <div class="page-content">
      <!-- KYC状态 -->
      <div class="kyc-status">
        <div class="status-icon" :class="kycLevel">
          <svg v-if="kycLevel === 'none'" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <svg v-else-if="kycLevel === 'basic'" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
        <div class="status-info">
          <span class="status-title">{{ kycTitle }}</span>
          <span class="status-desc">{{ kycDesc }}</span>
        </div>
      </div>

      <!-- 认证等级 -->
      <div class="kyc-levels">
        <div class="level-card" :class="{ active: kycLevel === 'none', completed: kycLevel !== 'none' }">
          <div class="level-header">
            <span class="level-num">Lv.0</span>
            <span class="level-name">未认证</span>
            <span v-if="kycLevel === 'none'" class="level-tag current">当前</span>
          </div>
          <div class="level-limits">
            <div class="limit-item">
              <span class="limit-label">24H提币限额</span>
              <span class="limit-value">0 USDT</span>
            </div>
            <div class="limit-item">
              <span class="limit-label">法币交易</span>
              <span class="limit-value disabled">不可用</span>
            </div>
          </div>
        </div>

        <div class="level-card" :class="{ active: kycLevel === 'basic', completed: kycLevel === 'advanced' }">
          <div class="level-header">
            <span class="level-num">Lv.1</span>
            <span class="level-name">基础认证</span>
            <span v-if="kycLevel === 'basic'" class="level-tag current">当前</span>
            <span v-if="kycLevel === 'advanced'" class="level-tag completed">已完成</span>
          </div>
          <div class="level-limits">
            <div class="limit-item">
              <span class="limit-label">24H提币限额</span>
              <span class="limit-value">10,000 USDT</span>
            </div>
            <div class="limit-item">
              <span class="limit-label">法币交易</span>
              <span class="limit-value">可用</span>
            </div>
          </div>
          <button v-if="kycLevel === 'none'" class="verify-btn" @click="startVerify('basic')">开始认证</button>
        </div>

        <div class="level-card" :class="{ active: kycLevel === 'advanced' }">
          <div class="level-header">
            <span class="level-num">Lv.2</span>
            <span class="level-name">高级认证</span>
            <span v-if="kycLevel === 'advanced'" class="level-tag current">当前</span>
          </div>
          <div class="level-limits">
            <div class="limit-item">
              <span class="limit-label">24H提币限额</span>
              <span class="limit-value gold">无限制</span>
            </div>
            <div class="limit-item">
              <span class="limit-label">法币交易</span>
              <span class="limit-value">可用</span>
            </div>
          </div>
          <button v-if="kycLevel === 'basic'" class="verify-btn" @click="startVerify('advanced')">升级认证</button>
        </div>
      </div>

      <!-- 认证表单 -->
      <div v-if="showForm" class="kyc-form">
        <div class="form-title">{{ formTitle }}</div>
        
        <div class="form-group">
          <label>证件类型</label>
          <div class="select-wrap">
            <select v-model="idType">
              <option value="idcard">身份证</option>
              <option value="passport">护照</option>
              <option value="driver">驾驶证</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>真实姓名</label>
          <input type="text" v-model="realName" placeholder="请输入证件上的姓名">
        </div>

        <div class="form-group">
          <label>证件号码</label>
          <input type="text" v-model="idNumber" placeholder="请输入证件号码">
        </div>

        <div class="form-group" v-if="verifyType === 'advanced'">
          <label>证件照片</label>
          <div class="upload-area">
            <div class="upload-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>证件正面</span>
            </div>
            <div class="upload-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>证件背面</span>
            </div>
            <div class="upload-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span>手持证件</span>
            </div>
          </div>
        </div>

        <button class="submit-btn" @click="submitVerify">提交认证</button>
      </div>

      <!-- 注意事项 -->
      <div class="kyc-notice">
        <div class="notice-title">注意事项</div>
        <ul class="notice-list">
          <li>请确保证件在有效期内</li>
          <li>照片需清晰可辨，无遮挡</li>
          <li>信息一经提交，不可修改</li>
          <li>审核一般在1-3个工作日内完成</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { alert } from '../utils/alert'

const kycLevel = ref('none') // none, basic, advanced
const showForm = ref(false)
const verifyType = ref('')

const idType = ref('idcard')
const realName = ref('')
const idNumber = ref('')

const kycTitle = computed(() => {
  if (kycLevel.value === 'advanced') return '高级认证已通过'
  if (kycLevel.value === 'basic') return '基础认证已通过'
  return '未完成身份认证'
})

const kycDesc = computed(() => {
  if (kycLevel.value === 'advanced') return '享受最高权限'
  if (kycLevel.value === 'basic') return '可进行法币交易，升级可享更高限额'
  return '完成认证后可进行提币和法币交易'
})

const formTitle = computed(() => {
  return verifyType.value === 'advanced' ? '高级认证' : '基础认证'
})

const startVerify = (type) => {
  verifyType.value = type
  showForm.value = true
}

const submitVerify = async () => {
  if (!realName.value || !idNumber.value) {
    await alert('请填写完整信息')
    return
  }
  // 模拟提交
  await alert('提交成功，请等待审核')
  showForm.value = false
  if (verifyType.value === 'basic') {
    kycLevel.value = 'basic'
  } else {
    kycLevel.value = 'advanced'
  }
}
</script>

<style scoped>
.kyc-page {
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
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.back-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin: 0;
  text-align: center;
}

.header-placeholder { width: 36px; }

.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

.page-content::-webkit-scrollbar { display: none; }
.page-content { scrollbar-width: none; }

.kyc-status {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #1e2329;
  border-radius: 16px;
  margin-bottom: 16px;
}

.status-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon.none { background: rgba(246, 70, 93, 0.15); color: #F6465D; }
.status-icon.basic { background: rgba(240, 185, 11, 0.15); color: #F0B90B; }
.status-icon.advanced { background: rgba(14, 203, 129, 0.15); color: #0ECB81; }

.status-info { flex: 1; }

.status-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin-bottom: 6px;
}

.status-desc {
  font-size: 13px;
  color: #5e6673;
}

.kyc-levels {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.level-card {
  padding: 18px;
  background: #1e2329;
  border-radius: 14px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.level-card.active {
  border-color: rgba(201, 169, 98, 0.5);
  background: linear-gradient(165deg, #242930 0%, #1a1e24 100%);
}

.level-card.completed {
  opacity: 0.7;
}

.level-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.level-num {
  padding: 4px 10px;
  background: #2B3139;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #848e9c;
}

.level-name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #eaecef;
}

.level-tag {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
}

.level-tag.current { background: rgba(201, 169, 98, 0.15); color: #C9A962; }
.level-tag.completed { background: rgba(14, 203, 129, 0.15); color: #0ECB81; }

.level-limits {
  display: flex;
  gap: 20px;
  margin-bottom: 14px;
}

.limit-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.limit-label {
  font-size: 12px;
  color: #5e6673;
}

.limit-value {
  font-size: 14px;
  color: #eaecef;
}

.limit-value.disabled { color: #5e6673; }
.limit-value.gold { color: #C9A962; }

.verify-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #0f1317;
  cursor: pointer;
}

.kyc-form {
  background: #1e2329;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  color: #eaecef;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #848e9c;
  margin-bottom: 8px;
}

.form-group input,
.select-wrap select {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: #2B3139;
  border: 1px solid transparent;
  border-radius: 12px;
  color: #eaecef;
  font-size: 14px;
  outline: none;
}

.form-group input:focus,
.select-wrap select:focus {
  border-color: rgba(201, 169, 98, 0.5);
}

.form-group input::placeholder { color: #5e6673; }

.select-wrap {
  position: relative;
}

.select-wrap select {
  appearance: none;
  cursor: pointer;
}

.upload-area {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.upload-box {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2B3139;
  border: 1px dashed rgba(255,255,255,0.15);
  border-radius: 12px;
  color: #5e6673;
  font-size: 11px;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #0f1317;
  cursor: pointer;
  margin-top: 10px;
}

.kyc-notice {
  background: #1e2329;
  border-radius: 14px;
  padding: 18px;
}

.notice-title {
  font-size: 14px;
  font-weight: 500;
  color: #eaecef;
  margin-bottom: 12px;
}

.notice-list {
  padding-left: 16px;
  margin: 0;
}

.notice-list li {
  font-size: 13px;
  color: #5e6673;
  line-height: 2;
}
</style>
