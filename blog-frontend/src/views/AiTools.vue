<template>
  <div class="ai-tools-page">
    <GridCanvas :speed="0.1" :squareSize="70" borderColor="rgba(255, 255, 255, 0.025)" />
    <section class="ai-tools-hero">
      <h1 class="ai-tools-title">AI 工具集</h1>
      <p class="ai-tools-subtitle">正在探索的 AI 生态</p>
    </section>

    <section class="ai-tools-grid">
      <div
        v-for="(tool, i) in aiTools"
        :key="tool.name"
        class="tool-card"
        :class="{ visible: visibleCards.has(i) }"
        :style="{ transitionDelay: `${i * 80}ms` }"
      >
        <div class="tool-icon" :style="{ '--brand-color': tool.color }">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <text x="12" y="16" text-anchor="middle" fill="currentColor" :font-size="tool.letterSize || 12" font-weight="700" font-family="sans-serif">{{ tool.letter }}</text>
          </svg>
        </div>
        <h3 class="tool-name">{{ tool.name }}</h3>
        <p class="tool-desc">{{ tool.desc }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GridCanvas from '../components/GridCanvas.vue'

const aiTools = [
  { name: 'Claude Code', desc: 'AI 编程助手与代码生成', color: '#D97757', letter: 'C', letterSize: 13 },
  { name: 'Codex', desc: 'OpenAI 代码理解与生成', color: '#412991', letter: 'X', letterSize: 13 },
  { name: 'Ollama', desc: '本地大模型运行框架', color: '#FFFFFF', letter: 'O', letterSize: 13 },
  { name: 'Skills', desc: '技能驱动的 Agent 能力', color: '#22D3EE', letter: 'S', letterSize: 13 },
  { name: 'MCP', desc: '模型上下文协议', color: '#A78BFA', letter: 'M', letterSize: 13 },
  { name: 'RAG', desc: '检索增强生成', color: '#F472B6', letter: 'R', letterSize: 13 },
  { name: 'Transformer', desc: '注意力机制架构', color: '#FB923C', letter: 'T', letterSize: 13 },
  { name: 'OpenCode', desc: '开源 AI 编程工具', color: '#34D399', letter: 'O', letterSize: 13 },
  { name: 'openclaw', desc: '开源 AI 框架', color: '#FBBF24', letter: 'cl', letterSize: 9 },
  { name: 'astrbot', desc: 'AI 聊天机器人框架', color: '#60A5FA', letter: 'A', letterSize: 13 }
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

  const cards = document.querySelectorAll('.tool-card')
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
.ai-tools-page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: calc(var(--header-height) + 60px) 24px 80px;
  min-height: 100vh;
}

.ai-tools-hero {
  text-align: center;
  margin-bottom: 64px;
}

.ai-tools-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.2;
  background: linear-gradient(135deg, #fff 0%, hsla(0, 0%, 100%, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.ai-tools-subtitle {
  font-size: 18px;
  color: hsla(0, 0%, 100%, 0.55);
}

.ai-tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tool-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition: all 0.6s var(--transition);
  opacity: 0;
  transform: translateY(20px);
}

.tool-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.tool-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3);
}

.tool-card:hover .tool-icon {
  background: color-mix(in srgb, var(--brand-color) 15%, transparent);
  border-color: color-mix(in srgb, var(--brand-color) 40%, transparent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--brand-color) 25%, transparent);
  color: var(--brand-color);
}

.tool-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: hsla(0, 0%, 100%, 0.06);
  border: 1px solid hsla(0, 0%, 100%, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsla(0, 0%, 100%, 0.65);
  margin-bottom: 16px;
  transition: all 0.3s var(--transition);
}

.tool-name {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.tool-desc {
  font-size: 13px;
  color: hsla(0, 0%, 100%, 0.55);
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .ai-tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .ai-tools-page {
    padding: calc(var(--header-height) + 40px) 16px 60px;
  }

  .ai-tools-title {
    font-size: 36px;
  }

  .ai-tools-subtitle {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .ai-tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
