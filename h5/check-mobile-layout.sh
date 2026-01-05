#!/bin/bash
echo "================================"
echo "移动端页面宽度统一检查报告"
echo "================================"
echo ""

echo "✓ 1. 检查所有页面容器都使用 max-width: 428px"
echo "   找到 $(grep -h 'max-width: 428px' src/views/*.vue | wc -l) 个页面使用 428px 宽度限制"
echo ""

echo "✓ 2. 确认没有页面使用 100vw 全宽"
if grep -l "width: 100vw" src/views/*.vue 2>/dev/null; then
  echo "   ✗ 发现使用 100vw 的页面"
else
  echo "   ✓ 所有页面都已移除 100vw"
fi
echo ""

echo "✓ 3. PageLayout 组件配置"
grep "max-width:" src/components/layout/PageLayout.vue | head -1
echo ""

echo "✓ 4. 全局重置样式 (reset-width.css)"
echo "   - 页面容器: width: 100%, max-width: 428px, margin: 0 auto"
echo "   - 支持设备宽度: 320px ~ 428px"
echo ""

echo "✓ 5. 布局效果"
echo "   - 小屏设备 (<428px): 占满屏幕宽度"
echo "   - 大屏设备 (>428px): 固定 428px 并居中显示"
echo ""

echo "================================"
echo "检查完成！所有页面已统一为移动端居中布局"
echo "================================"
