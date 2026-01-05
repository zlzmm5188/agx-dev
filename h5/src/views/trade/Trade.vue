<template>
  <PageLayout :show-nav="true" :nav-title="symbol" :show-back="true">
    <div class="trade-page">
      <!-- 交易对选择 -->
      <div class="symbol-selector">
        <div class="symbol-info">
          <h2>{{ symbol }}</h2>
          <p class="price">{{ formatPrice(currentPrice) }}</p>
          <p class="change" :class="changeClass">{{ changePercent }}%</p>
        </div>
      </div>

      <!-- 价格图表 -->
      <div class="chart-container">
        <div class="chart-placeholder">
          <p>价格图表区域</p>
          <!-- 这里将集成K线图组件 -->
        </div>
      </div>

      <!-- 订单类型切换 -->
      <div class="order-type-tabs">
        <div 
          class="tab" 
          :class="{ active: orderType === 'limit' }"
          @click="orderType = 'limit'"
        >
          限价单
        </div>
        <div 
          class="tab" 
          :class="{ active: orderType === 'market' }"
          @click="orderType = 'market'"
        >
          市价单
        </div>
      </div>

      <!-- 买入/卖出表单 -->
      <div class="trade-form">
        <div class="form-row">
          <label>方向</label>
          <div class="side-buttons">
            <button 
              class="side-btn buy" 
              :class="{ active: side === 'buy' }"
              @click="side = 'buy'"
            >
              买入 {{ baseCoin }}
            </button>
            <button 
              class="side-btn sell" 
              :class="{ active: side === 'sell' }"
              @click="side = 'sell'"
            >
              卖出 {{ baseCoin }}
            </button>
          </div>
        </div>

        <div class="form-row" v-if="orderType === 'limit'">
          <label>价格 ({{ quoteCoin }})</label>
          <input 
            v-model="price" 
            type="number" 
            :placeholder="`价格 ${quoteCoin}`"
            :disabled="orderType === 'market'"
          />
        </div>

        <div class="form-row">
          <label>数量 ({{ baseCoin }})</label>
          <input 
            v-model="quantity" 
            type="number" 
            :placeholder="`数量 ${baseCoin}`"
          />
        </div>

        <div class="form-row">
          <label>金额 ({{ quoteCoin }})</label>
          <input 
            v-model="amount" 
            type="number" 
            :placeholder="`金额 ${quoteCoin}`"
            readonly
          />
        </div>

        <div class="form-row">
          <label>可用余额</label>
          <span class="balance">
            {{ formatBalance(availableBalance) }} {{ side === 'buy' ? quoteCoin : baseCoin }}
          </span>
        </div>

        <button 
          class="trade-btn" 
          :class="side"
          @click="placeOrder"
          :disabled="!canPlaceOrder"
        >
          {{ side === 'buy' ? '买入' : '卖出' }} {{ side === 'buy' ? baseCoin : baseCoin }}
        </button>
      </div>

      <!-- 订单历史 -->
      <div class="orders-section">
        <h3>我的订单</h3>
        <div class="order-list">
          <div 
            class="order-item" 
            v-for="order in orders" 
            :key="order.orderNo"
          >
            <div class="order-info">
              <span class="symbol">{{ order.symbol }}</span>
              <span class="side" :class="order.side">{{ order.side === 'buy' ? '买入' : '卖出' }}</span>
              <span class="status">{{ orderStatusText[order.status] }}</span>
            </div>
            <div class="order-details">
              <div>价格: {{ formatPrice(order.price) }}</div>
              <div>数量: {{ formatBalance(order.quantity) }}</div>
              <div>已成交: {{ formatBalance(order.executedQty) }}</div>
            </div>
            <button 
              class="cancel-btn" 
              v-if="order.status === 0 || order.status === 1"
              @click="cancelOrder(order.orderNo)"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '@/utils/api';
import PageLayout from '@/components/layout/PageLayout.vue';

const route = useRoute();
const symbol = ref(route.params.symbol || 'BTCUSDT');
const baseCoin = computed(() => symbol.value.substring(0, symbol.value.length - 4));
const quoteCoin = computed(() => symbol.value.substring(symbol.value.length - 4));

// 交易数据
const currentPrice = ref(0);
const changePercent = ref(0);
const orderType = ref('limit'); // 'limit' or 'market'
const side = ref('buy'); // 'buy' or 'sell'
const price = ref('');
const quantity = ref('');
const orders = ref([]);

// 计算属性
const amount = computed(() => {
  if (orderType.value === 'market') {
    return '';
  }
  return price.value && quantity.value ? (parseFloat(price.value) * parseFloat(quantity.value)).toFixed(4) : '';
});

const availableBalance = ref(0);
const changeClass = computed(() => {
  return changePercent.value >= 0 ? 'positive' : 'negative';
});

const canPlaceOrder = computed(() => {
  if (side.value === 'buy') {
    // 买入时检查价格、数量和余额
    return price.value && quantity.value && parseFloat(amount.value) <= availableBalance.value;
  } else {
    // 卖出时检查数量和余额
    return quantity.value && parseFloat(quantity.value) <= availableBalance.value;
  }
});

const orderStatusText = {
  0: '待成交',
  1: '部分成交',
  2: '全部成交',
  3: '已取消',
  4: '失败'
};

// 格式化函数
const formatPrice = (value) => {
  return parseFloat(value).toFixed(4);
};

const formatBalance = (value) => {
  return parseFloat(value).toFixed(6);
};

// 获取交易对信息
const loadSymbolInfo = async () => {
  try {
    const response = await api.trade.getTradingPair(symbol.value);
    if (response.success) {
      // 这里应该获取实时价格，暂时使用模拟数据
      currentPrice.value = 45000.00;
      changePercent.value = 2.5;
    }
  } catch (error) {
    console.error('获取交易对信息失败:', error);
  }
};

// 获取我的订单
const loadOrders = async () => {
  try {
    const response = await api.trade.getOrders({ status: 0 }); // 只获取未成交订单
    if (response.success) {
      orders.value = response.data.list || [];
    }
  } catch (error) {
    console.error('获取订单失败:', error);
  }
};

// 获取余额
const loadBalance = async () => {
  try {
    const response = await api.account.balance();
    if (response.success) {
      const balances = response.data.balances || [];
      const targetCoin = side.value === 'buy' ? quoteCoin.value : baseCoin.value;
      const balanceItem = balances.find(b => b.coinSymbol === targetCoin);
      availableBalance.value = balanceItem ? parseFloat(balanceItem.balance) : 0;
    }
  } catch (error) {
    console.error('获取余额失败:', error);
  }
};

// 下单
const placeOrder = async () => {
  if (!canPlaceOrder.value) return;

  try {
    const orderData = {
      symbol: symbol.value,
      side: side.value,
      type: orderType.value,
      price: orderType.value === 'limit' ? parseFloat(price.value) : undefined,
      quantity: parseFloat(quantity.value)
    };

    const response = await api.trade.createOrder(orderData);
    if (response.success) {
      alert('下单成功');
      // 清空表单
      price.value = '';
      quantity.value = '';
      // 重新加载数据
      loadOrders();
      loadBalance();
    } else {
      alert(response.message || '下单失败');
    }
  } catch (error) {
    console.error('下单失败:', error);
    alert(error.message || '下单失败');
  }
};

// 取消订单
const cancelOrder = async (orderNo) => {
  try {
    const response = await api.trade.cancelOrder(orderNo);
    if (response.success) {
      alert('订单已取消');
      loadOrders();
      loadBalance();
    } else {
        alert(response.message || '取消失败');
    }
  } catch (error) {
    console.error('取消订单失败:', error);
    alert(error.message || '取消失败');
  }
};

// 监听交易对变化
watch(() => route.params.symbol, (newSymbol) => {
  if (newSymbol) {
    symbol.value = newSymbol;
    loadSymbolInfo();
    loadBalance();
  }
});

// 监听买卖方向变化，更新可用余额
watch(side, () => {
  loadBalance();
});

onMounted(() => {
  loadSymbolInfo();
  loadOrders();
  loadBalance();
});
</script>

<style scoped>
.trade-page {
  padding: 16px;
  background: var(--bg-primary, #0B0E11);
  min-height: 100vh;
  color: var(--text-primary, #FFFFFF);
}

.symbol-selector {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color, #2A2D37);
}

.symbol-info h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.price {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-primary, #FFFFFF);
}

.change {
  font-size: 16px;
  margin-top: 4px;
}

.change.positive {
  color: var(--color-success, #00B42A);
}

.change.negative {
  color: var(--color-error, #F53F3F);
}

.chart-container {
  height: 200px;
  margin: 20px 0;
  background: var(--bg-secondary, #181A20);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: var(--text-secondary, #8E929A);
}

.order-type-tabs {
  display: flex;
  background: var(--bg-secondary, #181A20);
  border-radius: 8px;
  margin: 20px 0;
  overflow: hidden;
}

.tab {
  flex: 1;
  padding: 12px 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.tab.active {
  background: var(--bg-primary, #0B0E11);
  color: var(--color-primary, #4080FF);
}

.trade-form {
  background: var(--bg-secondary, #181A20);
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
}

.form-row {
  margin-bottom: 16px;
}

.form-row label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary, #8E929A);
  font-size: 14px;
}

.side-buttons {
  display: flex;
  gap: 8px;
}

.side-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.side-btn.buy {
  background: var(--bg-success-light, #002914);
  color: var(--color-success, #00B42A);
}

.side-btn.buy.active {
  background: var(--color-success, #00B42A);
  color: white;
}

.side-btn.sell {
  background: var(--bg-error-light, #290000);
  color: var(--color-error, #F53F3F);
}

.side-btn.sell.active {
  background: var(--color-error, #F53F3F);
  color: white;
}

input {
  width: 100%;
  padding: 12px;
  background: var(--bg-tertiary, #2A2D37);
  border: 1px solid var(--border-color, #2A2D37);
  border-radius: 6px;
  color: var(--text-primary, #FFFFFF);
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: var(--color-primary, #4080FF);
}

.balance {
  color: var(--text-secondary, #8E929A);
  font-size: 14px;
}

.trade-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.trade-btn.buy {
  background: var(--color-success, #00B42A);
}

.trade-btn.buy:disabled {
  background: var(--color-success-light, #006619);
}

.trade-btn.sell {
  background: var(--color-error, #F53F3F);
}

.trade-btn.sell:disabled {
  background: var(--color-error-light, #992929);
}

.orders-section {
  margin-top: 20px;
}

.orders-section h3 {
  margin-bottom: 16px;
  color: var(--text-primary, #FFFFFF);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  background: var(--bg-secondary, #181A20);
  border-radius: 8px;
  padding: 12px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.symbol {
  font-weight: bold;
}

.side.buy {
  color: var(--color-success, #00B42A);
}

.side.sell {
  color: var(--color-error, #F53F3F);
}

.status {
  color: var(--text-secondary, #8E929A);
}

.order-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary, #8E929A);
  margin-bottom: 8px;
}

.cancel-btn {
  width: 100%;
  padding: 8px;
  background: var(--bg-tertiary, #2A2D37);
  border: none;
  border-radius: 6px;
  color: var(--text-primary, #FFFFFF);
  cursor: pointer;
}
</style>
