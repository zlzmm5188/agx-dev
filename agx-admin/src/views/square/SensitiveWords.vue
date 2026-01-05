<template>
  <div class="sensitive-words-page">
    <a-card class="page-card">
      <template #title>
        <div class="card-header">
          <h3>敏感词管理</h3>
          <a-button type="primary" @click="showCreateModal">添加敏感词</a-button>
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
            <a-button type="primary" @click="searchWords">搜索</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 敏感词列表 -->
      <a-table 
        :columns="columns" 
        :data-source="words" 
        :loading="loading" 
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'level'">
            <a-tag :color="getLevelColor(record.level)">
              {{ getLevelText(record.level) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="text" size="small" @click="editWord(record)">编辑</a-button>
              <a-button 
                type="text" 
                size="small" 
                :status="record.status === 1 ? 'danger' : 'success'"
                @click="toggleStatus(record)"
              >
                {{ record.status === 1 ? '禁用' : '启用' }}
              </a-button>
              <a-button type="text" size="small" status="danger" @click="deleteWord(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 创建/编辑敏感词弹窗 -->
    <a-modal 
      v-model:visible="modalVisible" 
      :title="modalTitle" 
      @ok="submitForm"
      :confirm-loading="submitting"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="敏感词" :required="true">
          <a-input v-model="form.word" placeholder="请输入敏感词" :disabled="!!form.id" />
        </a-form-item>
        <a-form-item label="级别" :required="true">
          <a-select v-model="form.level" placeholder="请选择级别">
            <a-option :value="1">警告</a-option>
            <a-option :value="2">禁止</a-option>
          </a-select>
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
const words = ref([]);
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
    title: '敏感词',
    dataIndex: 'word',
    width: 150
  },
  {
    title: '级别',
    dataIndex: 'level',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
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
    width: 180,
    fixed: 'right'
  }
];

// 表单数据
const form = reactive({
  id: null,
  word: '',
  level: 1,
  status: 1
});

// 级别文本
const getLevelText = (level) => {
  return level === 1 ? '警告' : '禁止';
};

// 级别颜色
const getLevelColor = (level) => {
  return level === 1 ? 'orange' : 'red';
};

// 加载敏感词列表
const loadWords = async (params = {}) => {
  loading.value = true;
  try {
    const response = await api.square.getSensitiveWords({
      status: searchForm.status,
      page: params.page || pagination.value.current,
      pageSize: params.pageSize || pagination.value.pageSize
    });
    
    if (response.success) {
      words.value = response.data.list || [];
      pagination.value.total = words.value.length; // 简化处理
    } else {
      Message.error(response.message || '获取敏感词列表失败');
    }
  } catch (error) {
    console.error('获取敏感词列表失败:', error);
    Message.error('获取敏感词列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const searchWords = () => {
  loadWords({ page: 1 });
};

// 表格变化处理
const handleTableChange = (pagination) => {
  loadWords({
    page: pagination.current,
    pageSize: pagination.pageSize
  });
};

// 显示创建弹窗
const showCreateModal = () => {
  formType.value = 'create';
  modalTitle.value = '添加敏感词';
  resetForm();
  modalVisible.value = true;
};

// 编辑敏感词
const editWord = (record) => {
  formType.value = 'edit';
  modalTitle.value = '编辑敏感词';
  Object.assign(form, {
    id: record.id,
    word: record.word,
    level: record.level,
    status: record.status
  });
  modalVisible.value = true;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: null,
    word: '',
    level: 1,
    status: 1
  });
};

// 提交表单
const submitForm = async () => {
  submitting.value = true;
  try {
    let response;
    if (formType.value === 'create') {
      response = await api.square.createSensitiveWord(form);
    } else {
      const { id, ...updateData } = form;
      response = await api.square.updateSensitiveWord(id, updateData);
    }

    if (response.success) {
      Message.success(formType.value === 'create' ? '添加成功' : '更新成功');
      modalVisible.value = false;
      loadWords();
    } else {
      Message.error(response.message || (formType.value === 'create' ? '添加失败' : '更新失败'));
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
    const response = await api.square.updateSensitiveWord(record.id, { status: newStatus });
    if (response.success) {
      Message.success(newStatus === 1 ? '启用成功' : '禁用成功');
      loadWords();
    } else {
      Message.error(response.message || '操作失败');
    }
  } catch (error) {
    console.error('切换状态失败:', error);
    Message.error('操作失败');
  }
};

// 删除敏感词
const deleteWord = async (record) => {
  if (!confirm(`确定要删除敏感词 "${record.word}" 吗？此操作不可恢复！`)) {
    return;
  }

  try {
    const response = await api.square.deleteSensitiveWord(record.id);
    if (response.success) {
      Message.success('删除成功');
      loadWords();
    } else {
      Message.error(response.message || '删除失败');
    }
  } catch (error) {
    console.error('删除失败:', error);
    Message.error('删除失败');
  }
};

onMounted(() => {
  loadWords();
});
</script>

<style scoped>
.sensitive-words-page {
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
