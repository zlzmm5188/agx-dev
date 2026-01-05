<template>
  <div class="register-page">
    <div class="page-content">
      <!-- Logo -->
      <div class="logo-section">
        <div class="logo">
          <img src="/agx-new.png" alt="AGX" class="logo-img">
        </div>
        <h1 class="app-name">创建账号</h1>
        <p class="app-slogan">开启您的数字资产之旅</p>
      </div>

      <!-- 注册表单 -->
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
          <label>验证码</label>
          <div class="input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <input type="text" v-model="verifyCode" placeholder="请输入验证码">
            <button 
              class="code-btn" 
              :disabled="countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>登录密码</label>
          <div class="input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="8-20位字母和数字组合">
            <button class="toggle-btn" @click="showPassword = !showPassword">
              <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M1 1l22 22"/>
              </svg>
            </button>
          </div>
          <div class="password-strength">
            <div class="strength-bar" :class="passwordStrength"></div>
            <span>密码强度: {{ passwordStrengthText }}</span>
          </div>
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <div class="input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <input :type="showPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="请再次输入密码">
          </div>
        </div>

        <div class="form-group">
          <label>邀请码 (选填)</label>
          <div class="input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <input type="text" v-model="inviteCode" placeholder="请输入邀请码">
          </div>
        </div>

        <div class="agreement">
          <label class="checkbox-wrap">
            <input type="checkbox" v-model="agreeTerms">
            <span class="checkmark"></span>
          </label>
          <span>我已阅读并同意</span>
          <a href="#">《用户协议》</a>
          <span>和</span>
          <a href="#">《隐私政策》</a>
        </div>

        <button class="submit-btn" :disabled="!canSubmit" @click="handleRegister">注册</button>
      </div>

      <!-- 登录链接 -->
      <div class="login-link">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { alert } from '../utils/alert'
import api from '../utils/api'

const router = useRouter()
const route = useRoute()

const username = ref('')
const verifyCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const inviteCode = ref(route.query.code || '')
const showPassword = ref(false)
const agreeTerms = ref(false)
const countdown = ref(0)
const loading = ref(false)

const passwordStrength = computed(() => {
  if (!password.value) return ''
  if (password.value.length < 8) return 'weak'
  if (/^[a-zA-Z]+$/.test(password.value) || /^\d+$/.test(password.value)) return 'weak'
  if (/^[a-zA-Z0-9]+$/.test(password.value) && password.value.length >= 8) return 'medium'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  const map = { weak: '弱', medium: '中', strong: '强', '': '请输入密码' }
  return map[passwordStrength.value]
})

const canSubmit = computed(() => {
  return username.value && password.value && confirmPassword.value && agreeTerms.value && !loading.value
})

const sendCode = async () => {
  if (!username.value) {
    await alert('请先输入账号')
    return
  }
  // 后端暂无验证码接口，用于模拟
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  await alert('验证码已发送')
}

const handleRegister = async () => {
  if (!username.value) {
    await alert('请输入账号')
    return
  }
  if (password.value.length < 8) {
    await alert('密码长度至少8位')
    return
  }
  if (password.value !== confirmPassword.value) {
    await alert('两次密码输入不一致')
    return
  }
  if (!agreeTerms.value) {
    await alert('请阅读并同意用户协议')
    return
  }
  
  loading.value = true
  try {
    const res = await api.account.register({
      username: username.value,
      password: password.value,
      inviteCode: inviteCode.value || undefined
    })
    
    if (res.success) {
      await alert('注册成功！请登录')
      router.push('/login')
    } else {
      await alert(res.message || '注册失败')
    }
  } catch (e) {
    await alert(e.message || '注册失败，请检查网络')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  width: 100%;
  max-width: 428px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #181a20 0%, #131518 50%, #0c0e12 100%);
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: max(20px, env(safe-area-inset-top));
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.logo-section {
  text-align: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 10px;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(201, 169, 98, 0.25);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-name {
  font-size: 22px;
  font-weight: 700;
  color: #eaecef;
  margin-bottom: 4px;
}

.app-slogan {
  font-size: 12px;
  color: #848e9c;
}

.form-section {
  background: #1e2329;
  border-radius: 16px;
  padding: 18px;
  flex-shrink: 0;
}

.form-group {
  margin-bottom: 12px;
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

.input-wrap svg { color: #5e6673; flex-shrink: 0; width: 18px; height: 18px; }

.input-wrap input {
  flex: 1;
  height: 42px;
  background: none;
  border: none;
  color: #eaecef;
  font-size: 14px;
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

.code-btn {
  padding: 7px 12px;
  background: linear-gradient(135deg, rgba(201,169,98,0.2), rgba(201,169,98,0.1));
  border: 1px solid rgba(201,169,98,0.3);
  border-radius: 6px;
  font-size: 12px;
  color: #C9A962;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.code-btn:disabled {
  opacity: 0.5;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.strength-bar {
  width: 60px;
  height: 3px;
  background: #2B3139;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.strength-bar::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}

.strength-bar.weak::after { width: 33%; background: #F6465D; }
.strength-bar.medium::after { width: 66%; background: #F0B90B; }
.strength-bar.strong::after { width: 100%; background: #0ECB81; }

.password-strength span {
  font-size: 11px;
  color: #5e6673;
}

.agreement {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3px;
  margin-bottom: 14px;
  font-size: 11px;
  color: #5e6673;
}

.checkbox-wrap {
  position: relative;
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.checkbox-wrap input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 16px;
  height: 16px;
  background: #2B3139;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.1);
}

.checkbox-wrap input:checked + .checkmark {
  background: #C9A962;
  border-color: #C9A962;
}

.checkmark::after {
  content: '';
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 7px;
  border: solid #0f1317;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-wrap input:checked + .checkmark::after {
  display: block;
}

.agreement a {
  color: #C9A962;
  text-decoration: none;
}

.submit-btn {
  width: 100%;
  height: 46px;
  background: linear-gradient(135deg, #C9A962, #A88B4A);
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #0f1317;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.15s;
}

.submit-btn:disabled {
  opacity: 0.5;
}

.submit-btn:not(:disabled):active { transform: scale(0.98); opacity: 0.9; }

.login-link {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: #848e9c;
  flex-shrink: 0;
}

.login-link a {
  color: #C9A962;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

/* 小屏幕适配 */
@media screen and (max-height: 700px) {
  .logo { width: 48px; height: 48px; margin-bottom: 8px; }
  .app-name { font-size: 20px; }
  .logo-section { margin-bottom: 12px; }
  .form-section { padding: 14px; }
  .form-group { margin-bottom: 10px; }
  .input-wrap input { height: 38px; font-size: 13px; }
  .submit-btn { height: 42px; font-size: 14px; }
  .login-link { margin-top: 12px; }
  .password-strength { margin-top: 4px; }
  .agreement { margin-bottom: 12px; }
}
</style>
