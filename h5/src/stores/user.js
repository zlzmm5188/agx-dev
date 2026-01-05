import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: {
      id: '',
      username: '',
      avatar: '',
      email: '',
      phone: '',
      vipLevel: 0,
      kycStatus: 0,
      securityLevel: 0
    },
    isLoggedIn: false
  }),

  getters: {
    getToken: (state) => state.token,
    getUserInfo: (state) => state.userInfo,
    isAuthenticated: (state) => !!state.token && state.isLoggedIn
  },

  actions: {
    setToken(token) {
      this.token = token
      this.isLoggedIn = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    setUserInfo(userInfo) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },

    logout() {
      this.token = ''
      this.isLoggedIn = false
      this.userInfo = {
        id: '',
        username: '',
        avatar: '',
        email: '',
        phone: '',
        vipLevel: 0,
        kycStatus: 0,
        securityLevel: 0
      }
      localStorage.removeItem('token')
    }
  }
})
