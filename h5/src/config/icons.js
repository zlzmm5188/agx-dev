/**
 * 图标路径配置文件
 * 统一管理所有功能性图标的SVG路径
 * 注意：不包括底部导航栏图标和平台品牌图标
 */

export const iconPaths = {
  // 导航类图标
  arrowLeft: 'M15 18l-6-6 6-6',
  arrowRight: 'M9 18l6-6-6-6',
  arrowDown: 'M6 9l6 6 6-6',
  arrowUp: 'M18 15l-6-6-6 6',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  chevronDown: 'M6 9l6 6 6-6',
  
  // 操作类图标
  close: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7',
  delete: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2',
  copy: 'M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-2M16 4h2a2 2 0 012 2v2M8 4v12',
  
  // 功能类图标
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14z M21 21l-4.35-4.35',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  refresh: 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
  more: '',
  moreVertical: '',
  
  // 信息类图标
  info: 'M12 16v-4M12 8h.01',
  help: 'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3',
  warning: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4M12 17h.01',
  error: 'M18 6L6 18M6 6l12 12',
  
  // 用户相关
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  userPlus: 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12.5 7a4 4 0 100-8 4 4 0 000 8zM20 8v6M23 11h-6',
  
  // 安全类
  lock: 'M7 11V7a5 5 0 0110 0v4',
  unlock: 'M7 11V7a5 5 0 019.9-1M15 11v6',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
  eyeOff: 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22',
  key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  
  // 通讯类
  mail: 'M3 7l9 6 9-6',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
  message: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  
  // 金融类
  dollar: 'M15 9.5a3 3 0 00-3-1.5h-1a2 2 0 000 4h2a2 2 0 010 4h-1a3 3 0 01-3-1.5M12 6v2M12 16v2',
  trendingUp: 'M22 7l-9.5 9.5-5-5L2 17',
  trendingDown: 'M22 17l-9.5-9.5-5 5L2 7',
  chart: 'M10 24l4-8 4 4 4-12 4 13',
  barChart: '',
  
  // 文件类
  file: 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z M13 2v7h7',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  
  // 分享类
  share: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71',
  qrcode: '',
  
  // 媒体类
  image: 'M21 15l-5-5L5 21',
  camera: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z',
  video: 'M23 7l-7 5 7 5V7z',
  
  // 其他
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z',
  calendar: 'M19 4h-1V2M5 4H4V2M3 8h18M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z',
  clock: 'M12 6v6l4 2',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20z M2 12h20',
  wifi: 'M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01',
  
  // Trade页面专用
  chartLine: 'M22 7l-9.5 9.5-5-5L2 17',
  dots: ''
}

/**
 * 多路径图标（需要多个path或其他SVG元素）
 */
export const complexIcons = {
  // 三个点（横向）
  more: [
    { type: 'circle', attrs: { cx: 12, cy: 12, r: 1 } },
    { type: 'circle', attrs: { cx: 19, cy: 12, r: 1 } },
    { type: 'circle', attrs: { cx: 5, cy: 12, r: 1 } }
  ],
  
  // 三个点（竖向）
  moreVertical: [
    { type: 'circle', attrs: { cx: 12, cy: 5, r: 1 } },
    { type: 'circle', attrs: { cx: 12, cy: 12, r: 1 } },
    { type: 'circle', attrs: { cx: 12, cy: 19, r: 1 } }
  ],
  
  // 柱状图
  barChart: [
    { type: 'rect', attrs: { x: 11, y: 18, width: 4, height: 8, rx: 1 } },
    { type: 'rect', attrs: { x: 16, y: 14, width: 4, height: 12, rx: 1 } },
    { type: 'rect', attrs: { x: 21, y: 10, width: 4, height: 16, rx: 1 } }
  ],
  
  // 二维码
  qrcode: [
    { type: 'rect', attrs: { x: 3, y: 3, width: 7, height: 7 } },
    { type: 'rect', attrs: { x: 14, y: 3, width: 7, height: 7 } },
    { type: 'rect', attrs: { x: 3, y: 14, width: 7, height: 7 } },
    { type: 'rect', attrs: { x: 14, y: 14, width: 7, height: 7 } }
  ],
  
  // 手机
  phoneDevice: [
    { type: 'rect', attrs: { x: 5, y: 2, width: 14, height: 20, rx: 2 } },
    { type: 'line', attrs: { x1: 12, y1: 18, x2: 12.01, y2: 18 } }
  ],
  
  // 邮箱
  mailBox: [
    { type: 'rect', attrs: { x: 3, y: 5, width: 18, height: 14, rx: 2 } },
    { type: 'path', attrs: { d: 'M3 7l9 6 9-6' } }
  ],
  
  // 锁
  lockIcon: [
    { type: 'rect', attrs: { x: 3, y: 11, width: 18, height: 11, rx: 2 } },
    { type: 'path', attrs: { d: 'M7 11V7a5 5 0 0110 0v4' } }
  ],
  
  // 目标/设置
  target: [
    { type: 'circle', attrs: { cx: 12, cy: 12, r: 3 } },
    { type: 'path', attrs: { d: 'M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24' } }
  ],
  
  // 图片
  imageIcon: [
    { type: 'rect', attrs: { x: 3, y: 3, width: 18, height: 18, rx: 2 } },
    { type: 'circle', attrs: { cx: 8.5, cy: 8.5, r: 1.5 } },
    { type: 'polyline', attrs: { points: '21 15 16 10 5 21' } }
  ],
  
  // Trade页面图表线
  chartPolyline: [
    { type: 'polyline', attrs: { points: '22,7 13.5,15.5 8.5,10.5 2,17' } },
    { type: 'polyline', attrs: { points: '16,7 22,7 22,13' } }
  ],
  
  // 用户圆圈
  userCircle: [
    { type: 'circle', attrs: { cx: 9, cy: 7, r: 4 } },
    { type: 'path', attrs: { d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' } }
  ],
  
  // 帮助圆圈
  helpCircle: [
    { type: 'circle', attrs: { cx: 12, cy: 12, r: 10 } },
    { type: 'path', attrs: { d: 'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3' } },
    { type: 'line', attrs: { x1: 12, y1: 17, x2: 12.01, y2: 17 } }
  ],
  
  // 理财/金钱圆圈
  dollarCircle: [
    { type: 'circle', attrs: { cx: 12, cy: 12, r: 9 } },
    { type: 'path', attrs: { d: 'M15 9.5a3 3 0 00-3-1.5h-1a2 2 0 000 4h2a2 2 0 010 4h-1a3 3 0 01-3-1.5' } },
    { type: 'path', attrs: { d: 'M12 6v2M12 16v2' } }
  ],
  
  // 闪电/IEO
  lightning: [
    { type: 'path', attrs: { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' } }
  ],
  
  // OTC/卡片
  card: [
    { type: 'rect', attrs: { x: 3, y: 6, width: 18, height: 12, rx: 2 } },
    { type: 'path', attrs: { d: 'M3 10h18' } },
    { type: 'path', attrs: { d: 'M7 14h4' } }
  ],
  
  // 全球
  globeLines: [
    { type: 'circle', attrs: { cx: 12, cy: 12, r: 10 } },
    { type: 'line', attrs: { x1: 2, y1: 12, x2: 22, y2: 12 } },
    { type: 'path', attrs: { d: 'M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' } }
  ]
}

/**
 * 图标大小预设
 */
export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28
}

/**
 * stroke-width 预设
 */
export const strokeWidths = {
  thin: 1,
  regular: 1.5,
  medium: 2,
  bold: 2.5
}
