# K线数据API

<cite>
**本文档引用文件**  
- [market.controller.ts](file://agx-backend/src/modules/market/market.controller.ts)
- [market.service.ts](file://agx-backend/src/modules/market/market.service.ts)
- [API_CONTRACT.md](file://agx-backend/API_CONTRACT.md)
- [ma-charts/index.vue](file://agx-admin/src/components/ma-charts/index.vue)
- [api.js](file://h5/src/utils/api.js)
- [market.js](file://h5/src/api/market.js)
</cite>

## 目录
1. [简介](#简介)
2. [接口端点说明](#接口端点说明)
3. [查询参数详解](#查询参数详解)
4. [返回数据格式](#返回数据格式)
5. [数据聚合逻辑](#数据聚合逻辑)
6. [前端图表集成](#前端图表集成)
7. [移动端使用示例](#移动端使用示例)
8. [性能与限制](#性能与限制)
9. [最佳实践](#最佳实践)

## 简介
K线数据API为前端图表组件提供金融资产的价格走势数据，支持多种时间周期和交易对。该接口目前返回模拟数据，未来将接入真实市场数据源。API遵循统一的响应格式，便于前后端集成。

## 接口端点说明
K线数据通过以下RESTful端点提供：

```
GET /api/market/klines
```

该端点位于`market.controller.ts`中定义，是行情模块的核心接口之一，用于获取指定交易对的历史价格数据。

**接口来源**
- [market.controller.ts](file://agx-backend/src/modules/market/market.controller.ts#L36-L47)

## 查询参数详解
K线接口支持以下查询参数：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| symbol | 字符串 | 是 | - | 交易对标识，如`BTCUSDT`、`XAU/USD` |
| interval | 字符串 | 否 | `1h` | 时间周期：`1m`, `5m`, `15m`, `30m`, `1h`, `4h`, `1d`, `1w` |
| limit | 数字 | 否 | `100` | 返回数据条数，最大支持1000条 |

示例请求：
```
GET /api/market/klines?symbol=BTCUSDT&interval=1h&limit=100
```

**参数来源**
- [market.controller.ts](file://agx-backend/src/modules/market/market.controller.ts#L41-L43)

## 返回数据格式
API返回标准的K线数组，每个数据点包含6个字段：

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "klines": [
      [1700000000000, 98000.00, 98500.00, 97500.00, 98200.00, 1234.56],
      [1700003600000, 98200.00, 98800.00, 98000.00, 98600.00, 1567.89]
    ]
  }
}
```

每个K线数据点为数组，按顺序包含：
1. **timestamp**：时间戳（毫秒）
2. **open**：开盘价
3. **high**：最高价
4. **low**：最低价
5. **close**：收盘价
6. **volume**：成交量

**数据格式来源**
- [market.service.ts](file://agx-backend/src/modules/market/market.service.ts#L196-L202)

## 数据聚合逻辑
K线数据的生成逻辑在`market.service.ts`中实现，当前为模拟数据生成：

1. 从`getMockKlines`方法生成模拟数据
2. 基于当前时间戳向前推算
3. 使用随机算法生成价格波动
4. 每个周期的间隔基于`interval`参数计算
5. 数据按时间顺序排列，最新数据在最后

注意：代码中明确标注`// TODO: 从数据源获取K线数据`，表明当前为临时实现，后续将替换为真实数据源。

**逻辑来源**
- [market.service.ts](file://agx-backend/src/modules/market/market.service.ts#L82-L85)

## 前端图表集成
前端使用`ma-charts`组件渲染K线图，该组件基于ECharts封装：

```vue
<template>
  <ma-charts :options="chartOptions" />
</template>
```

### 配置示例
```javascript
const chartOptions = {
  xAxis: { type: 'time' },
  yAxis: { type: 'value' },
  series: [{
    type: 'candlestick',
    data: klines.map(item => [
      new Date(item[0]),
      item[1], item[2], item[3], item[4]
    ])
  }]
}
```

**组件来源**
- [ma-charts/index.vue](file://agx-admin/src/components/ma-charts/index.vue)

## 移动端使用示例
移动端通过`api.js`中的封装方法调用K线接口：

```javascript
// 获取K线数据
const response = await api.market.getKlines({
  symbol: 'BTCUSDT',
  interval: '1h',
  limit: 100
})

if (response.success) {
  // 处理K线数据
  const klines = response.data.klines
  // 更新图表
  updateChart(klines)
}
```

### API封装
`market.js`文件导出`marketApi`，提供便捷的K线数据访问方法。

**移动端来源**
- [api.js](file://h5/src/utils/api.js#L108)
- [market.js](file://h5/src/api/market.js)

## 性能与限制
### 数据精度
- **分钟级**：1m, 5m, 15m, 30m
- **小时级**：1h, 4h
- **日级**：1d
- **周级**：1w

### 历史数据范围
- 默认返回100条数据
- 最大支持1000条历史数据
- 时间跨度受`limit`参数限制
- 无时间范围参数，从当前时间向前追溯

### 性能优化
- 前端使用`vue-echarts`进行高效渲染
- 支持自动重绘（autoresize）
- 按需加载数据，避免一次性获取过多
- 移动端采用懒加载策略

**性能来源**
- [ma-charts/index.vue](file://agx-admin/src/components/ma-charts/index.vue#L14)
- [market.service.ts](file://agx-backend/src/modules/market/market.service.ts#L43)

## 最佳实践
1. **合理设置limit**：避免一次性请求过多数据影响性能
2. **缓存策略**：前端应缓存最近获取的数据
3. **错误处理**：处理网络异常和API错误
4. **数据验证**：验证返回数据的完整性和格式
5. **用户体验**：加载时显示骨架屏或loading状态

**最佳实践来源**
- [api.js](file://h5/src/utils/api.js#L27-L69)
- [ma-charts/index.vue](file://agx-admin/src/components/ma-charts/index.vue)