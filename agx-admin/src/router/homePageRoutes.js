const homePageRoutes = [
  {
    name: 'dashboard',
    path: '/dashboard',
    meta: {
      title: '仪表盘',
      icon: 'icon-dashboard',
      type: 'M',
      affix: true
    },
    component: () => import('@/views/dashboard/index.vue'),
  }, {
    name: 'userCenter',
    path: '/usercenter',
    meta: {
      title: '个人信息',
      icon: 'icon-user',
      type: 'M',
    },
    component: () => import('@/views/userCenter/index.vue'),
  }, {
    name: 'message',
    path: '/message',
    meta: {
      title: '消息中心',
      icon: 'icon-message',
      type: 'M',
    },
    component: () => import('@/views/userCenter/message.vue'),
  }, {
    name: 'store',
    path: '/store',
    component: () => import('@/views/appStore/index.vue'),
    meta: { title: '应用市场', hidden: true }
  },
  // AGX 资产流水
  {
    name: 'agxAssetLogs',
    path: '/agx/assetLogs',
    component: () => import('@/views/agx/assetLogs.vue'),
    meta: { title: '资产流水', hidden: true }
  },
  // AGX 系统配置
  {
    name: 'agxConfig',
    path: '/agx/config',
    component: () => import('@/views/agx/config.vue'),
    meta: { title: '系统配置', hidden: true }
  },
  // AGX 公告管理
  {
    name: 'agxNotice',
    path: '/agx/notice',
    component: () => import('@/views/agx/notice.vue'),
    meta: { title: '公告管理', hidden: true }
  },
  // AGX 币种链配置
  {
    name: 'agxCoinChain',
    path: '/agx/coinChain',
    component: () => import('@/views/agx/coinChain.vue'),
    meta: { title: '币种链配置', hidden: true }
  },
  // AGX 邀请管理
  {
    name: 'agxInvites',
    path: '/agx/invites',
    component: () => import('@/views/agx/invites.vue'),
    meta: { title: '邀请管理', hidden: true }
  },
  // AGX 返佣管理
  {
    name: 'agxCommission',
    path: '/agx/commission',
    component: () => import('@/views/agx/commission.vue'),
    meta: { title: '返佣管理', hidden: true }
  },
  // AGX 操作日志
  {
    name: 'agxAdminLogs',
    path: '/agx/adminLogs',
    component: () => import('@/views/agx/adminLogs.vue'),
    meta: { title: '操作日志', hidden: true }
  },
  // AGX 用户详情
  {
    name: 'agxUserDetail',
    path: '/agx/user/:id',
    component: () => import('@/views/agx/userDetail.vue'),
    meta: { title: '用户详情', hidden: true }
  },
  // AGX 交易对管理
  {
    name: 'agxTradingPairs',
    path: '/agx/tradingPairs',
    component: () => import('@/views/trade/TradingPairs.vue'),
    meta: { title: '交易对管理', hidden: true }
  },
  // AGX 新币发行管理
  {
    name: 'agxCoinIssues',
    path: '/agx/coinIssues',
    component: () => import('@/views/trade/CoinIssues.vue'),
    meta: { title: '新币发行管理', hidden: true }
  },
  // AGX 敏感词管理
  {
    name: 'agxSensitiveWords',
    path: '/agx/sensitiveWords',
    component: () => import('@/views/square/SensitiveWords.vue'),
    meta: { title: '敏感词管理', hidden: true }
  },
  // AGX 帖子审核
  {
    name: 'agxPostReview',
    path: '/agx/postReview',
    component: () => import('@/views/square/PostReview.vue'),
    meta: { title: '帖子审核', hidden: true }
  },
  // AGX 私信管理
  {
    name: 'agxPrivateMessage',
    path: '/agx/privateMessage',
    component: () => import('@/views/square/PrivateMessage.vue'),
    meta: { title: '私信管理', hidden: true }
  },
]

export const homePage = {
  name: 'home',
  path: '/home',
  meta: { title: '首页', icon: 'icon-home', hidden: false, type: 'M' }
}

export default homePageRoutes