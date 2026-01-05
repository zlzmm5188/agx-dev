import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/tokens.css'
import './styles/variables.css'
import './styles/reset-width.css'

// 导入 SvgIcon 组件
import SvgIcon from './components/common/SvgIcon.vue'

// 注意：等待安装 vite-plugin-svg-icons 后取消注释
// import 'virtual:svg-icons-register'

const app = createApp(App)
const pinia = createPinia()

// 全局注册 SvgIcon 组件
app.component('SvgIcon', SvgIcon)

app.use(pinia)
app.use(router)
app.mount('#app')