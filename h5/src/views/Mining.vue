<template>
  <div class="mining-page">
    <!-- 固定顶部栏 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <h1 class="page-title">质押挖矿</h1>
      <div class="header-actions">
        <button class="header-btn" @click="$router.push('/orders?type=staking')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="page-content">
      <!-- AGX质押总览 -->
      <div class="staking-overview">
        <div class="overview-bg"></div>
        <div class="overview-header">
          <div class="overview-icon">
            <img src="https://web.agx.bi/assets/imgs/im/image.png" alt="AGX">
          </div>
          <div class="overview-info">
            <span class="overview-title">AGX 质押挖矿</span>
            <span class="overview-subtitle">质押 AGX · 赚取收益</span>
          </div>
        </div>
        
        <div class="overview-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalStaked }}</span>
            <span class="stat-label">全网质押</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stakingUsers }}</span>
            <span class="stat-label">质押用户</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ currentAPY }}%</span>
            <span class="stat-label">当前年化</span>
          </div>
        </div>
      </div>

      <!-- 我的AGX -->
      <div class="my-agx-section">
        <div class="section-header">
          <span class="section-title">我的 AGX</span>
          <router-link to="/ieo" class="get-agx-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            获取AGX
          </router-link>
        </div>
        <div class="my-agx-card">
          <div class="agx-row">
            <div class="agx-item">
              <span class="agx-label">可用余额</span>
              <span class="agx-value">{{ availableAGX }} AGX</span>
            </div>
            <div class="agx-item">
              <span class="agx-label">已质押</span>
              <span class="agx-value gold">{{ stakedAGX }} AGX</span>
            </div>
          </div>
          <div class="agx-row">
            <div class="agx-item">
              <span class="agx-label">累计收益</span>
              <span class="agx-value up">+{{ totalEarnings }} AGX</span>
            </div>
            <div class="agx-item">
              <span class="agx-label">昨日收益</span>
              <span class="agx-value up">+{{ yesterdayEarnings }} AGX</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 质押套餐 -->
      <div class="staking-plans">
        <div class="section-header">
          <span class="section-title">质押方案</span>
          <span class="section-desc">选择适合你的质押周期</span>
        </div>
        <div class="plan-list">
          <div v-for="plan in stakingPlans" :key="plan.id" :class="['plan-card', { popular: plan.popular }]">
            <span v-if="plan.popular" class="popular-tag">最受欢迎</span>
            <div class="plan-header">
              <span class="plan-period">{{ plan.period }}</span>
              <span class="plan-apy">{{ plan.apy }}% <small>APY</small></span>
            </div>
            <div class="plan-details">
              <div class="detail-item">
                <span>最低质押</span>
                <span class="value">{{ plan.minStake }} AGX</span>
              </div>
              <div class="detail-item">
                <span>预估日收益</span>
                <span class="value gold">{{ plan.dailyRate }}%</span>
              </div>
              <div class="detail-item">
                <span>赎回方式</span>
                <span class="value">{{ plan.redemption }}</span>
              </div>
            </div>
            <button class="stake-btn" @click="openStakeModal(plan)">
              立即质押
            </button>
          </div>
        </div>
      </div>

      <!-- 我的质押记录 -->
      <div class="my-stakes">
        <div class="section-header">
          <span class="section-title">我的质押</span>
          <router-link to="/orders?type=staking" class="view-all">全部记录 ›</router-link>
        </div>
        <div v-if="myStakes.length === 0" class="empty-stakes">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
          <p>您还没有质押记录</p>
          <span>去 IEO 购买 AGX 后即可质押挖矿</span>
        </div>
        <div v-else class="stakes-list">
          <div v-for="stake in myStakes" :key="stake.id" class="stake-item">
            <div class="stake-info">
              <span class="stake-amount">{{ stake.amount }} AGX</span>
              <span class="stake-period">{{ stake.period }} · {{ stake.apy }}% APY</span>
            </div>
            <div class="stake-right">
              <span class="stake-earnings">+{{ stake.earnings }} AGX</span>
              <span class="stake-status" :class="stake.status">{{ stake.statusText }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 质押说明 -->
      <div class="staking-rules">
        <div class="section-header">
          <span class="section-title">质押说明</span>
        </div>
        <div class="rules-content">
          <div class="rule-item">
            <span class="rule-num">1</span>
            <div class="rule-text">
              <span class="rule-title">获取 AGX</span>
              <span class="rule-desc">在新币发行(IEO)页面认购 AGX 代币</span>
            </div>
          </div>
          <div class="rule-item">
            <span class="rule-num">2</span>
            <div class="rule-text">
              <span class="rule-title">选择方案</span>
              <span class="rule-desc">根据需求选择质押周期，周期越长收益越高</span>
            </div>
          </div>
          <div class="rule-item">
            <span class="rule-num">3</span>
            <div class="rule-text">
              <span class="rule-title">质押挖矿</span>
              <span class="rule-desc">确认质押后自动开始计息，每日发放收益</span>
            </div>
          </div>
          <div class="rule-item">
            <span class="rule-num">4</span>
            <div class="rule-text">
              <span class="rule-title">赎回本金</span>
              <span class="rule-desc">到期后本金自动返回，收益每日发放</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部入口 -->
      <div class="bottom-actions">
        <router-link to="/ieo" class="action-btn primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          去购买 AGX
        </router-link>
        <router-link to="/contract" class="action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l4-4 4 3 7-8"/><path d="M14 8h6v6"/></svg>
          合约交易
        </router-link>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { alert } from '../utils/alert'

const totalStaked = ref('12.5M')
const stakingUsers = ref('8,560')
const currentAPY = ref('85')

const availableAGX = ref('0')
const stakedAGX = ref('0')
const totalEarnings = ref('0')
const yesterdayEarnings = ref('0')

const stakingPlans = ref([
  {
    id: 1,
    period: '7天',
    apy: '45',
    minStake: '100',
    dailyRate: '0.123',
    redemption: '到期自动',
    popular: false
  },
  {
    id: 2,
    period: '30天',
    apy: '65',
    minStake: '500',
    dailyRate: '0.178',
    redemption: '到期自动',
    popular: true
  },
  {
    id: 3,
    period: '90天',
    apy: '85',
    minStake: '1,000',
    dailyRate: '0.233',
    redemption: '到期自动',
    popular: false
  },
  {
    id: 4,
    period: '180天',
    apy: '120',
    minStake: '5,000',
    dailyRate: '0.329',
    redemption: '到期自动',
    popular: false
  }
])

const myStakes = ref([])

const openStakeModal = async (plan) => {
  await alert(`请先登录并持有 AGX 后参与质押`)
}
</script>

<style scoped>
.mining-page {
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
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-right: 12px;
}

.back-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.header-actions { display: flex; gap: 8px; }

.header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
}

.header-btn:active { background: rgba(255, 255, 255, 0.08); }

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

/* 质押总览 */
.staking-overview {
  position: relative;
  padding: 24px 20px;
  background: linear-gradient(165deg, rgba(201, 169, 98, 0.15) 0%, rgba(24, 26, 32, 0.95) 100%);
  border: 1px solid rgba(201, 169, 98, 0.25);
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}

.overview-bg {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  position: relative;
}

.overview-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(201, 169, 98, 0.3);
}

.overview-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overview-info { flex: 1; }

.overview-title {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #eaecef;
  margin-bottom: 4px;
}

.overview-subtitle {
  font-size: 13px;
  color: #C9A962;
}

.overview-stats {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.stat-item {
  text-align: center;
}

.stat-item .stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #C9A962;
  margin-bottom: 6px;
  font-family: 'DIN Alternate', monospace;
}

.stat-item .stat-label {
  font-size: 12px;
  color: #5e6673;
}

/* 我的AGX */
.my-agx-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #eaecef;
}

.section-desc {
  font-size: 12px;
  color: #5e6673;
}

.get-agx-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  color: #0f1317;
  text-decoration: none;
}

.view-all {
  font-size: 13px;
  color: #848e9c;
  text-decoration: none;
}

.my-agx-card {
  background: #1e2329;
  border-radius: 16px;
  padding: 16px;
}

.agx-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.agx-row:last-child {
  margin-bottom: 0;
}

.agx-item {
  flex: 1;
  padding: 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
}

.agx-label {
  display: block;
  font-size: 12px;
  color: #5e6673;
  margin-bottom: 6px;
}

.agx-value {
  font-size: 16px;
  font-weight: 600;
  color: #eaecef;
  font-family: 'DIN Alternate', monospace;
}

.agx-value.gold { color: #C9A962; }
.agx-value.up { color: #0ECB81; }

/* 质押方案 */
.staking-plans {
  margin-bottom: 20px;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-card {
  position: relative;
  padding: 18px;
  background: #1e2329;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  transition: all 0.2s;
}

.plan-card.popular {
  border-color: rgba(201, 169, 98, 0.4);
  background: linear-gradient(165deg, rgba(201, 169, 98, 0.08) 0%, #1e2329 100%);
}

.popular-tag {
  position: absolute;
  top: 0;
  right: 20px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border-radius: 0 0 8px 8px;
  font-size: 10px;
  font-weight: 600;
  color: #0f1317;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.plan-period {
  font-size: 18px;
  font-weight: 700;
  color: #eaecef;
}

.plan-apy {
  font-size: 24px;
  font-weight: 700;
  color: #C9A962;
  font-family: 'DIN Alternate', monospace;
}

.plan-apy small {
  font-size: 12px;
  font-weight: 500;
  color: #848e9c;
}

.plan-details {
  padding: 14px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 14px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #848e9c;
  margin-bottom: 10px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .value {
  color: #eaecef;
}

.detail-item .value.gold {
  color: #C9A962;
}

.stake-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #0f1317;
  cursor: pointer;
}

.stake-btn:active {
  transform: scale(0.98);
}

/* 我的质押 */
.my-stakes {
  margin-bottom: 20px;
}

.empty-stakes {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: #1e2329;
  border-radius: 14px;
  text-align: center;
}

.empty-stakes p {
  font-size: 14px;
  color: #848e9c;
  margin: 16px 0 8px;
}

.empty-stakes span {
  font-size: 12px;
  color: #5e6673;
}

.stakes-list {
  background: #1e2329;
  border-radius: 14px;
}

.stake-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.stake-item:last-child {
  border-bottom: none;
}

.stake-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stake-amount {
  font-size: 15px;
  font-weight: 600;
  color: #eaecef;
}

.stake-period {
  font-size: 12px;
  color: #5e6673;
}

.stake-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.stake-earnings {
  font-size: 14px;
  font-weight: 600;
  color: #0ECB81;
}

.stake-status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
}

.stake-status.active {
  color: #0ECB81;
  background: rgba(14,203,129,0.12);
}

.stake-status.pending {
  color: #F0B90B;
  background: rgba(240,185,11,0.12);
}

/* 质押说明 */
.staking-rules {
  margin-bottom: 20px;
}

.rules-content {
  background: #1e2329;
  border-radius: 14px;
  padding: 16px;
}

.rule-item {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(201,169,98,0.2), rgba(201,169,98,0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #C9A962;
  flex-shrink: 0;
}

.rule-text { flex: 1; }

.rule-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #eaecef;
  margin-bottom: 4px;
}

.rule-desc {
  font-size: 12px;
  color: #5e6673;
  line-height: 1.5;
}

/* 底部操作 */
.bottom-actions {
  display: flex;
  gap: 12px;
  padding-top: 10px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  color: #0f1317;
}

.action-btn:not(.primary) {
  background: rgba(255,255,255,0.06);
  color: #eaecef;
  border: 1px solid rgba(255,255,255,0.1);
}
</style>
