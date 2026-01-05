<template>
  <div class="p-4">
    <a-card title="数字货币行情管理" :bordered="false">
      <template #extra>
        <a-space>
          <a-button @click="syncPrices" :loading="syncing">
            <template #icon><icon-sync /></template>
            同步行情
          </a-button>
          <a-button type="primary" @click="showCreateModal">
            <template #icon><icon-plus /></template>
            添加币种
          </a-button>
        </a-space>
      </template>

      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-input-search v-model="searchForm.keyword" placeholder="搜索币种" @search="handleSearch" />
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.category" placeholder="分类" allow-clear style="width: 100%">
            <a-option value="main">主流币</a-option>
            <a-option value="alt">山寨币</a-option>
            <a-option value="defi">DeFi</a-option>
            <a-option value="meme">Meme</a-option>
            <a-option value="nft">NFT</a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 100%">
            <a-option :value="1">已上线</a-option>
            <a-option :value="0">已下线</a-option>
          </a-select>
        </a-col>
      </a-row>

      <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="handlePageChange">
        <template #columns>
          <a-table-column title="币种" :width="180">
            <template #cell="{ record }">
              <div class="flex items-center gap-2">
                <a-avatar :size="32" :style="{ backgroundColor: getRandomColor(record.symbol) }">
                  {{ record.symbol.substring(0, 2) }}
                </a-avatar>
                <div>
                  <div class="font-medium">{{ record.symbol }}</div>
                  <div class="text-gray-400 text-xs">{{ record.name }}</div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="当前价格" :width="120">
            <template #cell="{ record }">
              <span class="font-medium">${{ formatPrice(record.price) }}</span>
            </template>
          </a-table-column>
          <a-table-column title="24H涨跌" :width="100">
            <template #cell="{ record }">
              <span :class="record.changePercent >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ record.changePercent >= 0 ? '+' : '' }}{{ record.changePercent.toFixed(2) }}%
              </span>
            </template>
          </a-table-column>
          <a-table-column title="24H成交额" :width="120">
            <template #cell="{ record }">
              ${{ formatVolume(record.volumeUsd) }}
            </template>
          </a-table-column>
          <a-table-column title="分类" :width="80">
            <template #cell="{ record }">
              <a-tag size="small">{{ getCategoryName(record.category) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="前端展示" :width="100">
            <template #cell="{ record }">
              <a-switch v-model="record.isVisible" :checked-value="1" :unchecked-value="0" size="small" @change="updateVisible(record)" />
            </template>
          </a-table-column>
          <a-table-column title="热门" :width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.isHot" :checked-value="1" :unchecked-value="0" size="small" @change="updateHot(record)" />
            </template>
          </a-table-column>
          <a-table-column title="可交易" :width="80">
            <template #cell="{ record }">
              <a-switch v-model="record.isTradable" :checked-value="1" :unchecked-value="0" size="small" @change="updateTradable(record)" />
            </template>
          </a-table-column>
          <a-table-column title="排序" data-index="sortOrder" :width="70" />
          <a-table-column title="操作" :width="120" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="editAsset(record)">编辑</a-button>
                <a-button type="text" size="small" status="danger" @click="deleteAsset(record)">删除</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑币种' : '添加币种'" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="交易对" required>
              <a-input v-model="formData.symbol" placeholder="如: BTC/USDT" :disabled="isEdit" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="名称" required>
              <a-input v-model="formData.name" placeholder="如: 比特币" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="分类">
              <a-select v-model="formData.category" style="width: 100%">
                <a-option value="main">主流币</a-option>
                <a-option value="alt">山寨币</a-option>
                <a-option value="defi">DeFi</a-option>
                <a-option value="meme">Meme</a-option>
                <a-option value="nft">NFT</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序">
              <a-input-number v-model="formData.sortOrder" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="前端展示">
              <a-switch v-model="formData.isVisible" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="热门">
              <a-switch v-model="formData.isHot" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="可交易">
              <a-switch v-model="formData.isTradable" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'

const loading = ref(false)
const syncing = ref(false)
const tableData = ref([])
const modalVisible = ref(false)
const isEdit = ref(false)

const searchForm = reactive({
  keyword: '',
  category: null,
  status: null
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const formData = reactive({
  id: null,
  symbol: '',
  name: '',
  category: 'main',
  sortOrder: 0,
  isVisible: true,
  isHot: false,
  isTradable: true
})

const formatPrice = (price) => {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1) return price.toFixed(4)
  return price.toFixed(6)
}

const formatVolume = (vol) => {
  if (vol >= 1e9) return (vol / 1e9).toFixed(2) + 'B'
  if (vol >= 1e6) return (vol / 1e6).toFixed(2) + 'M'
  if (vol >= 1e3) return (vol / 1e3).toFixed(2) + 'K'
  return vol.toFixed(2)
}

const getRandomColor = (str) => {
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const getCategoryName = (cat) => {
  const names = { main: '主流', alt: '山寨', defi: 'DeFi', meme: 'Meme', nft: 'NFT' }
  return names[cat] || cat
}

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: 1, symbol: 'BTC/USDT', name: '比特币', price: 98560.25, changePercent: 2.35, volumeUsd: 25600000000, category: 'main', sortOrder: 1, isVisible: 1, isHot: 1, isTradable: 1 },
      { id: 2, symbol: 'ETH/USDT', name: '以太坊', price: 3256.80, changePercent: 1.82, volumeUsd: 12800000000, category: 'main', sortOrder: 2, isVisible: 1, isHot: 1, isTradable: 1 },
      { id: 3, symbol: 'AGX/USDT', name: 'AGX Token', price: 0.8520, changePercent: 5.68, volumeUsd: 85600000, category: 'main', sortOrder: 3, isVisible: 1, isHot: 1, isTradable: 1 },
      { id: 4, symbol: 'SOL/USDT', name: 'Solana', price: 185.60, changePercent: -1.25, volumeUsd: 3560000000, category: 'main', sortOrder: 4, isVisible: 1, isHot: 1, isTradable: 1 },
      { id: 5, symbol: 'DOGE/USDT', name: '狗狗币', price: 0.1856, changePercent: 8.52, volumeUsd: 1560000000, category: 'meme', sortOrder: 10, isVisible: 1, isHot: 1, isTradable: 1 },
    ]
    pagination.total = 25
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handlePageChange = (page) => {
  pagination.current = page
  fetchData()
}

const syncPrices = async () => {
  syncing.value = true
  setTimeout(() => {
    Message.success('行情同步完成')
    syncing.value = false
    fetchData()
  }, 2000)
}

const showCreateModal = () => {
  isEdit.value = false
  Object.assign(formData, { id: null, symbol: '', name: '', category: 'main', sortOrder: 0, isVisible: true, isHot: false, isTradable: true })
  modalVisible.value = true
}

const editAsset = (record) => {
  isEdit.value = true
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleSubmit = () => {
  if (!formData.symbol || !formData.name) {
    Message.warning('请填写完整信息')
    return
  }
  Message.success(isEdit.value ? '修改成功' : '添加成功')
  modalVisible.value = false
  fetchData()
}

const updateVisible = (record) => {
  Message.success(record.isVisible ? '已显示' : '已隐藏')
}

const updateHot = (record) => {
  Message.success(record.isHot ? '已设为热门' : '已取消热门')
}

const updateTradable = (record) => {
  Message.success(record.isTradable ? '已开启交易' : '已关闭交易')
}

const deleteAsset = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除 ${record.symbol} 吗？`,
    onOk: () => {
      Message.success('已删除')
      fetchData()
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.text-green-500 { color: #52c41a; }
.text-red-500 { color: #f5222d; }
</style>
