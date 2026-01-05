<template>
  <svg :class="svgClass" :style="svgStyle" aria-hidden="true">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 图标名称（对应 src/assets/icons/ 目录下的 svg 文件名）
  name: {
    type: String,
    required: true
  },
  // 图标前缀，默认为 'icon'
  prefix: {
    type: String,
    default: 'icon'
  },
  // 图标颜色，默认继承父元素颜色
  color: {
    type: String,
    default: ''
  },
  // 图标大小，支持字符串（如 '20px'）或数字（自动添加 px）
  size: {
    type: [String, Number],
    default: '16px'
  },
  // 自定义类名
  className: {
    type: String,
    default: ''
  }
})

// 计算 symbol id（vite-plugin-svg-icons 使用的格式）
const symbolId = computed(() => `#${props.prefix}-${props.name}`)

// 计算 SVG 的 class
const svgClass = computed(() => {
  return ['svg-icon', props.className].filter(Boolean).join(' ')
})

// 计算 SVG 的样式
const svgStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: size,
    height: size,
    color: props.color
  }
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
