<template>
  <div class="home-page">
    <section class="hero">
      <canvas ref="gridCanvas" class="fluid-canvas"></canvas>
      <div class="hero-vignette"></div>
      <div class="hero-content">
        <p class="hero-eyebrow">全栈开发者 / AI 应用开发</p>
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
          <div class="skill-icon" :style="{ '--brand-color': skill.color }">
            <svg v-if="skill.type === 'spring'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path d="M21.854 8.646a5.96 5.96 0 0 0-4.293-5.262 5.97 5.97 0 0 0-6.478 1.389c-.283.283-.53.6-.743.941-.213-.34-.46-.658-.743-.941a5.97 5.97 0 0 0-6.478-1.39A5.96 5.96 0 0 0 .073 8.7C.96 13.977 5.23 18.22 12 22c6.77-3.78 11.04-8.023 11.927-13.3a5.93 5.93 0 0 0-.073-.054z" fill="currentColor"/>
            </svg>
            <svg v-else-if="skill.type === 'vue'" viewBox="0 0 24 24" width="28" height="28">
              <path d="M2 3h3.5L12 14.5 18.5 3H22L12 21 2 3z" fill="currentColor"/>
              <path d="M7.5 3L12 11 16.5 3H14L12 6.5 10 3H7.5z" fill="rgba(0,0,0,0.3)"/>
            </svg>
            <svg v-else-if="skill.type === 'kotlin'" viewBox="0 0 24 24" width="28" height="28">
              <path d="M2 2h20L12 12l10 10H2V2z" fill="currentColor"/>
              <path d="M5.5 5.5l6.5 6.5-6.5 6.5V5.5z" fill="rgba(255,255,255,0.5)"/>
            </svg>
            <svg v-else-if="skill.type === 'python'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path d="M12 2C9.24 2 7.47 3.17 7.47 5.24V7h4.86v.56H5.38C3.14 7.56 1.4 9.53 1.4 12.28c0 2.74 1.53 4.62 3.98 4.62h1.62V14.8c0-2.16 1.87-4.04 4.04-4.04h4.86c1.76 0 3.16-1.42 3.16-3.16V5.24C19.06 3.17 17.28 2 12 2zm-2.62 1.83a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9z" fill="#3776AB"/>
              <path d="M12 22c2.76 0 4.53-1.17 4.53-3.24V16.2H11.67v-.56h6.89c2.24 0 3.98-1.97 3.98-4.72 0-2.74-1.53-4.62-3.98-4.62h-1.62v2.11c0 2.16-1.87 4.04-4.04 4.04H8.54c-1.76 0-3.16 1.42-3.16 3.16v2.53C5.38 20.83 7.16 22 12 22zm2.62-1.83a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9z" fill="#FFD43B"/>
            </svg>
            <svg v-else-if="skill.type === 'mysql'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <ellipse cx="12" cy="6" rx="9" ry="3.5" fill="currentColor"/>
              <path d="M3 6v5c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5V6" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M3 11v5c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5v-5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
            <svg v-else-if="skill.type === 'redis'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 2v20M3 7l9 5 9-5M3 17l9-5 9 5" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
              <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
            </svg>
            <svg v-else-if="skill.type === 'cloudflare'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path d="M16.5 18h-9a1.5 1.5 0 0 1 0-3h.24a5.5 5.5 0 0 1 10.52 0h.24a1.5 1.5 0 0 1 0 3z" fill="currentColor" opacity="0.25"/>
              <path d="M18.5 14.5a4 4 0 0 0-3.87-3.02A5.5 5.5 0 0 0 5 13.5H3.5a2.5 2.5 0 0 0-.47 4.97A2 2 0 0 0 5 18h11.5a2 2 0 0 0 2-2v-.5z" fill="currentColor"/>
            </svg>
            <svg v-else-if="skill.type === 'playwright'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="12" font-weight="700" font-family="sans-serif">P</text>
            </svg>
            <svg v-else-if="skill.type === 'arkts'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="11" font-weight="700" font-family="sans-serif">A</text>
            </svg>
            <svg v-else-if="skill.type === 'cpp'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <text x="12" y="16.5" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="700" font-family="sans-serif">C++</text>
            </svg>
            <svg v-else-if="skill.type === 'linux'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="8" font-weight="700" font-family="monospace">&gt;_</text>
            </svg>
            <svg v-else-if="skill.type === 'docker'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <rect x="2" y="9" width="4" height="3" rx="0.5" fill="currentColor"/>
              <rect x="7" y="9" width="4" height="3" rx="0.5" fill="currentColor"/>
              <rect x="12" y="9" width="4" height="3" rx="0.5" fill="currentColor"/>
              <rect x="7" y="5" width="4" height="3" rx="0.5" fill="currentColor"/>
              <rect x="12" y="5" width="4" height="3" rx="0.5" fill="currentColor"/>
              <path d="M1 14c0 0 2 5 11 5s12-5 12-5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="skill.type === 'git'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
              <circle cx="12" cy="8" r="2" fill="currentColor"/>
              <circle cx="12" cy="16" r="2" fill="currentColor"/>
              <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <svg v-else-if="skill.type === 'wechat'" viewBox="0 0 24 24" width="28" height="28" fill="none">
              <path d="M9.5 4C5.91 4 3 6.46 3 9.5c0 1.7.86 3.22 2.2 4.24L4.5 16l2.5-1.2c.8.3 1.68.46 2.58.46.17 0 .33 0 .5-.02A5.48 5.48 0 0 1 10 13.5C10 10.46 12.46 8 15.5 8c.45 0 .88.05 1.3.14C15.9 5.64 13 4 9.5 4z" fill="currentColor"/>
              <path d="M21 13.5c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.67 0 1.31-.1 1.9-.28L20 19.5l-.65-2.08C20.44 16.49 21 15.06 21 13.5z" fill="currentColor" opacity="0.6"/>
            </svg>
          </div>
          <h3 class="skill-name">{{ skill.name }}</h3>
          <p class="skill-desc">{{ skill.desc }}</p>
        </div>
      </div>
    </section>

    <section class="contact" ref="contactRef">
      <canvas ref="contactCanvas" class="contact-canvas"></canvas>
      <div class="contact-inner">
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
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSnakeGrid } from '@/composables/useSnakeGrid'
import { useFluidBackground } from '@/composables/useFluidBackground'

const aboutRef = ref(null)
const contactRef = ref(null)
const aboutVisible = ref(false)
const contactVisible = ref(false)
const gridCanvas = ref(null)
const contactCanvas = ref(null)
const heroNameRef = ref(null)
const heroBioRef = ref(null)

let observer = null
let snake = null
let fluid = null

const bioText = '欢迎，这是个记录折腾过程的地方'
const bioChars = computed(() => [...bioText])
const nameChars = computed(() => [...'ZhuYiming'])

const skills = [
  { name: 'Spring Boot', desc: '企业级 Java 后端框架', color: '#6DB33F', type: 'spring' },
  { name: 'Vue 3', desc: '现代前端渐进式框架', color: '#42B883', type: 'vue' },
  { name: 'Kotlin', desc: 'Android 与服务端开发', color: '#7F52FF', type: 'kotlin' },
  { name: 'Python', desc: '数据处理与 AI 脚本', color: '#3776AB', type: 'python' },
  { name: 'MySQL', desc: '关系型数据库设计', color: '#4479A1', type: 'mysql' },
  { name: 'Redis', desc: '高性能缓存与消息队列', color: '#DC382D', type: 'redis' },
  { name: 'Cloudflare', desc: '边缘计算与 CDN', color: '#F38020', type: 'cloudflare' },
  { name: 'Playwright', desc: '浏览器自动化与爬虫', color: '#2EAD33', type: 'playwright' },
  { name: 'ArkTS', desc: 'HarmonyOS 应用开发', color: '#CE392D', type: 'arkts' },
  { name: '微信小程序', desc: '轻量级移动端应用', color: '#07C160', type: 'wechat' },
  { name: 'C / C++', desc: '系统编程与高性能计算', color: '#00599C', type: 'cpp' },
  { name: 'Linux', desc: '了解常用 Linux 命令', color: '#FCC624', type: 'linux' },
  { name: 'Docker', desc: '了解 Docker 工作原理及部署', color: '#2496ED', type: 'docker' },
  { name: 'Git', desc: '熟悉 Git 版本管理', color: '#F05032', type: 'git' }
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

  // Init fluid background for contact section
  if (contactCanvas.value) {
    fluid = useFluidBackground()
    fluid.init(contactCanvas.value)
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
  if (fluid) fluid.destroy()
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
  padding: 80px 24px;
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
  position: relative;
  overflow: hidden;
}

.contact-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.contact-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 100px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.contact-inner a,
.contact-inner .contact-item {
  pointer-events: auto;
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
  gap: 12px;
}

.skill-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 20px 20px;
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
  background: color-mix(in srgb, var(--brand-color) 15%, transparent);
  border-color: color-mix(in srgb, var(--brand-color) 40%, transparent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--brand-color) 25%, transparent);
  color: var(--brand-color);
}

.skill-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: hsla(0, 0%, 100%, 0.06);
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsla(0, 0%, 100%, 0.65);
  margin-bottom: 12px;
  transition: all 0.3s var(--transition);
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
