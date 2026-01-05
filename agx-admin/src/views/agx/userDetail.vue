<template>
  <div class="ma-content-block p-4">
    <a-page-header title="用户详情" @back="$router.back()">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleRecharge">充值</a-button>
          <a-button @click="handleWinRate">胜率设置</a-button>
          <a-button :status="userInfo.status === 1 ? 'danger' : 'success'" @click="handleToggleStatus">
            {{ userInfo.status === 1 ? '禁用账户' : '启用账户' }}
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- 基本信息 -->
    <a-card title="基本信息" class="mb-4">
      <a-descriptions :column="3" bordered>
        <a-descriptions-item label="用户ID">{{ userInfo.id }}</a-descriptions-item>
        <a-descriptions-item label="UID">{{ userInfo.uid }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{ userInfo.username }}</a-descriptions-item>
        <a-descriptions-item label="昵称">{{ userInfo.nickname || '-' }}</a-descriptions-item>
        <a-descriptions-item label="邀请码">{{ userInfo.inviteCode }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="userInfo.status === 1 ? 'green' : 'red'">{{ userInfo.status === 1 ? '正常' : '禁用' }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="胜率">
          <a-tag :color="userInfo.winRate > 50 ? 'green' : userInfo.winRate < 50 ? 'red' : 'gray'">{{ userInfo.winRate }}%</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="最后登录">{{ userInfo.lastLoginAt || '-' }}</a-descriptions-item>
        <a-descriptions-item label="注册时间">{{ userInfo.createdAt }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 资产信息 -->
    <a-card title="资产信息" class="mb-4">
      <a-table :data="assets" :pagination="false" size="small">
        <template #columns>
          <a-table-column title="币种" data-index="coin" :width="100" />
          <a-table-column title="可用余额" data-index="balance" :width="200" />
          <a-table-column title="冻结" data-index="frozen" :width="200" />
          <a-table-column title="操作" :width="150">
            <template #cell="{ record }">
              <a-button type="text" size="small" @click="handleAdjust(record)">调整</a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 最近合约订单 -->
    <a-tabs default-active-key="orders" class="mb-4">
      <a-tab-pane key="orders" title="合约订单">
        <a-table :data="orders" :pagination="false" size="small">
          <template #columns>
            <a-table-column title="订单号" data-index="orderNo" :width="200" />
            <a-table-column title="交易对" data-index="symbol" :width="100" />
            <a-table-column title="方向" data-index="direction" :width="80">
              <template #cell="{ record }">
                <a-tag :color="record.direction === 1 ? 'green' : 'red'">{{ record.direction === 1 ? '涨' : '跌' }}</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="金额" data-index="amount" :width="120" />
            <a-table-column title="盈亏" data-index="profitLoss" :width="120">
              <template #cell="{ record }">
                <span :class="parseFloat(record.profitLoss) >= 0 ? 'text-green-500' : 'text-red-500'">
                  {{ record.profitLoss }}
                </span>
              </template>
            </a-table-column>
            <a-table-column title="结果" data-index="result" :width="80">
              <template #cell="{ record }">
                <a-tag v-if="record.result === 'win'" color="green">盈</a-tag>
                <a-tag v-else-if="record.result === 'lose'" color="red">亏</a-tag>
                <a-tag v-else color="orange">待结算</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="时间" data-index="createdAt" :width="170" />
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="recharge" title="充值记录">
        <a-table :data="recharges" :pagination="false" size="small">
          <template #columns>
            <a-table-column title="订单号" data-index="orderNo" :width="200" />
            <a-table-column title="币种" data-index="coin" :width="80" />
            <a-table-column title="链" data-index="chain" :width="80" />
            <a-table-column title="金额" data-index="amount" :width="120" />
            <a-table-column title="状态" data-index="status" :width="80">
              <template #cell="{ record }">
                <a-tag :color="record.status === 1 ? 'green' : 'orange'">{{ record.status === 1 ? '成功' : '待确认' }}</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="时间" data-index="createdAt" :width="170" />
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="withdraw" title="提现记录">
        <a-table :data="withdraws" :pagination="false" size="small">
          <template #columns>
            <a-table-column title="订单号" data-index="orderNo" :width="200" />
            <a-table-column title="币种" data-index="coin" :width="80" />
            <a-table-column title="金额" data-index="amount" :width="120" />
            <a-table-column title="实际到账" data-index="actualAmount" :width="120" />
            <a-table-column title="状态" data-index="status" :width="80">
              <template #cell="{ record }">
                <a-tag :color="record.status === 0 ? 'orange' : record.status === 1 ? 'green' : 'red'">
                  {{ record.status === 0 ? '待审核' : record.status === 1 ? '已通过' : '已拒绝' }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column title="时间" data-index="createdAt" :width="170" />
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <!-- 充值弹窗 -->
    <a-modal v-model:visible="rechargeVisible" title="手动充值" @ok="submitRecharge">
      <a-form :model="rechargeForm" layout="vertical">
        <a-form-item label="币种" required>
          <a-select v-model="rechargeForm.coin">
            <a-option value="USDT">USDT</a-option>
            <a-option value="BTC">BTC</a-option>
            <a-option value="ETH">ETH</a-option>
            <a-option value="AGX">AGX</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="金额" required>
          <a-input-number v-model="rechargeForm.amount" :min="0" :precision="8" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model="rechargeForm.remark" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 胜率设置弹窗 -->
    <a-modal v-model:visible="winRateVisible" title="设置胜率" @ok="submitWinRate">
      <a-form layout="vertical">
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
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import agxApi from '@/api/agx'

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const userInfo = ref({})
const assets = ref([])
const orders = ref([])
const recharges = ref([])
const withdraws = ref([])

// 充值
const rechargeVisible = ref(false)
const rechargeForm = reactive({ coin: 'USDT', amount: 0, remark: '' })

// 胜率
const winRateVisible = ref(false)
const winRateValue = ref(50)

const fetchData = async () => {
  try {
    // 获取用户列表中的该用户
    const res = await agxApi.getUserList({ keyword: '', page: 1, pageSize: 1000 })
    if (res.code === 0) {
      const user = res.data.list.find(u => u.id == userId)
      if (user) {
        userInfo.value = user
        winRateValue.value = user.winRate ?? 50
      }
    }

    // 获取用户资产
    const assetRes = await agxApi.getUserAssets(userId)
    if (assetRes.code === 0) {
      assets.value = assetRes.data.assets || []
    }

    // 获取用户订单
    const orderRes = await agxApi.getContractOrderList({ userId, page: 1, pageSize: 10 })
    if (orderRes.code === 0) {
      orders.value = orderRes.data.list || []
    }

    // 获取充值记录
    const rechargeRes = await agxApi.getRechargeList({ keyword: userInfo.value.username, page: 1, pageSize: 10 })
    if (rechargeRes.code === 0) {
      recharges.value = rechargeRes.data.list?.filter(r => r.userId == userId) || []
    }

    // 获取提现记录
    const withdrawRes = await agxApi.getWithdrawList({ keyword: userInfo.value.username, page: 1, pageSize: 10 })
    if (withdrawRes.code === 0) {
      withdraws.value = withdrawRes.data.list?.filter(w => w.userId == userId) || []
    }
  } catch (e) {
    Message.error('加载失败')
  }
}

const handleRecharge = () => {
  rechargeForm.coin = 'USDT'
  rechargeForm.amount = 0
  rechargeForm.remark = ''
  rechargeVisible.value = true
}

const submitRecharge = async () => {
  if (!rechargeForm.amount || rechargeForm.amount <= 0) {
    Message.warning('请输入有效金额')
    return
  }
  try {
    const res = await agxApi.manualRecharge({
      userId: parseInt(userId),
      coin: rechargeForm.coin,
      amount: String(rechargeForm.amount),
      remark: rechargeForm.remark
    })
    if (res.code === 0) {
      Message.success('充值成功')
      rechargeVisible.value = false
      fetchData()
    }
  } catch (e) {
    Message.error('充值失败')
  }
}

const handleWinRate = () => {
  winRateVisible.value = true
}

const submitWinRate = async () => {
  try {
    const res = await agxApi.updateUserStatus(userId, { winRate: winRateValue.value })
    if (res.code === 0) {
      Message.success('设置成功')
      winRateVisible.value = false
      userInfo.value.winRate = winRateValue.value
    }
  } catch (e) {
    Message.error('设置失败')
  }
}

const handleToggleStatus = async () => {
  try {
    const newStatus = userInfo.value.status === 1 ? 0 : 1
    const res = await agxApi.updateUserStatus(userId, { status: newStatus })
    if (res.code === 0) {
      Message.success(newStatus === 1 ? '已启用' : '已禁用')
      userInfo.value.status = newStatus
    }
  } catch (e) {
    Message.error('操作失败')
  }
}

const handleAdjust = (record) => {
  // 简化处理，用充值功能
  rechargeForm.coin = record.coin
  rechargeForm.amount = 0
  rechargeForm.remark = '资产调整'
  rechargeVisible.value = true
}

onMounted(() => { fetchData() })
</script>
