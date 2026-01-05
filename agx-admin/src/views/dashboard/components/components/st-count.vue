<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <div class="w-full mx-auto">
    <div class="block lg:grid lg:grid-cols-4 lg:gap-2">
      <!-- 用户统计 -->
      <a-card
        style="height: 120px;"
        class="rounded-sm mt-3 lg:col-span-2"
        :body-style="{ padding: 0, height: '120px' }"
        :bordered="false"
        hoverable
      >
        <div class="flex justify-between h-full">
          <div class="en-title-large bg-blue-600">NU</div>
          <div class="w-full ml-4 flex justify-between items-center">
            <div class="text-lg font-medium">用户统计</div>
            <a-space size="large" class="mr-4">
              <div class="text-right">
                <div class="text-gray-500">总数</div>
                <div class="text-2xl font-bold">{{ stats.totalUsers }}</div>
              </div>
              <div class="text-right">
                <div class="text-gray-500">今日新增</div>
                <div class="text-2xl font-bold text-green-600"><icon-caret-up /> {{ stats.todayUsers }}</div>
              </div>
              <div class="text-right">
                <div class="text-gray-500">本周</div>
                <div class="text-xl font-bold">{{ stats.weekUsers }}</div>
              </div>
            </a-space>
          </div>
        </div>
      </a-card>
      <!-- 充值统计 -->
      <a-card
        style="height: 65px;"
        class="rounded-sm mt-3 lg:ml-2"
        :body-style="{ padding: 0, height: '65px' }"
        :bordered="false"
        hoverable
      >
        <div class="flex justify-between h-full">
          <div class="en-title bg-green-600">RC</div>
          <div class="w-full ml-3.5 flex justify-between items-center">
            充值统计
            <a-space size="large" class="mr-3">
              <div class="text-right">
                <div>总额</div>
                <div>{{ stats.totalRecharge }}</div>
              </div>
              <div class="text-right">
                <div>今日</div>
                <div class="text-green-600">{{ stats.todayRecharge }}</div>
              </div>
            </a-space>
          </div>
        </div>
      </a-card>
      <!-- 提现统计 -->
      <a-card
        style="height: 65px;"
        class="rounded-sm mt-3 lg:ml-2"
        :body-style="{ padding: 0, height: '65px' }"
        :bordered="false"
        hoverable
      >
        <div class="flex justify-between h-full">
          <div class="en-title bg-red-600">WD</div>
          <div class="w-full ml-3.5 flex justify-between items-center">
            提现统计
            <a-space size="large" class="mr-3">
              <div class="text-right">
                <div>总额</div>
                <div>{{ stats.totalWithdraw }}</div>
              </div>
              <div class="text-right">
                <div>待审</div>
                <div class="text-orange-500">{{ stats.pendingWithdraw }}</div>
              </div>
            </a-space>
          </div>
        </div>
      </a-card>
      <!-- 合约统计 -->
      <a-card
        style="height: 65px;"
        class="rounded-sm mt-3 lg:ml-2"
        :body-style="{ padding: 0, height: '65px' }"
        :bordered="false"
        hoverable
      >
        <div class="flex justify-between h-full">
          <div class="en-title bg-purple-600">CT</div>
          <div class="w-full ml-3.5 flex justify-between items-center">
            合约订单
            <a-space size="large" class="mr-3">
              <div class="text-right">
                <div>总数</div>
                <div>{{ stats.totalOrders }}</div>
              </div>
              <div class="text-right">
                <div>今日</div>
                <div>{{ stats.todayOrders }}</div>
              </div>
            </a-space>
          </div>
        </div>
      </a-card>
      <!-- 平台资产 -->
      <a-card
        style="height: 65px;"
        class="rounded-sm mt-3 lg:ml-2"
        :body-style="{ padding: 0, height: '65px' }"
        :bordered="false"
        hoverable
      >
        <div class="flex justify-between h-full">
          <div class="en-title bg-pink-600">AS</div>
          <div class="w-full ml-3.5 flex justify-between items-center">
            平台资产
            <a-space size="large" class="mr-3">
              <div class="text-right">
                <div>总资产</div>
                <div class="text-xl font-bold">{{ stats.totalAssets }}</div>
              </div>
            </a-space>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import agxApi from '@/api/agx'

const stats = ref({
  totalUsers: 0,
  todayUsers: 0,
  weekUsers: 0,
  totalRecharge: '0',
  todayRecharge: '0',
  totalWithdraw: '0',
  pendingWithdraw: 0,
  totalOrders: 0,
  todayOrders: 0,
  totalAssets: '0'
})

onMounted(async () => {
  try {
    const res = await agxApi.getDashboardStats()
    if (res.code === 0 && res.data) {
      stats.value = { ...stats.value, ...res.data }
    }
  } catch (e) {
    console.error('Failed to load dashboard stats', e)
  }
})
</script>

<style scoped>
.en-title {
  width: 75px; color: #fff; text-align: center;
  line-height: 65px; font-weight: bold; font-size: 1.3em;
  border-radius: 2px 0 0 2px;
}
.en-title-large {
  width: 100px; color: #fff; text-align: center;
  line-height: 120px; font-weight: bold; font-size: 1.8em;
  border-radius: 2px 0 0 2px;
}
</style>