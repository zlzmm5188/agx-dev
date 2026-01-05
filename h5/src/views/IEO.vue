<template>
  <PageLayout :show-back="true" :title="'新币发行'">
    <div class="ieo-container">
      <div class="ieo-header">
        <h2>新币发行</h2>
        <p>参与新币申购，获取早期投资机会</p>
      </div>

      <!-- 发行列表 -->
      <div class="ieo-list">
        <div 
          v-for="issue in issues" 
          :key="issue.id" 
          class="ieo-card"
          @click="selectIssue(issue)"
        >
          <div class="ieo-top">
            <div class="ieo-info">
              <h3>{{ issue.coinSymbol }}</h3>
              <p>{{ issue.coinName }}</p>
            </div>
            <div class="ieo-status" :class="getStatusClass(issue)">
              {{ getStatusText(issue) }}
            </div>
          </div>
          
          <div class="ieo-details">
            <div class="detail-item">
              <span class="label">发行价格</span>
              <span class="value">${{ issue.issuePrice }}</span>
            </div>
            <div class="detail-item">
              <span class="label">发行总量</span>
              <span class="value">{{ issue.issueAmount }}</span>
            </div>
            <div class="detail-item">
              <span class="label">申购进度</span>
              <span class="value">{{ issue.subscribeRate }}%</span>
            </div>
          </div>

          <div class="ieo-timer">
            <div v-if="issue.status === 1" class="time-left">
              距离结束: {{ formatTimeLeft(getTimeLeft(issue.endTime)) }}
            </div>
            <div v-else-if="issue.status === 0" class="time-left">
              距离开始: {{ formatTimeLeft(getTimeLeft(issue.startTime)) }}
            </div>
            <div v-else class="time-ended">
              已结束
            </div>
          </div>
        </div>
      </div>

      <!-- 申购弹窗 -->
      <transition name="slide-up">
        <div class="modal-overlay" v-if="showSubscribeModal">
          <div class="subscribe-modal" @click.stop>
            <div class="modal-header">
              <h3>申购 {{ selectedIssue?.coinSymbol }}</h3>
              <button class="close-btn" @click="showSubscribeModal = false">×</button>
            </div>

            <div class="modal-content">
              <div class="subscribe-info">
                <p class="price">发行价格: ${{ selectedIssue?.issuePrice }}</p>
                <p class="limit">单人限额: {{ selectedIssue?.minBuyAmount }} - {{ selectedIssue?.maxBuyAmount }} {{ selectedIssue?.coinSymbol }}</p>
              </div>

              <div class="form-group">
                <label>申购数量</label>
                <div class="input-group">
                  <input 
                    type="number" 
                    v-model="subscribeAmount" 
                    :placeholder="`最小 ${selectedIssue?.minBuyAmount}, 最大 ${selectedIssue?.maxBuyAmount}`"
                    :min="selectedIssue?.minBuyAmount"
                    :max="selectedIssue?.maxBuyAmount"
                  >
                  <span class="unit">{{ selectedIssue?.coinSymbol }}</span>
                </div>
              </div>

              <div class="amount-info">
                <div class="info-row">
                  <span>支付金额</span>
                  <span>{{ calculatePayAmount() }} USDT</span>
                </div>
                <div class="info-row">
                  <span>可用余额</span>
                  <span>{{ usdtBalance }} USDT</span>
                </div>
              </div>

              <button 
                class="subscribe-btn" 
                :disabled="!canSubscribe"
                @click="confirmSubscribe"
              >
                {{ canSubscribe ? '确认申购' : '申购不可用' }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'
import { api } from '../utils/api'
import { alert } from '../utils/alert'

const issues = ref([])
const showSubscribeModal = ref(false)
const selectedIssue = ref(null)
const subscribeAmount = ref('')
const usdtBalance = ref('0.00')

// 获取发行列表
const loadIssues = async () => {
  try {
    const response = await api.trade.getIssues()
    if (response.success) {
      issues.value = response.data.list.map(issue => ({
        ...issue,
        status: getIssueStatus(issue),
        startTime: new Date(issue.startTime),
        endTime: new Date(issue.endTime),
        lotteryTime: new Date(issue.lotteryTime),
        unlockTime: new Date(issue.unlockTime),
      }))
    }
  } catch (error) {
    console.error('获取发行列表失败:', error)
  }
}

// 获取用户余额
const loadBalance = async () => {
  try {
    const response = await api.account.balance()
    if (response.success) {
      const usdtAsset = response.data.assets.find(asset => asset.asset === 'USDT')
      usdtBalance.value = usdtAsset ? usdtAsset.balance : '0.00'
    }
  } catch (error) {
    console.error('获取余额失败:', error)
  }
}

// 获取发行状态
const getIssueStatus = (issue) => {
  const now = new Date()
  const startTime = new Date(issue.startTime)
  const endTime = new Date(issue.endTime)
  
  if (now < startTime) return 0 // 未开始
  if (now >= startTime && now <= endTime) return 1 // 进行中
  return 2 // 已结束
}

// 获取状态文本
const getStatusText = (issue) => {
  const statusMap = {
    0: '未开始',
    1: '进行中',
    2: '已结束'
  }
  return statusMap[issue.status] || '未知'
}

// 获取状态样式
const getStatusClass = (issue) => {
  const classMap = {
    0: 'status-upcoming',
    1: 'status-ongoing',
    2: 'status-ended'
  }
  return classMap[issue.status] || 'status-unknown'
}

// 获取时间差
const getTimeLeft = (endTime) => {
  const now = new Date()
  const diff = endTime.getTime() - now.getTime()
  return Math.max(0, diff)
}

// 格式化时间差
const formatTimeLeft = (ms) => {
  if (ms <= 0) return '00:00:00'
  
  const seconds = Math.floor(ms / 1000)
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (days > 0) {
    return `${days}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 选择发行项目
const selectIssue = (issue) => {
  if (issue.status !== 1) {
    alert('当前项目不在申购期间')
    return
  }
  
  selectedIssue.value = issue
  showSubscribeModal.value = true
  subscribeAmount.value = ''
}

// 计算支付金额
const calculatePayAmount = () => {
  if (!selectedIssue.value || !subscribeAmount.value) return '0.00'
  const amount = parseFloat(subscribeAmount.value) || 0
  const price = selectedIssue.value.issuePrice
  return (amount * price).toFixed(2)
}

// 检查是否可以申购
const canSubscribe = computed(() => {
  if (!selectedIssue.value || !subscribeAmount.value) return false
  
  const amount = parseFloat(subscribeAmount.value)
  const min = selectedIssue.value.minBuyAmount
  const max = selectedIssue.value.maxBuyAmount
  const payAmount = parseFloat(calculatePayAmount())
  const balance = parseFloat(usdtBalance.value)
  
  return amount >= min && amount <= max && payAmount <= balance
})

// 确认申购
const confirmSubscribe = async () => {
  if (!canSubscribe.value) {
    alert('申购条件不满足')
    return
  }
  
  try {
    const response = await api.trade.subscribeCoin({
      issueId: selectedIssue.value.id,
      buyAmount: parseFloat(subscribeAmount.value)
    })
    
    if (response.success) {
      alert('申购成功！')
      showSubscribeModal.value = false
      subscribeAmount.value = ''
      loadIssues() // 重新加载列表
    } else {
      alert(response.message || '申购失败')
    }
  } catch (error) {
    console.error('申购失败:', error)
    alert('申购失败，请重试')
  }
}

onMounted(() => {
  loadIssues()
  loadBalance()
})
</script>

<style scoped>
.ieo-container {
  padding: 16px;
  min-height: 100vh;
  background: #0B0E11;
}

.ieo-header {
  text-align: center;
  margin-bottom: 24px;
}

.ieo-header h2 {
  color: #EAECEF;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.ieo-header p {
  color: #848E9C;
  font-size: 14px;
}

.ieo-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ieo-card {
  background: #181A20;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #2B3139;
  cursor: pointer;
  transition: all 0.2s;
}

.ieo-card:active {
  opacity: 0.8;
}

.ieo-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.ieo-info h3 {
  color: #EAECEF;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.ieo-info p {
  color: #848E9C;
  font-size: 12px;
  margin: 0;
}

.ieo-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.ieo-status.status-ongoing {
  background: rgba(14, 203, 129, 0.15);
  color: #0ECB81;
}

.ieo-status.status-upcoming {
  background: rgba(240, 185, 11, 0.15);
  color: #F0B90B;
}

.ieo-status.status-ended {
  background: rgba(246, 70, 93, 0.15);
  color: #F6465D;
}

.ieo-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.detail-item {
  text-align: center;
}

.detail-item .label {
  display: block;
  color: #848E9C;
  font-size: 11px;
  margin-bottom: 4px;
}

.detail-item .value {
  display: block;
  color: #EAECEF;
  font-size: 14px;
  font-weight: 600;
}

.ieo-timer {
  padding-top: 12px;
  border-top: 1px solid #2B3139;
}

.time-left {
  color: #0ECB81;
  font-size: 12px;
  font-weight: 500;
}

.time-ended {
  color: #848E9C;
  font-size: 12px;
}

/* 申购弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.subscribe-modal {
  width: 100%;
  max-width: 428px;
  background: #181A20;
  border-radius: 20px 20px 0 0;
  padding: 24px 16px 16px;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #2B3139;
}

.modal-header h3 {
  color: #EAECEF;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #848E9C;
  font-size: 24px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
}

.subscribe-info {
  margin-bottom: 20px;
}

.subscribe-info .price {
  color: #EAECEF;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.subscribe-info .limit {
  color: #848E9C;
  font-size: 12px;
  margin: 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  color: #EAECEF;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 12px 60px 12px 16px;
  background: #0B0E11;
  border: 1px solid #2B3139;
  border-radius: 8px;
  color: #EAECEF;
  font-size: 14px;
  outline: none;
}

.input-group input:focus {
  border-color: #F0B90B;
}

.input-group .unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #848E9C;
  font-size: 12px;
  pointer-events: none;
}

.amount-info {
  background: #0B0E11;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}

.info-row:first-child {
  color: #EAECEF;
  font-weight: 500;
}

.info-row:last-child {
  color: #848E9C;
  border-top: 1px solid #2B3139;
  padding-top: 8px;
  margin-top: 8px;
}

.subscribe-btn {
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

.subscribe-btn:disabled {
  background: #2B3139;
  color: #848E9C;
  cursor: not-allowed;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>