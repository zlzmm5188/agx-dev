<template>
  <div class="quick-icon-wrapper" :class="iconClass">
    <!-- 新币 IEO -->
    <svg v-if="name === 'ieo'" viewBox="0 0 48 48" fill="currentColor" stroke="none">
      <circle cx="24" cy="24" r="18" opacity="0.12"/>
      <path d="M24 8L27.5 17H37L29 23L32 34L24 28L16 34L19 23L11 17H20.5L24 8Z"/>
    </svg>

    <!-- 现货 Trade -->
    <svg v-else-if="name === 'trade'" viewBox="0 0 48 48" fill="currentColor" stroke="none">
      <rect x="10" y="30" width="5" height="10" rx="1.5" opacity="0.5"/>
      <rect x="18" y="24" width="5" height="16" rx="1.5" opacity="0.7"/>
      <rect x="26" y="18" width="5" height="22" rx="1.5" opacity="0.85"/>
      <rect x="34" y="12" width="5" height="28" rx="1.5"/>
    </svg>

    <!-- 合约 Contract -->
    <svg v-else-if="name === 'contract'" viewBox="0 0 48 48" fill="currentColor" stroke="currentColor">
      <path d="M10 36L18 24L28 30L38 14" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M30 14H38V22" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="10" cy="36" r="3.5"/>
      <circle cx="18" cy="24" r="3.5" opacity="0.7"/>
      <circle cx="28" cy="30" r="3.5" opacity="0.7"/>
      <circle cx="38" cy="14" r="4"/>
    </svg>

    <!-- 黄金 Gold -->
    <svg v-else-if="name === 'gold'" viewBox="0 0 48 48" fill="currentColor" stroke="none">
      <path d="M10 30L15 18H33L38 30H10Z"/>
      <path d="M12 30L16 20H32L36 30H12Z" opacity="0.25"/>
      <rect x="18" y="12" width="12" height="6" rx="1"/>
      <path d="M14 36L10 30H38L34 36H14Z"/>
    </svg>

    <!-- 理财 Earn -->
    <svg v-else-if="name === 'earn'" viewBox="0 0 48 48" fill="currentColor" stroke="none">
      <circle cx="24" cy="24" r="16" opacity="0.12"/>
      <circle cx="24" cy="24" r="11" opacity="0.25"/>
      <circle cx="24" cy="24" r="6"/>
    </svg>

    <!-- 质押 Mining -->
    <svg v-else-if="name === 'mining'" viewBox="0 0 48 48" fill="currentColor" stroke="currentColor">
      <rect x="12" y="28" width="24" height="10" rx="2" opacity="0.3" stroke="none"/>
      <circle cx="24" cy="20" r="11" stroke-width="2.5" fill="none"/>
      <path d="M24 12V28" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M16 20H32" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    </svg>

    <!-- 充币 Deposit -->
    <svg v-else-if="name === 'deposit'" viewBox="0 0 48 48" fill="currentColor" stroke="currentColor">
      <rect x="12" y="12" width="24" height="24" rx="4" stroke-width="2.5" fill="none"/>
      <rect x="16" y="16" width="16" height="16" rx="2" opacity="0.15" stroke="none"/>
      <path d="M24 20V32" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M18 26L24 32L30 26" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>

    <!-- 提币 Withdraw -->
    <svg v-else-if="name === 'withdraw'" viewBox="0 0 48 48" fill="currentColor" stroke="currentColor">
      <rect x="12" y="12" width="24" height="24" rx="4" stroke-width="2.5" fill="none"/>
      <rect x="16" y="16" width="16" height="16" rx="2" opacity="0.15" stroke="none"/>
      <path d="M24 32V20" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M18 26L24 20L30 26" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>

    <!-- 默认图标 -->
    <svg v-else viewBox="0 0 48 48" fill="none" stroke="currentColor">
      <circle cx="24" cy="24" r="16" stroke-width="2"/>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.quick-icon-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-icon-wrapper svg {
  width: 36px;
  height: 36px;
  position: relative;
  z-index: 1;
  color: #C9A962 !important;
}

.quick-icon-wrapper svg,
.quick-icon-wrapper svg * {
  stroke: #C9A962 !important;
  fill: #C9A962 !important;
}
</style>
