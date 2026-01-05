import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// 注意：需要安装依赖 npm install vite-plugin-svg-icons fast-glob -D
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // SVG 图标插件配置
    // 等待安装依赖后取消注释：
    // createSvgIconsPlugin({
    //   iconDirs: [resolve(__dirname, 'src/assets/icons')],
    //   symbolId: 'icon-[dir]-[name]',
    //   inject: 'body-last',
    //   customDomId: '__svg__icons__dom__'
    // })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // 开启预热，加速首屏
    warmup: {
      clientFiles: [
        './src/views/Home.vue',
        './src/views/Mine.vue',
        './src/components/TabBar.vue'
      ]
    }
  },
  // 依赖预构建优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios']
  }
})
