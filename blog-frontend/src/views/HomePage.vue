<template>
  <div class="home-page">
    <section class="hero">
      <canvas ref="gridCanvas" class="fluid-canvas"></canvas>
      <div class="hero-vignette"></div>
      <div class="hero-content">
        <p class="hero-eyebrow">全栈开发者 / AI 爱好者</p>
        <h1 class="hero-name" ref="heroNameRef">
          <span v-for="(char, i) in nameChars" :key="i" class="name-char" :style="{ animationDelay: `${i * 0.08}s` }">{{ char }}</span>
        </h1>
        <p class="hero-bio" ref="heroBioRef">
          <span v-for="(char, i) in bioChars" :key="i" class="bio-char" :style="{ animationDelay: `${i * 0.04}s` }">{{ char }}</span>
        </p>
        <div class="hero-actions">
          <router-link class="btn-primary shimmer-btn" to="/portfolio">查看作品</router-link>
          <router-link class="btn-secondary" to="/blog">阅读博客</router-link>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="arrow arrow-1"></div>
        <div class="arrow arrow-2"></div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSnakeGrid } from '@/composables/useSnakeGrid'

const aboutRef = ref(null)
const contactRef = ref(null)
const aboutVisible = ref(false)
const contactVisible = ref(false)
const gridCanvas = ref(null)
const heroNameRef = ref(null)
const heroBioRef = ref(null)

let observer = null
let snake = null

const bioText = '热爱技术，专注于构建高质量的全栈应用。探索 AI、RAG、云原生等前沿技术，用代码创造价值。'
const bioChars = computed(() => [...bioText])
const nameChars = computed(() => [...'FeiTwnd'])

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
  { icon: '@', label: 'Email', href: 'mailto:myzovo@qq.com' },
  { icon: 'G', label: 'GitHub', href: 'https://github.com/myzovo' }
]

onMounted(() => {
  // Init snake grid background
  if (gridCanvas.value) {
    snake = useSnakeGrid()
    snake.init(gridCanvas.value)
  }

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
  if (snake) snake.destroy()
})
</script>

<style scoped>
.home-page {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.hero {
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 24px;
  position: relative;
  overflow: hidden;
}

.fluid-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
}

.hero-content {
  max-width: 720px;
  position: relative;
  z-index: 3;
  pointer-events: none;
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
  text-shadow: rgb(69, 45, 45) 0 0 1px, rgb(255, 255, 251) 0 0 1px, rgb(255, 255, 251) 0 0 2px;
}

.name-char {
  display: inline-block;
  animation: nameGlow 1s ease both, whiteShadow 1.5s ease-in-out infinite alternate;
  animation-delay: var(--delay, 0s), 0s;
}

@keyframes nameGlow {
  0% {
    opacity: 0;
    transform: translateY(20px);
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  }
  60% {
    opacity: 1;
    transform: translateY(0);
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px rgba(255, 255, 255, 0.3);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 5px #333;
  }
}

@keyframes whiteShadow {
  from {
    text-shadow: 0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, 0 0 5px #333, 0 0 8px #333, 0 0 9px #333, 0 0 10px #333, 0 0 15px #333;
  }
  to {
    text-shadow: 0 0 0.5px #fff, 0 0 1px #fff, 0 0 1.5px #fff, 0 0 2px #333, 0 0 4px #333, 0 0 5px #333, 0 0 6px #333, 0 0 8px #333;
  }
}

.hero-bio {
  font-size: 18px;
  color: hsla(0, 0%, 100%, 0.75);
  line-height: 1.7;
  max-width: 540px;
  margin: 0 auto 40px;
  animation: fadeInUp 0.6s var(--transition) 0.2s both;
}

.bio-char {
  display: inline;
  animation: letterGlow 0.7s ease both;
}

@keyframes letterGlow {
  0% {
    opacity: 0;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  }
  66% {
    opacity: 1;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
  }
  77% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  animation: fadeInUp 0.6s var(--transition) 0.3s both;
  pointer-events: auto;
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
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  background: hsla(0, 0%, 100%, 0.9);
  transform: translateY(-1px);
}

.shimmer-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s linear infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
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
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  pointer-events: none;
}

.arrow {
  width: 20px;
  height: 20px;
  position: relative;
}

.arrow::before,
.arrow::after {
  content: '';
  display: block;
  height: 2px;
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  box-shadow: 1px 1px 20px 0px rgba(255, 255, 255, 0.5);
  width: 13px;
}

.arrow::before {
  transform: translate(-50%, -50%) rotate(45deg) translateX(-10%);
  transform-origin: top left;
}

.arrow::after {
  transform: translate(-50%, -50%) rotate(-45deg) translateX(10%);
  transform-origin: top right;
}

.arrow-1 {
  animation: arrowMovement 2s ease-in-out infinite;
}

.arrow-2 {
  animation: arrowMovement 2s 1s ease-in-out infinite;
}

@keyframes arrowMovement {
  0% {
    opacity: 0;
    transform: translateY(-8px);
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(8px);
  }
}

.about {
  height: 100vh;
  scroll-snap-align: start;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 100px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.about::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}

.contact {
  height: 100vh;
  scroll-snap-align: start;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 100px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.contact::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
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
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3);
}

.skill-card:hover .skill-icon {
  background: hsla(0, 0%, 100%, 0.1);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
