<template>
  <teleport to="body">
    <transition name="alert-fade">
      <div v-if="visible" class="ios-alert-overlay" @click="handleOverlayClick">
        <transition name="alert-scale">
          <div v-if="visible" class="ios-alert-box" @click.stop>
            <div v-if="title" class="alert-title">{{ title }}</div>
            <div class="alert-message">{{ message }}</div>
            <div class="alert-buttons">
              <button 
                v-if="showCancel" 
                class="alert-btn cancel-btn" 
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button 
                class="alert-btn confirm-btn" 
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const visible = ref(true)

const handleConfirm = () => {
  visible.value = false
  setTimeout(() => {
    emit('confirm')
    emit('close')
  }, 200)
}

const handleCancel = () => {
  visible.value = false
  setTimeout(() => {
    emit('cancel')
    emit('close')
  }, 200)
}

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleCancel()
  }
}
</script>

<style scoped>
.ios-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.ios-alert-box {
  width: 100%;
  max-width: 280px;
  background: rgba(30, 35, 41, 0.98);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.alert-title {
  padding: 20px 16px 8px;
  font-size: 17px;
  font-weight: 600;
  color: #eaecef;
  text-align: center;
  line-height: 1.4;
}

.alert-message {
  padding: 12px 16px 20px;
  font-size: 14px;
  color: #848e9c;
  text-align: center;
  line-height: 1.6;
}

.alert-title + .alert-message {
  padding-top: 4px;
}

.alert-buttons {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.alert-btn {
  flex: 1;
  height: 48px;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.alert-btn:active {
  background: rgba(255, 255, 255, 0.06);
}

.cancel-btn {
  color: #848e9c;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.confirm-btn {
  color: #C9A962;
  font-weight: 600;
}

/* 动画 */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.2s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}

.alert-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.alert-scale-leave-active {
  transition: all 0.2s ease;
}

.alert-scale-enter-from {
  opacity: 0;
  transform: scale(0.7);
}

.alert-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
