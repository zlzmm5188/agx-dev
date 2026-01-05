// API统一导出
import api from '../utils/api'

export { api }
export const accountApi = api.account
export const marketApi = api.market
export const goldApi = api.gold
export const contractApi = api.contract
export const poolApi = api.pool
export const inviteApi = api.invite
export const squareApi = api.square
export const socialApi = api.social
export const aiApi = api.ai

export default api
