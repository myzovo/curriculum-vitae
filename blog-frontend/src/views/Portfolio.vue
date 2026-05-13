<template>
  <div class="portfolio-page">
    <GridCanvas :speed="0.1" :squareSize="70" borderColor="rgba(255, 255, 255, 0.025)" />
    <aside class="portfolio-sidebar">
      <h1 class="sidebar-title">作品集</h1>
      <p class="sidebar-subtitle">内容可能包含：半成品项目、未经验证的观点，以及偶尔闪现的好想法。欢迎手动过滤</p>
      <nav class="project-nav">
        <a
          v-for="(project, index) in projects"
          :key="project.name"
          class="nav-item"
          :class="{ active: activeIndex === index }"
          @click="activeIndex = index"
        >
          <span class="nav-dot"></span>
          <span class="nav-label">{{ project.name }}</span>
          <span class="nav-badge">{{ project.badge }}</span>
        </a>
      </nav>
    </aside>

    <main ref="mainRef" class="portfolio-main">
      <transition name="slide-fade" mode="out-in">
        <article :key="activeIndex" class="project-detail">
          <div class="detail-header">
            <div class="detail-icon">
              <span class="icon-letter">{{ current.name.charAt(0) }}</span>
            </div>
            <div>
              <h2 class="detail-name">{{ current.name }}</h2>
              <span class="detail-badge">{{ current.badge }}</span>
            </div>
          </div>

          <p class="detail-desc">{{ current.description }}</p>

          <ul class="detail-features">
            <li v-for="feature in current.features" :key="feature">
              <span class="feature-dot"></span>
              {{ feature }}
            </li>
          </ul>

          <div class="detail-stack">
            <span v-for="tag in current.stack" :key="tag" class="tech-tag">{{ tag }}</span>
          </div>
        </article>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import GridCanvas from '../components/GridCanvas.vue'

const projects = [
  {
    name: 'LinkPoink',
    badge: '灵感商城',
    description: '连接"拥有者"与"需求者"的创意与技能市场。让普通人将脑中的灵感、毕生经验、零碎知识转化为可保护、可定价、可交易的数字资产。半盲盒预览+数字权益卡确权机制，保护无形创意。',
    features: [
      '灵感货架：出售创意火花、经验直觉、知识心得',
      '悬赏大厅：发布需求，平台用户接单完成',
      '半盲盒预览：展示风格意向，隐藏核心细节',
      '数字权益卡：时间戳哈希存证保护原创'
    ],
    stack: ['Spring Boot', 'Vue 3', 'MySQL', 'Redis']
  },
  {
    name: 'FuncFind',
    badge: 'RAG Web 导航',
    description: '基于 RAG 的网站功能定位与导航器。爬取网站、提取交互元素、构建向量知识库，自然语言驱动页面导航与元素高亮。可嵌入 Shadow DOM Widget，两行代码集成，零样式泄漏。',
    features: [
      '网站爬取与交互元素提取',
      '向量知识库构建与语义检索',
      '自然语言驱动页面导航与高亮',
      'Shadow DOM Widget 嵌入式集成'
    ],
    stack: ['Spring Boot', 'Crawlee', 'Playwright', 'Vue 3', 'Cloudflare Vectorize']
  },
  {
    name: 'DocVec_RAG',
    badge: '轻量 RAG 系统',
    description: '面向资源受限部署的轻量级 RAG 系统。上传文档、分块、向量化、检索增强问答。两阶段分块（固定长度 + 语义），会话级运行时配置与密钥脱敏。',
    features: [
      '文档上传与两阶段智能分块',
      '向量化存储与语义检索',
      '检索增强生成问答',
      '会话级配置与密钥脱敏'
    ],
    stack: ['Spring Boot', 'Vue 3', 'Cloudflare Vectorize', 'R2']
  },
  {
    name: 'Cloud Attendance Assistant',
    badge: '微信小程序',
    description: '微信小程序员工考勤系统。实时地理围栏（Haversine 距离检测），TOTP 管理员验证（兼容 Google Authenticator），离线 Mock OpenID 优雅降级。',
    features: [
      '实时地理围栏打卡（10km 半径）',
      'TOTP 管理员二次验证',
      '迟到/早退自动检测',
      '离线优雅降级方案'
    ],
    stack: ['WeChat Mini Program', 'Cloud Functions', 'Cloud DB']
  },
  {
    name: 'Noto AI',
    badge: '智能笔记应用',
    description: '集成 OCR、语义搜索与 AI 问答的智能笔记应用。基于开源 Noto 应用 + Spring Boot 后端，拍照 OCR 存储后向量化，RAG 驱动知识问答。',
    features: [
      '拍照 OCR 识别与存储',
      '语义向量检索（pgvector）',
      'RAG 驱动的智能问答',
      '多模型路由（DeepSeek / 智谱 AI）'
    ],
    stack: ['Kotlin', 'Spring Boot', 'Supabase', 'pgvector', 'DeepSeek']
  },
  {
    name: 'Website Link Discoverer',
    badge: '网站探索器',
    description: '基于 Crawlee + Playwright 的网站探索工具。发现所有交互入口（链接、按钮、表单），输出结构化 sitemap.json，包含 XPath 和语义上下文，内置安全过滤。',
    features: [
      '自动发现所有交互入口',
      '结构化 JSON 输出（XPath + 语义上下文）',
      '内置危险操作安全过滤',
      '支持 CLI 与 Web UI 两种模式'
    ],
    stack: ['Node.js', 'Crawlee', 'Playwright']
  }
]

const activeIndex = ref(0)
const current = computed(() => projects[activeIndex.value])
const mainRef = ref(null)

let scrollCooldown = false

const onWheel = (e) => {
  e.preventDefault()
  if (scrollCooldown) return
  if (Math.abs(e.deltaY) < 30) return
  scrollCooldown = true
  setTimeout(() => { scrollCooldown = false }, 600)

  if (e.deltaY > 0 && activeIndex.value < projects.length - 1) {
    activeIndex.value++
  } else if (e.deltaY < 0 && activeIndex.value > 0) {
    activeIndex.value--
  }
}

onMounted(() => {
  mainRef.value?.addEventListener('wheel', onWheel, { passive: false })
})

onUnmounted(() => {
  mainRef.value?.removeEventListener('wheel', onWheel)
})
</script>

<style scoped>
.portfolio-page {
  display: flex;
  min-height: 100vh;
  padding-top: var(--header-height);
}

.portfolio-sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  width: 320px;
  padding: 48px 32px 48px 40px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 10;
}

.sidebar-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.sidebar-subtitle {
  font-size: 13px;
  color: hsla(0, 0%, 100%, 0.4);
  line-height: 1.7;
  margin-bottom: 40px;
}

.project-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s var(--transition);
  text-decoration: none;
  position: relative;
}

.nav-item:hover {
  background: hsla(0, 0%, 100%, 0.04);
}

.nav-item.active {
  background: hsla(0, 0%, 100%, 0.06);
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.2);
  flex-shrink: 0;
  transition: all 0.3s var(--transition);
}

.nav-item.active .nav-dot {
  background: var(--color-accent);
  box-shadow: 0 0 8px hsla(160, 84%, 39%, 0.5);
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
  color: hsla(0, 0%, 100%, 0.55);
  flex: 1;
  transition: color 0.3s var(--transition);
}

.nav-item.active .nav-label {
  color: #fff;
}

.nav-item:hover .nav-label {
  color: hsla(0, 0%, 100%, 0.85);
}

.nav-badge {
  font-size: 11px;
  color: hsla(0, 0%, 100%, 0.3);
  background: hsla(0, 0%, 100%, 0.04);
  padding: 2px 8px;
  border-radius: 999px;
  transition: all 0.3s var(--transition);
}

.nav-item.active .nav-badge {
  color: hsla(0, 0%, 100%, 0.6);
  background: hsla(0, 0%, 100%, 0.08);
}

.portfolio-main {
  flex: 1;
  margin-left: 320px;
  padding: 60px 60px 80px 60px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.project-detail {
  max-width: 720px;
  width: 100%;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.detail-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: hsla(0, 0%, 100%, 0.06);
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-letter {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.detail-name {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.detail-badge {
  font-size: 12px;
  color: var(--color-accent);
  background: hsla(160, 84%, 39%, 0.1);
  padding: 3px 12px;
  border-radius: 999px;
}

.detail-desc {
  font-size: 16px;
  line-height: 1.8;
  color: hsla(0, 0%, 100%, 0.85);
  margin-bottom: 32px;
}

.detail-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 36px;
}

.detail-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.65);
  line-height: 1.6;
}

.feature-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.3);
  flex-shrink: 0;
}

.detail-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: hsla(0, 0%, 100%, 0.06);
  color: hsla(0, 0%, 100%, 0.55);
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 100%, 0.06);
}

/* Transition */
.slide-fade-enter-active {
  transition: all 0.4s var(--transition);
}

.slide-fade-leave-active {
  transition: all 0.2s var(--transition);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1024px) {
  .portfolio-sidebar {
    width: 260px;
    padding: 36px 24px 36px 28px;
  }

  .portfolio-main {
    margin-left: 260px;
    padding: 40px 32px 60px;
  }
}

@media (max-width: 768px) {
  .portfolio-page {
    flex-direction: column;
  }

  .portfolio-sidebar {
    position: relative;
    top: 0;
    width: 100%;
    padding: 24px 16px 0;
    max-height: none;
    overflow-y: visible;
  }

  .sidebar-subtitle {
    margin-bottom: 20px;
  }

  .project-nav {
    flex-direction: row;
    overflow-x: auto;
    gap: 0;
    padding-bottom: 16px;
    -webkit-overflow-scrolling: touch;
  }

  .nav-item {
    white-space: nowrap;
    padding: 10px 14px;
  }

  .nav-badge {
    display: none;
  }

  .portfolio-main {
    margin-left: 0;
    padding: 24px 16px 60px;
    overflow: hidden;
  }

  .detail-header {
    gap: 14px;
    margin-bottom: 24px;
  }

  .detail-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }

  .icon-letter {
    font-size: 20px;
  }

  .detail-name {
    font-size: 24px;
  }

  .detail-desc {
    font-size: 15px;
  }
}
</style>
