<template>
  <div class="p-4">
    <a-card title="邀请关系链" :bordered="false">
      <template #extra>
        <a-space>
          <a-input-search v-model="searchKeyword" placeholder="搜索用户名/UID" @search="handleSearch" style="width: 200px" />
          <a-button type="primary" @click="fetchData">刷新</a-button>
          <a-button @click="expandAll">全部展开</a-button>
          <a-button @click="collapseAll">全部收起</a-button>
        </a-space>
      </template>

      <a-row :gutter="16" class="mb-4">
        <a-col :span="4"><a-statistic title="总用户数" :value="stats.totalUsers" /></a-col>
        <a-col :span="4"><a-statistic title="总充值" :value="stats.totalRecharge" :precision="2" prefix="$" /></a-col>
        <a-col :span="4"><a-statistic title="总提款" :value="stats.totalWithdraw" :precision="2" prefix="$" /></a-col>
        <a-col :span="4"><a-statistic title="内部线业绩" :value="stats.internalPerformance" :precision="2" prefix="$" /></a-col>
        <a-col :span="4"><a-statistic title="一级邀请" :value="stats.level1Total" /></a-col>
        <a-col :span="4"><a-statistic title="二级邀请" :value="stats.level2Total" /></a-col>
      </a-row>

      <div class="tree-wrapper">
        <div class="org-tree" v-if="treeData">
          <tree-node :node="treeData" :level="0" :index="0" :expanded-keys="expandedKeys" :top-recharge-uid="topRechargeUid" @toggle="toggleNode" />
        </div>
      </div>

      <a-divider>用户列表</a-divider>
      <a-table :data="tableData" :loading="loading" :pagination="pagination" @page-change="handlePageChange" size="small">
        <template #columns>
          <a-table-column title="用户" :width="140">
            <template #cell="{ record }">
              <div class="flex items-center gap-1">
                <span v-if="record.uid === topRechargeUid" class="trophy">🏆</span>
                <div>
                  <div class="font-medium">{{ record.username }}</div>
                  <div class="text-xs uid-text">{{ record.uid }}</div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="邀请人" :width="120">
            <template #cell="{ record }">
              <template v-if="record.inviter"><div>{{ record.inviter.username }}</div></template>
              <span v-else class="uid-text">-</span>
            </template>
          </a-table-column>
          <a-table-column title="充值" :width="100">
            <template #cell="{ record }"><span class="recharge-text">${{ record.recharge }}</span></template>
          </a-table-column>
          <a-table-column title="提款" :width="100">
            <template #cell="{ record }"><span class="withdraw-text">${{ record.withdraw }}</span></template>
          </a-table-column>
          <a-table-column title="直推" data-index="directCount" :width="60" />
          <a-table-column title="团队" data-index="teamCount" :width="60" />
          <a-table-column title="类型" :width="70">
            <template #cell="{ record }">
              <a-tag v-if="record.isInternal" color="orange" size="small">内部</a-tag>
              <a-tag v-else size="small">普通</a-tag>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineComponent, h, computed } from 'vue'

const expandedKeys = ref(new Set(['ROOT']))

const toggleNode = (uid) => {
  if (expandedKeys.value.has(uid)) {
    expandedKeys.value.delete(uid)
  } else {
    expandedKeys.value.add(uid)
  }
  expandedKeys.value = new Set(expandedKeys.value)
}

const expandAll = () => {
  const keys = new Set()
  const collect = (node) => {
    if (node.uid) keys.add(node.uid)
    if (node.children) node.children.forEach(collect)
  }
  if (treeData.value) collect(treeData.value)
  expandedKeys.value = keys
}

const collapseAll = () => {
  expandedKeys.value = new Set(['ROOT'])
}

const TreeNode = defineComponent({
  name: 'TreeNode',
  props: ['node', 'level', 'index', 'expandedKeys', 'topRechargeUid'],
  emits: ['toggle'],
  setup(props, { emit }) {
    return () => {
      if (!props.node) return null
      const hasChildren = props.node.children && props.node.children.length > 0
      const isExpanded = props.expandedKeys.has(props.node.uid)
      const lvClass = ['root', 'lv1', 'lv2', 'lv3', 'lv4'][props.level] || 'lv4'
      const isInternal = props.level === 1 && props.index === 1
      const isTopRecharge = props.node.uid === props.topRechargeUid
      
      return h('div', { class: ['tree-item', { internal: isInternal }] }, [
        h('div', { 
          class: ['node-box', lvClass, { expandable: hasChildren, expanded: isExpanded, internal: isInternal }],
          onClick: () => hasChildren && emit('toggle', props.node.uid)
        }, [
          isTopRecharge ? h('span', { class: 'trophy-badge' }, '��') : null,
          isInternal ? h('span', { class: 'internal-badge' }, '内部') : null,
          h('div', { class: 'node-main' }, [
            hasChildren ? h('span', { class: 'expand-icon' }, isExpanded ? '▼' : '▶') : h('span', { class: 'expand-icon dot' }, '●'),
            h('span', { class: 'node-name' }, props.node.username || props.node.nickname),
            h('span', { class: 'node-uid' }, props.node.uid),
          ]),
          h('div', { class: 'node-finance' }, [
            h('span', { class: 'recharge' }, ['充:', h('b', `$${props.node.recharge || 0}`)]),
            h('span', { class: 'withdraw' }, ['提:', h('b', `$${props.node.withdraw || 0}`)]),
          ]),
          h('div', { class: 'node-stats' }, [
            h('span', null, `直推:${props.node.directCount || 0}`),
            h('span', null, `团队:${props.node.teamCount || 0}`)
          ]),
          hasChildren ? h('span', { class: 'children-count' }, `${props.node.children.length}人`) : null
        ]),
        isExpanded && hasChildren ? h('div', { class: ['tree-children', { 'internal-line': isInternal }] }, 
          props.node.children.map((child, idx) => 
            h(TreeNode, { 
              node: child, 
              level: props.level + 1,
              index: idx,
              expandedKeys: props.expandedKeys,
              topRechargeUid: props.topRechargeUid,
              key: child.uid || idx,
              onToggle: (uid) => emit('toggle', uid)
            })
          )
        ) : null
      ])
    }
  }
})

const loading = ref(false)
const tableData = ref([])
const searchKeyword = ref('')
const treeData = ref(null)
const stats = reactive({ totalUsers: 0, totalRecharge: 0, totalWithdraw: 0, internalPerformance: 0, level1Total: 0, level2Total: 0 })
const pagination = reactive({ current: 1, pageSize: 15, total: 0 })

const topRechargeUid = computed(() => {
  let max = 0, uid = ''
  const find = (node) => {
    if (node.recharge > max) { max = node.recharge; uid = node.uid }
    if (node.children) node.children.forEach(find)
  }
  if (treeData.value) find(treeData.value)
  return uid
})

const fetchData = async () => {
  loading.value = true
  setTimeout(() => {
    stats.totalUsers = 12560; stats.totalRecharge = 1256800; stats.totalWithdraw = 458600
    stats.internalPerformance = 358000; stats.level1Total = 8520; stats.level2Total = 25600
    
    treeData.value = {
      username: '系统根节点', uid: 'ROOT', directCount: 156, teamCount: 12560, recharge: 0, withdraw: 0,
      children: [
        { username: 'topuser', uid: 'U10001', directCount: 45, teamCount: 856, recharge: 125000, withdraw: 45000, children: [
          { username: 'user_a', uid: 'U10011', directCount: 12, teamCount: 35, recharge: 35000, withdraw: 12000, children: [
            { username: 'sub_a1', uid: 'U10111', directCount: 3, teamCount: 8, recharge: 8500, withdraw: 2000 },
            { username: 'sub_a2', uid: 'U10112', directCount: 5, teamCount: 12, recharge: 12000, withdraw: 4500 }
          ]},
          { username: 'user_b', uid: 'U10012', directCount: 8, teamCount: 28, recharge: 28000, withdraw: 8000 },
          { username: 'user_c', uid: 'U10013', directCount: 6, teamCount: 18, recharge: 18000, withdraw: 6500 }
        ]},
        { username: '内部团队长', uid: 'U10002', directCount: 32, teamCount: 180, recharge: 358000, withdraw: 125000, isInternal: true, children: [
          { username: 'staff_a', uid: 'U10021', directCount: 15, teamCount: 45, recharge: 85000, withdraw: 28000, isInternal: true },
          { username: 'staff_b', uid: 'U10022', directCount: 8, teamCount: 22, recharge: 62000, withdraw: 18000, isInternal: true }
        ]},
        { username: 'vip_star', uid: 'U10003', directCount: 28, teamCount: 120, recharge: 95000, withdraw: 32000 }
      ]
    }
    
    tableData.value = [
      { id: 1, username: '内部团队长', uid: 'U10002', inviter: null, directCount: 32, teamCount: 180, recharge: 358000, withdraw: 125000, isInternal: true },
      { id: 2, username: 'topuser', uid: 'U10001', inviter: null, directCount: 45, teamCount: 856, recharge: 125000, withdraw: 45000, isInternal: false },
      { id: 3, username: 'vip_star', uid: 'U10003', inviter: null, directCount: 28, teamCount: 120, recharge: 95000, withdraw: 32000, isInternal: false },
    ]
    pagination.total = 12560; loading.value = false
  }, 300)
}

const handleSearch = () => { pagination.current = 1; fetchData() }
const handlePageChange = (p) => { pagination.current = p; fetchData() }
onMounted(() => fetchData())
</script>

<style scoped>
.uid-text { color: #888; }
.recharge-text { color: #52c41a; font-weight: 500; }
.withdraw-text { color: #f5222d; font-weight: 500; }
.trophy { font-size: 16px; }
.tree-wrapper { padding: 16px; background: var(--color-bg-2); border-radius: 8px; margin-bottom: 16px; max-height: 550px; overflow: auto; }
.org-tree { font-size: 13px; }

.tree-item { margin-left: 0; }
.tree-item.internal > .node-box { position: relative; }
.tree-children { margin-left: 24px; border-left: 2px solid #3b82f6; padding-left: 0; }
.tree-children.internal-line { border-left-color: #f59e0b; }
.tree-children .tree-item { position: relative; }
.tree-children .tree-item::before { content: ''; position: absolute; left: -2px; top: 22px; width: 20px; height: 2px; background: #3b82f6; }
.tree-children.internal-line .tree-item::before { background: #f59e0b; }

.node-box {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 6px 20px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 2px solid #3b82f6;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #fff;
  cursor: default;
  transition: all 0.2s;
  position: relative;
}
.node-box.expandable { cursor: pointer; }
.node-box.expandable:hover { border-color: #60a5fa; box-shadow: 0 0 12px rgba(59,130,246,0.4); }
.node-box.internal { border-color: #f59e0b; background: linear-gradient(135deg, #78350f 0%, #b45309 100%); }

.trophy-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); font-size: 20px; }
.internal-badge { position: absolute; top: -10px; right: 10px; font-size: 10px; background: #f59e0b; color: #000; padding: 1px 6px; border-radius: 8px; font-weight: 600; }

.node-main { display: flex; align-items: center; gap: 6px; }
.expand-icon { font-size: 10px; color: #60a5fa; width: 14px; }
.expand-icon.dot { color: #64748b; }
.node-name { font-weight: 600; font-size: 13px; }
.node-uid { font-size: 10px; color: #94a3b8; }

.node-finance { display: flex; gap: 10px; font-size: 11px; border-left: 1px solid #475569; padding-left: 10px; }
.node-finance .recharge { color: #4ade80; }
.node-finance .withdraw { color: #f87171; }
.node-finance b { margin-left: 2px; }

.node-stats { display: flex; gap: 8px; font-size: 10px; color: #94a3b8; border-left: 1px solid #475569; padding-left: 10px; }
.children-count { font-size: 10px; color: #60a5fa; background: rgba(59,130,246,0.2); padding: 2px 6px; border-radius: 8px; }

.node-box.root { background: linear-gradient(135deg, #7c2d12 0%, #dc2626 100%); border-color: #ef4444; }
.node-box.lv1 { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); border-color: #3b82f6; }
.node-box.lv2 { background: linear-gradient(135deg, #14532d 0%, #16a34a 100%); border-color: #22c55e; }
.node-box.lv3 { background: linear-gradient(135deg, #581c87 0%, #9333ea 100%); border-color: #a855f7; }
.node-box.lv4 { background: linear-gradient(135deg, #7e22ce 0%, #c084fc 100%); border-color: #d8b4fe; }
</style>
