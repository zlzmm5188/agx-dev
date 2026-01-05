<template>
  <div class="ma-content-block p-4">
    <!-- 搜索区域 -->
    <a-row class="mb-4">
      <a-col :span="24">
        <a-space>
          <a-input v-model="searchForm.keyword" placeholder="用户名/UID/昵称" allow-clear style="width: 200px" />
          <a-select v-model="searchForm.status" placeholder="状态" allow-clear style="width: 120px">
            <a-option :value="1">正常</a-option>
            <a-option :value="0">禁用</a-option>
          </a-select>
          <a-button type="primary" @click="handleSearch">
            <template #icon><icon-search /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon><icon-refresh /></template>
            重置
          </a-button>
          <a-button v-if="selectedKeys.length > 0" type="outline" status="danger" @click="handleBatchDisable">
            批量禁用({{ selectedKeys.length }})
          </a-button>
          <a-button v-if="selectedKeys.length > 0" type="outline" status="success" @click="handleBatchEnable">
            批量启用({{ selectedKeys.length }})
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 表格 -->
    <a-table
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      row-key="id"
      :row-selection="{ type: 'checkbox', showCheckedAll: true, onlyCurrent: false }"
      v-model:selectedKeys="selectedKeys"
    >
      <template #columns>
        <a-table-column title="ID" data-index="id" :width="80" />
        <a-table-column title="UID" data-index="uid" :width="120" />
        <a-table-column title="用户名" data-index="username" :width="150" />
        <a-table-column title="昵称" data-index="nickname" :width="120" />
        <a-table-column title="邀请码" data-index="inviteCode" :width="100" />
        <a-table-column title="KYC状态" data-index="kycStatus" :width="100">
          <template #cell="{ record }">
            <a-tag v-if="record.kycStatus === 0" color="gray">未认证</a-tag>
            <a-tag v-else-if="record.kycStatus === 1" color="orange">待审核</a-tag>
            <a-tag v-else-if="record.kycStatus === 2" color="green">已认证</a-tag>
            <a-tag v-else color="red">已拒绝</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" :width="100">
          <template #cell="{ record }">
            <a-tag v-if="record.status === 1" color="green">正常</a-tag>
            <a-tag v-else color="red">禁用</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="胜率" data-index="winRate" :width="100">
          <template #cell="{ record }">
            <a-tag :color="record.winRate > 50 ? 'green' : record.winRate < 50 ? 'red' : 'gray'">{{ record.winRate }}%</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="最后登录" data-index="lastLoginAt" :width="170" />
        <a-table-column title="注册时间" data-index="createdAt" :width="170" />
        <a-table-column title="操作" :width="280" fixed="right">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleDetail(record)">详情</a-button>
              <a-button type="text" size="small" @click="handleAsset(record)">资产</a-button>
              <a-button type="text" size="small" @click="handleWinRate(record)">胜率</a-button>
              <a-popconfirm
                :content="record.status === 1 ? '确定禁用该用户？' : '确定启用该用户？'"
                @ok="handleToggleStatus(record)"
              >
                <a-button v-if="record.status === 1" type="text" status="danger" size="small">禁用</a-button>
                <a-button v-else type="text" status="success" size="small">启用</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <!-- 资产管理弹窗 -->
    <a-modal v-model:visible="assetVisible" title="用户资产管理" width="700px" :footer="false">
      <a-spin :loading="assetLoading">
        <a-table :data="userAssets" :pagination="false" size="small">
          <template #columns>
            <a-table-column title="币种" data-index="coin" :width="100" />
            <a-table-column title="可用余额" data-index="balance" :width="150" />
            <a-table-column title="冻结余额" data-index="frozen" :width="150" />
            <a-table-column title="操作" :width="120">
              <template #cell="{ record }">
                <a-button type="text" size="small" @click="openAdjust(record)">调整</a-button>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-spin>
    </a-modal>

    <!-- 资产调整弹窗 -->
    <a-modal v-model:visible="adjustVisible" title="调整资产" @ok="submitAdjust">
      <a-form :model="adjustForm" layout="vertical">
        <a-form-item label="币种">
          <a-input :value="adjustForm.coinSymbol" disabled />
        </a-form-item>
        <a-form-item label="当前余额">
          <a-input :value="adjustForm.currentBalance" disabled />
        </a-form-item>
        <a-form-item label="操作类型">
          <a-radio-group v-model="adjustForm.type">
            <a-radio value="add">增加</a-radio>
            <a-radio value="sub">扣除</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="金额">
          <a-input-number v-model="adjustForm.amount" :min="0" :precision="8" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model="adjustForm.remark" placeholder="调整原因" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 胜率设置弹窗 -->
    <a-modal v-model:visible="winRateVisible" title="设置用户胜率" @ok="submitWinRate">
      <a-form layout="vertical">
        <a-form-item label="用户">
          <a-input :value="currentUser?.username" disabled />
        </a-form-item>
        <a-form-item label="胜率(0-100)">
          <a-slider v-model="winRateValue" :min="0" :max="100" show-input />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-tag color="red">必输(0-30%)</a-tag>
            <a-tag color="orange">偏输(30-50%)</a-tag>
            <a-tag color="gray">正常(50%)</a-tag>
            <a-tag color="arcoblue">偏赢(50-70%)</a-tag>
            <a-tag color="green">必赢(70-100%)</a-tag>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import agxApi from '@/api/agx'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const selectedKeys = ref([])
const searchForm = reactive({
  keyword: '',
  status: undefined
})

// 资产管理
const assetVisible = ref(false)
const assetLoading = ref(false)
const userAssets = ref([])
const currentUserId = ref(null)

// 资产调整
const adjustVisible = ref(false)
const adjustForm = reactive({
  coinId: null,
  coinSymbol: '',
  currentBalance: '',
  type: 'add',
  amount: 0,
  remark: ''
})

// 胜率设置
const winRateVisible = ref(false)
const winRateValue = ref(50)
const currentUser = ref(null)

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await agxApi.getUserList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    if (res.code === 0) {
      tableData.value = res.data?.list || res.list || []
      pagination.total = res.data?.total || res.total || 0
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = undefined
  pagination.current = 1
  selectedKeys.value = []
  fetchData()
}

const handleDetail = (record) => {
  router.push(`/agx/user/${record.id}`)
}

const onPageChange = (page) => {
  pagination.current = page
  fetchData()
}

const onPageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.current = 1
  fetchData()
}

const handleToggleStatus = async (record) => {
  try {
    const newStatus = record.status === 1 ? 0 : 1
    const res = await agxApi.updateUserStatus(record.id, { status: newStatus })
    if (res.code === 0) {
      Message.success(newStatus === 1 ? '已启用' : '已禁用')
      fetchData()
    }
  } catch (e) {
    console.error(e)
  }
}

const handleBatchDisable = async () => {
  if (selectedKeys.value.length === 0) return
  try {
    for (const id of selectedKeys.value) {
      await agxApi.updateUserStatus(id, { status: 0 })
    }
    Message.success(`已禁用 ${selectedKeys.value.length} 个用户`)
    selectedKeys.value = []
    fetchData()
  } catch (e) {
    Message.error('操作失败')
  }
}

const handleBatchEnable = async () => {
  if (selectedKeys.value.length === 0) return
  try {
    for (const id of selectedKeys.value) {
      await agxApi.updateUserStatus(id, { status: 1 })
    }
    Message.success(`已启用 ${selectedKeys.value.length} 个用户`)
    selectedKeys.value = []
    fetchData()
  } catch (e) {
    Message.error('操作失败')
  }
}

// 资产管理
const handleAsset = async (record) => {
  currentUserId.value = record.id
  assetVisible.value = true
  assetLoading.value = true
  try {
    const res = await agxApi.getUserAssets(record.id)
    if (res.code === 0) {
      userAssets.value = res.data?.assets || []
    }
  } finally {
    assetLoading.value = false
  }
}

const openAdjust = (record) => {
  adjustForm.coinId = record.coinId
  adjustForm.coinSymbol = record.coin || record.coinSymbol
  adjustForm.currentBalance = record.balance
  adjustForm.type = 'add'
  adjustForm.amount = 0
  adjustForm.remark = ''
  adjustVisible.value = true
}

const submitAdjust = async () => {
  if (!adjustForm.amount || adjustForm.amount <= 0) {
    Message.warning('请输入有效金额')
    return
  }
  try {
    const res = await agxApi.adjustUserAsset(currentUserId.value, {
      coinId: adjustForm.coinId,
      amount: String(adjustForm.amount),
      type: adjustForm.type,
      remark: adjustForm.remark
    })
    if (res.code === 0) {
      Message.success('调整成功')
      adjustVisible.value = false
      handleAsset({ id: currentUserId.value })
    }
  } catch (e) {
    Message.error('调整失败')
  }
}

// 胜率设置
const handleWinRate = (record) => {
  currentUser.value = record
  winRateValue.value = record.winRate ?? 50
  winRateVisible.value = true
}

const submitWinRate = async () => {
  try {
    const res = await agxApi.updateUserStatus(currentUser.value.id, { winRate: winRateValue.value })
    if (res.code === 0) {
      Message.success('胜率设置成功')
      winRateVisible.value = false
      fetchData()
    }
  } catch (e) {
    Message.error('设置失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>
