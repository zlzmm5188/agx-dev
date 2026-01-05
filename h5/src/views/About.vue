<template>
  <PageLayout title="关于我们" :show-back="true">
    <div class="page-content">
      <!-- Logo和品牌 -->
      <div class="brand-section">
        <div class="logo-wrap">
          <div class="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="url(#grad)"/>
              <path d="M24 10L14 28h8l-2 10 12-16h-8l2-12z" fill="#0f1317"/>
              <defs><linearGradient id="grad" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#C9A962"/><stop offset="1" stop-color="#8B7355"/></linearGradient></defs>
            </svg>
          </div>
          <h1 class="brand-name">Ascenda</h1>
          <p class="brand-slogan">全球领先的数字资产交易平台</p>
        </div>
        <div class="version-info">
          <span class="version">v2.0.0</span>
          <button class="check-update">检查更新</button>
        </div>
      </div>

      <!-- 公司简介 -->
      <div class="intro-section">
        <h2 class="section-title">关于我们</h2>
        <div class="intro-content">
          <p>Ascenda成立于2020年，是一家全球化的数字资产交易服务平台。我们致力于为全球用户提供安全、便捷、专业的数字资产交易服务。</p>
          <p>平台支持多种主流数字资产的现货交易、合约交易、理财等服务，拥有先进的技术架构和完善的风控体系，为用户资产安全保驾护航。</p>
        </div>
      </div>

      <!-- 核心数据 -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">500万+</span>
            <span class="stat-label">注册用户</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">180+</span>
            <span class="stat-label">国家地区</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">$50亿+</span>
            <span class="stat-label">日均交易额</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">99.99%</span>
            <span class="stat-label">系统稳定性</span>
          </div>
        </div>
      </div>

      <!-- 核心优势 -->
      <div class="features-section">
        <h2 class="section-title">核心优势</h2>
        <div class="features-list">
          <div class="feature-item">
            <div class="feature-icon security">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="feature-content">
              <span class="feature-title">安全可靠</span>
              <span class="feature-desc">银行级别安全体系，多重签名冷钱包存储</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon speed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div class="feature-content">
              <span class="feature-title">极速交易</span>
              <span class="feature-desc">百万级TPS撮合引擎，毫秒级成交速度</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon global">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
              </svg>
            </div>
            <div class="feature-content">
              <span class="feature-title">全球覆盖</span>
              <span class="feature-desc">服务覆盖180+国家和地区，7×24小时支持</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon pro">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
              </svg>
            </div>
            <div class="feature-content">
              <span class="feature-title">专业团队</span>
              <span class="feature-desc">来自全球顶尖金融科技公司的精英团队</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="contact-section">
        <h2 class="section-title">联系我们</h2>
        <div class="contact-list">
          <a href="https://ascenda.com" target="_blank" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            <span>官方网站</span>
          </a>
          <a href="https://twitter.com/ascenda" target="_blank" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Twitter</span>
          </a>
          <a href="https://t.me/ascenda" target="_blank" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
            </svg>
            <span>Telegram</span>
          </a>
          <a href="mailto:support@ascenda.com" class="contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>
            </svg>
            <span>邮件支持</span>
          </a>
        </div>
      </div>

      <!-- 法律声明 -->
      <div class="legal-section">
        <a href="#" class="legal-link">用户协议</a>
        <span class="divider">|</span>
        <a href="#" class="legal-link">隐私政策</a>
        <span class="divider">|</span>
        <a href="#" class="legal-link">免责声明</a>
      </div>

      <div class="copyright">
        <p>© 2024 Ascenda. All rights reserved.</p>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '../components/layout/PageLayout.vue'
</script>

<style scoped>
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

/* 固定顶部栏 */
/* 固定顶部栏 */
.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(180deg, #1e2228 0%, #181a20 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #848e9c;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-right: 12px;
}

.back-btn:active { background: rgba(255, 255, 255, 0.08); }

.page-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin: 0;
}

.header-actions { display: flex; gap: 8px; }

.page-content::-webkit-scrollbar { display: none; }

.brand-section {
  padding: 40px 16px;
  text-align: center;
  background: linear-gradient(180deg, rgba(201, 169, 98, 0.1) 0%, transparent 100%);
}

.logo-wrap {
  margin-bottom: 20px;
}

.logo {
  margin-bottom: 16px;
}

.brand-name {
  font-size: 28px;
  font-weight: 700;
  color: #eaecef;
  margin: 0 0 8px 0;
}

.brand-slogan {
  font-size: 14px;
  color: #848e9c;
  margin: 0;
}

.version-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.version {
  font-size: 13px;
  color: #5e6673;
}

.check-update {
  padding: 6px 14px;
  background: rgba(201,169,98,0.12);
  border: 1px solid rgba(201,169,98,0.3);
  border-radius: 16px;
  font-size: 12px;
  color: #C9A962;
  cursor: pointer;
}

.intro-section, .features-section, .contact-section {
  padding: 0 16px;
  margin-bottom: 28px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #eaecef;
  margin: 0 0 16px 0;
}

.intro-content {
  padding: 16px;
  background: #1e2329;
  border-radius: 14px;
}

.intro-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #848e9c;
  line-height: 1.7;
}

.intro-content p:last-child {
  margin-bottom: 0;
}

.stats-section {
  padding: 0 16px;
  margin-bottom: 28px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 16px;
  background: linear-gradient(135deg, rgba(201,169,98,0.08), #1e2329);
  border: 1px solid rgba(201,169,98,0.1);
  border-radius: 14px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #C9A962;
  font-family: 'DIN Alternate', monospace;
}

.stat-label {
  font-size: 12px;
  color: #848e9c;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: #1e2329;
  border-radius: 14px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.feature-icon.security { background: rgba(14,203,129,0.12); color: #0ECB81; }
.feature-icon.speed { background: rgba(246,190,79,0.12); color: #F6BE4F; }
.feature-icon.global { background: rgba(30,136,229,0.12); color: #1E88E5; }
.feature-icon.pro { background: rgba(201,169,98,0.12); color: #C9A962; }

.feature-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  color: #eaecef;
}

.feature-desc {
  font-size: 13px;
  color: #5e6673;
  line-height: 1.5;
}

.contact-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #1e2329;
  border-radius: 12px;
  text-decoration: none;
  color: #eaecef;
  font-size: 14px;
  transition: all 0.15s;
}

.contact-item:active {
  background: #242930;
}

.contact-item svg {
  color: #C9A962;
}

.legal-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
}

.legal-link {
  font-size: 13px;
  color: #5e6673;
  text-decoration: none;
}

.divider {
  color: #2B3139;
}

.copyright {
  text-align: center;
  padding: 0 16px 20px;
}

.copyright p {
  font-size: 12px;
  color: #5e6673;
  margin: 0;
}
</style>
