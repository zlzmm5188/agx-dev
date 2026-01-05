<template>
  <PageLayout :show-nav="true" :nav-title="'新币发行'" :show-back="true">
    <div class="ieo-page">
      <div class="ieo-list">
        <div 
          class="ieo-item" 
          v-for="issue in issues" 
          :key="issue.id"
          @click="viewDetail(issue)"
        >
          <div class="ieo-header">
            <div class="coin-info">
              <h3>{{ issue.coinSymbol }}</h3>
              <p>{{ issue.coinName }}</p>
            </div>
            <span class="status" :class="statusClass(issue.status)">
              {{ statusText(issue.status) }}
            </span>
          </div>
          
          <div class="ieo-details">
            <div class="detail-row">
              <span>发行价格</span>
              <span>{{ formatPrice(issue.issuePrice) }} USDT</span>
            </div>
            <div class="detail-row">
              <span>发行总量</span>
              <span>{{ formatBalance(issue.issueAmount) }}</span>
            </div>
            <div class="detail-row">
              <span>申购时间</span>
              <span>{{ formatDate(issue.startTime) }} - {{ formatDate(issue.endTime) }}</span>
            </div>
            <div class="detail-row">
              <span>开奖时间</span>
              <span>{{ formatDate(issue.lotteryTime) }}</span>
            </div>
          </div>
          
          <div class="progress-bar">
            <div 
              class="progress" 
              :style="{ width: calculateProgress(issue) + '%' }"
            ></div>
          </div>
          
          <div class="progress-text">
            <span>已申购: {{ formatBalance(issue.totalSubscribed) }} / {{ formatBalance(issue.issueAmount) }}</span>
            <span>{{ calculateProgress(issue).toFixed(2) }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 申购弹窗 -->
      <div class="modal" v-if="showSubscribeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>申购 {{ currentIssue?.coinSymbol }}</h3>
            <span class="close" @click="showSubscribeModal = false">&times;</span>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>申购数量</label>
              <input 
                v-model="subscribeAmount" 
                type="number" 
                :placeholder="`最小: ${currentIssue?.minBuyAmount}, 最大: ${currentIssue?.maxBuyAmount}`"
              />
            </div>
            <div class="form-group">
              <label>预计支付</label>
              <input 
                :value="estimatedPayment" 
                readonly
              />
            </div>
            <button 
              class="subscribe-btn" 
              @click="confirmSubscribe"
              :disabled="!canSubscribe"
            >
              确认申购
            </button>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/utils/api';
import PageLayout from '@/components/layout/PageLayout.vue';

const router = useRouter();
const issues = ref([]);
const showSubscribeModal = ref(false);
const currentIssue = ref(null);
const subscribeAmount = ref('');

// 获取新币发行列表
const loadIssues = async () => {
  try {
    const response = await api.trade.getCoinIssues();
    if (response.success) {
      issues.value = response.data.list || [];
    }
  } catch (error) {
    console.error('获取新币发行列表失败:', error);
  }
};

// 状态文本
const statusText = (status) => {
  const texts = {
    0: '未开始',
    1: '进行中',
    2: '已结束',
    3: '已开奖'
  };
  return texts[status] || '未知';
};

// 状态样式
const statusClass = (status) => {
  const classes = {
    0: 'status-upcoming',
    1: 'status-active',
    2: 'status-ended',
    3: 'status-lottery'
  };
  return classes[status] || '';
};

// 计算进度
const calculateProgress = (issue) => {
  if (!issue.issueAmount || issue.issueAmount <= 0) return 0;
  return (issue.totalSubscribed / issue.issueAmount) * 100;
};

// 格式化函数
const formatPrice = (value) => {
  return parseFloat(value).toFixed(4);
};

const formatBalance = (value) => {
  return parseFloat(value).toFixed(2);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString();
};

// 预计支付金额
const estimatedPayment = computed(() => {
  if (!currentIssue.value || !subscribeAmount.value) return '0.00';
  return (parseFloat(subscribeAmount.value) * currentIssue.value.issuePrice).toFixed(2);
});

// 是否可以申购
const canSubscribe = computed(() => {
  if (!currentIssue.value || !subscribeAmount.value) return false;
  const amount = parseFloat(subscribeAmount.value);
  return amount >= currentIssue.value.minBuyAmount && 
         amount <= currentIssue.value.maxBuyAmount;
});

// 查看详情
const viewDetail = (issue) => {
  currentIssue.value = issue;
  if (issue.status === 1) { // 进行中，显示申购弹窗
    showSubscribeModal.value = true;
  } else {
    // 其他状态跳转到详情页
    router.push(`/trade/ieo/${issue.id}`);
  }
};

// 确认申购
const confirmSubscribe = async () => {
  if (!canSubscribe.value) return;

  try {
    const response = await api.trade.subscribeCoin({
      issueId: currentIssue.value.id,
      buyAmount: parseFloat(subscribeAmount.value)
    });

    if (response.success) {
      alert('申购成功');
      showSubscribeModal.value = false;
      subscribeAmount.value = '';
      loadIssues(); // 重新加载列表
    } else {
      alert(response.message || '申购失败');
    }
  } catch (error) {
    console.error('申购失败:', error);
    alert(error.message || '申购失败');
  }
};

onMounted(() => {
  loadIssues();
});
</script>

<style scoped>
.ieo-page {
  padding: 16px;
  background: var(--bg-primary, #0B0E11);
  min-height: 100vh;
  color: var(--text-primary, #FFFFFF);
}

.ieo-item {
  background: var(--bg-secondary, #181A20);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
}

.ieo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.coin-info h3 {
  margin: 0 0 4px 0;
  color: var(--text-primary, #FFFFFF);
}

.coin-info p {
  margin: 0;
  color: var(--text-secondary, #8E929A);
  font-size: 14px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-upcoming {
  background: var(--bg-warning-light, #292200);
  color: var(--color-warning, #FF7D00);
}

.status-active {
  background: var(--bg-success-light, #002914);
  color: var(--color-success, #00B42A);
}

.status-ended {
  background: var(--bg-tertiary, #2A2D37);
  color: var(--text-secondary, #8E929A);
}

.status-lottery {
  background: var(--bg-primary, #0B0E11);
  color: var(--color-primary, #4080FF);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-secondary, #8E929A);
}

.progress-bar {
  height: 6px;
  background: var(--bg-tertiary, #2A2D37);
  border-radius: 3px;
  overflow: hidden;
  margin: 12px 0;
}

.progress {
  height: 100%;
  background: var(--color-success, #00B42A);
  transition: width 0.3s;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary, #8E929A);
}

/* 申购弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-secondary, #181A20);
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color, #2A2D37);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary, #FFFFFF);
}

.close {
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary, #8E929A);
}

.modal-body {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary, #8E929A);
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: var(--bg-tertiary, #2A2D37);
  border: 1px solid var(--border-color, #2A2D37);
  border-radius: 6px;
  color: var(--text-primary, #FFFFFF);
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary, #4080FF);
}

.subscribe-btn {
  width: 100%;
  padding: 14px;
  background: var(--color-success, #00B42A);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.subscribe-btn:disabled {
  background: var(--bg-tertiary, #2A2D37);
  color: var(--text-secondary, #8E929A);
  cursor: not-allowed;
}
</style>
