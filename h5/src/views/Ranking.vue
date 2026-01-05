<template>
  <div class="ranking-page">
    <!-- 固定顶部栏 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h1 class="page-title">排行榜</h1>
      <div class="header-placeholder"></div>
    </div>

    <div class="page-content">
      <!-- 排行榜类型切换 -->
      <div class="rank-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 时间筛选 -->
      <div class="time-filter">
        <button 
          v-for="time in timeFilters" 
          :key="time.key"
          :class="['time-btn', { active: activeTime === time.key }]"
          @click="activeTime = time.key"
        >
          {{ time.label }}
        </button>
      </div>

      <!-- TOP3展示 -->
      <div class="top3-section">
        <div class="top3-wrap">
          <!-- 第二名 -->
          <div class="top-item second">
            <div class="top-avatar">
              <span>{{ topUsers[1]?.name.charAt(0) }}</span>
              <span class="rank-badge">2</span>
            </div>
            <span class="top-name">{{ topUsers[1]?.name }}</span>
            <span class="top-value">{{ activeTab === 'profit' ? topUsers[1]?.profit : topUsers[1]?.volume }}</span>
          </div>
          <!-- 第一名 -->
          <div class="top-item first">
            <div class="crown">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/>
              </svg>
            </div>
            <div class="top-avatar gold">
              <span>{{ topUsers[0]?.name.charAt(0) }}</span>
              <span class="rank-badge gold">1</span>
            </div>
            <span class="top-name">{{ topUsers[0]?.name }}</span>
            <span class="top-value gold">{{ activeTab === 'profit' ? topUsers[0]?.profit : topUsers[0]?.volume }}</span>
          </div>
          <!-- 第三名 -->
          <div class="top-item third">
            <div class="top-avatar">
              <span>{{ topUsers[2]?.name.charAt(0) }}</span>
              <span class="rank-badge">3</span>
            </div>
            <span class="top-name">{{ topUsers[2]?.name }}</span>
            <span class="top-value">{{ activeTab === 'profit' ? topUsers[2]?.profit : topUsers[2]?.volume }}</span>
          </div>
        </div>
      </div>

      <!-- 排行列表 -->
      <div class="rank-list">
        <div class="list-header">
          <span class="col rank">排名</span>
          <span class="col user">用户</span>
          <span class="col value">{{ activeTab === 'profit' ? '收益率' : '交易额' }}</span>
        </div>
        <div 
          v-for="(user, index) in restUsers" 
          :key="user.id"
          class="rank-item"
        >
          <span class="col rank">{{ index + 4 }}</span>
          <div class="col user">
            <div class="user-avatar">{{ user.name.charAt(0) }}</div>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-trades">{{ user.trades }}笔交易</span>
            </div>
          </div>
          <span class="col value" :class="{ profit: activeTab === 'profit' }">
            {{ activeTab === 'profit' ? user.profit : user.volume }}
          </span>
        </div>
      </div>

      <!-- 我的排名 -->
      <div class="my-rank-section">
        <div class="my-rank-card">
          <div class="my-rank-left">
            <span class="my-rank-label">我的排名</span>
            <span class="my-rank-value">--</span>
          </div>
          <div class="my-rank-right">
            <span class="my-data-label">{{ activeTab === 'profit' ? '我的收益率' : '我的交易额' }}</span>
            <span class="my-data-value">--</span>
          </div>
          <router-link to="/login" class="login-tip">登录查看</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('profit')
const activeTime = ref('week')

const tabs = [
  { key: 'profit', label: '收益榜' },
  { key: 'volume', label: '交易榜' }
]

const timeFilters = [
  { key: 'day', label: '日榜' },
  { key: 'week', label: '周榜' },
  { key: 'month', label: '月榜' },
  { key: 'total', label: '总榜' }
]

const allUsers = ref([
  { id: 1, name: '神秘交易员', profit: '+856.32%', volume: '$12.5M', trades: 1256 },
  { id: 2, name: '币圈大V', profit: '+645.18%', volume: '$8.9M', trades: 986 },
  { id: 3, name: '量化高手', profit: '+523.67%', volume: '$7.2M', trades: 2341 },
  { id: 4, name: '价值投资者', profit: '+412.45%', volume: '$5.8M', trades: 456 },
  { id: 5, name: '趋势猎人', profit: '+389.21%', volume: '$4.5M', trades: 789 },
  { id: 6, name: '稳健收益', profit: '+312.88%', volume: '$3.2M', trades: 234 },
  { id: 7, name: '短线王者', profit: '+298.56%', volume: '$2.8M', trades: 3456 },
  { id: 8, name: '波段操作', profit: '+256.34%', volume: '$2.1M', trades: 567 },
  { id: 9, name: '定投达人', profit: '+198.72%', volume: '$1.5M', trades: 123 },
  { id: 10, name: '新手上路', profit: '+145.23%', volume: '$0.8M', trades: 89 }
])

const topUsers = computed(() => allUsers.value.slice(0, 3))
const restUsers = computed(() => allUsers.value.slice(3))
</script>

<style scoped>
.ranking-page {
  width: 100%;
  max-width: 428px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  overflow-y: auto;
  overflow-x: hidden;
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
  padding-bottom: 100px;
}

.page-content::-webkit-scrollbar { display: none; }

.rank-tabs {
  display: flex;
  margin: 16px;
  padding: 4px;
  background: #1e2329;
  border-radius: 12px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #848e9c;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  color: #0f1317;
}

.time-filter {
  display: flex;
  gap: 8px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.time-btn {
  padding: 6px 14px;
  font-size: 12px;
  color: #5e6673;
  background: rgba(255,255,255,0.04);
  border: 1px solid transparent;
  border-radius: 14px;
  cursor: pointer;
}

.time-btn.active {
  color: #C9A962;
  border-color: rgba(201,169,98,0.3);
  background: rgba(201,169,98,0.1);
}

.top3-section {
  padding: 20px 16px 30px;
  background: linear-gradient(180deg, rgba(201, 169, 98, 0.1) 0%, transparent 100%);
}

.top3-wrap {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
}

.top-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.top-item.first {
  order: 2;
}

.top-item.second {
  order: 1;
}

.top-item.third {
  order: 3;
}

.crown {
  margin-bottom: 4px;
}

.top-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border-radius: 50%;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.top-item.first .top-avatar {
  width: 72px;
  height: 72px;
  font-size: 26px;
}

.top-avatar.gold {
  background: linear-gradient(135deg, #C9A962, #8B7355);
}

.rank-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #C0C0C0, #808080);
  border: 2px solid #181a20;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0f1317;
}

.top-item:nth-child(3) .rank-badge {
  background: linear-gradient(135deg, #CD7F32, #B87333);
}

.top-name {
  font-size: 13px;
  color: #eaecef;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-value {
  font-size: 14px;
  font-weight: 600;
  color: #0ECB81;
  font-family: 'DIN Alternate', monospace;
}

.top-value.gold {
  color: #C9A962;
}

.rank-list {
  margin: 0 16px;
  background: #1e2329;
  border-radius: 16px;
  overflow: hidden;
}

.list-header {
  display: flex;
  padding: 12px 16px;
  font-size: 12px;
  color: #5e6673;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.rank-item:last-child {
  border-bottom: none;
}

.col.rank {
  width: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #848e9c;
}

.col.user {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.col.value {
  width: 80px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #eaecef;
  font-family: 'DIN Alternate', monospace;
}

.col.value.profit {
  color: #0ECB81;
}

.user-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #60A5FA, #3B82F6);
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  color: #eaecef;
}

.user-trades {
  font-size: 11px;
  color: #5e6673;
}

.my-rank-section {
  padding: 20px 16px;
}

.my-rank-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, rgba(201,169,98,0.1), #1e2329);
  border: 1px solid rgba(201,169,98,0.15);
  border-radius: 14px;
  position: relative;
}

.my-rank-left, .my-rank-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.my-rank-label, .my-data-label {
  font-size: 12px;
  color: #5e6673;
}

.my-rank-value, .my-data-value {
  font-size: 18px;
  font-weight: 700;
  color: #eaecef;
}

.login-tip {
  position: absolute;
  right: 16px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #0f1317;
  text-decoration: none;
}
</style>
