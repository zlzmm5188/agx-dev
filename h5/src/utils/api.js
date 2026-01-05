import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    const { data } = response
    // AGX后端返回格式: { code: 0, msg: 'ok', data: {...} }
    if (data.code === 0) {
      return { success: true, data: data.data, message: data.msg }
    } else if (data.code === 1002) {
      // 未登录
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(new Error(data.msg || '请先登录'))
    } else {
      return { success: false, message: data.msg || '请求失败', code: data.code }
    }
  },
  (error) => {
    let message = '网络错误'
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          message = '登录已过期'
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '接口不存在'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = data?.msg || '请求失败'
      }
    } else if (error.request) {
      message = '网络连接失败'
    }
    return Promise.reject({ success: false, message, error })
  }
)

// API接口定义 - 与后端agx-backend对接
export const api = {
  // 通用请求方法
  request: (config) => apiClient(config),
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),

  // ========== 账户模块 /api/account ==========
  account: {
    register: (data) => apiClient.post('/api/account/register', data),
    login: (data) => apiClient.post('/api/account/login', data),
    profile: () => apiClient.get('/api/account/profile'),
    updateProfile: (data) => apiClient.put('/api/account/profile', data),
    balance: () => apiClient.get('/api/account/balance'),
    changePassword: (data) => apiClient.post('/api/account/password', data),
    // KYC
    submitKyc: (data) => apiClient.post('/api/account/kyc', data),
    getKycStatus: () => apiClient.get('/api/account/kyc'),
    // 充提
    getDepositAddress: (params) => apiClient.get('/api/account/deposit/address', { params }),
    getDepositHistory: (params) => apiClient.get('/api/account/deposit/history', { params }),
    withdraw: (data) => apiClient.post('/api/account/withdraw', data),
    getWithdrawHistory: (params) => apiClient.get('/api/account/withdraw/history', { params }),
    // 邀请
    getInviteList: (params) => apiClient.get('/api/account/invites', { params }),
    getInviteStats: () => apiClient.get('/api/account/invite/stats'),
    // 公告
    getNotices: () => apiClient.get('/api/account/notices'),
  },

  // ========== 行情模块 /api/market ==========
  market: {
    getTickers: (type, tab) => apiClient.get('/api/market/tickers', { params: { type, tab } }),
    getTicker: (symbol) => apiClient.get(`/api/market/ticker/${symbol}`),
    getKlines: (params) => apiClient.get('/api/market/klines', { params }),
    getAssets: (type) => apiClient.get('/api/market/assets', { params: { type } }),
  },

  // ========== 黄金模块 /api/gold ==========
  gold: {
    getPrices: () => apiClient.get('/api/gold/prices'),
    getDetail: () => apiClient.get('/api/gold/detail'),
    getKlines: (params) => apiClient.get('/api/gold/klines', { params }),
    getCategories: () => apiClient.get('/api/gold/categories'),
    getProducts: (type) => apiClient.get('/api/gold/products', { params: { type } }),
    getProductDetail: (id) => apiClient.get(`/api/gold/product/${id}`),
    getSpot: () => apiClient.get('/api/gold/spot'),
    getContract: () => apiClient.get('/api/gold/contract'),
    getFinance: () => apiClient.get('/api/gold/finance'),
    getAgx: () => apiClient.get('/api/gold/agx'),
  },

  // ========== 合约模块 /api/contract ==========
  contract: {
    getConfigs: () => apiClient.get('/api/contract/configs'),
    createOrder: (data) => apiClient.post('/api/contract/order', data),
    getOrders: (status) => apiClient.get('/api/contract/orders', { params: { status } }),
  },

  // ========== 矿池模块 /api/pool ==========
  pool: {
    getProducts: () => apiClient.get('/api/pool/products'),
    getHoldings: () => apiClient.get('/api/pool/holdings'),
    subscribe: (data) => apiClient.post('/api/pool/subscribe', data),
    redeem: (data) => apiClient.post('/api/pool/redeem', data),
  },

  // ========== 邀请模块 /api/invite ==========
  invite: {
    getInfo: () => apiClient.get('/api/invite/info'),
    getRecords: (params) => apiClient.get('/api/invite/records', { params }),
    getCommissions: (params) => apiClient.get('/api/invite/commissions', { params }),
    getLevels: () => apiClient.get('/api/invite/levels'),
    getRank: (params) => apiClient.get('/api/invite/rank', { params }),
    getMyRank: (params) => apiClient.get('/api/invite/myrank', { params }),
  },

  // ========== 广场模块 /api/square ==========
  square: {
    getPosts: (params) => apiClient.get('/api/square/posts', { params }),
    getPost: (id) => apiClient.get(`/api/square/post/${id}`),
    createPost: (data) => apiClient.post('/api/square/post', data),
    toggleLike: (data) => apiClient.post('/api/square/like', data),
    createComment: (data) => apiClient.post('/api/square/comment', data),
    getComments: (params) => apiClient.get('/api/square/comments', { params }),
    toggleFollow: (data) => apiClient.post('/api/square/follow', data),
    getTopics: (limit) => apiClient.get('/api/square/topics', { params: { limit } }),
  },

  // ========== 社交模块 /api/user ==========
  social: {
    follow: (targetId) => apiClient.post(`/api/user/follow/${targetId}`),
    unfollow: (targetId) => apiClient.post(`/api/user/unfollow/${targetId}`),
    getFriends: (params) => apiClient.get('/api/user/friends', { params }),
    sendFriendRequest: (data) => apiClient.post('/api/user/friend-request', data),
    handleFriendRequest: (requestId, accept) => apiClient.post(`/api/user/friend-request/${requestId}/handle`, { accept }),
    getConversations: (params) => apiClient.get('/api/user/conversations', { params }),
    getMessages: (conversationId, params) => apiClient.get(`/api/user/conversations/${conversationId}/messages`, { params }),
    sendMessage: (data) => apiClient.post('/api/user/messages/send', data),
  },

  // ========== AI模块 /api/ai ==========
  ai: {
    chat: (data) => apiClient.post('/api/ai/chat', data),
    getQuestions: (language) => apiClient.get('/api/ai/questions', { params: { language } }),
  },

  // ========== 交易模块 /api/trade ==========
  trade: {
    getPairs: () => apiClient.get('/api/trade/pairs'),
    createOrder: (data) => apiClient.post('/api/trade/order', data),
    cancelOrder: (orderNo) => apiClient.delete(`/api/trade/order/${orderNo}`),
    getOrders: (params) => apiClient.get('/api/trade/orders', { params }),
    getIssues: () => apiClient.get('/api/trade/issues'),
    subscribeCoin: (data) => apiClient.post('/api/trade/subscribe', data),
  },

  // ========== 广场模块 /api/square ==========
  square: {
    getPosts: (params) => apiClient.get('/api/square/posts', { params }),
    getPost: (id) => apiClient.get(`/api/square/post/${id}`),
    createPost: (data) => apiClient.post('/api/square/post', data),
    toggleLike: (data) => apiClient.post('/api/square/like', data),
    createComment: (data) => apiClient.post('/api/square/comment', data),
    getComments: (params) => apiClient.get('/api/square/comments', { params }),
    toggleFollow: (data) => apiClient.post('/api/square/follow', data),
    getTopics: (params) => apiClient.get('/api/square/topics', { params }),
  },
}

export default api