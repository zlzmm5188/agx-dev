import { createRouter, createWebHistory } from 'vue-router'

// 主要页面直接导入，加快首屏速度
import Home from '../views/Home.vue'
import Mine from '../views/Mine.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { tabBar: true, title: '首页' }
  },
  {
    path: '/markets',
    name: 'Markets',
    component: () => import('../views/Markets.vue'),
    meta: { tabBar: true, title: '行情' }
  },
  {
    path: '/trade',
    name: 'Trade',
    component: () => import('../views/trade/Trade.vue'),
    meta: { tabBar: true, title: '交易' }
  },
  {
    path: '/trade/:symbol',
    name: 'TradeSymbol',
    component: () => import('../views/trade/Trade.vue'),
    meta: { title: '交易' }
  },
  {
    path: '/earn',
    name: 'Earn',
    component: () => import('../views/Earn.vue'),
    meta: { tabBar: true, title: '理财' }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine,
    meta: { tabBar: true, title: '我的' }
  },
  {
    path: '/deposit',
    name: 'Deposit',
    component: () => import('../views/Deposit.vue'),
    meta: { title: '充值' }
  },
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: () => import('../views/Withdraw.vue'),
    meta: { title: '提现' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { title: '设置' }
  },
  {
    path: '/ieo',
    name: 'IEO',
    component: () => import('../views/trade/IEO.vue'),
    meta: { title: '新币发行' }
  },
  {
    path: '/trade/ieo/:id',
    name: 'IEODetail',
    component: () => import('../views/trade/IEO.vue'),
    meta: { title: '新币发行详情' }
  },
  {
    path: '/gold',
    name: 'Gold',
    component: () => import('../views/Gold.vue'),
    meta: { title: '黄金' }
  },
  {
    path: '/square',
    name: 'Square',
    component: () => import('../views/Square.vue'),
    meta: { tabBar: true, title: '广场' }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue'),
    meta: { title: '聊天' }
  },
  {
    path: '/chat/:userId',
    name: 'ChatDetail',
    component: () => import('../views/ChatDetail.vue'),
    meta: { title: '聊天' }
  },
  {
    path: '/mining',
    name: 'Mining',
    component: () => import('../views/Mining.vue'),
    meta: { title: '矿池' }
  },
  {
    path: '/ai',
    name: 'AI',
    component: () => import('../views/AI.vue'),
    meta: { title: '升达智能' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: { title: '订单记录' }
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import('../views/Security.vue'),
    meta: { title: '安全中心' }
  },
  {
    path: '/kyc',
    name: 'KYC',
    component: () => import('../views/KYC.vue'),
    meta: { title: '身份认证' }
  },
  {
    path: '/post/create',
    name: 'CreatePost',
    component: () => import('../views/CreatePost.vue'),
    meta: { title: '发布动态' }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue'),
    meta: { title: '动态详情' }
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue'),
    meta: { title: '用户主页' }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../views/Notifications.vue'),
    meta: { title: '消息通知' }
  },
  {
    path: '/assets',
    name: 'Assets',
    component: () => import('../views/Assets.vue'),
    meta: { title: '我的资产' }
  },
  {
    path: '/otc',
    name: 'OTC',
    component: () => import('../views/OTC.vue'),
    meta: { title: 'C2C买币' }
  },
  {
    path: '/invite',
    name: 'Invite',
    component: () => import('../views/Invite.vue'),
    meta: { title: '邀请好友' }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue'),
    meta: { title: '帮助中心' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: '关于我们' }
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('../views/Ranking.vue'),
    meta: { title: '排行榜' }
  },
  {
    path: '/contract',
    name: 'Contract',
    component: () => import('../views/Contract.vue'),
    meta: { title: '合约交易' }
  },
  {
    path: '/kline',
    name: 'Kline',
    component: () => import('../views/Kline.vue'),
    meta: { title: 'K线图' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Ascenda` : 'Ascenda'
  next()
})

export default router
