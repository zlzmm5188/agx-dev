<template>
  <svg 
    :width="computedSize" 
    :height="computedSize" 
    viewBox="0 0 24 24" 
    fill="none" 
    :stroke="color" 
    :stroke-width="computedStrokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="['icon', { 'icon-clickable': clickable }]"
  >
    <!-- 简单单路径图标 -->
    <path v-if="simplePath" :d="simplePath" />
    
    <!-- 复杂多元素图标 -->
    <template v-else-if="complexElements">
      <component 
        v-for="(element, index) in complexElements" 
        :key="index"
        :is="element.type"
        v-bind="element.attrs"
      />
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { iconPaths, complexIcons, iconSizes, strokeWidths } from '../config/icons'

const props = defineProps({
  // 图标名称（必填）
  name: {
    type: String,
    required: true
  },
  // 图标大小（可以是数字或预设值）
  size: {
    type: [Number, String],
    default: 'md'
  },
  // 图标颜色
  color: {
    type: String,
    default: 'currentColor'
  },
  // stroke-width（可以是数字或预设值）
  strokeWidth: {
    type: [Number, String],
    default: 'regular'
  },
  // 是否可点击（添加交互效果）
  clickable: {
    type: Boolean,
    default: false
  }
})

// 计算实际大小
const computedSize = computed(() => {
  if (typeof props.size === 'number') {
    return props.size
  }
  return iconSizes[props.size] || iconSizes.md
})

// 计算实际stroke-width
const computedStrokeWidth = computed(() => {
  if (typeof props.strokeWidth === 'number') {
    return props.strokeWidth
  }
  return strokeWidths[props.strokeWidth] || strokeWidths.regular
})

// 获取简单路径
const simplePath = computed(() => {
  return iconPaths[props.name] || null
})

// 获取复杂图标元素
const complexElements = computed(() => {
  return complexIcons[props.name] || null
})
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.icon-clickable {
  cursor: pointer;
}

.icon-clickable:hover {
  opacity: 0.8;
}

.icon-clickable:active {
  transform: scale(0.95);
  opacity: 0.6;
}
</style>
