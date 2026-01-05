<template>
  <div class="text-config-container">
    <a-card title="文案配置">
      <template #extra>
        <a-space>
          <a-button @click="handleExport">
            <template #icon><icon-download /></template>
            导出配置
          </a-button>
          <a-button type="primary" @click="handleAdd">
            <template #icon><icon-plus /></template>
            添加文案
          </a-button>
        </a-space>
      </template>

      <a-alert class="mb-4" type="info">
        配置前端显示的各类文案，支持多语言。修改后即时生效，无需发布。
      </a-alert>

      <!-- Tab切换 - 按分类 -->
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="common" title="通用文案" />
        <a-tab-pane key="trade" title="交易相关" />
        <a-tab-pane key="asset" title="资产相关" />
        <a-tab-pane key="user" title="用户相关" />
        <a-tab-pane key="tips" title="提示语" />
        <a-tab-pane key="agreement" title="协议文档" />
      </a-tabs>

      <!-- 搜索栏 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-input v-model="searchForm.keyword" placeholder="文案Key或内容" allow-clear />
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.lang" placeholder="语言" allow-clear style="width: 100%">
            <a-option value="zh-CN">简体中文</a-option>
            <a-option value="zh-TW">繁体中文</a-option>
            <a-option value="en">English</a-option>
            <a-option value="ja">日本語</a-option>
            <a-option value="ko">한국어</a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </a-col>
      </a-row>

      <!-- 文案列表 -->
      <a-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading">
        <template #content="{ record }">
          <a-typography-paragraph :ellipsis="{ rows: 2 }" style="margin: 0">
            {{ record.content }}
          </a-typography-paragraph>
        </template>
        <template #langs="{ record }">
          <a-space>
            <a-tag v-for="lang in record.langs" :key="lang" size="small">{{ lang }}</a-tag>
          </a-space>
        </template>
        <template #action="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="text" size="small" @click="handleTranslate(record)">翻译</a-button>
            <a-popconfirm content="确定删除该文案？" @ok="handleDelete(record)">
              <a-button type="text" size="small" status="danger">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑文案弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑文案' : '添加文案'" width="700px" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="文案Key" required>
              <a-input v-model="formData.key" placeholder="如 trade.buy.button" :disabled="isEdit" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属分类" required>
              <a-select v-model="formData.category" placeholder="选择分类">
                <a-option value="common">通用文案</a-option>
                <a-option value="trade">交易相关</a-option>
                <a-option value="asset">资产相关</a-option>
                <a-option value="user">用户相关</a-option>
                <a-option value="tips">提示语</a-option>
                <a-option value="agreement">协议文档</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="备注说明">
          <a-input v-model="formData.remark" placeholder="文案用途说明" />
        </a-form-item>
        
        <a-divider>多语言内容</a-divider>
        
        <a-form-item label="简体中文" required>
          <a-textarea v-model="formData.zhCN" placeholder="简体中文内容" :auto-size="{ minRows: 2 }" />
        </a-form-item>
        <a-form-item label="繁体中文">
          <a-textarea v-model="formData.zhTW" placeholder="繁体中文内容" :auto-size="{ minRows: 2 }" />
        </a-form-item>
        <a-form-item label="English">
          <a-textarea v-model="formData.en" placeholder="English content" :auto-size="{ minRows: 2 }" />
        </a-form-item>
        <a-form-item label="日本語">
          <a-textarea v-model="formData.ja" placeholder="日本語コンテンツ" :auto-size="{ minRows: 2 }" />
        </a-form-item>
        <a-form-item label="한국어">
          <a-textarea v-model="formData.ko" placeholder="한국어 콘텐츠" :auto-size="{ minRows: 2 }" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 翻译弹窗 -->
    <a-modal v-model:visible="translateVisible" title="批量翻译" @ok="handleTranslateSubmit">
      <a-form layout="vertical">
        <a-form-item label="源语言">
          <a-select v-model="translateForm.source" style="width: 100%">
            <a-option value="zh-CN">简体中文</a-option>
            <a-option value="en">English</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="目标语言">
          <a-checkbox-group v-model="translateForm.targets">
            <a-checkbox value="zh-TW">繁体中文</a-checkbox>
            <a-checkbox value="en">English</a-checkbox>
            <a-checkbox value="ja">日本語</a-checkbox>
            <a-checkbox value="ko">한국어</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-alert type="warning">翻译功能为Mock模式，实际需接入翻译API</a-alert>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const activeTab = ref('common')
const modalVisible = ref(false)
const translateVisible = ref(false)
const isEdit = ref(false)

const searchForm = reactive({
  keyword: '',
  lang: ''
})

const formData = reactive({
  key: '',
  category: 'common',
  remark: '',
  zhCN: '',
  zhTW: '',
  en: '',
  ja: '',
  ko: ''
})

const translateForm = reactive({
  source: 'zh-CN',
  targets: ['en', 'ja', 'ko']
})

const columns = [
  { title: 'Key', dataIndex: 'key', width: 200 },
  { title: '内容(中文)', dataIndex: 'content', slotName: 'content', width: 300 },
  { title: '备注', dataIndex: 'remark', width: 150 },
  { title: '已翻译', dataIndex: 'langs', slotName: 'langs', width: 180 },
  { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
  { title: '操作', slotName: 'action', width: 150, fixed: 'right' }
]

const tableData = ref([])

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showPageSize: true
})

const mockData = () => {
  const commonTexts = [
    { id: 1, key: 'common.confirm', content: '确认', remark: '确认按钮', langs: ['中', 'EN', '日', '韩'], updatedAt: '2024-01-15 10:30' },
    { id: 2, key: 'common.cancel', content: '取消', remark: '取消按钮', langs: ['中', 'EN', '日', '韩'], updatedAt: '2024-01-15 10:30' },
    { id: 3, key: 'common.submit', content: '提交', remark: '提交按钮', langs: ['中', 'EN'], updatedAt: '2024-01-15 10:30' },
    { id: 4, key: 'common.loading', content: '加载中...', remark: '加载提示', langs: ['中', 'EN', '日', '韩'], updatedAt: '2024-01-15 10:30' },
    { id: 5, key: 'common.success', content: '操作成功', remark: '成功提示', langs: ['中', 'EN'], updatedAt: '2024-01-15 10:30' },
  ]
  const tradeTexts = [
    { id: 6, key: 'trade.buy', content: '买入', remark: '买入按钮', langs: ['中', 'EN', '日', '韩'], updatedAt: '2024-01-15 10:30' },
    { id: 7, key: 'trade.sell', content: '卖出', remark: '卖出按钮', langs: ['中', 'EN', '日', '韩'], updatedAt: '2024-01-15 10:30' },
    { id: 8, key: 'trade.price', content: '价格', remark: '价格标签', langs: ['中', 'EN'], updatedAt: '2024-01-15 10:30' },
    { id: 9, key: 'trade.amount', content: '数量', remark: '数量标签', langs: ['中', 'EN'], updatedAt: '2024-01-15 10:30' },
    { id: 10, key: 'trade.fee', content: '手续费', remark: '手续费标签', langs: ['中', 'EN', '日'], updatedAt: '2024-01-15 10:30' },
  ]
  const assetTexts = [
    { id: 11, key: 'asset.total', content: '总资产', remark: '总资产标签', langs: ['中', 'EN', '日', '韩'], updatedAt: '2024-01-15 10:30' },
    { id: 12, key: 'asset.available', content: '可用余额', remark: '可用余额', langs: ['中', 'EN'], updatedAt: '2024-01-15 10:30' },
    { id: 13, key: 'asset.frozen', content: '冻结金额', remark: '冻结金额', langs: ['中', 'EN'], updatedAt: '2024-01-15 10:30' },
    { id: 14, key: 'asset.gold', content: '黄金资产', remark: '黄金资产标题', langs: ['中', 'EN', '日', '韩'], updatedAt: '2024-01-15 10:30' },
  ]

  const dataMap = {
    common: commonTexts,
    trade: tradeTexts,
    asset: assetTexts,
    user: [],
    tips: [],
    agreement: []
  }
  tableData.value = dataMap[activeTab.value] || []
  pagination.total = tableData.value.length
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    mockData()
    loading.value = false
  }, 500)
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, { key: '', category: activeTab.value, remark: '', zhCN: '', zhTW: '', en: '', ja: '', ko: '' })
  modalVisible.value = true
}

const handleEdit = (record) => {
  isEdit.value = true
  Object.assign(formData, {
    key: record.key,
    category: activeTab.value,
    remark: record.remark,
    zhCN: record.content,
    zhTW: '',
    en: '',
    ja: '',
    ko: ''
  })
  modalVisible.value = true
}

const handleSubmit = () => {
  Message.success(isEdit.value ? '更新成功' : '添加成功')
  modalVisible.value = false
  mockData()
}

const handleDelete = (record) => {
  Message.success(`已删除 ${record.key}`)
  mockData()
}

const handleTranslate = (record) => {
  translateVisible.value = true
}

const handleTranslateSubmit = () => {
  Message.success('翻译任务已提交')
  translateVisible.value = false
}

const handleExport = () => {
  Message.success('配置导出成功')
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.text-config-container {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
