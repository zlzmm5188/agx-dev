<template>
  <div class="permission-matrix-container">
    <a-card title="等级权限矩阵">
      <template #extra>
        <a-space>
          <a-button @click="handleInitDefault">初始化默认配置</a-button>
          <a-button type="primary" @click="handleSave">保存配置</a-button>
        </a-space>
      </template>

      <a-alert class="mb-4" type="info">
        配置不同用户等级的功能权限和限制。修改后点击"保存配置"生效。
      </a-alert>

      <!-- 权限矩阵表格 -->
      <a-table :columns="columns" :data="matrixData" :pagination="false" :loading="loading" :bordered="{ cell: true }">
        <template #level1="{ record }">
          <div class="permission-cell">
            <a-switch v-model="record.levels[0].allowed" :checked-value="1" :unchecked-value="0" size="small" />
            <a-input-number v-if="record.hasLimit" v-model="record.levels[0].limitValue" size="small" :min="0" style="width: 70px; margin-left: 8px" />
          </div>
        </template>
        <template #level2="{ record }">
          <div class="permission-cell">
            <a-switch v-model="record.levels[1].allowed" :checked-value="1" :unchecked-value="0" size="small" />
            <a-input-number v-if="record.hasLimit" v-model="record.levels[1].limitValue" size="small" :min="0" style="width: 70px; margin-left: 8px" />
          </div>
        </template>
        <template #level3="{ record }">
          <div class="permission-cell">
            <a-switch v-model="record.levels[2].allowed" :checked-value="1" :unchecked-value="0" size="small" />
            <a-input-number v-if="record.hasLimit" v-model="record.levels[2].limitValue" size="small" :min="0" style="width: 70px; margin-left: 8px" />
          </div>
        </template>
        <template #level4="{ record }">
          <div class="permission-cell">
            <a-switch v-model="record.levels[3].allowed" :checked-value="1" :unchecked-value="0" size="small" />
            <a-input-number v-if="record.hasLimit" v-model="record.levels[3].limitValue" size="small" :min="0" style="width: 70px; margin-left: 8px" />
          </div>
        </template>
        <template #level5="{ record }">
          <div class="permission-cell">
            <a-switch v-model="record.levels[4].allowed" :checked-value="1" :unchecked-value="0" size="small" />
            <a-input-number v-if="record.hasLimit" v-model="record.levels[4].limitValue" size="small" :min="0" style="width: 70px; margin-left: 8px" />
          </div>
        </template>
      </a-table>

      <!-- 添加新权限 -->
      <a-divider>添加新权限项</a-divider>
      <a-form :model="newPermForm" layout="inline">
        <a-form-item label="权限键">
          <a-input v-model="newPermForm.key" placeholder="如 can_xxx" style="width: 150px" />
        </a-form-item>
        <a-form-item label="权限名称">
          <a-input v-model="newPermForm.name" placeholder="权限显示名称" style="width: 150px" />
        </a-form-item>
        <a-form-item label="有数量限制">
          <a-switch v-model="newPermForm.hasLimit" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleAddPermission">添加</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)

const columns = [
  { title: '权限项', dataIndex: 'name', width: 180, fixed: 'left' },
  { title: '普通用户', dataIndex: 'level1', slotName: 'level1', width: 150, align: 'center' },
  { title: '银牌会员', dataIndex: 'level2', slotName: 'level2', width: 150, align: 'center' },
  { title: '金牌会员', dataIndex: 'level3', slotName: 'level3', width: 150, align: 'center' },
  { title: '钻石会员', dataIndex: 'level4', slotName: 'level4', width: 150, align: 'center' },
  { title: '黑金会员', dataIndex: 'level5', slotName: 'level5', width: 150, align: 'center' },
]

const matrixData = ref([])

const newPermForm = reactive({
  key: '',
  name: '',
  hasLimit: false
})

const mockData = () => {
  matrixData.value = [
    {
      key: 'can_post',
      name: '可以发帖',
      hasLimit: false,
      levels: [
        { level: 1, allowed: 1, limitValue: null },
        { level: 2, allowed: 1, limitValue: null },
        { level: 3, allowed: 1, limitValue: null },
        { level: 4, allowed: 1, limitValue: null },
        { level: 5, allowed: 1, limitValue: null },
      ]
    },
    {
      key: 'can_comment',
      name: '可以评论',
      hasLimit: false,
      levels: [
        { level: 1, allowed: 1, limitValue: null },
        { level: 2, allowed: 1, limitValue: null },
        { level: 3, allowed: 1, limitValue: null },
        { level: 4, allowed: 1, limitValue: null },
        { level: 5, allowed: 1, limitValue: null },
      ]
    },
    {
      key: 'can_add_friend',
      name: '可以加好友',
      hasLimit: false,
      levels: [
        { level: 1, allowed: 1, limitValue: null },
        { level: 2, allowed: 1, limitValue: null },
        { level: 3, allowed: 1, limitValue: null },
        { level: 4, allowed: 1, limitValue: null },
        { level: 5, allowed: 1, limitValue: null },
      ]
    },
    {
      key: 'can_chat',
      name: '可以私聊',
      hasLimit: false,
      levels: [
        { level: 1, allowed: 1, limitValue: null },
        { level: 2, allowed: 1, limitValue: null },
        { level: 3, allowed: 1, limitValue: null },
        { level: 4, allowed: 1, limitValue: null },
        { level: 5, allowed: 1, limitValue: null },
      ]
    },
    {
      key: 'daily_post_limit',
      name: '每日发帖上限',
      hasLimit: true,
      levels: [
        { level: 1, allowed: 1, limitValue: 5 },
        { level: 2, allowed: 1, limitValue: 10 },
        { level: 3, allowed: 1, limitValue: 20 },
        { level: 4, allowed: 1, limitValue: 50 },
        { level: 5, allowed: 1, limitValue: 100 },
      ]
    },
    {
      key: 'friend_limit',
      name: '好友数量上限',
      hasLimit: true,
      levels: [
        { level: 1, allowed: 1, limitValue: 100 },
        { level: 2, allowed: 1, limitValue: 200 },
        { level: 3, allowed: 1, limitValue: 500 },
        { level: 4, allowed: 1, limitValue: 1000 },
        { level: 5, allowed: 1, limitValue: 5000 },
      ]
    },
    {
      key: 'daily_message_limit',
      name: '每日私聊消息上限',
      hasLimit: true,
      levels: [
        { level: 1, allowed: 1, limitValue: 50 },
        { level: 2, allowed: 1, limitValue: 100 },
        { level: 3, allowed: 1, limitValue: 200 },
        { level: 4, allowed: 1, limitValue: 500 },
        { level: 5, allowed: 1, limitValue: 999999 },
      ]
    },
  ]
}

const handleSave = () => {
  // 收集所有权限数据
  const permissions = []
  matrixData.value.forEach((row) => {
    row.levels.forEach((l) => {
      permissions.push({
        level: l.level,
        permissionKey: row.key,
        allowed: l.allowed,
        limitValue: l.limitValue,
      })
    })
  })
  
  console.log('保存权限矩阵:', permissions)
  Message.success('权限矩阵配置已保存')
}

const handleInitDefault = () => {
  mockData()
  Message.success('已恢复默认配置')
}

const handleAddPermission = () => {
  if (!newPermForm.key || !newPermForm.name) {
    Message.warning('请填写完整信息')
    return
  }

  // 检查是否已存在
  const exists = matrixData.value.find((p) => p.key === newPermForm.key)
  if (exists) {
    Message.warning('该权限键已存在')
    return
  }

  matrixData.value.push({
    key: newPermForm.key,
    name: newPermForm.name,
    hasLimit: newPermForm.hasLimit,
    levels: [1, 2, 3, 4, 5].map((level) => ({
      level,
      allowed: 1,
      limitValue: newPermForm.hasLimit ? 10 : null,
    })),
  })

  newPermForm.key = ''
  newPermForm.name = ''
  newPermForm.hasLimit = false

  Message.success('权限项已添加')
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.permission-matrix-container {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
.permission-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
