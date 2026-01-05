import { request } from '@/utils/request.js'

export default {

  /**
   * 获取验证码 (暂不需要)
   * @returns
   */
  getCaptch() {
    return Promise.resolve({ code: 0, data: { enabled: false } })
  },

  /**
   * 管理员登录
   * @param {object} params
   * @returns
   */
  login(params = {}) {
    return request({
      url: '/api/admin/login',
      method: 'post',
      data: params
    })
  },

  /**
   * 用户退出
   * @param {object} params
   * @returns
   */
  logout(params = {}) {
    return Promise.resolve({ code: 0, msg: 'ok' })
  },

  /**
   * 获取登录用户信息
   * @param {object} params
   * @returns
   */
  getInfo(params = {}) {
    // 返回静态管理员信息 - AGX 业务模块化菜单结构
    return Promise.resolve({
      code: 0,
      data: {
        user: {
          id: 1,
          username: 'admin',
          nickname: '超级管理员',
          avatar: '/logo.png'
        },
        roles: ['superAdmin'],
        codes: [],
        routers: [
          // ========== 仪表盘 ==========
          {
            name: 'dashboard',
            path: '/dashboard',
            meta: { title: '仪表盘', icon: 'icon-dashboard', type: 'M' },
            component: 'agx/dashboard'
          },
          
          // ========== 1. 用户与权限管理 ==========
          {
            name: 'userMgmt',
            path: '/user',
            meta: { title: '用户与权限', icon: 'icon-user-group', type: 'M' },
            children: [
              { name: 'userList', path: '/user/list', meta: { title: '用户列表', icon: 'icon-user', type: 'M' }, component: 'agx/users' },
              { name: 'levelMgmt', path: '/user/levels', meta: { title: 'VIP等级管理', icon: 'icon-star', type: 'M' }, component: 'agx/userLevels' },
              { name: 'kycList', path: '/user/kyc', meta: { title: 'KYC审核', icon: 'icon-id-card', type: 'M' }, component: 'agx/kyc' },
              { name: 'loginLogs', path: '/user/login-logs', meta: { title: '登录记录', icon: 'icon-history', type: 'M' }, component: 'agx/loginLogs' },
              { name: 'blacklist', path: '/user/blacklist', meta: { title: '黑名单/风控', icon: 'icon-stop', type: 'M' }, component: 'agx/blacklist' },
            ]
          },
          
          // ========== 2. 资产与财务管理 ==========
          {
            name: 'assetMgmt',
            path: '/asset',
            meta: { title: '资产与财务', icon: 'icon-wallet', type: 'M' },
            children: [
              { name: 'assetOverview', path: '/asset/overview', meta: { title: '资产总览', icon: 'icon-pie-chart', type: 'M' }, component: 'agx/assetOverview' },
              { name: 'goldHolding', path: '/asset/gold/holding', meta: { title: '黄金持仓', icon: 'icon-gold', type: 'M' }, component: 'agx/goldHolding' },
              { name: 'goldIncome', path: '/asset/gold/income', meta: { title: '黄金收益记录', icon: 'icon-rise', type: 'M' }, component: 'agx/goldIncome' },
              { name: 'goldConfig', path: '/asset/gold/config', meta: { title: '黄金规则配置', icon: 'icon-tool', type: 'M' }, component: 'agx/goldConfig' },
              { name: 'rechargeList', path: '/asset/recharge', meta: { title: '充币记录', icon: 'icon-download', type: 'M' }, component: 'agx/recharge' },
              { name: 'withdrawList', path: '/asset/withdraw', meta: { title: '提币审核', icon: 'icon-upload', type: 'M' }, component: 'agx/withdraw' },
              { name: 'assetLogs', path: '/asset/logs', meta: { title: '资产流水', icon: 'icon-file-text', type: 'M' }, component: 'agx/assetLogs' },
              { name: 'otcOrders', path: '/asset/otc', meta: { title: 'OTC订单', icon: 'icon-swap', type: 'M' }, component: 'agx/otcOrders' },
            ]
          },
          
          // ========== 3. 产品与交易管理 ==========
          {
            name: 'productMgmt',
            path: '/product',
            meta: { title: '产品与交易', icon: 'icon-apps', type: 'M' },
            children: [
              { name: 'marketCrypto', path: '/product/market/crypto', meta: { title: '数字货币行情', icon: 'icon-bitcoin', type: 'M' }, component: 'agx/marketCrypto' },
              { name: 'marketStock', path: '/product/market/stock', meta: { title: '股票行情', icon: 'icon-stock', type: 'M' }, component: 'agx/marketStock' },
              { name: 'marketForex', path: '/product/market/forex', meta: { title: '外汇行情', icon: 'icon-fund', type: 'M' }, component: 'agx/marketForex' },
              { name: 'marketMetal', path: '/product/market/metal', meta: { title: '贵金属行情', icon: 'icon-gold', type: 'M' }, component: 'agx/marketMetal' },
              { name: 'tradeSpot', path: '/product/trade/spot', meta: { title: '现货配置', icon: 'icon-transaction', type: 'M' }, component: 'agx/tradeSpot' },
              { name: 'tradeContract', path: '/product/trade/contract', meta: { title: '秒合约配置', icon: 'icon-thunderbolt', type: 'M' }, component: 'agx/contract' },
              { name: 'tradeGold', path: '/product/trade/gold', meta: { title: '黄金玩法配置', icon: 'icon-gold', type: 'M' }, component: 'agx/tradeGold' },
              { name: 'newCoin', path: '/product/newcoin', meta: { title: '新币管理', icon: 'icon-plus-circle', type: 'M' }, component: 'agx/newCoin' },
              { name: 'poolMgmt', path: '/product/pool', meta: { title: '矿池产品', icon: 'icon-storage', type: 'M' }, component: 'agx/pool' },
            ]
          },
          
          // ========== 4. 内容与广场管理 ==========
          {
            name: 'contentMgmt',
            path: '/content',
            meta: { title: '内容与广场', icon: 'icon-fire', type: 'M' },
            children: [
              { name: 'officialPost', path: '/content/official', meta: { title: '官方内容', icon: 'icon-crown', type: 'M' }, component: 'agx/officialPost' },
              { name: 'userPost', path: '/content/user', meta: { title: '用户内容', icon: 'icon-message', type: 'M' }, component: 'agx/userPost' },
              { name: 'topicMgmt', path: '/content/topic', meta: { title: '话题管理', icon: 'icon-tags', type: 'M' }, component: 'agx/topics' },
              { name: 'bannerMgmt', path: '/content/banner', meta: { title: 'Banner管理', icon: 'icon-image', type: 'M' }, component: 'agx/banners' },
              { name: 'noticeList', path: '/content/notice', meta: { title: '公告管理', icon: 'icon-notification', type: 'M' }, component: 'agx/notice' },
              { name: 'socialManage', path: '/content/social', meta: { title: '社交关系管理', icon: 'icon-user-group', type: 'M' }, component: 'agx/socialManage' },
            ]
          },
          
          // ========== 5. 邀请与激励系统 ==========
          {
            name: 'inviteMgmt',
            path: '/invite',
            meta: { title: '邀请与激励', icon: 'icon-share-alt', type: 'M' },
            children: [
              { name: 'inviteChain', path: '/invite/chain', meta: { title: '邀请关系链', icon: 'icon-relation', type: 'M' }, component: 'agx/inviteChain' },
              { name: 'inviteLevels', path: '/invite/levels', meta: { title: '等级规则配置', icon: 'icon-ordered-list', type: 'M' }, component: 'agx/inviteLevels' },
              { name: 'commissionConfig', path: '/invite/commission', meta: { title: '收益比例配置', icon: 'icon-percentage', type: 'M' }, component: 'agx/commissionConfig' },
              { name: 'inviteRank', path: '/invite/rank', meta: { title: '邀请排行榜', icon: 'icon-trophy', type: 'M' }, component: 'agx/inviteRank' },
              { name: 'commissionLogs', path: '/invite/logs', meta: { title: '返佣记录', icon: 'icon-gift', type: 'M' }, component: 'agx/commission' },
            ]
          },
          
          // ========== 6. 系统配置与设置 ==========
          {
            name: 'systemMgmt',
            path: '/system',
            meta: { title: '系统设置', icon: 'icon-settings', type: 'M' },
            children: [
              { name: 'menuConfig', path: '/system/menu', meta: { title: '前端菜单配置', icon: 'icon-menu', type: 'M' }, component: 'agx/menuConfig' },
              { name: 'featureSwitch', path: '/system/features', meta: { title: '功能开关', icon: 'icon-poweroff', type: 'M' }, component: 'agx/featureSwitch' },
              { name: 'permissionMatrix', path: '/system/permissions', meta: { title: '等级权限矩阵', icon: 'icon-safe', type: 'M' }, component: 'agx/permissionMatrix' },
              { name: 'textConfig', path: '/system/text', meta: { title: '文案配置', icon: 'icon-edit', type: 'M' }, component: 'agx/textConfig' },
              { name: 'sysParams', path: '/system/params', meta: { title: '系统参数', icon: 'icon-tool', type: 'M' }, component: 'agx/config' },
              { name: 'currencyMgmt', path: '/system/currency', meta: { title: '币种管理', icon: 'icon-bitcoin', type: 'M' }, component: 'agx/currency' },
              { name: 'chainMgmt', path: '/system/chain', meta: { title: '链配置', icon: 'icon-link', type: 'M' }, component: 'agx/coinChain' },
              { name: 'adminLogs', path: '/system/logs', meta: { title: '操作日志', icon: 'icon-file-text', type: 'M' }, component: 'agx/adminLogs' },
            ]
          },
          
          // ========== 7. 订单监控（快捷入口） ==========
          {
            name: 'orderMgmt',
            path: '/order',
            meta: { title: '订单监控', icon: 'icon-unordered-list', type: 'M' },
            children: [
              { name: 'poolOrders', path: '/order/pool', meta: { title: '矿池持仓', icon: 'icon-storage', type: 'M' }, component: 'agx/poolOrders' },
              { name: 'contractOrders', path: '/order/contract', meta: { title: '合约订单', icon: 'icon-thunderbolt', type: 'M' }, component: 'agx/contractOrders' },
            ]
          }
        ]
      }
    })
  }
}
