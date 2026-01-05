<template>
  <div class="p-4">
    <a-card title="VIP等级管理" :bordered="false">
      <template #extra>
        <a-input-search v-model="searchKeyword" placeholder="搜索用户" @search="handleSearch" style="width: 200px" />
      </template>

      <!-- 等级分布统计 -->
      <a-row :gutter="16" class="mb-4">
        <a-col :span="4" v-for="level in levelStats" :key="level.level">
          <a-card :bordered="false" size="small">
            <div class="text-center">
              <span class="text-2xl">{{ level.icon }}</span>
              <div class="font-medium">{{ level.name }}</div>
              <div class="text-xl font-bold">{{ level.count }}</div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="handlePageChange">
        <template #columns>
          <a-table-column title="用户" :width="160">
            <template #cell="{ record }">
              <div class="flex items-center gap-2">
                <a-avatar :size="36">{{ record.username.charAt(0) }}</a-avatar>
                <div>
                  <div class="font-medium">{{ record.username }}</div>
                  <div class="text-gray-400 text-xs">{{ record.uid }}</div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="当前等级" :width="120">
            <template #cell="{ record }">
              <a-tag :color="getLevelColor(record.level)">
                {{ getLevelIcon(record.level) }} {{ getLevelName(record.level) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="邀请人数" data-index="inviteCount" :width="100" />
          <a-table-column title="累计交易" :width="140">
            <template #cell="{ record }">
              {{ formatNumber(record.totalTrade) }} USDT
            </template>
          </a-table-column>
          <a-table-column title="累计返佣" :width="140">
            <template #cell="{ record }">
              <span class="text-green-500">{{ formatNumber(record.totalCommission) }}</span>
            </template>
          </a-table-column>
          <a-table-column title="升级时间" data-index="levelUpAt" :width="160" />
          <a-table-column title="操作" :width="150">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="adjustLevel(record)">调整等级</a-button>
                <a-button type="text" size="small" @click="viewDetail(record)">详情</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="adjustVisible" title="调整用户等级" @ok="handleAdjust">
      <a-form :model="adjustForm" layout="vertical">
        <a-form-item label="用户">
          <a-input :model-value="adjustForm.username" disabled />
        </a-form-item>
        <a-form-item label="当前等级">
          <a-tag :color="getLevelColor(adjustForm.currentLevel)">
            {{ getLevelIcon(adjustForm.currentLevel) }} {{ getLevelName(adjustForm.currentLevel) }}
          </a-tag>
        </a-form-item>
        <a-form-item label="调整为">
          <a-select v-model="adjustForm.newLevel" style="width: 100%">
            <a-option v-for="l in 5" :key="l" :value="l">
              {{ getLevelIcon(l) }} {{ getLevelName(l) }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="调整原因">
          <a-textarea v-model="adjustForm.reason" placeholder="请输入调整原因" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const tableData = ref([])
const searchKeyword = ref('')
const adjustVisible = ref(false)

const levelStats = ref([
  { level: 1, name: '普通', icon: '👤', count: 8560 },
  { level: 2, name: '银牌', icon: '🥈', count: 2560 },
  { level: 3, name: '金牌', icon: '🥇', count: 856 },
  { level: 4, name: '钻石', icon: '💎', count: 325 },
  { level: 5, name: '黑金', icon: '👑', count: 56 },
])

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const adjustForm = reactive({
  userId: null,
  username: '',
  currentLevel: 1,
  newLevel: 1,
  reason: ''
})

const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getLevelColor = (level) => {
  const colors = { 1: 'gray', 2: '#C0C0C0', 3: '#FFD700', 4: '#00CED1', 5: '#1a1a2e' }
  return colors[level] || 'gray'
}

const getLevelName = (level) => {
  const names = { 1: '普通会员', 2: '银牌会员', 3: '金牌会员', 4: '钻石会员', 5: '黑金会员' }
  return names[level] || '普通会员'
}

const getLevelIcon = (level) => {
  const icons = { 1: '👤', 2: '🥈', 3: '🥇', 4: '💎', 5: '👑' }
  return icons[level] || '👤'
}

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = [
      { id: 1, username: 'vip_user1', uid: 'U10001', level: 5, inviteCount: 156, totalTrade: 256800, totalCommission: 25680.50, levelUpAt: '2025-01-15 10:00' },
      { id: 2, username: 'vip_user2', uid: 'U10002', level: 4, inviteCount: 68, totalTrade: 125600, totalCommission: 12560.00, levelUpAt: '2025-01-18 14:30' },
      { id: 3, username: 'vip_user3', uid: 'U10003', level: 3, inviteCount: 35, totalTrade: 58600, totalCommission: 5860.00, levelUpAt: '2025-01-20 09:15' },
    ]
    pagination.total = 12357
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

const adjustLevel = (record) => {
  adjustForm.userId = record.id
  adjustForm.username = record.username
  adjustForm.currentLevel = record.level
  adjustForm.newLevel = record.level
  adjustForm.reason = ''
  adjustVisible.value = true
}

const handleAdjust = () => {
  if (!adjustForm.reason) {
    Message.warning('请输入调整原因')
    return
  }
  Message.success('等级调整成功')
  adjustVisible.value = false
  fetchData()
}

const viewDetail = (record) => {
  Message.info(`查看用户 ${record.username} 详情`)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.text-green-500 { color: #52c41a; }
</style>
