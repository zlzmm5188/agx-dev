<template>
  <PageLayout title="消息中心" :show-back="true">
    <template #navbar-right>
      <button class="header-btn" @click="showFilter = !showFilter">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M1 12h6M17 12h6"/>
        </svg>
      </button>
    </template>

    <div class="page-content">
      <!-- 分类Tab -->
      <div class="notif-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon" :class="tab.key">
            <svg v-if="tab.key === 'all'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            <svg v-else-if="tab.key === 'system'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
            <svg v-else-if="tab.key === 'trade'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
          </span>
          {{ tab.label }}
          <span v-if="tab.count" class="tab-badge">{{ tab.count }}</span>
        </button>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-value">{{ unreadCount }}</span>
          <span class="stat-label">未读消息</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ notifications.length }}</span>
          <span class="stat-label">全部消息</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ todayCount }}</span>
          <span class="stat-label">今日新增</span>
        </div>
      </div>

      <!-- 通知列表 -->
      <div class="notif-list">
        <div 
          v-for="notif in filteredNotifs" 
          :key="notif.id"
          :class="['notif-item', { unread: !notif.read }]"
          @click="readNotif(notif)"
        >
          <div class="notif-icon" :class="notif.type">
            <svg v-if="notif.type === 'system'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <svg v-else-if="notif.type === 'trade'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            <svg v-else-if="notif.type === 'asset'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <div class="notif-content">
            <div class="notif-header">
              <span class="notif-title">{{ notif.title }}</span>
              <span v-if="!notif.read" class="unread-badge">NEW</span>
            </div>
            <p class="notif-desc">{{ notif.content }}</p>
            <div class="notif-footer">
              <span class="notif-time">{{ notif.time }}</span>
              <span class="notif-type-tag" :class="notif.type">{{ getTypeLabel(notif.type) }}</span>
            </div>
          </div>
          <button class="notif-action" @click.stop="deleteNotif(notif.id)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredNotifs.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <p class="empty-title">暂无消息</p>
        <p class="empty-desc">您的消息将在这里显示</p>
      </div>

      <!-- 操作按钮 -->
      <div class="notif-actions" v-if="notifications.length > 0">
        <button class="action-btn primary" @click="markAllRead">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          全部已读
        </button>
        <button class="action-btn danger" @click="clearAll">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          清空全部
        </button>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'

const activeTab = ref('all')
const showFilter = ref(false)

const tabs = [
  { key: 'all', label: '全部', count: 5 },
  { key: 'system', label: '系统', count: 2 },
  { key: 'trade', label: '交易', count: 2 },
  { key: 'asset', label: '资产', count: 1 }
]

const notifications = ref([
  { id: 1, type: 'system', title: '系统升级通知', content: '平台将于2024年1月5日凌晨2:00-4:00进行系统升级，届时部分功能可能暂时不可用', time: '10分钟前', read: false },
  { id: 2, type: 'trade', title: '订单成交通知', content: '您的BTC/USDT买单已成交，成交价格：97,500.00 USDT，成交数量：0.01 BTC', time: '1小时前', read: false },
  { id: 3, type: 'asset', title: '充值到账通知', content: '您的USDT充值已到账，充值金额：500.00 USDT，请查收', time: '2小时前', read: false },
  { id: 4, type: 'trade', title: 'AGX认购成功', content: '恭喜您成功认购AGX代币1000枚，认购金额：100 USDT', time: '昨天', read: true },
  { id: 5, type: 'system', title: '安全提醒', content: '检测到您的账户在新设备登录，如非本人操作请及时修改密码', time: '2天前', read: true }
])

const filteredNotifs = computed(() => {
  if (activeTab.value === 'all') return notifications.value
  return notifications.value.filter(n => n.type === activeTab.value)
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const todayCount = computed(() => {
  return notifications.value.filter(n => n.time.includes('分钟') || n.time.includes('小时')).length
})

const getTypeLabel = (type) => {
  const labels = { system: '系统', trade: '交易', asset: '资产' }
  return labels[type] || '其他'
}

const readNotif = (notif) => {
  notif.read = true
}

const deleteNotif = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const clearAll = () => {
  notifications.value = []
}
</script>

<style scoped>
.notifications-page {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0f1114 0%, #0c0e12 100%);
}

/* 固定顶部栏 */
.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(180deg, rgba(30, 34, 40, 0.95) 0%, rgba(24, 26, 32, 0.98) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}

.back-btn, .header-btn {
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
  transition: all 0.15s;
}

.back-btn:active, .header-btn:active { 
  background: rgba(255, 255, 255, 0.08);
  transform: scale(0.95);
}

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin: 0;
  text-align: center;
  letter-spacing: -0.3px;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
}

.page-content::-webkit-scrollbar { display: none; }

/* 分类Tab */
.notif-tabs {
  display: flex;
  gap: 8px;
  padding: 16px;
  overflow-x: auto;
}

.notif-tabs::-webkit-scrollbar { display: none; }

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px;
  font-size: 13px;
  font-weight: 500;
  color: #848e9c;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:active { transform: scale(0.97); }

.tab-btn.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
  color: #A78BFA;
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-badge {
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: linear-gradient(135deg, #F6465D, #E91E63);
  border-radius: 9px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 统计卡片 */
.stats-card {
  display: flex;
  align-items: center;
  margin: 0 16px 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 16px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #eaecef;
}

.stat-label {
  font-size: 11px;
  color: #848e9c;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
}

/* 通知列表 */
.notif-list {
  padding: 0 16px;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(30, 35, 41, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  margin-bottom: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

.notif-item:active {
  transform: scale(0.98);
  background: rgba(36, 41, 48, 0.8);
}

.notif-item.unread {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(30, 35, 41, 0.8));
  border-color: rgba(139, 92, 246, 0.12);
}

.notif-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.notif-icon.system { background: rgba(139, 92, 246, 0.12); color: #A78BFA; }
.notif-icon.trade { background: rgba(14, 203, 129, 0.12); color: #0ECB81; }
.notif-icon.asset { background: rgba(30, 136, 229, 0.12); color: #1E88E5; }

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.notif-title {
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
}

.unread-badge {
  padding: 2px 6px;
  background: linear-gradient(135deg, #F6465D, #E91E63);
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.notif-desc {
  margin: 0 0 8px;
  font-size: 13px;
  color: #848e9c;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notif-time {
  font-size: 11px;
  color: #5e6673;
}

.notif-type-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.notif-type-tag.system { background: rgba(139, 92, 246, 0.1); color: #A78BFA; }
.notif-type-tag.trade { background: rgba(14, 203, 129, 0.1); color: #0ECB81; }
.notif-type-tag.asset { background: rgba(30, 136, 229, 0.1); color: #1E88E5; }

.notif-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5e6673;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s;
}

.notif-item:hover .notif-action { opacity: 1; }
.notif-action:hover { color: #F6465D; background: rgba(246, 70, 93, 0.1); }

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #5e6673;
}

.empty-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.06);
  border-radius: 50%;
  margin-bottom: 20px;
}

.empty-icon svg { opacity: 0.4; color: #A78BFA; }

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #848e9c;
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 13px;
  color: #5e6673;
  margin: 0;
}

/* 操作按钮 */
.notif-actions {
  display: flex;
  gap: 12px;
  padding: 20px 16px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  color: #848e9c;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:active {
  transform: scale(0.97);
}

.action-btn.primary {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.1));
  border-color: rgba(139, 92, 246, 0.2);
  color: #A78BFA;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.15));
}

.action-btn.danger {
  color: #F6465D;
}

.action-btn.danger:hover {
  background: rgba(246, 70, 93, 0.1);
  border-color: rgba(246, 70, 93, 0.2);
}
</style>
