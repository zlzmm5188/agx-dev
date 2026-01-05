<template>
  <div class="trading-pairs-page">
    <a-card class="page-card">
      <template #title>
        <div class="card-header">
          <h3>交易对管理</h3>
          <a-button type="primary" @click="showCreateModal">添加交易对</a-button>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <div class="search-section">
        <a-form :model="searchForm" layout="inline">
          <a-form-item label="状态">
            <a-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px;">
              <a-option :value="undefined">全部</a-option>
              <a-option :value="1">启用</a-option>
              <a-option :value="0">禁用</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="searchPairs">搜索</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 交易对列表 -->
      <a-table 
        :columns="columns" 
        :data-source="pairs" 
        :loading="loading" 
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'minQty'">
            {{ formatNumber(record.minQty) }}
          </template>
          <template v-else-if="column.dataIndex === 'maxQty'">
            {{ record.maxQty ? formatNumber(record.maxQty) : '无限制' }}
          </template>
          <template v-else-if="column.dataIndex === 'tradeFee'">
            {{ (record.tradeFee * 100).toFixed(2) }}%
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="text" size="small" @click="editPair(record)">编辑</a-button>
              <a-button 
                type="text" 
                size="small" 
                :status="record.status === 1 ? 'danger' : 'success'"
                @click="toggleStatus(record)"
              >
                {{ record.status === 1 ? '禁用' : '启用' }}
              </a-button>
              <a-button type="text" size="small" status="danger" @click="deletePair(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 创建/编辑交易对弹窗 -->
    <a-modal 
      v-model:visible="modalVisible" 
      :title="modalTitle" 
      @ok="submitForm"
      :confirm-loading="submitting"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="交易对符号" :required="true">
          <a-input v-model="form.symbol" placeholder="如: BTCUSDT" :disabled="!!form.id" />
        </a-form-item>
        <a-form-item label="基础货币" :required="true">
          <a-input v-model="form.baseCoin" placeholder="如: BTC" />
        </a-form-item>
        <a-form-item label="计价货币" :required="true">
          <a-input v-model="form.quoteCoin" placeholder="如: USDT" />
        </a-form-item>
        <a-form-item label="最小交易量" :required="true">
          <a-input-number 
            v-model="form.minQty" 
            style="width: 100%"
            placeholder="最小交易量"
            :min="0"
            :step="0.00000001"
          />
        </a-form-item>
        <a-form-item label="最大交易量">
          <a-input-number 
            v-model="form.maxQty" 
            style="width: 100%"
            placeholder="最大交易量，留空为无限制"
            :min="0"
            :step="0.00000001"
          />
        </a-form-item>
        <a-form-item label="价格精度" :required="true">
          <a-input-number 
            v-model="form.pricePrecision" 
            style="width: 100%"
            placeholder="价格小数位数"
            :min="0"
            :max="10"
          />
        </a-form-item>
        <a-form-item label="数量精度" :required="true">
          <a-input-number 
            v-model="form.qtyPrecision" 
            style="width: 100%"
            placeholder="数量小数位数"
            :min="0"
            :max="10"
          />
        </a-form-item>
        <a-form-item label="交易手续费率" :required="true">
          <a-input-number 
            v-model="form.tradeFee" 
            style="width: 100%"
            placeholder="手续费率，如0.002表示0.2%"
            :min="0"
            :max="0.1"
            :step="0.0001"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-switch 
            v-model="form.status" 
            :checked-value="1" 
            :unchecked-value="0"
            checked-text="启用" 
            unchecked-text="禁用"
          />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number 
            v-model="form.sortOrder" 
            style="width: 100%"
            placeholder="排序值，越大越靠前"
            :min="0"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { api } from '@/utils/api';

// 状态变量
const loading = ref(false);
const submitting = ref(false);
const pairs = ref([]);
const modalVisible = ref(false);
const modalTitle = ref('');
const formType = ref('create'); // 'create' or 'edit'

// 搜索表单
const searchForm = reactive({
  status: undefined
});

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true
});

// 表格列配置
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100
  },
  {
    title: '交易对',
    dataIndex: 'symbol',
    width: 120
  },
  {
    title: '基础货币',
    dataIndex: 'baseCoin',
    width: 120
  },
  {
    title: '计价货币',
    dataIndex: 'quoteCoin',
    width: 120
  },
  {
    title: '最小交易量',
    dataIndex: 'minQty',
    width: 120
  },
  {
    title: '最大交易量',
    dataIndex: 'maxQty',
    width: 120
  },
  {
    title: '价格精度',
    dataIndex: 'pricePrecision',
    width: 100
  },
  {
    title: '数量精度',
    dataIndex: 'qtyPrecision',
    width: 100
  },
  {
    title: '手续费率',
    dataIndex: 'tradeFee',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    customRender: ({ record }) => new Date(record.createdAt).toLocaleString()
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    fixed: 'right'
  }
];

// 表单数据
const form = reactive({
  id: null,
  symbol: '',
  baseCoin: '',
  quoteCoin: '',
  minQty: 0.00000001,
  maxQty: null,
  pricePrecision: 8,
  qtyPrecision: 8,
  tradeFee: 0.002,
  status: 1,
  sortOrder: 0
});

// 格式化数字
const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  return parseFloat(num).toString();
};

// 加载交易对列表
const loadPairs = async (params = {}) => {
  loading.value = true;
  try {
    const response = await api.admin.getTradingPairs({
      status: searchForm.status,
      page: params.page || pagination.value.current,
      pageSize: params.pageSize || pagination.value.pageSize
    });
    
    if (response.success) {
      pairs.value = response.data.list || [];
      pagination.value.total = response.data.total || 0;
      pagination.value.current = response.data.page || 1;
      pagination.value.pageSize = response.data.pageSize || 20;
    } else {
      Message.error(response.message || '获取交易对列表失败');
    }
  } catch (error) {
    console.error('获取交易对列表失败:', error);
    Message.error('获取交易对列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const searchPairs = () => {
  loadPairs({ page: 1 });
};

// 表格变化处理
const handleTableChange = (pagination) => {
  loadPairs({
    page: pagination.current,
    pageSize: pagination.pageSize
  });
};

// 显示创建弹窗
const showCreateModal = () => {
  formType.value = 'create';
  modalTitle.value = '创建交易对';
  resetForm();
  modalVisible.value = true;
};

// 编辑交易对
const editPair = (record) => {
  formType.value = 'edit';
  modalTitle.value = '编辑交易对';
  Object.assign(form, {
    id: record.id,
    symbol: record.symbol,
    baseCoin: record.baseCoin,
    quoteCoin: record.quoteCoin,
    minQty: parseFloat(record.minQty),
    maxQty: record.maxQty ? parseFloat(record.maxQty) : null,
    pricePrecision: record.pricePrecision,
    qtyPrecision: record.qtyPrecision,
    tradeFee: parseFloat(record.tradeFee),
    status: record.status,
    sortOrder: record.sortOrder
  });
  modalVisible.value = true;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: null,
    symbol: '',
    baseCoin: '',
    quoteCoin: '',
    minQty: 0.00000001,
    maxQty: null,
    pricePrecision: 8,
    qtyPrecision: 8,
    tradeFee: 0.002,
    status: 1,
    sortOrder: 0
  });
};

// 提交表单
const submitForm = async () => {
  submitting.value = true;
  try {
    let response;
    if (formType.value === 'create') {
      response = await api.admin.createTradingPair(form);
    } else {
      const { id, ...updateData } = form;
      response = await api.admin.updateTradingPair(id, updateData);
    }

    if (response.success) {
      Message.success(formType.value === 'create' ? '创建成功' : '更新成功');
      modalVisible.value = false;
      loadPairs();
    } else {
      Message.error(response.message || (formType.value === 'create' ? '创建失败' : '更新失败'));
    }
  } catch (error) {
    console.error('操作失败:', error);
    Message.error('操作失败');
  } finally {
    submitting.value = false;
  }
};

// 切换状态
const toggleStatus = async (record) => {
  try {
    const newStatus = record.status === 1 ? 0 : 1;
    const response = await api.admin.updateTradingPair(record.id, { status: newStatus });
    if (response.success) {
      Message.success(newStatus === 1 ? '启用成功' : '禁用成功');
      loadPairs();
    } else {
      Message.error(response.message || '操作失败');
    }
  } catch (error) {
    console.error('切换状态失败:', error);
    Message.error('操作失败');
  }
};

// 删除交易对
const deletePair = async (record) => {
  if (!confirm(`确定要删除交易对 ${record.symbol} 吗？此操作不可恢复！`)) {
    return;
  }

  try {
    const response = await api.admin.deleteTradingPair(record.id);
    if (response.success) {
      Message.success('删除成功');
      loadPairs();
    } else {
      Message.error(response.message || '删除失败');
    }
  } catch (error) {
    console.error('删除失败:', error);
    Message.error('删除失败');
  }
};

onMounted(() => {
  loadPairs();
});
</script>

<style scoped>
.trading-pairs-page {
  padding: 20px;
  background: var(--color-bg-2);
  min-height: calc(100vh - 64px);
}

.page-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-section {
  margin-bottom: 20px;
}
</style>
