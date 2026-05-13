<template>
  <div class="portfolio-page">
    <section class="portfolio-hero">
      <h1 class="portfolio-title">作品集</h1>
      <p class="portfolio-subtitle">探索我的项目</p>
    </section>

    <section class="portfolio-grid">
      <article
        v-for="(project, index) in projects"
        :key="project.name"
        class="project-card"
        :class="{ visible: visibleCards.has(index) }"
        :style="{ transitionDelay: `${index * 100}ms` }"
      >
        <div class="card-visual">
          <div class="card-icon">
            <span class="icon-letter">{{ project.name.charAt(0) }}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="card-header">
            <h2 class="project-name">{{ project.name }}</h2>
            <span class="project-badge">{{ project.badge }}</span>
          </div>
          <p class="project-desc">{{ project.description }}</p>

          <ul class="project-features">
            <li v-for="feature in project.features" :key="feature">
              <span class="feature-dot"></span>
              {{ feature }}
            </li>
          </ul>

          <div class="tech-stack">
            <span v-for="tag in project.stack" :key="tag" class="tech-tag">{{ tag }}</span>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const projects = [
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
  }
]

const visibleCards = ref(new Set())
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.dataset.index)
          visibleCards.value = new Set([...visibleCards.value, index])
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  const cards = document.querySelectorAll('.project-card')
  cards.forEach((card, i) => {
    card.dataset.index = i
    observer.observe(card)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.portfolio-page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: calc(var(--header-height) + 60px) 24px 80px;
  min-height: 100vh;
}

.portfolio-hero {
  text-align: center;
  margin-bottom: 64px;
}

.portfolio-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 12px;
}

.portfolio-subtitle {
  font-size: 18px;
  color: hsla(0, 0%, 100%, 0.55);
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s var(--transition),
              transform 0.6s var(--transition),
              border-color 0.3s var(--transition),
              box-shadow 0.3s var(--transition);
}

.project-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.project-card:hover {
  border-color: hsla(0, 0%, 100%, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.project-card:hover .card-visual {
  transform: scale(1.02);
}

.card-visual {
  height: 180px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s var(--transition);
  position: relative;
  overflow: hidden;
}

.card-visual::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, hsla(0, 0%, 100%, 0.03) 0%, transparent 70%);
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: hsla(0, 0%, 100%, 0.06);
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.icon-letter {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.project-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.01em;
}

.project-badge {
  flex-shrink: 0;
  background: hsla(0, 0%, 100%, 0.08);
  color: hsla(0, 0%, 100%, 0.75);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 100%, 0.08);
}

.project-desc {
  font-size: 14px;
  line-height: 1.7;
  color: hsla(0, 0%, 100%, 0.85);
}

.project-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: hsla(0, 0%, 100%, 0.55);
  line-height: 1.5;
}

.feature-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.35);
  flex-shrink: 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 4px;
}

.tech-tag {
  background: hsla(0, 0%, 100%, 0.06);
  color: hsla(0, 0%, 100%, 0.55);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid hsla(0, 0%, 100%, 0.06);
  transition: background 0.3s var(--transition), color 0.3s var(--transition);
}

.project-card:hover .tech-tag {
  background: hsla(0, 0%, 100%, 0.1);
  color: hsla(0, 0%, 100%, 0.85);
}

@media (max-width: 768px) {
  .portfolio-page {
    padding: calc(var(--header-height) + 40px) 16px 60px;
  }

  .portfolio-title {
    font-size: 36px;
  }

  .portfolio-subtitle {
    font-size: 16px;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-visual {
    height: 140px;
  }
}

@media (max-width: 480px) {
  .portfolio-title {
    font-size: 28px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
