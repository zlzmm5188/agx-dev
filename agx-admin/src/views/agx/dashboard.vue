<template>
  <div class="p-4">
    <!-- 统计卡片 -->
    <a-row :gutter="16" class="mb-4">
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <a-statistic title="总用户数" :value="stats.totalUsers" show-group-separator>
            <template #prefix><icon-user class="text-blue-500" /></template>
          </a-statistic>
          <div class="stat-footer">今日: +{{ stats.todayUsers }} | 本周: {{ stats.weekUsers }}</div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <a-statistic title="总充值" :value="stats.totalRecharge" show-group-separator>
            <template #prefix><icon-download class="text-green-500" /></template>
            <template #suffix>USDT</template>
          </a-statistic>
          <div class="stat-footer">今日充值: {{ stats.todayRecharge }}</div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <a-statistic title="总提现" :value="stats.totalWithdraw" show-group-separator>
            <template #prefix><icon-upload class="text-orange-500" /></template>
            <template #suffix>USDT</template>
          </a-statistic>
          <div class="stat-footer">待审核: {{ stats.pendingWithdraw }}</div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <a-statistic title="平台总资产" :value="stats.totalAssets" show-group-separator>
            <template #prefix><icon-safe class="text-purple-500" /></template>
            <template #suffix>USDT</template>
          </a-statistic>
          <div class="stat-footer">用户钱包余额总和</div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="mb-4">
      <a-col :span="6">
        <a-card class="stat-card" :class="{ pending: stats.pendingKyc > 0 }" :bordered="false">
          <a-statistic title="待审核KYC" :value="stats.pendingKyc" show-group-separator>
            <template #prefix><icon-id-card class="text-yellow-500" /></template>
          </a-statistic>
          <div class="stat-footer" :style="stats.pendingKyc > 0 ? 'color: #faad14' : ''">
            {{ stats.pendingKyc > 0 ? '请及时处理' : '暂无待处理' }}
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :class="{ pending: stats.pendingWithdraw > 0 }" :bordered="false">
          <a-statistic title="待处理提现" :value="stats.pendingWithdraw" show-group-separator>
            <template #prefix><icon-upload class="text-red-500" /></template>
          </a-statistic>
          <div class="stat-footer" :style="stats.pendingWithdraw > 0 ? 'color: #f5222d' : ''">
            {{ stats.pendingWithdraw > 0 ? '请及时处理' : '暂无待处理' }}
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <a-statistic title="合约订单" :value="stats.totalOrders" show-group-separator>
            <template #prefix><icon-thunderbolt class="text-blue-500" /></template>
          </a-statistic>
          <div class="stat-footer">今日: {{ stats.todayOrders }}</div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <a-statistic title="矿池总额" :value="stats.poolTotal" show-group-separator>
            <template #prefix><icon-storage class="text-green-500" /></template>
            <template #suffix>USDT</template>
          </a-statistic>
          <div class="stat-footer">活跃持仓</div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷操作 -->
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="快捷搜索用户" class="mb-4" :bordered="false">
          <a-input-search
            v-model="searchKeyword"
            placeholder="输入用户名/UID/ID搜索"
            search-button
            @search="handleSearchUser"
            @press-enter="handleSearchUser"
          />
          <div v-if="searchResults.length > 0" class="search-results mt-2">
            <a-list :data="searchResults" size="small" :bordered="false">
              <template #item="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #title>
                      <a-link @click="goUserDetail(item.id)">{{ item.username }}</a-link>
                    </template>
                    <template #description>
                      UID: {{ item.uid }} | 胜率: {{ item.winRate }}%
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-button type="text" size="small" @click="goUserDetail(item.id)">查看</a-button>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </div>
          <div v-else-if="searched && searchResults.length === 0" class="mt-2 text-gray-400">
            未找到用户
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="快捷操作" class="mb-4" :bordered="false">
          <a-space wrap>
            <a-button type="primary" @click="$router.push('/user/kyc')">
              <template #icon><icon-id-card /></template>
              KYC审核
              <a-badge v-if="stats.pendingKyc > 0" :count="stats.pendingKyc" :offset="[8, -4]" />
            </a-button>
            <a-button type="primary" status="warning" @click="$router.push('/finance/withdraw')">
              <template #icon><icon-upload /></template>
              提现审核
              <a-badge v-if="stats.pendingWithdraw > 0" :count="stats.pendingWithdraw" :offset="[8, -4]" />
            </a-button>
            <a-button type="primary" status="success" @click="$router.push('/product/pool')">
              <template #icon><icon-plus /></template>
              矿池产品
            </a-button>
            <a-button @click="$router.push('/product/contract')">
              <template #icon><icon-thunderbolt /></template>
              合约配置
            </a-button>
            <a-button @click="$router.push('/user/list')">
              <template #icon><icon-user /></template>
              用户管理
            </a-button>
            <a-button type="outline" @click="$router.push('/system/notice')">
              <template #icon><icon-notification /></template>
              发布公告
            </a-button>
          </a-space>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="系统信息" class="mb-4" :bordered="false">
          <a-descriptions :column="2" size="small">
            <a-descriptions-item label="系统版本">AGX v1.0.0</a-descriptions-item>
            <a-descriptions-item label="后端状态">
              <a-tag color="green">运行中</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="数据库">PostgreSQL 16</a-descriptions-item>
            <a-descriptions-item label="服务器时间">{{ serverTime }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>

    <!-- 待审核列表 -->
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="待审核KYC" class="mb-4" :bordered="false">
          <template #extra>
            <a-link @click="$router.push('/user/kyc')">查看全部</a-link>
          </template>
          <a-table :data="pendingKycList" :pagination="false" size="small">
            <template #columns>
              <a-table-column title="用户" data-index="username" :width="100" />
              <a-table-column title="姓名" data-index="realName" :width="100" />
              <a-table-column title="申请时间" data-index="createdAt" :width="170" />
              <a-table-column title="操作" :width="80">
                <template #cell="{ record }">
                  <a-button type="text" size="small" @click="$router.push('/user/kyc')">审核</a-button>
                </template>
              </a-table-column>
            </template>
            <template #empty>
              <div class="text-gray-400 py-4">暂无待审核KYC</div>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="待审核提现" class="mb-4" :bordered="false">
          <template #extra>
            <a-link @click="$router.push('/finance/withdraw')">查看全部</a-link>
          </template>
          <a-table :data="pendingWithdrawList" :pagination="false" size="small">
            <template #columns>
              <a-table-column title="用户" data-index="username" :width="100" />
              <a-table-column title="金额" :width="120">
                <template #cell="{ record }">
                  <span class="text-red-500">-{{ record.amount }} {{ record.coin }}</span>
                </template>
              </a-table-column>
              <a-table-column title="申请时间" data-index="createdAt" :width="170" />
              <a-table-column title="操作" :width="80">
                <template #cell="{ record }">
                  <a-button type="text" size="small" @click="$router.push('/finance/withdraw')">审核</a-button>
                </template>
              </a-table-column>
            </template>
            <template #empty>
              <div class="text-gray-400 py-4">暂无待审核提现</div>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import agxApi from '@/api/agx'

const router = useRouter()

const stats = reactive({
  totalUsers: 0,
  todayUsers: 0,
  weekUsers: 0,
  totalRecharge: 0,
  todayRecharge: 0,
  totalWithdraw: 0,
  pendingWithdraw: 0,
  totalOrders: 0,
  todayOrders: 0,
  totalAssets: 0,
  poolTotal: 0,
  pendingKyc: 0
})

const serverTime = ref('')
const searchKeyword = ref('')
const searchResults = ref([])
const searched = ref(false)
const pendingKycList = ref([])
const pendingWithdrawList = ref([])
let timer = null
let statsTimer = null

const updateTime = () => {
  serverTime.value = new Date().toLocaleString('zh-CN')
}

const fetchStats = async () => {
  try {
    const res = await agxApi.getDashboardStats()
    if (res.code === 0 && res.data) {
      Object.assign(stats, res.data)
    }
  } catch (e) {
    console.error(e)
  }
}

const fetchPendingList = async () => {
  try {
    const res = await agxApi.getPendingList()
    if (res.code === 0 && res.data) {
      pendingKycList.value = res.data.pendingKyc || []
      pendingWithdrawList.value = res.data.pendingWithdraw || []
    }
  } catch (e) {
    console.error(e)
  }
}

const handleSearchUser = async () => {
  if (!searchKeyword.value.trim()) return
  searched.value = true
  try {
    const res = await agxApi.getUserList({ keyword: searchKeyword.value, page: 1, pageSize: 5 })
    if (res.code === 0) {
      searchResults.value = res.data.list || []
    }
  } catch (e) {
    searchResults.value = []
  }
}

const goUserDetail = (id) => {
  router.push(`/agx/user/${id}`)
}

onMounted(() => {
  updateTime()
  fetchStats()
  fetchPendingList()
  timer = setInterval(updateTime, 1000)
  statsTimer = setInterval(() => {
    fetchStats()
    fetchPendingList()
  }, 30000) // 每30秒刷新统计
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (statsTimer) clearInterval(statsTimer)
})
</script>

<style scoped>
.stat-card {
  text-align: center;
}
.stat-card.pending {
  border-left: 3px solid #faad14;
}
.stat-footer {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
