<template>
  <div class="coin-issues-page">
    <a-card class="page-card">
      <template #title>
        <div class="card-header">
          <h3>新币发行管理</h3>
          <a-button type="primary" @click="showCreateModal">创建发行</a-button>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <div class="search-section">
        <a-form :model="searchForm" layout="inline">
          <a-form-item label="状态">
            <a-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px;">
              <a-option :value="undefined">全部</a-option>
              <a-option :value="0">未开始</a-option>
              <a-option :value="1">进行中</a-option>
              <a-option :value="2">已结束</a-option>
              <a-option :value="3">已开奖</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="searchIssues">搜索</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 发行列表 -->
      <a-table 
        :columns="columns" 
        :data-source="issues" 
        :loading="loading" 
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'issuePrice'">
            {{ formatPrice(record.issuePrice) }}
          </template>
          <template v-else-if="column.dataIndex === 'issueAmount'">
            {{ formatNumber(record.issueAmount) }}
          </template>
          <template v-else-if="column.dataIndex === 'totalSubscribed'">
            {{ formatNumber(record.totalSubscribed) }}
          </template>
          <template v-else-if="column.dataIndex === 'winRate'">
            {{ record.winRate ? (record.winRate * 100).toFixed(2) + '%' : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="text" size="small" @click="editIssue(record)">编辑</a-button>
              <a-button type="text" size="small" @click="viewSubscriptions(record)">申购记录</a-button>
              <a-button type="text" size="small" status="danger" @click="deleteIssue(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 创建/编辑发行弹窗 -->
    <a-modal 
      v-model:visible="modalVisible" 
      :title="modalTitle" 
      @ok="submitForm"
      :confirm-loading="submitting"
      width="600px"
    >
      <a-form :model="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="币种符号" :required="true">
          <a-input v-model="form.coinSymbol" placeholder="如: AGX" :disabled="!!form.id" />
        </a-form-item>
        <a-form-item label="币种名称" :required="true">
          <a-input v-model="form.coinName" placeholder="如: Ascenda Token" />
        </a-form-item>
        <a-form-item label="总发行量" :required="true">
          <a-input-number 
            v-model="form.totalSupply" 
            style="width: 100%"
            placeholder="总发行量"
            :min="0"
            :step="0.00000001"
          />
        </a-form-item>
        <a-form-item label="发行价格" :required="true">
          <a-input-number 
            v-model="form.issuePrice" 
            style="width: 100%"
            placeholder="发行价格"
            :min="0"
            :step="0.0001"
          />
        </a-form-item>
        <a-form-item label="本次发行量" :required="true">
          <a-input-number 
            v-model="form.issueAmount" 
            style="width: 100%"
            placeholder="本次发行量"
            :min="0"
            :step="0.00000001"
          />
        </a-form-item>
        <a-form-item label="最小申购数量" :required="true">
          <a-input-number 
            v-model="form.minBuyAmount" 
            style="width: 100%"
            placeholder="最小申购数量"
            :min="0"
            :step="0.00000001"
          />
        </a-form-item>
        <a-form-item label="最大申购数量" :required="true">
          <a-input-number 
            v-model="form.maxBuyAmount" 
            style="width: 100%"
            placeholder="最大申购数量"
            :min="0"
            :step="0.00000001"
          />
        </a-form-item>
        <a-form-item label="申购开始时间" :required="true">
          <a-date-picker 
            v-model="form.startTime" 
            show-time 
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="申购结束时间" :required="true">
          <a-date-picker 
            v-model="form.endTime" 
            show-time 
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="开奖时间" :required="true">
          <a-date-picker 
            v-model="form.lotteryTime" 
            show-time 
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="解锁时间" :required="true">
          <a-date-picker 
            v-model="form.unlockTime" 
            show-time 
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
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
const issues = ref([]);
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
    width: 80
  },
  {
    title: '币种',
    dataIndex: 'coinSymbol',
    width: 100
  },
  {
    title: '名称',
    dataIndex: 'coinName',
    width: 120
  },
  {
    title: '发行价格',
    dataIndex: 'issuePrice',
    width: 120
  },
  {
    title: '发行总量',
    dataIndex: 'issueAmount',
    width: 120
  },
  {
    title: '总申购量',
    dataIndex: 'totalSubscribed',
    width: 120
  },
  {
    title: '申购人数',
    dataIndex: 'subscriberCount',
    width: 100
  },
  {
    title: '中签率',
    dataIndex: 'winRate',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: 180,
    customRender: ({ record }) => new Date(record.startTime).toLocaleString()
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 180,
    customRender: ({ record }) => new Date(record.endTime).toLocaleString()
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 180,
    fixed: 'right'
  }
];

// 表单数据
const form = reactive({
  id: null,
  coinSymbol: '',
  coinName: '',
  totalSupply: 0,
  issuePrice: 0,
  issueAmount: 0,
  minBuyAmount: 0,
  maxBuyAmount: 0,
  startTime: null,
  endTime: null,
  lotteryTime: null,
  unlockTime: null
});

// 状态文本
const getStatusText = (status) => {
  const texts = {
    0: '未开始',
    1: '进行中',
    2: '已结束',
    3: '已开奖'
  };
  return texts[status] || '未知';
};

// 状态颜色
const getStatusColor = (status) => {
  const colors = {
    0: 'default',
    1: 'blue',
    2: 'red',
    3: 'green'
  };
  return colors[status] || 'default';
};

// 格式化数字
const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  return parseFloat(num).toString();
};

// 格式化价格
const formatPrice = (price) => {
  return parseFloat(price).toFixed(4);
};

// 加载发行列表
const loadIssues = async (params = {}) => {
  loading.value = true;
  try {
    const response = await api.admin.getCoinIssues({
      status: searchForm.status,
      page: params.page || pagination.value.current,
      pageSize: params.pageSize || pagination.value.pageSize
    });
    
    if (response.success) {
      issues.value = response.data.list || [];
      pagination.value.total = response.data.total || 0;
      pagination.value.current = response.data.page || 1;
      pagination.value.pageSize = response.data.pageSize || 20;
    } else {
      Message.error(response.message || '获取发行列表失败');
    }
  } catch (error) {
    console.error('获取发行列表失败:', error);
    Message.error('获取发行列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const searchIssues = () => {
  loadIssues({ page: 1 });
};

// 表格变化处理
const handleTableChange = (pagination) => {
  loadIssues({
    page: pagination.current,
    pageSize: pagination.pageSize
  });
};

// 显示创建弹窗
const showCreateModal = () => {
  formType.value = 'create';
  modalTitle.value = '创建新币发行';
  resetForm();
  modalVisible.value = true;
};

// 编辑发行
const editIssue = (record) => {
  formType.value = 'edit';
  modalTitle.value = '编辑新币发行';
  Object.assign(form, {
    id: record.id,
    coinSymbol: record.coinSymbol,
    coinName: record.coinName,
    totalSupply: parseFloat(record.totalSupply),
    issuePrice: parseFloat(record.issuePrice),
    issueAmount: parseFloat(record.issueAmount),
    minBuyAmount: parseFloat(record.minBuyAmount),
    maxBuyAmount: parseFloat(record.maxBuyAmount),
    startTime: new Date(record.startTime),
    endTime: new Date(record.endTime),
    lotteryTime: new Date(record.lotteryTime),
    unlockTime: new Date(record.unlockTime)
  });
  modalVisible.value = true;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: null,
    coinSymbol: '',
    coinName: '',
    totalSupply: 0,
    issuePrice: 0,
    issueAmount: 0,
    minBuyAmount: 0,
    maxBuyAmount: 0,
    startTime: null,
    endTime: null,
    lotteryTime: null,
    unlockTime: null
  });
};

// 提交表单
const submitForm = async () => {
  submitting.value = true;
  try {
    // 转换日期格式
    const submitData = {
      ...form,
      startTime: form.startTime ? new Date(form.startTime).toISOString() : null,
      endTime: form.endTime ? new Date(form.endTime).toISOString() : null,
      lotteryTime: form.lotteryTime ? new Date(form.lotteryTime).toISOString() : null,
      unlockTime: form.unlockTime ? new Date(form.unlockTime).toISOString() : null
    };

    let response;
    if (formType.value === 'create') {
      response = await api.admin.createCoinIssue(submitData);
    } else {
      const { id, ...updateData } = submitData;
      response = await api.admin.updateCoinIssue(id, updateData);
    }

    if (response.success) {
      Message.success(formType.value === 'create' ? '创建成功' : '更新成功');
      modalVisible.value = false;
      loadIssues();
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

// 查看申购记录
const viewSubscriptions = (record) => {
  // 这里可以跳转到申购记录页面
  console.log('查看申购记录', record);
};

// 删除发行
const deleteIssue = async (record) => {
  if (!confirm(`确定要删除发行项目 ${record.coinName} 吗？此操作不可恢复！`)) {
    return;
  }

  try {
    // TODO: 实现删除API调用
    Message.success('删除成功');
    loadIssues();
  } catch (error) {
    console.error('删除失败:', error);
    Message.error('删除失败');
  }
};

onMounted(() => {
  loadIssues();
});
</script>

<style scoped>
.coin-issues-page {
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
