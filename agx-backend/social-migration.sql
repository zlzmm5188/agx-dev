-- ========================================
-- AGX 社交模块数据库迁移脚本
-- 版本: v1.1.0
-- 日期: 2025-01-02
-- ========================================

-- ========== 1. 好友关系表 ==========
CREATE TABLE IF NOT EXISTS agx_friend (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    friend_id BIGINT NOT NULL,
    remark VARCHAR(50),
    status SMALLINT DEFAULT 1,
    is_blocked SMALLINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_user ON agx_friend(user_id);
CREATE INDEX IF NOT EXISTS idx_friend_friend ON agx_friend(friend_id);

COMMENT ON TABLE agx_friend IS '好友关系表';
COMMENT ON COLUMN agx_friend.user_id IS '用户ID';
COMMENT ON COLUMN agx_friend.friend_id IS '好友ID';
COMMENT ON COLUMN agx_friend.remark IS '好友备注名';
COMMENT ON COLUMN agx_friend.status IS '状态：1正常 0已解除';
COMMENT ON COLUMN agx_friend.is_blocked IS '是否屏蔽：0否 1是';

-- ========== 2. 好友请求表 ==========
CREATE TABLE IF NOT EXISTS agx_friend_request (
    id BIGSERIAL PRIMARY KEY,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    message VARCHAR(200),
    status SMALLINT DEFAULT 0,
    handled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_friend_req_from ON agx_friend_request(from_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_req_to ON agx_friend_request(to_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_req_status ON agx_friend_request(status);

COMMENT ON TABLE agx_friend_request IS '好友请求表';
COMMENT ON COLUMN agx_friend_request.from_user_id IS '发起方用户ID';
COMMENT ON COLUMN agx_friend_request.to_user_id IS '接收方用户ID';
COMMENT ON COLUMN agx_friend_request.message IS '请求留言';
COMMENT ON COLUMN agx_friend_request.status IS '状态：0待处理 1已同意 2已拒绝 3已取消';

-- ========== 3. 会话表 ==========
CREATE TABLE IF NOT EXISTS agx_conversation (
    id BIGSERIAL PRIMARY KEY,
    user_a_id BIGINT NOT NULL,
    user_b_id BIGINT NOT NULL,
    last_message_id BIGINT,
    last_message_text VARCHAR(500),
    last_message_at TIMESTAMP,
    unread_a INT DEFAULT 0,
    unread_b INT DEFAULT 0,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_a_id, user_b_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_user_a ON agx_conversation(user_a_id);
CREATE INDEX IF NOT EXISTS idx_conv_user_b ON agx_conversation(user_b_id);

COMMENT ON TABLE agx_conversation IS '私聊会话表';
COMMENT ON COLUMN agx_conversation.user_a_id IS '用户A ID（较小的ID）';
COMMENT ON COLUMN agx_conversation.user_b_id IS '用户B ID（较大的ID）';
COMMENT ON COLUMN agx_conversation.unread_a IS '用户A未读数';
COMMENT ON COLUMN agx_conversation.unread_b IS '用户B未读数';

-- ========== 4. 私聊消息表 ==========
CREATE TABLE IF NOT EXISTS agx_message (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    msg_type SMALLINT DEFAULT 1,
    content TEXT NOT NULL,
    attachment VARCHAR(500),
    is_read SMALLINT DEFAULT 0,
    read_at TIMESTAMP,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_msg_conv ON agx_message(conversation_id);
CREATE INDEX IF NOT EXISTS idx_msg_sender ON agx_message(sender_id);
CREATE INDEX IF NOT EXISTS idx_msg_receiver ON agx_message(receiver_id);
CREATE INDEX IF NOT EXISTS idx_msg_created ON agx_message(created_at);

COMMENT ON TABLE agx_message IS '私聊消息表';
COMMENT ON COLUMN agx_message.msg_type IS '消息类型：1文本 2图片 3语音 4系统消息';
COMMENT ON COLUMN agx_message.is_read IS '是否已读：0未读 1已读';
COMMENT ON COLUMN agx_message.status IS '状态：1正常 0已撤回 -1已删除';

-- ========== 5. 系统功能开关表 ==========
CREATE TABLE IF NOT EXISTS agx_system_toggle (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    enabled SMALLINT DEFAULT 1,
    description VARCHAR(255),
    sort INT DEFAULT 0,
    updated_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_toggle_key ON agx_system_toggle(key);
CREATE INDEX IF NOT EXISTS idx_toggle_module ON agx_system_toggle(module);

COMMENT ON TABLE agx_system_toggle IS '系统功能开关表';
COMMENT ON COLUMN agx_system_toggle.key IS '开关键名';
COMMENT ON COLUMN agx_system_toggle.module IS '所属模块：social, trade, content, asset, user';
COMMENT ON COLUMN agx_system_toggle.enabled IS '是否开启：0关闭 1开启';

-- ========== 6. 等级权限矩阵表 ==========
CREATE TABLE IF NOT EXISTS agx_level_permission (
    id SERIAL PRIMARY KEY,
    level INT NOT NULL,
    permission_key VARCHAR(50) NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    allowed SMALLINT DEFAULT 1,
    limit_value INT,
    remark VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(level, permission_key)
);

CREATE INDEX IF NOT EXISTS idx_lp_level ON agx_level_permission(level);
CREATE INDEX IF NOT EXISTS idx_lp_key ON agx_level_permission(permission_key);

COMMENT ON TABLE agx_level_permission IS '等级权限矩阵表';
COMMENT ON COLUMN agx_level_permission.level IS '用户等级: 1=普通, 2=银牌, 3=金牌, 4=钻石, 5=黑金';
COMMENT ON COLUMN agx_level_permission.permission_key IS '权限键名';
COMMENT ON COLUMN agx_level_permission.allowed IS '是否允许：0不允许 1允许';
COMMENT ON COLUMN agx_level_permission.limit_value IS '限制值（如每日发帖数、好友上限等）';

-- ========== 7. 扩展用户表字段 ==========
ALTER TABLE agx_user ADD COLUMN IF NOT EXISTS social_status SMALLINT DEFAULT 1;
ALTER TABLE agx_user ADD COLUMN IF NOT EXISTS can_be_friended SMALLINT DEFAULT 1;
ALTER TABLE agx_user ADD COLUMN IF NOT EXISTS can_send_friend_request SMALLINT DEFAULT 1;
ALTER TABLE agx_user ADD COLUMN IF NOT EXISTS can_chat SMALLINT DEFAULT 1;
ALTER TABLE agx_user ADD COLUMN IF NOT EXISTS friend_count INT DEFAULT 0;
ALTER TABLE agx_user ADD COLUMN IF NOT EXISTS mute_until TIMESTAMP;

COMMENT ON COLUMN agx_user.social_status IS '社交状态：1正常 0禁言 -1社交封禁';
COMMENT ON COLUMN agx_user.can_be_friended IS '是否允许被加好友：0否 1是';
COMMENT ON COLUMN agx_user.can_send_friend_request IS '是否允许发起好友请求：0否 1是';
COMMENT ON COLUMN agx_user.can_chat IS '是否允许私聊：0否 1是';
COMMENT ON COLUMN agx_user.friend_count IS '好友数';
COMMENT ON COLUMN agx_user.mute_until IS '禁言截止时间';

-- ========== 8. 扩展帖子表字段 ==========
ALTER TABLE agx_post ADD COLUMN IF NOT EXISTS weight INT DEFAULT 0;
ALTER TABLE agx_post ADD COLUMN IF NOT EXISTS review_remark VARCHAR(100);
ALTER TABLE agx_post ADD COLUMN IF NOT EXISTS reviewed_by BIGINT;
ALTER TABLE agx_post ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

COMMENT ON COLUMN agx_post.weight IS '权重分值（推荐/热度控制）';
COMMENT ON COLUMN agx_post.review_remark IS '审核备注';
COMMENT ON COLUMN agx_post.reviewed_by IS '审核人';
COMMENT ON COLUMN agx_post.reviewed_at IS '审核时间';

-- ========== 9. 初始化默认功能开关 ==========
INSERT INTO agx_system_toggle (key, name, module, enabled, description, sort)
VALUES 
    ('allow_post', '允许发帖', 'social', 1, '是否允许用户发帖', 1),
    ('allow_comment', '允许评论', 'social', 1, '是否允许用户评论', 2),
    ('allow_like', '允许点赞', 'social', 1, '是否允许用户点赞', 3),
    ('allow_add_friend', '允许加好友', 'social', 1, '是否允许用户加好友', 4),
    ('allow_chat', '允许私聊', 'social', 1, '是否允许好友私聊', 5),
    ('allow_spot_trade', '允许现货交易', 'trade', 1, '现货交易开关', 1),
    ('allow_contract_trade', '允许合约交易', 'trade', 1, '合约交易开关', 2),
    ('allow_gold_trade', '允许黄金交易', 'trade', 1, '黄金交易开关', 3),
    ('allow_recharge', '允许充值', 'asset', 1, '充值功能开关', 1),
    ('allow_withdraw', '允许提现', 'asset', 1, '提现功能开关', 2),
    ('allow_transfer', '允许划转', 'asset', 1, '资产划转开关', 3)
ON CONFLICT (key) DO NOTHING;

-- ========== 10. 初始化默认权限矩阵 ==========
INSERT INTO agx_level_permission (level, permission_key, permission_name, allowed, limit_value)
VALUES 
    -- 普通用户
    (1, 'can_post', '可以发帖', 1, NULL),
    (1, 'can_comment', '可以评论', 1, NULL),
    (1, 'can_add_friend', '可以加好友', 1, NULL),
    (1, 'can_chat', '可以私聊', 1, NULL),
    (1, 'daily_post_limit', '每日发帖上限', 1, 5),
    (1, 'friend_limit', '好友数量上限', 1, 100),
    -- 银牌会员
    (2, 'can_post', '可以发帖', 1, NULL),
    (2, 'can_comment', '可以评论', 1, NULL),
    (2, 'can_add_friend', '可以加好友', 1, NULL),
    (2, 'can_chat', '可以私聊', 1, NULL),
    (2, 'daily_post_limit', '每日发帖上限', 1, 10),
    (2, 'friend_limit', '好友数量上限', 1, 200),
    -- 金牌会员
    (3, 'can_post', '可以发帖', 1, NULL),
    (3, 'can_comment', '可以评论', 1, NULL),
    (3, 'can_add_friend', '可以加好友', 1, NULL),
    (3, 'can_chat', '可以私聊', 1, NULL),
    (3, 'daily_post_limit', '每日发帖上限', 1, 20),
    (3, 'friend_limit', '好友数量上限', 1, 500),
    -- 钻石会员
    (4, 'can_post', '可以发帖', 1, NULL),
    (4, 'can_comment', '可以评论', 1, NULL),
    (4, 'can_add_friend', '可以加好友', 1, NULL),
    (4, 'can_chat', '可以私聊', 1, NULL),
    (4, 'daily_post_limit', '每日发帖上限', 1, 50),
    (4, 'friend_limit', '好友数量上限', 1, 1000),
    -- 黑金会员
    (5, 'can_post', '可以发帖', 1, NULL),
    (5, 'can_comment', '可以评论', 1, NULL),
    (5, 'can_add_friend', '可以加好友', 1, NULL),
    (5, 'can_chat', '可以私聊', 1, NULL),
    (5, 'daily_post_limit', '每日发帖上限', 1, 100),
    (5, 'friend_limit', '好友数量上限', 1, 5000)
ON CONFLICT (level, permission_key) DO NOTHING;

-- ========================================
-- 迁移完成
-- ========================================
