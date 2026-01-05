import { request } from '@/utils/request.js'

export default {
  /**
   * 获取用户列表
   */
  getUserList(params = {}) {
    return request({
      url: '/api/admin/user/list',
      method: 'get',
      params
    })
  },

  /**
   * 更新用户状态
   */
  updateUserStatus(id, data) {
    return request({
      url: `/api/admin/user/${id}/status`,
      method: 'put',
      data
    })
  },

  /**
   * 获取币种列表
   */
  getCurrencyList(params = {}) {
    return request({
      url: '/api/admin/currency/list',
      method: 'get',
      params
    })
  },

  /**
   * 创建币种
   */
  createCurrency(data) {
    return request({
      url: '/api/admin/currency',
      method: 'post',
      data
    })
  },

  /**
   * 更新币种
   */
  updateCurrency(id, data) {
    return request({
      url: `/api/admin/currency/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除币种
   */
  deleteCurrency(id) {
    return request({
      url: `/api/admin/currency/${id}`,
      method: 'delete'
    })
  },

  /**
   * 获取矿池产品列表
   */
  getPoolList(params = {}) {
    return request({
      url: '/api/admin/pool/list',
      method: 'get',
      params
    })
  },

  /**
   * 创建矿池产品
   */
  createPool(data) {
    return request({
      url: '/api/admin/pool',
      method: 'post',
      data
    })
  },

  /**
   * 更新矿池产品
   */
  updatePool(id, data) {
    return request({
      url: `/api/admin/pool/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除矿池产品
   */
  deletePool(id) {
    return request({
      url: `/api/admin/pool/${id}`,
      method: 'delete'
    })
  },

  /**
   * 获取秒合约配置列表
   */
  getContractList(params = {}) {
    return request({
      url: '/api/admin/contract/list',
      method: 'get',
      params
    })
  },

  /**
   * 创建秒合约配置
   */
  createContract(data) {
    return request({
      url: '/api/admin/contract',
      method: 'post',
      data
    })
  },

  /**
   * 更新秒合约配置
   */
  updateContract(id, data) {
    return request({
      url: `/api/admin/contract/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除秒合约配置
   */
  deleteContract(id) {
    return request({
      url: `/api/admin/contract/${id}`,
      method: 'delete'
    })
  },

  /**
   * 仪表盘统计
   */
  getDashboardStats() {
    return request({
      url: '/api/admin/dashboard/stats',
      method: 'get'
    })
  },

  /**
   * 待审核列表
   */
  getPendingList() {
    return request({
      url: '/api/admin/dashboard/pending',
      method: 'get'
    })
  },

  /**
   * 矿池持仓列表
   */
  getPoolHoldingList(params = {}) {
    return request({
      url: '/api/admin/holding/list',
      method: 'get',
      params
    })
  },

  /**
   * 合约订单列表
   */
  getContractOrderList(params = {}) {
    return request({
      url: '/api/admin/order/list',
      method: 'get',
      params
    })
  },

  /**
   * 手动结算合约订单
   */
  settleContractOrder(id, data) {
    return request({
      url: `/api/admin/order/${id}/settle`,
      method: 'put',
      data
    })
  },

  /**
   * KYC列表
   */
  getKycList(params = {}) {
    return request({
      url: '/api/admin/kyc/list',
      method: 'get',
      params
    })
  },

  /**
   * KYC审核
   */
  reviewKyc(id, data) {
    return request({
      url: `/api/admin/kyc/${id}/review`,
      method: 'put',
      data
    })
  },

  /**
   * 充值记录列表
   */
  getRechargeList(params = {}) {
    return request({
      url: '/api/admin/recharge/list',
      method: 'get',
      params
    })
  },

  /**
   * 手动充值
   */
  manualRecharge(data) {
    return request({
      url: '/api/admin/recharge/manual',
      method: 'post',
      data
    })
  },

  /**
   * 提现列表
   */
  getWithdrawList(params = {}) {
    return request({
      url: '/api/admin/withdraw/list',
      method: 'get',
      params
    })
  },

  /**
   * 提现审核
   */
  reviewWithdraw(id, data) {
    return request({
      url: `/api/admin/withdraw/${id}/review`,
      method: 'put',
      data
    })
  },

  /**
   * 获取用户资产
   */
  getUserAssets(id) {
    return request({
      url: `/api/admin/user/${id}/assets`,
      method: 'get'
    })
  },

  /**
   * 调整用户资产
   */
  adjustUserAsset(id, data) {
    return request({
      url: `/api/admin/user/${id}/asset/adjust`,
      method: 'post',
      data
    })
  },

  /**
   * 资产流水列表
   */
  getAssetLogs(params = {}) {
    return request({
      url: '/api/admin/asset/logs',
      method: 'get',
      params
    })
  },

  /**
   * 系统配置列表
   */
  getConfigList(params = {}) {
    return request({
      url: '/api/admin/config/list',
      method: 'get',
      params
    })
  },

  /**
   * 更新系统配置
   */
  updateConfig(key, data) {
    return request({
      url: `/api/admin/config/${key}`,
      method: 'put',
      data
    })
  },

  /**
   * 批量更新配置
   */
  batchUpdateConfigs(data) {
    return request({
      url: '/api/admin/config/batch',
      method: 'post',
      data
    })
  },

  /**
   * 公告列表
   */
  getNoticeList(params = {}) {
    return request({
      url: '/api/admin/notice/list',
      method: 'get',
      params
    })
  },

  /**
   * 创建公告
   */
  createNotice(data) {
    return request({
      url: '/api/admin/notice',
      method: 'post',
      data
    })
  },

  /**
   * 更新公告
   */
  updateNotice(id, data) {
    return request({
      url: `/api/admin/notice/${id}`,
      method: 'put',
      data
    })
  },

  /**
   * 删除公告
   */
  deleteNotice(id) {
    return request({
      url: `/api/admin/notice/${id}`,
      method: 'delete'
    })
  },

  // ============ 币种链管理 ============

  getCoinChainList(coinId) {
    return request({
      url: '/api/admin/chain/list',
      method: 'get',
      params: { coinId }
    })
  },

  createCoinChain(data) {
    return request({
      url: '/api/admin/chain',
      method: 'post',
      data
    })
  },

  updateCoinChain(id, data) {
    return request({
      url: `/api/admin/chain/${id}`,
      method: 'put',
      data
    })
  },

  deleteCoinChain(id) {
    return request({
      url: `/api/admin/chain/${id}`,
      method: 'delete'
    })
  },

  // ============ 邀请管理 ============

  getInviteList(params = {}) {
    return request({
      url: '/api/admin/invite/list',
      method: 'get',
      params
    })
  },

  // ============ 返佣管理 ============

  getCommissionList(params = {}) {
    return request({
      url: '/api/admin/commission/list',
      method: 'get',
      params
    })
  },

  // ============ 操作日志 ============

  getAdminLogList(params = {}) {
    return request({
      url: '/api/admin/log/list',
      method: 'get',
      params
    })
  }
}
