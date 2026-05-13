<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">全栈开发者 / AI 爱好者</p>
        <h1 class="hero-name">FeiTwnd</h1>
        <p class="hero-bio">热爱技术，专注于构建高质量的全栈应用。探索 AI、RAG、云原生等前沿技术，用代码创造价值。</p>
        <div class="hero-actions">
          <router-link class="btn-primary" to="/portfolio">查看作品</router-link>
          <router-link class="btn-secondary" to="/blog">阅读博客</router-link>
        </div>
      </div>
      <div class="scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <section class="about" ref="aboutRef">
      <h2 class="section-title" :class="{ visible: aboutVisible }">技术栈</h2>
      <p class="section-subtitle" :class="{ visible: aboutVisible }">持续学习，持续进化</p>
      <div class="skills-grid">
        <div
          v-for="(skill, i) in skills"
          :key="skill.name"
          class="skill-card"
          :class="{ visible: aboutVisible }"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="skill-icon">{{ skill.icon }}</div>
          <h3 class="skill-name">{{ skill.name }}</h3>
          <p class="skill-desc">{{ skill.desc }}</p>
        </div>
      </div>
    </section>

    <section class="contact" ref="contactRef">
      <h2 class="section-title" :class="{ visible: contactVisible }">联系方式</h2>
      <p class="section-subtitle" :class="{ visible: contactVisible }">期待与你交流</p>
      <div class="contact-links">
        <a
          v-for="(link, i) in contactLinks"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noreferrer"
          class="contact-item"
          :class="{ visible: contactVisible }"
          :style="{ transitionDelay: `${i * 100}ms` }"
        >
          <span class="contact-icon">{{ link.icon }}</span>
          <span class="contact-label">{{ link.label }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const aboutRef = ref(null)
const contactRef = ref(null)
const aboutVisible = ref(false)
const contactVisible = ref(false)

let observer = null

const skills = [
  { icon: 'S', name: 'Spring Boot', desc: '企业级 Java 后端框架' },
  { icon: 'V', name: 'Vue 3', desc: '现代前端渐进式框架' },
  { icon: 'K', name: 'Kotlin', desc: 'Android 与服务端开发' },
  { icon: 'P', name: 'Python', desc: '数据处理与 AI 脚本' },
  { icon: 'M', name: 'MySQL', desc: '关系型数据库设计' },
  { icon: 'R', name: 'Redis', desc: '高性能缓存与消息队列' },
  { icon: 'C', name: 'Cloudflare', desc: '边缘计算与 CDN' },
  { icon: 'W', name: 'Playwright', desc: '浏览器自动化与爬虫' }
]

const contactLinks = [
  { icon: '@', label: 'Email', href: 'mailto:hi@example.com' },
  { icon: 'G', label: 'GitHub', href: 'https://github.com' },
  { icon: 'B', label: 'Bilibili', href: 'https://www.bilibili.com' },
  { icon: 'L', label: 'LeetCode', href: 'https://leetcode.com' }
]

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === aboutRef.value) aboutVisible.value = true
          if (entry.target === contactRef.value) contactVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  if (aboutRef.value) observer.observe(aboutRef.value)
  if (contactRef.value) observer.observe(contactRef.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.home-page {
  padding-top: var(--header-height);
}

.hero {
  min-height: calc(100vh - var(--header-height));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 24px;
  position: relative;
}

.hero-content {
  max-width: 720px;
}

.hero-eyebrow {
  font-size: 16px;
  color: hsla(0, 0%, 100%, 0.55);
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 16px;
  animation: fadeInUp 0.6s var(--transition) both;
}

.hero-name {
  font-size: 72px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 24px;
  animation: fadeInUp 0.6s var(--transition) 0.1s both;
}

.hero-bio {
  font-size: 18px;
  color: hsla(0, 0%, 100%, 0.75);
  line-height: 1.7;
  max-width: 540px;
  margin: 0 auto 40px;
  animation: fadeInUp 0.6s var(--transition) 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  animation: fadeInUp 0.6s var(--transition) 0.3s both;
}

.btn-primary {
  padding: 12px 32px;
  background: #fff;
  color: #000;
  border: 1px solid #fff;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-primary);
  text-decoration: none;
  transition: all 0.3s var(--transition);
}

.btn-primary:hover {
  background: hsla(0, 0%, 100%, 0.9);
  transform: translateY(-1px);
}

.btn-secondary {
  padding: 12px 32px;
  background: transparent;
  color: #fff;
  border: 1px solid hsla(0, 0%, 100%, 0.4);
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-primary);
  text-decoration: none;
  transition: all 0.3s var(--transition);
}

.btn-secondary:hover {
  border-color: hsla(0, 0%, 100%, 0.7);
  background: hsla(0, 0%, 100%, 0.05);
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  color: hsla(0, 0%, 100%, 0.3);
  animation: bounceArrow 2s var(--transition) infinite;
}

.about,
.contact {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 100px 24px;
}

.section-title {
  font-size: 42px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s var(--transition);
}

.section-title.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-subtitle {
  font-size: 16px;
  color: hsla(0, 0%, 100%, 0.55);
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s var(--transition) 0.1s;
}

.section-subtitle.visible {
  opacity: 1;
  transform: translateY(0);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.skill-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: all 0.6s var(--transition);
  opacity: 0;
  transform: translateY(20px);
}

.skill-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.skill-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.skill-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: hsla(0, 0%, 100%, 0.06);
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
}

.skill-name {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.skill-desc {
  font-size: 13px;
  color: hsla(0, 0%, 100%, 0.55);
  line-height: 1.5;
}

.contact-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  text-decoration: none;
  transition: all 0.6s var(--transition);
  opacity: 0;
  transform: translateY(20px);
}

.contact-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.contact-item:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.contact-label {
  font-size: 15px;
  font-weight: 500;
  color: hsla(0, 0%, 100%, 0.85);
}

@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-name {
    font-size: 48px;
  }

  .hero-bio {
    font-size: 16px;
  }

  .section-title {
    font-size: 32px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .contact-links {
    flex-direction: column;
  }
}
</style>
