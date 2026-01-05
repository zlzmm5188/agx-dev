<template>
  <div class="ieo-page">
    <!-- 固定顶部栏 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <div class="header-center">
        <span class="page-title">新币发行</span>
      </div>
      <button class="header-btn" @click="showHelp = true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <div class="page-content">
    <!-- 顶部背景 -->
    <div class="ieo-bg">
      <div class="bg-glow"></div>
      <div class="bg-grid"></div>
      <!-- 高端金币视觉 -->
      <div class="gold-coins-scene">
        <div class="gold-coin coin-1">
          <div class="coin-face front"></div>
          <div class="coin-face back"></div>
          <div class="coin-edge"></div>
        </div>
        <div class="gold-coin coin-2">
          <div class="coin-face front"></div>
          <div class="coin-face back"></div>
          <div class="coin-edge"></div>
        </div>
        <div class="gold-coin coin-3">
          <div class="coin-face front"></div>
          <div class="coin-face back"></div>
          <div class="coin-edge"></div>
        </div>
        <div class="ambient-light"></div>
      </div>
    </div>

    <!-- 当前项目 -->
    <div class="ieo-featured">
      <div class="ieo-card active">
        <!-- 卡片光效 -->
        <div class="card-shine"></div>
        
        <div class="ieo-header">
          <div class="ieo-icon-wrap">
            <img src="https://web.agx.bi/assets/imgs/im/image.png" class="ieo-icon" alt="AGX">
            <span class="icon-pulse"></span>
          </div>
          <div class="ieo-info">
            <span class="ieo-name">AGX 升达金指币</span>
            <span class="ieo-pair">AGX/USDT</span>
          </div>
          <span class="ieo-status">
            <span class="status-dot"></span>
            即将开启
          </span>
        </div>

        <!-- 项目亮点 -->
        <div class="ieo-highlights">
          <span class="highlight-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"/></svg>黄金背书</span>
          <span class="highlight-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>安全审计</span>
          <span class="highlight-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>首发限量</span>
        </div>
        
        <div class="ieo-countdown">
          <span class="cd-label">距离开始</span>
          <div class="cd-time">
            <div class="cd-block">
              <span class="cd-num">{{ countdown.days }}</span>
              <span class="cd-unit">天</span>
            </div>
            <span class="cd-sep">:</span>
            <div class="cd-block">
              <span class="cd-num">{{ countdown.hours }}</span>
              <span class="cd-unit">时</span>
            </div>
            <span class="cd-sep">:</span>
            <div class="cd-block">
              <span class="cd-num">{{ countdown.mins }}</span>
              <span class="cd-unit">分</span>
            </div>
            <span class="cd-sep">:</span>
            <div class="cd-block">
              <span class="cd-num">{{ countdown.secs }}</span>
              <span class="cd-unit">秒</span>
            </div>
          </div>
        </div>

        <!-- 募资进度 -->
        <div class="ieo-progress">
          <div class="progress-header">
            <span>预约进度</span>
            <span class="progress-percent">68.5%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 68.5%"></div>
            <div class="progress-glow"></div>
          </div>
          <div class="progress-info">
            <span>68,500,000 / 100,000,000 AGX</span>
          </div>
        </div>

        <div class="ieo-details">
          <div class="ieo-row">
            <span>发行价格</span>
            <span class="value highlight">$0.10</span>
          </div>
          <div class="ieo-row">
            <span>发行总量</span>
            <span class="value">100,000,000 AGX</span>
          </div>
          <div class="ieo-row">
            <span>个人限额</span>
            <span class="value">1,000 - 50,000 USDT</span>
          </div>
          <div class="ieo-row">
            <span>解锁规则</span>
            <span class="value">TGE 20%, 线性解锁 6 个月</span>
          </div>
        </div>

        <button class="ieo-btn" disabled>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          敬请期待
        </button>
        
        <!-- 项目链接 -->
        <div class="ieo-links">
          <a href="#" class="ieo-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
            白皮书
          </a>
          <a href="#" class="ieo-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            官网
          </a>
          <a href="#" class="ieo-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
            Twitter
          </a>
          <a href="#" class="ieo-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            Telegram
          </a>
        </div>
      </div>
    </div>
    
    <!-- 项目介绍 -->
    <div class="ieo-intro">
      <div class="section-head">
        <span>项目介绍</span>
      </div>
      <div class="intro-content">
        <p>AGX（升达金指币）是一个基于区块链技术的黄金资产数字化平台。每一枚 AGX 代币都有等值的实物黄金作为背书，存放于第三方托管机构。</p>
        <div class="intro-features">
          <div class="intro-feature">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="feature-text">
              <span class="feature-title">实物黄金背书</span>
              <span class="feature-desc">1 AGX = 0.1克黄金</span>
            </div>
          </div>
          <div class="intro-feature">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="feature-text">
              <span class="feature-title">安全审计</span>
              <span class="feature-desc">通过CertiK安全审计</span>
            </div>
          </div>
          <div class="intro-feature">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="feature-text">
              <span class="feature-title">线性解锁</span>
              <span class="feature-desc">6个月平稳释放</span>
            </div>
          </div>
          <div class="intro-feature">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div class="feature-text">
              <span class="feature-title">全球团队</span>
              <span class="feature-desc">来自多国的专业团队</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AGX生态功能介绍 -->
    <div class="agx-ecosystem">
      <div class="section-head">
        <span>AGX生态功能</span>
        <span class="section-badge">一站式黄金资产管理</span>
      </div>
      
      <!-- 黄金资产数字化 -->
      <div class="ecosystem-card gold-card">
        <div class="card-header">
          <div class="card-icon gold-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="card-title">
            <h3>拥有真实黄金</h3>
            <p>1 AGX = 0.1克实物黄金储备</p>
          </div>
        </div>
        <div class="card-content">
          <div class="feature-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/>
            </svg>
            <span>持有AGX即拥有对应克重的实物黄金所有权</span>
          </div>
          <div class="feature-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
            </svg>
            <span>第三方权威机构托管，安全可查询</span>
          </div>
          <div class="feature-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/>
            </svg>
            <span>支持线上兑换实物黄金（满100克起）</span>
          </div>
        </div>
      </div>

      <!-- 黄金秒合约 -->
      <div class="ecosystem-card contract-card">
        <div class="card-header">
          <div class="card-icon contract-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="card-title">
            <h3>黄金秒合约交易</h3>
            <p>超短线黄金价格合约</p>
          </div>
        </div>
        <div class="card-content">
          <div class="feature-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>30秒-5分钟超短线黄金价格预测</span>
          </div>
          <div class="feature-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 1v6m0 6v6m6-12h-6m-6 0h6"/>
            </svg>
            <span>预测正确可获得85%-95%收益</span>
          </div>
          <div class="feature-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="21" cy="12" r="1"/>
            </svg>
            <span>使用AGX作为合约保证金享受0手续费</span>
          </div>
        </div>
      </div>

      <!-- 质押挖矿 -->
      <div class="ecosystem-card mining-card">
        <div class="card-header">
          <div class="card-icon mining-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14,2 14,8 20,8" fill="none" stroke="#fff" stroke-width="2"/>
              <line x1="16" y1="13" x2="8" y2="13" fill="none" stroke="#fff" stroke-width="2"/>
              <line x1="16" y1="17" x2="8" y2="17" fill="none" stroke="#fff" stroke-width="2"/>
              <polyline points="10,9 9,9 8,9" fill="none" stroke="#fff" stroke-width="2"/>
            </svg>
          </div>
          <div class="card-title">
            <h3>质押挖黄金</h3>
            <p>质押AGX获得实物黄金收益</p>
          </div>
        </div>
        <div class="card-content">
          <div class="staking-pools">
            <div class="pool-item">
              <div class="pool-info">
                <span class="pool-name">30天锁仓池</span>
                <span class="pool-apy">年化 12%</span>
              </div>
              <div class="pool-reward">奖励: 黄金积分</div>
            </div>
            <div class="pool-item">
              <div class="pool-info">
                <span class="pool-name">90天锁仓池</span>
                <span class="pool-apy">年化 18%</span>
              </div>
              <div class="pool-reward">奖励: 实物黄金</div>
            </div>
            <div class="pool-item">
              <div class="pool-info">
                <span class="pool-name">365天锁仓池</span>
                <span class="pool-apy">年化 25%</span>
              </div>
              <div class="pool-reward">奖励: AGX+黄金</div>
            </div>
          </div>
          <div class="mining-features">
            <div class="feature-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/>
              </svg>
              <span>锁仓期满自动释放本金+收益</span>
            </div>
            <div class="feature-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/>
              </svg>
              <span>智能合约保证，无人为干预风险</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 认购规则 -->
    <div class="ieo-rules">
      <div class="section-head">
        <span>认购规则</span>
      </div>
      <div class="rules-list">
        <div class="rule-item">
          <span class="rule-num">1</span>
          <div class="rule-content">
            <span class="rule-title">完成KYC认证</span>
            <span class="rule-desc">参与认购需完成Lv2身份认证</span>
          </div>
        </div>
        <div class="rule-item">
          <span class="rule-num">2</span>
          <div class="rule-content">
            <span class="rule-title">账户余额要求</span>
            <span class="rule-desc">现货账户持有不少于100 USDT</span>
          </div>
        </div>
        <div class="rule-item">
          <span class="rule-num">3</span>
          <div class="rule-content">
            <span class="rule-title">认购时间</span>
            <span class="rule-desc">开放后24小时内可认购，先到先得</span>
          </div>
        </div>
        <div class="rule-item">
          <span class="rule-num">4</span>
          <div class="rule-content">
            <span class="rule-title">代币发放</span>
            <span class="rule-desc">TGE后7天内发放首批代币</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 我的参与记录 -->
    <div class="ieo-my-records">
      <div class="section-head">
        <span>我的参与</span>
        <router-link to="/orders?type=ieo" class="view-all">全部记录</router-link>
      </div>
      <div class="empty-records">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
        <p>您还未参与任何项目</p>
        <span>完成认证后可参与认购</span>
      </div>
    </div>

    <!-- 往期项目 -->
    <div class="ieo-history">
      <div class="section-head">
        <span>往期项目</span>
        <span class="section-badge">{{ historyList.length }} 个项目</span>
      </div>
      <div class="ieo-list">
        <div class="ieo-item" v-for="item in historyList" :key="item.name">
          <div class="item-rank" :class="item.roi >= 500 ? 'hot' : ''">{{ item.roi >= 500 ? '🔥' : '' }}</div>
          <img :src="item.icon" class="item-icon" :alt="item.name">
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-date">{{ item.date }}</span>
          </div>
          <div class="item-chart">
            <svg viewBox="0 0 40 20" class="mini-chart">
              <path :d="getChartPath(item.roi)" fill="none" stroke="var(--color-up)" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="item-result">
            <span class="item-raise">{{ item.raised }}</span>
            <span class="item-roi" :class="item.roi > 0 ? 'up' : 'down'">{{ item.roi > 0 ? '+' : '' }}{{ item.roi }}%</span>
          </div>
        </div>
      </div>
    </div>

    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const countdown = ref({ days: '29', hours: '23', mins: '45', secs: '12' })
let countdownTimer = null

const updateCountdown = () => {
  const target = new Date('2026-01-12T00:00:00').getTime()
  const now = Date.now()
  const diff = target - now
  
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const secs = Math.floor((diff % (1000 * 60)) / 1000)
    
    countdown.value = {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0')
    }
  }
}

// 生成迷你图表路径
const getChartPath = (roi) => {
  const points = []
  let y = 15
  for (let i = 0; i <= 8; i++) {
    y = Math.max(3, Math.min(17, y + (Math.random() - 0.3) * 4))
    points.push(`${i * 5},${y}`)
  }
  return `M${points.join(' L')}`
}

onMounted(() => {
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const historyList = ref([
  { name: 'PEPE', icon: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg', date: '2024-12-15', raised: '500万 USDT', roi: 850 },
  { name: 'WIF', icon: 'https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg', date: '2024-11-20', raised: '300万 USDT', roi: 420 },
  { name: 'BONK', icon: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg', date: '2024-10-08', raised: '200万 USDT', roi: 180 },
  { name: 'SHIB', icon: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png', date: '2024-09-05', raised: '800万 USDT', roi: 320 }
])
</script>

<style scoped>
/* 页面容器 */
.ieo-page {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
  -webkit-tap-highlight-color: transparent;
}

/* 固定顶部栏 */
.page-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(18, 20, 24, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  border: none;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.page-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  border: none;
}

/* 可滚动内容区 */
.page-content {
  position: relative;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

/* 隐藏滚动条 */
.page-content::-webkit-scrollbar {
  display: none;
}

.page-content {
  scrollbar-width: none;
}

/* 顶部背景 */
.ieo-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 350px;
  overflow: hidden;
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.05) 40%, transparent 70%);
  filter: blur(60px);
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 250px;
  background: 
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  mask: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%);
  -webkit-mask: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%);
}

/* 高端金币场景 - 私人银行风格 */
.gold-coins-scene {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 160px;
  perspective: 1000px;
  perspective-origin: 50% 50%;
}

.gold-coin {
  position: absolute;
  width: 72px;
  height: 72px;
  transform-style: preserve-3d;
}

.coin-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  backface-visibility: hidden;
}

.coin-face.front {
  background: 
    radial-gradient(ellipse 60% 40% at 35% 30%, rgba(255,248,220,0.4) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 50% 50%, #B8A060 0%, #8B7345 50%, #6B5530 100%);
  box-shadow: 
    inset 0 -2px 8px rgba(0,0,0,0.4),
    inset 0 2px 4px rgba(255,248,220,0.2),
    0 0 1px rgba(139, 115, 69, 0.8);
}

.coin-face.back {
  background: 
    radial-gradient(ellipse 60% 40% at 65% 70%, rgba(255,248,220,0.2) 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 50% 50%, #9A8858 0%, #7A6840 50%, #5A4828 100%);
  transform: rotateY(180deg);
  box-shadow: 
    inset 0 2px 8px rgba(0,0,0,0.5),
    inset 0 -2px 4px rgba(255,248,220,0.1);
}

.coin-edge {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(90deg, #6B5530 0%, #8B7345 50%, #6B5530 100%);
  transform: translateZ(-3px);
  box-shadow: 0 0 8px rgba(0,0,0,0.5);
}

/* 第一枚金币 - 主体 */
.coin-1 {
  left: 50%;
  top: 30%;
  margin-left: -36px;
  animation: coinFloat1 8s ease-in-out infinite;
}

@keyframes coinFloat1 {
  0%, 100% { 
    transform: rotateX(15deg) rotateY(0deg) translateY(0px);
  }
  50% { 
    transform: rotateX(15deg) rotateY(12deg) translateY(-6px);
  }
}

/* 第二枚金币 - 左后 */
.coin-2 {
  left: 15%;
  top: 45%;
  width: 56px;
  height: 56px;
  opacity: 0.7;
  animation: coinFloat2 10s ease-in-out infinite;
}

@keyframes coinFloat2 {
  0%, 100% { 
    transform: rotateX(25deg) rotateY(-15deg) translateY(0px);
  }
  50% { 
    transform: rotateX(25deg) rotateY(-5deg) translateY(-4px);
  }
}

/* 第三枚金币 - 右后 */
.coin-3 {
  right: 15%;
  top: 50%;
  width: 48px;
  height: 48px;
  opacity: 0.5;
  animation: coinFloat3 12s ease-in-out infinite;
}

@keyframes coinFloat3 {
  0%, 100% { 
    transform: rotateX(30deg) rotateY(20deg) translateY(0px);
  }
  50% { 
    transform: rotateX(30deg) rotateY(10deg) translateY(-3px);
  }
}

/* 环境光 - 电影级光效 */
.ambient-light {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 100px;
  background: radial-gradient(ellipse, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
  filter: blur(25px);
  animation: ambientPulse 6s ease-in-out infinite;
}

@keyframes ambientPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.ieo-featured {
  position: relative;
  padding: 16px;
}

.ieo-card {
  position: relative;
  background: linear-gradient(165deg, rgba(24, 26, 31, 0.98) 0%, rgba(14, 16, 19, 0.99) 100%);
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: 20px;
  padding: 24px 16px;
  overflow: hidden;
  box-shadow: 
    0 0 0 1px rgba(201, 169, 98, 0.05),
    0 8px 32px rgba(0,0,0,0.4),
    0 0 60px rgba(201, 169, 98, 0.08);
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(201, 169, 98, 0.1) 50%, transparent 100%);
  animation: shine 4s ease-in-out infinite;
}

@keyframes shine {
  0% { left: -100%; }
  40%, 100% { left: 100%; }
}

.ieo-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.ieo-icon-wrap {
  position: relative;
}

.ieo-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #D4B872, #8B7355);
  box-shadow: 
    0 4px 24px rgba(201, 169, 98, 0.35),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

.icon-pulse {
  position: absolute;
  inset: -5px;
  border: 2px solid rgba(201, 169, 98, 0.25);
  border-radius: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.08); }
}

.ieo-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ieo-name {
  font-size: 19px;
  font-weight: 700;
  color: var(--text-primary);
}

.ieo-pair {
  font-size: 13px;
  color: var(--text-tertiary);
}

.ieo-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-brand);
  background: rgba(201, 169, 98, 0.1);
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: 20px;
}

.status-dot {
  width: 7px;
  height: 7px;
  background: var(--color-brand);
  border-radius: 50%;
  animation: blink 1.5s infinite;
  box-shadow: 0 0 8px rgba(201, 169, 98, 0.5);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* 项目亮点 */
.ieo-highlights {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}

.highlight-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-brand);
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.1) 0%, rgba(201, 169, 98, 0.05) 100%);
  border: 1px solid rgba(201, 169, 98, 0.15);
  border-radius: 10px;
}

.highlight-tag svg {
  opacity: 0.8;
}

.ieo-countdown {
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 100%);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 16px;
  margin-bottom: 22px;
}

.cd-label {
  font-size: 13px;
  color: var(--text-tertiary);
  display: block;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.cd-time {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.cd-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.cd-num {
  width: 56px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  background: #15171a;
  border: 1px solid rgba(201, 169, 98, 0.25);
  border-radius: 12px;
  color: var(--color-brand);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 16px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

.cd-num::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%);
  pointer-events: none;
}

.cd-num::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(0,0,0,0.6) 10%,
    rgba(0,0,0,0.6) 90%,
    transparent 100%);
  transform: translateY(-50%);
}

.cd-unit {
  font-size: 11px;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.cd-sep {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-brand);
  margin-bottom: 24px;
  animation: sepBlink 1s ease-in-out infinite;
}

@keyframes sepBlink {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.3; }
}

/* 募资进度 */
.ieo-progress {
  margin-bottom: 22px;
  padding: 18px;
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.08) 0%, rgba(201, 169, 98, 0.03) 100%);
  border-radius: 14px;
  border: 1px solid rgba(201, 169, 98, 0.12);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--text-tertiary);
}

.progress-percent {
  color: var(--color-brand);
  font-weight: 700;
  font-size: 15px;
  font-family: var(--font-mono);
}

.progress-bar {
  position: relative;
  height: 10px;
  background: rgba(255,255,255,0.06);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand-dark) 0%, var(--color-brand) 50%, var(--color-brand-light) 100%);
  border-radius: 5px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%);
}

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5));
  animation: progressGlow 2s infinite;
}

@keyframes progressGlow {
  0%, 100% { opacity: 0; transform: translateX(-20px); }
  50% { opacity: 1; transform: translateX(0); }
}

.progress-info {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: center;
  font-family: var(--font-mono);
}

.ieo-details {
  margin-bottom: 24px;
  padding: 4px 0;
}

.ieo-row {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  font-size: 14px;
  color: var(--text-tertiary);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.ieo-row:last-child {
  border-bottom: none;
}

.ieo-row .value {
  color: var(--text-secondary);
  font-weight: 500;
}

.ieo-row .value.highlight {
  color: var(--color-brand);
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-mono);
}

.ieo-btn {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(201, 169, 98, 0.12);
  color: var(--text-tertiary);
  font-size: 16px;
  font-weight: 600;
  border-radius: 14px;
  border: 1px solid rgba(201, 169, 98, 0.2);
  transition: all 0.15s ease;
}

.ieo-btn:not(:disabled) {
  background: linear-gradient(135deg, #D4B872 0%, #A08050 100%);
  color: #0B0E11;
  border: none;
  box-shadow: 0 4px 16px rgba(201, 169, 98, 0.3);
}

.ieo-btn:not(:disabled):active {
  transform: scale(0.98);
}

.ieo-history {
  padding: 28px 16px 0;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-head span:first-child {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
}

.section-badge {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary);
  padding: 5px 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
}

.ieo-list {
  background: linear-gradient(180deg, #1a1c20 0%, #14161a 100%);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 16px;
  overflow: hidden;
}

.ieo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.15s ease;
}

.ieo-item:active {
  background: rgba(255,255,255,0.02);
}

.ieo-item:last-child {
  border-bottom: none;
}

.item-rank {
  width: 24px;
  font-size: 14px;
  text-align: center;
}

.item-rank.hot {
  animation: hotPulse 1s infinite;
}

@keyframes hotPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-input);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.item-date {
  font-size: 12px;
  color: var(--text-tertiary);
}

.item-chart {
  width: 48px;
  height: 24px;
}

.mini-chart {
  width: 100%;
  height: 100%;
}

.item-result {
  text-align: right;
  min-width: 80px;
}

.item-raise {
  display: block;
  font-size: 12px;
  color: var(--text-tertiary);
  margin-bottom: 3px;
}

.item-roi {
  font-size: 16px;
  font-weight: 700;
  font-family: var(--font-mono);
}

.item-roi.up { color: var(--color-up); }
.item-roi.down { color: var(--color-down); }


/* 项目链接 */
.ieo-links {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.ieo-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 12px;
  color: var(--text-tertiary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.ieo-link:active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-brand);
}

/* 项目介绍 */
.ieo-intro {
  padding: 0 16px;
  margin-bottom: 24px;
}

.intro-content {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
}

.intro-content p {
  margin: 0 0 20px 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.intro-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.intro-feature {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.intro-feature .feature-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201, 169, 98, 0.1);
  border-radius: 10px;
  color: var(--color-brand);
  flex-shrink: 0;
}

.intro-feature .feature-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.intro-feature .feature-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.intro-feature .feature-desc {
  font-size: 11px;
  color: var(--text-tertiary);
}

/* 认购规则 */
.ieo-rules {
  padding: 0 16px;
  margin-bottom: 24px;
}

.rules-list {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);
  color: #0B0E11;
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
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
  color: var(--text-primary);
}

.rule-desc {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 我的参与记录 */
.ieo-my-records {
  padding: 0 16px;
  margin-bottom: 24px;
}

.view-all {
  font-size: 13px;
  color: var(--color-brand);
  text-decoration: none;
}

.empty-records {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-card);
  border-radius: 16px;
}

.empty-records p {
  margin: 16px 0 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.empty-records span {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* AGX生态功能样式 */
.agx-ecosystem {
  margin: 20px 16px;
}

.ecosystem-card {
  background: linear-gradient(135deg, rgba(31, 35, 42, 0.8), rgba(24, 26, 32, 0.9));
  border: 1px solid rgba(201, 169, 98, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.ecosystem-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #C9A962, #F0B90B, #C9A962);
  opacity: 0.6;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  position: relative;
}

.gold-icon {
  background: linear-gradient(135deg, rgba(240, 185, 11, 0.2), rgba(201, 169, 98, 0.2));
  color: #F0B90B;
}

.contract-icon {
  background: linear-gradient(135deg, rgba(14, 203, 129, 0.2), rgba(76, 175, 80, 0.2));
  color: #0ECB81;
}

.mining-icon {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  color: #6366F1;
}

.card-title h3 {
  color: #EAECEF;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
}

.card-title p {
  color: #848E9C;
  font-size: 12px;
  margin: 0;
}

.card-content {
  color: #B7BDC6;
}

.feature-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
  line-height: 1.4;
}

.feature-row svg {
  margin-right: 12px;
  color: #C9A962;
  flex-shrink: 0;
}

.staking-pools {
  margin-bottom: 16px;
}

.pool-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  margin-bottom: 8px;
}

.pool-info {
  display: flex;
  flex-direction: column;
}

.pool-name {
  font-size: 14px;
  color: #EAECEF;
  font-weight: 500;
}

.pool-apy {
  font-size: 12px;
  color: #0ECB81;
  font-weight: 600;
}

.pool-reward {
  font-size: 11px;
  color: #848E9C;
  background: rgba(201, 169, 98, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.mining-features {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
}

.section-badge {
  background: linear-gradient(135deg, rgba(201, 169, 98, 0.2), rgba(240, 185, 11, 0.2));
  color: #F0B90B;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}
</style>
