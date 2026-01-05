<template>
  <div class="p-4">
    <a-card title="邀请排行榜" :bordered="false">
      <template #extra>
        <a-radio-group v-model="timeRange" type="button" @change="fetchData">
          <a-radio value="day">日榜</a-radio>
          <a-radio value="week">周榜</a-radio>
          <a-radio value="month">月榜</a-radio>
          <a-radio value="all">总榜</a-radio>
        </a-radio-group>
      </template>

      <a-row :gutter="16" class="mb-4">
        <a-col :span="6">
          <a-select v-model="rankType" style="width: 100%" @change="fetchData">
            <a-option value="invite">邀请榜</a-option>
            <a-option value="commission">返佣榜</a-option>
            <a-option value="team">团队榜</a-option>
          </a-select>
        </a-col>
      </a-row>

      <!-- TOP3 卡片 -->
      <a-row :gutter="16" class="mb-6">
        <a-col :span="8" v-for="(item, index) in top3" :key="index">
          <a-card :bordered="false" :class="['top-card', `top-${index + 1}`]">
            <div class="text-center">
              <div class="rank-badge">{{ index + 1 }}</div>
              <a-avatar :size="64" class="mb-2">{{ item.username.charAt(0) }}</a-avatar>
              <div class="font-medium text-lg">{{ item.username }}</div>
              <div class="text-gray-400 text-sm">{{ item.uid }}</div>
              <div class="mt-2 text-xl font-bold" :class="index === 0 ? 'text-yellow-500' : 'text-blue-500'">
                {{ getScoreText(item) }}
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-table :data="tableData" :loading="loading" :pagination="false">
        <template #columns>
          <a-table-column title="排名" :width="80">
            <template #cell="{ rowIndex }">
              <span class="rank-num">{{ rowIndex + 4 }}</span>
            </template>
          </a-table-column>
          <a-table-column title="用户" :width="180">
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
          <a-table-column title="邀请人数" data-index="inviteCount" :width="100" v-if="rankType === 'invite'" />
          <a-table-column title="返佣金额" :width="140" v-if="rankType === 'commission'">
            <template #cell="{ record }">
              <span class="text-green-500">{{ formatNumber(record.commission) }} USDT</span>
            </template>
          </a-table-column>
          <a-table-column title="团队人数" data-index="teamCount" :width="100" v-if="rankType === 'team'" />
          <a-table-column title="等级" :width="100">
            <template #cell="{ record }">
              <a-tag :color="getLevelColor(record.level)">{{ getLevelName(record.level) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="注册时间" data-index="createdAt" :width="160" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(false)
const timeRange = ref('week')
const rankType = ref('invite')
const top3 = ref([])
const tableData = ref([])

const formatNumber = (num) => {
  return Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getLevelColor = (level) => {
  const colors = { 1: 'gray', 2: '#C0C0C0', 3: '#FFD700', 4: '#00CED1', 5: '#1a1a2e' }
  return colors[level] || 'gray'
}

const getLevelName = (level) => {
  const names = { 1: '普通', 2: '银牌', 3: '金牌', 4: '钻石', 5: '黑金' }
  return names[level] || '普通'
}

const getScoreText = (item) => {
  if (rankType.value === 'invite') return `${item.inviteCount} 人`
  if (rankType.value === 'commission') return `${formatNumber(item.commission)} USDT`
  return `${item.teamCount} 人`
}

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    top3.value = [
      { username: 'topuser', uid: 'U10001', inviteCount: 156, commission: 25680.50, teamCount: 856, level: 5, createdAt: '2025-01-01' },
      { username: 'trader88', uid: 'U10002', inviteCount: 98, commission: 15680.00, teamCount: 520, level: 5, createdAt: '2025-01-02' },
      { username: 'gold_king', uid: 'U10003', inviteCount: 75, commission: 12560.00, teamCount: 380, level: 4, createdAt: '2025-01-03' },
    ]
    tableData.value = [
      { username: 'user_04', uid: 'U10004', inviteCount: 56, commission: 8560.00, teamCount: 180, level: 4, createdAt: '2025-01-05' },
      { username: 'user_05', uid: 'U10005', inviteCount: 45, commission: 6580.00, teamCount: 125, level: 3, createdAt: '2025-01-06' },
      { username: 'user_06', uid: 'U10006', inviteCount: 38, commission: 5680.00, teamCount: 95, level: 3, createdAt: '2025-01-08' },
      { username: 'user_07', uid: 'U10007', inviteCount: 32, commission: 4560.00, teamCount: 78, level: 3, createdAt: '2025-01-10' },
    ]
    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.top-card { position: relative; }
.top-1 { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); }
.top-2 { background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%); }
.top-3 { background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%); }
.rank-badge { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; background: rgba(0,0,0,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
.rank-num { font-weight: bold; color: #666; }
.text-yellow-500 { color: #FFD700; }
.text-blue-500 { color: #1890ff; }
.text-green-500 { color: #52c41a; }
</style>
