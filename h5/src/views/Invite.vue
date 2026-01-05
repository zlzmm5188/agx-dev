<template>
  <PageLayout title="邀请好友" :show-back="true">
    <div class="page-content">
      <!-- 邀请奖励卡片 -->
      <div class="reward-card">
        <div class="reward-header">
          <h2 class="reward-title">邀请好友 赚取佣金</h2>
          <p class="reward-desc">每邀请一位好友注册交易，您可获得其交易手续费的20%返佣</p>
        </div>
        <div class="reward-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalReward }}</span>
            <span class="stat-label">累计收益 (USDT)</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ inviteCount }}</span>
            <span class="stat-label">邀请人数</span>
          </div>
        </div>
      </div>

      <!-- 邀请码 -->
      <div class="invite-code-section">
        <div class="code-label">我的邀请码</div>
        <div class="code-box">
          <span class="code-text">{{ inviteCode }}</span>
          <button class="copy-btn" @click="copyCode">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            复制
          </button>
        </div>
      </div>

      <!-- 邀请方式 -->
      <div class="share-section">
        <div class="section-title">分享邀请</div>
        <div class="share-methods">
          <button class="share-btn wechat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/>
            </svg>
            <span>微信</span>
          </button>
          <button class="share-btn link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
            <span>复制链接</span>
          </button>
          <button class="share-btn qrcode" @click="showQR = true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            <span>二维码</span>
          </button>
          <button class="share-btn poster">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>海报</span>
          </button>
        </div>
      </div>

      <!-- 奖励规则 -->
      <div class="rules-section">
        <div class="section-title">奖励规则</div>
        <div class="rules-list">
          <div class="rule-item">
            <div class="rule-icon">1</div>
            <div class="rule-content">
              <span class="rule-title">分享邀请码</span>
              <span class="rule-desc">将您的专属邀请码或链接分享给好友</span>
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-icon">2</div>
            <div class="rule-content">
              <span class="rule-title">好友注册</span>
              <span class="rule-desc">好友使用邀请码注册并完成身份认证</span>
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-icon">3</div>
            <div class="rule-content">
              <span class="rule-title">好友交易</span>
              <span class="rule-desc">好友完成首笔交易后激活返佣</span>
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-icon">4</div>
            <div class="rule-content">
              <span class="rule-title">获得佣金</span>
              <span class="rule-desc">持续获得好友交易手续费的20%返佣</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 邀请记录 -->
      <div class="records-section">
        <div class="section-header">
          <span class="section-title">邀请记录</span>
          <button class="view-all">查看全部</button>
        </div>
        <div class="records-list">
          <div v-for="record in inviteRecords" :key="record.id" class="record-item">
            <div class="record-avatar">{{ record.name.charAt(0) }}</div>
            <div class="record-info">
              <span class="record-name">{{ record.name }}</span>
              <span class="record-time">{{ record.time }}</span>
            </div>
            <div class="record-reward">
              <span class="reward-amount">+{{ record.reward }} USDT</span>
              <span class="reward-status" :class="record.status">{{ record.statusText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { alert } from '../utils/alert'
import PageLayout from '../components/layout/PageLayout.vue'

const inviteCode = ref('AGX2024XY')
const totalReward = ref('1,258.50')
const inviteCount = ref(28)
const showQR = ref(false)

const inviteRecords = ref([
  { id: 1, name: '用户***88', time: '2024-01-03', reward: '25.60', status: 'active', statusText: '已激活' },
  { id: 2, name: '用户***56', time: '2024-01-02', reward: '12.30', status: 'active', statusText: '已激活' },
  { id: 3, name: '用户***12', time: '2024-01-01', reward: '0.00', status: 'pending', statusText: '待激活' }
])

const copyCode = async () => {
  navigator.clipboard?.writeText(inviteCode.value)
  await alert('邀请码已复制')
}
</script>

<style scoped>
.invite-page {
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
  background: linear-gradient(180deg, rgba(201, 169, 98, 0.08) 0%, #181a20 100%);
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

.reward-card {
  margin: 16px;
  padding: 24px 20px;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.2) 0%, rgba(139, 115, 85, 0.15) 100%);
  border: 1px solid rgba(201, 169, 98, 0.25);
  border-radius: 20px;
}

.reward-header {
  text-align: center;
  margin-bottom: 24px;
}

.reward-title {
  font-size: 22px;
  font-weight: 700;
  color: #C9A962;
  margin: 0 0 8px 0;
}

.reward-desc {
  font-size: 13px;
  color: #848e9c;
  margin: 0;
  line-height: 1.5;
}

.reward-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: rgba(0,0,0,0.2);
  border-radius: 14px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #eaecef;
  font-family: 'DIN Alternate', monospace;
}

.stat-label {
  font-size: 12px;
  color: #848e9c;
}

.invite-code-section {
  margin: 0 16px 20px;
}

.code-label {
  font-size: 14px;
  color: #848e9c;
  margin-bottom: 10px;
}

.code-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #1e2329;
  border: 2px dashed rgba(201,169,98,0.3);
  border-radius: 14px;
}

.code-text {
  font-size: 24px;
  font-weight: 700;
  color: #C9A962;
  letter-spacing: 2px;
  font-family: 'DIN Alternate', monospace;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #0f1317;
  cursor: pointer;
}

.share-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #eaecef;
  margin-bottom: 14px;
}

.share-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 10px;
  background: #1e2329;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.share-btn:active {
  transform: scale(0.96);
}

.share-btn.wechat { color: #07C160; }
.share-btn.link { color: #1E88E5; }
.share-btn.qrcode { color: #C9A962; }
.share-btn.poster { color: #F6465D; }

.share-btn span {
  font-size: 11px;
  color: #848e9c;
}

.rules-section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.rules-list {
  background: #1e2329;
  border-radius: 16px;
  padding: 6px 0;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
}

.rule-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  color: #0f1317;
  flex-shrink: 0;
}

.rule-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rule-title {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
}

.rule-desc {
  font-size: 12px;
  color: #5e6673;
}

.records-section {
  padding: 0 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.view-all {
  font-size: 13px;
  color: #C9A962;
  background: none;
  border: none;
  cursor: pointer;
}

.records-list {
  background: #1e2329;
  border-radius: 14px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.record-item:last-child {
  border-bottom: none;
}

.record-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-name {
  font-size: 14px;
  color: #eaecef;
}

.record-time {
  font-size: 11px;
  color: #5e6673;
}

.record-reward {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.reward-amount {
  font-size: 14px;
  font-weight: 600;
  color: #0ECB81;
  font-family: 'DIN Alternate', monospace;
}

.reward-status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
}

.reward-status.active {
  color: #0ECB81;
  background: rgba(14,203,129,0.12);
}

.reward-status.pending {
  color: #F0B90B;
  background: rgba(240,185,11,0.12);
}
</style>
