<template>
  <div class="p-4">
    <a-card title="功能开关" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="handleSave" :loading="saving">
          <template #icon><icon-save /></template>
          保存配置
        </a-button>
      </template>

      <a-alert type="info" class="mb-4">
        控制前端各功能模块的显示与隐藏，关闭后用户将无法访问对应功能
      </a-alert>

      <a-row :gutter="24">
        <a-col :span="8" v-for="(group, gKey) in featureGroups" :key="gKey">
          <a-card :title="group.title" :bordered="false" class="mb-4">
            <div v-for="item in group.items" :key="item.key" class="feature-item">
              <div class="feature-info">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-gray-400 text-xs">{{ item.desc }}</div>
              </div>
              <a-switch v-model="item.enabled" size="small" />
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'

const saving = ref(false)

const featureGroups = reactive({
  trade: {
    title: '交易模块',
    items: [
      { key: 'spot', name: '现货交易', desc: '币币交易功能', enabled: true },
      { key: 'contract', name: '秒合约', desc: '秒合约交易功能', enabled: true },
      { key: 'gold', name: '黄金交易', desc: '黄金买卖功能', enabled: true },
      { key: 'otc', name: 'OTC交易', desc: '场外交易功能', enabled: true },
    ]
  },
  finance: {
    title: '资产模块',
    items: [
      { key: 'deposit', name: '充值', desc: '充币功能', enabled: true },
      { key: 'withdraw', name: '提现', desc: '提币功能', enabled: true },
      { key: 'transfer', name: '划转', desc: '账户间划转', enabled: true },
      { key: 'pool', name: '矿池理财', desc: '矿池产品投资', enabled: true },
    ]
  },
  social: {
    title: '社交模块',
    items: [
      { key: 'allow_post', name: '允许发帖', desc: '是否允许用户发布帖子', enabled: true },
      { key: 'allow_comment', name: '允许评论', desc: '是否允许用户评论', enabled: true },
      { key: 'allow_like', name: '允许点赞', desc: '是否允许用户点赞', enabled: true },
      { key: 'allow_add_friend', name: '允许加好友', desc: '是否允许用户添加好友', enabled: true },
      { key: 'allow_chat', name: '允许私聊', desc: '是否允许好友私聊', enabled: true },
      { key: 'follow', name: '允许关注', desc: '是否允许用户关注', enabled: true },
    ]
  },
  user: {
    title: '用户模块',
    items: [
      { key: 'register', name: '新用户注册', desc: '允许新用户注册', enabled: true },
      { key: 'kyc', name: 'KYC认证', desc: 'KYC认证功能', enabled: true },
      { key: 'invite', name: '邀请功能', desc: '邀请好友功能', enabled: true },
      { key: 'rank', name: '排行榜', desc: '排行榜展示', enabled: true },
    ]
  },
  market: {
    title: '行情模块',
    items: [
      { key: 'crypto', name: '加密货币行情', desc: '数字货币价格', enabled: true },
      { key: 'forex', name: '外汇行情', desc: '外汇价格', enabled: false },
      { key: 'stock', name: '股票行情', desc: '股票价格', enabled: false },
      { key: 'metal', name: '贵金属行情', desc: '黄金白银价格', enabled: true },
    ]
  },
  other: {
    title: '其他功能',
    items: [
      { key: 'notice', name: '公告弹窗', desc: '首页公告弹窗', enabled: true },
      { key: 'banner', name: '轮播Banner', desc: '首页轮播图', enabled: true },
      { key: 'chat', name: '在线客服', desc: '客服聊天功能', enabled: true },
      { key: 'feedback', name: '意见反馈', desc: '用户反馈入口', enabled: true },
    ]
  }
})

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
.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.feature-item:last-child {
  border-bottom: none;
}
</style>
