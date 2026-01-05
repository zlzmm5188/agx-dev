<template>
  <PageLayout :show-navbar="false" :show-back="false">
    <div class="page-content">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo">
          <img src="/agx-new.png" alt="AGX" class="logo-img">
        </div>
        <h1 class="app-name">升达金融</h1>
        <p class="app-slogan">黄金背书 · 价值永恒</p>
      </div>

      <!-- 登录表单 -->
      <div class="form-section">
        <div class="form-group">
          <label>账号</label>
          <div class="input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <input type="text" v-model="username" placeholder="请输入账号">
          </div>
        </div>

        <div class="form-group">
          <label>密码</label>
          <div class="input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="请输入密码">
            <button class="toggle-btn" @click="showPassword = !showPassword">
              <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M1 1l22 22"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span>记住登录</span>
          </label>
          <span class="forgot-link" @click="async () => await alert('请联系客服重置密码')">忘记密码？</span>
        </div>

        <button class="submit-btn" @click="handleLogin">登录</button>
      </div>

      <!-- 注册链接 -->
      <div class="register-link">
        <span>还没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { alert } from '../utils/alert'
import { useUserStore } from '../stores/user'
import api from '../utils/api'
import PageLayout from '../components/layout/PageLayout.vue'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value) {
    await alert('请输入账号')
    return
  }
  if (!password.value) {
    await alert('请输入密码')
    return
  }
  
  loading.value = true
  try {
    const res = await api.account.login({
      username: username.value,
      password: password.value
    })
    
    if (res.success && res.data) {
      // 保存token
      userStore.setToken(res.data.token)
      // 保存用户信息
      if (res.data.user) {
        userStore.setUserInfo(res.data.user)
      }
      // 如果选择记住登录，保存用户名
      if (rememberMe.value) {
        localStorage.setItem('rememberedUsername', username.value)
      } else {
        localStorage.removeItem('rememberedUsername')
      }
      // 跳转首页
      router.push('/')
    } else {
      await alert(res.message || '登录失败')
    }
  } catch (e) {
    await alert(e.message || '登录失败，请检查网络')
  } finally {
    loading.value = false
  }
}

// 初始化：检查是否有记住的用户名
const rememberedUsername = localStorage.getItem('rememberedUsername')
if (rememberedUsername) {
  username.value = rememberedUsername
  rememberMe.value = true
}
</script>

<style scoped>
.login-page {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh; /* 动态视口高度，适配移动端浏览器工具栏 */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 20px;
  padding-top: env(safe-area-inset-top, 20px);
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.logo-section {
  text-align: center;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(201, 169, 98, 0.3);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-name {
  font-size: 24px;
  font-weight: 700;
  color: #eaecef;
  margin-bottom: 4px;
}

.app-slogan {
  font-size: 13px;
  color: #C9A962;
}

.form-section {
  background: #1e2329;
  border-radius: 16px;
  padding: 20px;
  flex-shrink: 0;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: #848e9c;
  margin-bottom: 6px;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  background: #2B3139;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: border-color 0.2s;
}

.input-wrap:focus-within {
  border-color: rgba(201, 169, 98, 0.5);
}

.input-wrap svg { color: #5e6673; flex-shrink: 0; }

.input-wrap input {
  flex: 1;
  height: 44px;
  background: none;
  border: none;
  color: #eaecef;
  font-size: 15px;
  outline: none;
}

.input-wrap input::placeholder { color: #5e6673; }

.toggle-btn {
  background: none;
  border: none;
  color: #5e6673;
  padding: 4px;
  -webkit-tap-highlight-color: transparent;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #848e9c;
}

.remember-me input {
  width: 16px;
  height: 16px;
  accent-color: #C9A962;
}

.forgot-link {
  font-size: 12px;
  color: #C9A962;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.submit-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #0f1317;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.15s;
}

.submit-btn:active { transform: scale(0.98); opacity: 0.9; }

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #848e9c;
  flex-shrink: 0;
}

.register-link a {
  color: #C9A962;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

/* 小屏幕适配 */
@media screen and (max-height: 667px) {
  .logo { width: 56px; height: 56px; margin-bottom: 8px; }
  .app-name { font-size: 22px; }
  .logo-section { margin-bottom: 16px; }
  .form-section { padding: 16px; }
  .form-group { margin-bottom: 12px; }
  .input-wrap input { height: 40px; }
  .submit-btn { height: 44px; }
  .register-link { margin-top: 16px; }
}
</style>
