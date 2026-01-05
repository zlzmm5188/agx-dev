import { createApp } from 'vue'
import IOSAlert from '../components/IOSAlert.vue'

let alertInstance = null

export const showAlert = (options) => {
  return new Promise((resolve, reject) => {
    // 如果已存在实例，先移除
    if (alertInstance) {
      alertInstance.unmount()
      alertInstance = null
    }

    // 创建容器
    const container = document.createElement('div')
    document.body.appendChild(container)

    // 规范化选项
    const props = typeof options === 'string' 
      ? { message: options }
      : { ...options }

    // 创建组件实例
    const app = createApp(IOSAlert, {
      ...props,
      onConfirm: () => {
        cleanup()
        resolve(true)
      },
      onCancel: () => {
        cleanup()
        resolve(false)
      },
      onClose: () => {
        cleanup()
      }
    })

    // 清理函数
    const cleanup = () => {
      setTimeout(() => {
        if (alertInstance) {
          alertInstance.unmount()
          alertInstance = null
        }
        if (container && container.parentNode) {
          container.parentNode.removeChild(container)
        }
      }, 300)
    }

    // 挂载组件
    alertInstance = app.mount(container)
  })
}

// 确认对话框
export const confirm = (message, title = '提示') => {
  return showAlert({
    title,
    message,
    showCancel: true
  })
}

// 普通提示
export const alert = (message, title = '') => {
  return showAlert({
    title,
    message,
    showCancel: false
  })
}

// 成功提示
export const success = (message) => {
  return showAlert({
    title: '成功',
    message,
    showCancel: false
  })
}

// 错误提示
export const error = (message) => {
  return showAlert({
    title: '错误',
    message,
    showCancel: false
  })
}

export default {
  showAlert,
  confirm,
  alert,
  success,
  error
}
