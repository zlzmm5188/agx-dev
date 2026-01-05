-- 广场功能增强 - 添加视频支持和审核功能

-- 添加视频字段到帖子表
ALTER TABLE agx_post ADD COLUMN IF NOT EXISTS video_url VARCHAR(500) DEFAULT NULL COMMENT '视频URL';
ALTER TABLE agx_post ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'text' COMMENT '媒体类型: text-文本, image-图片, video-视频';

-- 创建敏感词过滤表
CREATE TABLE IF NOT EXISTS agx_sensitive_words (
  id              BIGSERIAL PRIMARY KEY,
  word            VARCHAR(100) NOT NULL UNIQUE COMMENT '敏感词',
  level           SMALLINT NOT NULL DEFAULT 1 COMMENT '级别: 1-警告, 2-禁止',
  status          SMALLINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建审核记录表
CREATE TABLE IF NOT EXISTS agx_post_review (
  id              BIGSERIAL PRIMARY KEY,
  post_id         BIGINT NOT NULL COMMENT '帖子ID',
  reviewer_id     BIGINT NOT NULL COMMENT '审核人ID',
  action          VARCHAR(20) NOT NULL COMMENT '操作: approve-通过, reject-拒绝, modify-修改',
  reason          VARCHAR(500) COMMENT '审核原因',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建私信表（用于私聊记录查看）
CREATE TABLE IF NOT EXISTS agx_private_message (
  id              BIGSERIAL PRIMARY KEY,
  sender_id       BIGINT NOT NULL COMMENT '发送者ID',
  receiver_id     BIGINT NOT NULL COMMENT '接收者ID',
  content         TEXT NOT NULL COMMENT '消息内容',
  media_type      VARCHAR(20) DEFAULT 'text' COMMENT '媒体类型: text, image, video, file',
  media_url       VARCHAR(500) COMMENT '媒体URL',
  is_read         SMALLINT NOT NULL DEFAULT 0 COMMENT '是否已读: 0-未读, 1-已读',
  status          SMALLINT NOT NULL DEFAULT 1 COMMENT '状态: -1-删除, 0-撤回, 1-正常',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_post_media_type ON agx_post(media_type);
CREATE INDEX IF NOT EXISTS idx_post_review_post_id ON agx_post_review(post_id);
CREATE INDEX IF NOT EXISTS idx_private_message_sender ON agx_private_message(sender_id);
CREATE INDEX IF NOT EXISTS idx_private_message_receiver ON agx_private_message(receiver_id);
CREATE INDEX IF NOT EXISTS idx_private_message_created_at ON agx_private_message(created_at);

-- 插入默认敏感词
INSERT INTO agx_sensitive_words (word, level, status) VALUES
  ('习近平', 2, 1),
  ('毛泽东', 2, 1),
  ('胡锦涛', 2, 1),
  ('温家宝', 2, 1),
  ('腐败', 1, 1),
  ('贪污', 1, 1),
  ('色情', 2, 1),
  ('赌博', 2, 1),
  ('毒品', 2, 1),
  ('暴力', 1, 1)
ON CONFLICT (word) DO NOTHING;

-- 更新帖子表的媒体类型字段，根据现有数据设置默认值
UPDATE agx_post SET media_type = 'image' WHERE images IS NOT NULL AND images != '';
UPDATE agx_post SET media_type = 'text' WHERE images IS NULL OR images = '';
