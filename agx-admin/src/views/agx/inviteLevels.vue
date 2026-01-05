<template>
  <div class="p-4">
    <a-card title="等级规则配置" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="handleSave" :loading="saving">
          <template #icon><icon-save /></template>
          保存配置
        </a-button>
      </template>

      <a-alert type="info" class="mb-4">
        用户等级根据邀请人数自动升级，等级越高返佣比例越高、手续费折扣越多
      </a-alert>

      <a-table :data="levelList" :pagination="false">
        <template #columns>
          <a-table-column title="等级" :width="120">
            <template #cell="{ record }">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ record.icon }}</span>
                <div>
                  <div class="font-medium" :style="{ color: record.color }">{{ record.name }}</div>
                  <div class="text-gray-400 text-xs">Lv.{{ record.level }}</div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="升级条件" :width="150">
            <template #cell="{ record }">
              <a-input-number v-model="record.minInvite" :min="0" size="small" style="width: 100px">
                <template #suffix>人</template>
              </a-input-number>
            </template>
          </a-table-column>
          <a-table-column title="一级返佣" :width="120">
            <template #cell="{ record }">
              <a-input-number v-model="record.commission1" :min="0" :max="100" :precision="2" size="small" style="width: 90px">
                <template #suffix>%</template>
              </a-input-number>
            </template>
          </a-table-column>
          <a-table-column title="二级返佣" :width="120">
            <template #cell="{ record }">
              <a-input-number v-model="record.commission2" :min="0" :max="100" :precision="2" size="small" style="width: 90px">
                <template #suffix>%</template>
              </a-input-number>
            </template>
          </a-table-column>
          <a-table-column title="手续费折扣" :width="120">
            <template #cell="{ record }">
              <a-input-number v-model="record.feeDiscount" :min="0" :max="100" :precision="0" size="small" style="width: 90px">
                <template #suffix>%</template>
              </a-input-number>
            </template>
          </a-table-column>
          <a-table-column title="专属权益" :width="200">
            <template #cell="{ record }">
              <a-input v-model="record.benefits" size="small" placeholder="权益说明" />
            </template>
          </a-table-column>
          <a-table-column title="当前人数" data-index="userCount" :width="100" />
        </template>
      </a-table>

      <a-divider />

      <a-form layout="vertical" class="max-w-xl">
        <a-form-item label="自动升级">
          <a-switch v-model="autoUpgrade" />
          <span class="ml-2">{{ autoUpgrade ? '已开启' : '已关闭' }}</span>
          <template #help>开启后，用户邀请人数达标自动升级</template>
        </a-form-item>
        <a-form-item label="等级保护期(天)">
          <a-input-number v-model="protectDays" :min="0" style="width: 200px" />
          <template #help>在保护期内不会因人数减少而降级</template>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const saving = ref(false)
const autoUpgrade = ref(true)
const protectDays = ref(30)

const levelList = ref([
  { level: 1, name: '普通会员', icon: '👤', color: '#999', minInvite: 0, commission1: 15, commission2: 5, feeDiscount: 100, benefits: '基础功能', userCount: 8560 },
  { level: 2, name: '银牌会员', icon: '🥈', color: '#C0C0C0', minInvite: 5, commission1: 18, commission2: 8, feeDiscount: 95, benefits: '专属客服', userCount: 2560 },
  { level: 3, name: '金牌会员', icon: '🥇', color: '#FFD700', minInvite: 20, commission1: 20, commission2: 10, feeDiscount: 90, benefits: '优先提现', userCount: 856 },
  { level: 4, name: '钻石会员', icon: '💎', color: '#00CED1', minInvite: 50, commission1: 22, commission2: 12, feeDiscount: 85, benefits: '专属活动', userCount: 325 },
  { level: 5, name: '黑金会员', icon: '👑', color: '#1a1a2e', minInvite: 100, commission1: 25, commission2: 15, feeDiscount: 80, benefits: '最高权益', userCount: 56 },
])

const handleSave = async () => {
  saving.value = true
  setTimeout(() => {
    Message.success('配置保存成功')
    saving.value = false
  }, 1000)
}

onMounted(() => {})
</script>

<style scoped>
.max-w-xl { max-width: 36rem; }
</style>
