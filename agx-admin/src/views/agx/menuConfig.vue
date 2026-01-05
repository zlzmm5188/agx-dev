<template>
  <div class="menu-config-container">
    <a-card title="前端菜单配置">
      <template #extra>
        <a-space>
          <a-button @click="handlePreview">
            <template #icon><icon-eye /></template>
            预览效果
          </a-button>
          <a-button type="primary" @click="handleAdd">
            <template #icon><icon-plus /></template>
            添加菜单
          </a-button>
        </a-space>
      </template>

      <a-alert class="mb-4" type="info">
        配置前端App的菜单展示，包括底部导航、九宫格功能入口、侧边栏等。修改后需点击"发布配置"生效。
      </a-alert>

      <!-- Tab切换 - 按位置分类 -->
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="bottom" title="底部导航" />
        <a-tab-pane key="grid" title="九宫格入口" />
        <a-tab-pane key="sidebar" title="侧边栏菜单" />
        <a-tab-pane key="quick" title="快捷入口" />
      </a-tabs>

      <!-- 底部导航配置 -->
      <template v-if="activeTab === 'bottom'">
        <div class="menu-preview mb-4">
          <div class="bottom-nav-preview">
            <div v-for="item in bottomNavData" :key="item.id" class="nav-item" :class="{ active: item.active }">
              <div class="nav-icon">{{ item.icon }}</div>
              <div class="nav-text">{{ item.title }}</div>
            </div>
          </div>
        </div>
        <a-table :columns="menuColumns" :data="bottomNavData" :loading="loading">
          <template #icon="{ record }">
            <span class="menu-icon">{{ record.icon }}</span>
          </template>
          <template #status="{ record }">
            <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" />
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="text" size="small" @click="handleMoveUp(record)">上移</a-button>
              <a-button type="text" size="small" @click="handleMoveDown(record)">下移</a-button>
            </a-space>
          </template>
        </a-table>
      </template>

      <!-- 九宫格入口配置 -->
      <template v-if="activeTab === 'grid'">
        <div class="menu-preview mb-4">
          <div class="grid-preview">
            <div v-for="item in gridData" :key="item.id" class="grid-item">
              <div class="grid-icon">{{ item.icon }}</div>
              <div class="grid-text">{{ item.title }}</div>
            </div>
          </div>
        </div>
        <a-table :columns="menuColumns" :data="gridData" :loading="loading">
          <template #icon="{ record }">
            <span class="menu-icon">{{ record.icon }}</span>
          </template>
          <template #status="{ record }">
            <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" />
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm content="确定删除？" @ok="handleDelete(record)">
                <a-button type="text" size="small" status="danger">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </template>

      <!-- 侧边栏菜单配置 -->
      <template v-if="activeTab === 'sidebar'">
        <a-table :columns="sidebarColumns" :data="sidebarData" :loading="loading">
          <template #icon="{ record }">
            <span class="menu-icon">{{ record.icon }}</span>
          </template>
          <template #status="{ record }">
            <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" />
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm content="确定删除？" @ok="handleDelete(record)">
                <a-button type="text" size="small" status="danger">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </template>

      <!-- 快捷入口配置 -->
      <template v-if="activeTab === 'quick'">
        <a-table :columns="menuColumns" :data="quickData" :loading="loading">
          <template #icon="{ record }">
            <span class="menu-icon">{{ record.icon }}</span>
          </template>
          <template #status="{ record }">
            <a-switch v-model="record.status" :checked-value="1" :unchecked-value="0" />
          </template>
          <template #action="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm content="确定删除？" @ok="handleDelete(record)">
                <a-button type="text" size="small" status="danger">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </template>

      <div class="mt-4">
        <a-space>
          <a-button type="primary" @click="handlePublish">发布配置</a-button>
          <a-button @click="handleReset">重置为默认</a-button>
        </a-space>
      </div>
    </a-card>

    <!-- 添加/编辑菜单弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="isEdit ? '编辑菜单' : '添加菜单'" @ok="handleSubmit">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="菜单名称" required>
          <a-input v-model="formData.title" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item label="菜单图标">
          <a-input v-model="formData.icon" placeholder="图标名称或emoji" />
        </a-form-item>
        <a-form-item label="跳转路径" required>
          <a-input v-model="formData.path" placeholder="如 /market 或 https://..." />
        </a-form-item>
        <a-form-item label="菜单位置" required>
          <a-select v-model="formData.position" placeholder="选择位置">
            <a-option value="bottom">底部导航</a-option>
            <a-option value="grid">九宫格入口</a-option>
            <a-option value="sidebar">侧边栏</a-option>
            <a-option value="quick">快捷入口</a-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="排序权重">
              <a-input-number v-model="formData.sort" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否显示">
              <a-switch v-model="formData.status" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="权限要求">
          <a-checkbox-group v-model="formData.permissions">
            <a-checkbox value="login">需要登录</a-checkbox>
            <a-checkbox value="kyc">需要KYC</a-checkbox>
            <a-checkbox value="vip">VIP专属</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const activeTab = ref('bottom')
const modalVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  title: '',
  icon: '',
  path: '',
  position: 'grid',
  sort: 0,
  status: true,
  permissions: []
})

const menuColumns = [
  { title: '图标', dataIndex: 'icon', slotName: 'icon', width: 60 },
  { title: '名称', dataIndex: 'title', width: 120 },
  { title: '路径', dataIndex: 'path', width: 200 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 80 },
  { title: '操作', slotName: 'action', width: 150, fixed: 'right' }
]

const sidebarColumns = [
  { title: '图标', dataIndex: 'icon', slotName: 'icon', width: 60 },
  { title: '名称', dataIndex: 'title', width: 120 },
  { title: '路径', dataIndex: 'path', width: 200 },
  { title: '分组', dataIndex: 'group', width: 100 },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 80 },
  { title: '操作', slotName: 'action', width: 150, fixed: 'right' }
]

const bottomNavData = ref([])
const gridData = ref([])
const sidebarData = ref([])
const quickData = ref([])

const mockData = () => {
  bottomNavData.value = [
    { id: 1, icon: '🏠', title: '首页', path: '/home', sort: 100, status: 1, active: true },
    { id: 2, icon: '📈', title: '行情', path: '/market', sort: 99, status: 1 },
    { id: 3, icon: '💰', title: '交易', path: '/trade', sort: 98, status: 1 },
    { id: 4, icon: '🏆', title: '广场', path: '/square', sort: 97, status: 1 },
    { id: 5, icon: '👤', title: '我的', path: '/mine', sort: 96, status: 1 },
  ]

  gridData.value = [
    { id: 1, icon: '🪙', title: '现货交易', path: '/trade/spot', sort: 100, status: 1 },
    { id: 2, icon: '⚡', title: '秒合约', path: '/trade/contract', sort: 99, status: 1 },
    { id: 3, icon: '🥇', title: '黄金理财', path: '/gold', sort: 98, status: 1 },
    { id: 4, icon: '⛏️', title: '矿池', path: '/pool', sort: 97, status: 1 },
    { id: 5, icon: '🎁', title: '新币认购', path: '/newcoin', sort: 96, status: 1 },
    { id: 6, icon: '💳', title: '充值', path: '/recharge', sort: 95, status: 1 },
    { id: 7, icon: '📤', title: '提现', path: '/withdraw', sort: 94, status: 1 },
    { id: 8, icon: '🎯', title: '邀请好友', path: '/invite', sort: 93, status: 1 },
    { id: 9, icon: '📋', title: '更多', path: '/more', sort: 92, status: 1 },
  ]

  sidebarData.value = [
    { id: 1, icon: '📊', title: '资产总览', path: '/assets', group: '资产', sort: 100, status: 1 },
    { id: 2, icon: '📜', title: '交易记录', path: '/orders', group: '资产', sort: 99, status: 1 },
    { id: 3, icon: '🔒', title: '安全设置', path: '/security', group: '设置', sort: 98, status: 1 },
    { id: 4, icon: '🌐', title: '语言设置', path: '/language', group: '设置', sort: 97, status: 1 },
    { id: 5, icon: '📞', title: '在线客服', path: '/support', group: '帮助', sort: 96, status: 1 },
    { id: 6, icon: '❓', title: '帮助中心', path: '/help', group: '帮助', sort: 95, status: 1 },
  ]

  quickData.value = [
    { id: 1, icon: '💰', title: '快速充值', path: '/recharge', sort: 100, status: 1 },
    { id: 2, icon: '📤', title: '快速提现', path: '/withdraw', sort: 99, status: 1 },
  ]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, { title: '', icon: '', path: '', position: activeTab.value, sort: 0, status: true, permissions: [] })
  modalVisible.value = true
}

const handleEdit = (record) => {
  isEdit.value = true
  Object.assign(formData, record, { position: activeTab.value })
  modalVisible.value = true
}

const handleSubmit = () => {
  Message.success(isEdit.value ? '更新成功' : '添加成功')
  modalVisible.value = false
}

const handleDelete = (record) => {
  Message.success(`已删除 ${record.title}`)
}

const handleMoveUp = (record) => {
  Message.success(`${record.title} 已上移`)
}

const handleMoveDown = (record) => {
  Message.success(`${record.title} 已下移`)
}

const handlePreview = () => {
  Message.info('预览功能开发中')
}

const handlePublish = () => {
  Message.success('菜单配置已发布')
}

const handleReset = () => {
  Message.success('已重置为默认配置')
  mockData()
}

onMounted(() => {
  mockData()
})
</script>

<style scoped>
.menu-config-container {
  padding: 16px;
}
.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 16px;
}
.menu-icon {
  font-size: 20px;
}
.menu-preview {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
}
.bottom-nav-preview {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
}
.nav-item {
  text-align: center;
  cursor: pointer;
}
.nav-item.active .nav-text {
  color: #165dff;
}
.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}
.nav-text {
  font-size: 12px;
  color: #666;
}
.grid-preview {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
}
.grid-item {
  text-align: center;
  padding: 8px;
}
.grid-icon {
  font-size: 28px;
  margin-bottom: 4px;
}
.grid-text {
  font-size: 12px;
  color: #333;
}
</style>
