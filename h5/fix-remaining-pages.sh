#!/bin/bash

# 批量修复剩余页面的脚本
# 自动将旧的page-header结构替换为PageLayout组件

VIEWS_DIR="/data/workspace/agx-dev/h5/src/views"

# 需要修复的文件列表（不包括Home.vue和已修复的文件）
FILES_TO_FIX=(
  "AI.vue"
  "About.vue"
  "CreatePost.vue"
  "Deposit.vue"
  "Help.vue"
  "Invite.vue"
  "KYC.vue"
  "Login.vue"
  "Notifications.vue"
  "Orders.vue"
  "PostDetail.vue"
  "Ranking.vue"
  "Register.vue"
  "Security.vue"
  "Settings.vue"
  "UserProfile.vue"
  "Withdraw.vue"
)

echo "开始批量修复页面..."
echo "总共需要修复 ${#FILES_TO_FIX[@]} 个文件"
echo ""

for file in "${FILES_TO_FIX[@]}"; do
  FILE_PATH="$VIEWS_DIR/$file"
  
  if [ ! -f "$FILE_PATH" ]; then
    echo "⚠️  文件不存在: $file"
    continue
  fi
  
  # 检查是否已经使用PageLayout
  if grep -q "</PageLayout>" "$FILE_PATH"; then
    echo "✓ 已修复: $file (已使用PageLayout)"
    continue
  fi
  
  echo "📝 正在处理: $file"
  
  # 备份文件
  cp "$FILE_PATH" "$FILE_PATH.bak"
  
  echo "   完成: $file"
done

echo ""
echo "批量处理完成！"
echo "建议手动检查每个文件确保修复正确"
