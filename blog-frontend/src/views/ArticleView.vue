<template>
  <div class="article-page">
    <GridCanvas :speed="0.08" :squareSize="100" borderColor="rgba(255, 255, 255, 0.015)" />
    <div class="article-nav">
      <router-link class="back-link" to="/blog">← 返回博客</router-link>
      <button
        v-if="canDelete"
        class="delete-btn"
        :disabled="deleting"
        @click="handleDelete"
      >
        {{ deleting ? '删除中...' : '删除文章' }}
      </button>
    </div>

    <div v-if="loading" class="skeleton-wrap">
      <div class="skeleton skeleton-meta"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-line" v-for="n in 6" :key="n"></div>
    </div>

    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <article v-else class="article-content">
      <div class="article-meta">
        <span class="meta-category">{{ article.categoryName || '未分类' }}</span>
        <span class="meta-date">{{ formatDate(article.createdAt) }}</span>
      </div>
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-body" v-html="article.content"></div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticle, deleteArticle } from '../utils/api'
import GridCanvas from '../components/GridCanvas.vue'

const route = useRoute()
const router = useRouter()

const article = ref({})
const loading = ref(false)
const error = ref('')
const deleting = ref(false)

const currentUser = computed(() => {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
})

const canDelete = computed(() => {
  const user = currentUser.value
  if (!user) return false
  const authorId = article.value?.authorId
  return Number(user.id) === Number(authorId) || Number(user.role) === 1
})

const formatDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return Number.isNaN(d.getTime()) ? val : d.toLocaleDateString('zh-CN')
}

const fetchArticle = async () => {
  loading.value = true
  error.value = ''
  try {
    article.value = await getArticle(route.params.id)
  } catch (e) {
    error.value = e.message || '文章加载失败'
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('确定删除该文章吗？')) return
  deleting.value = true
  try {
    await deleteArticle(route.params.id)
    router.replace('/blog')
  } catch (e) {
    alert(e.message || '删除失败')
  } finally {
    deleting.value = false
  }
}

onMounted(() => fetchArticle())
</script>

<style scoped>
.article-page {
  max-width: 820px;
  margin: 0 auto;
  padding: calc(var(--header-height) + 60px) 24px 80px;
  min-height: 100vh;
}

.article-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.back-link {
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.55);
  text-decoration: none;
  transition: color 0.3s var(--transition);
}

.back-link:hover {
  color: #fff;
}

.delete-btn {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid var(--color-danger);
  border-radius: 4px;
  color: var(--color-danger);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-primary);
  cursor: pointer;
  transition: all 0.3s var(--transition);
}

.delete-btn:hover:not(:disabled) {
  background: var(--color-danger);
  color: #fff;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.meta-category {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent);
  background: hsla(160, 84%, 39%, 0.1);
  padding: 3px 12px;
  border-radius: 999px;
}

.meta-date {
  font-size: 13px;
  color: hsla(0, 0%, 100%, 0.35);
}

.article-title {
  font-size: 42px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 40px;
}

.article-body {
  color: hsla(0, 0%, 100%, 0.85);
  font-size: 16px;
  line-height: 1.8;
}

.article-body :deep(p) {
  margin-bottom: 1.2em;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  color: #fff;
  margin: 1.5em 0 0.5em;
  font-weight: 600;
}

.article-body :deep(h2) { font-size: 28px; }
.article-body :deep(h3) { font-size: 22px; }

.article-body :deep(a) {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s var(--transition);
}

.article-body :deep(a:hover) {
  border-bottom-color: var(--color-accent);
}

.article-body :deep(code) {
  background: hsla(0, 0%, 100%, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Poppins', monospace;
}

.article-body :deep(pre) {
  background: #1a1a1a;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 20px;
  overflow-x: auto;
  margin: 1.2em 0;
}

.article-body :deep(pre code) {
  background: none;
  padding: 0;
}

.article-body :deep(blockquote) {
  border-left: 3px solid hsla(0, 0%, 100%, 0.2);
  padding-left: 20px;
  margin: 1.2em 0;
  color: hsla(0, 0%, 100%, 0.65);
  font-style: italic;
}

.article-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius);
  margin: 1.2em 0;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1.2em;
}

.article-body :deep(li) {
  margin-bottom: 0.4em;
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2em 0;
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: 10px 14px;
  text-align: left;
}

.article-body :deep(th) {
  background: hsla(0, 0%, 100%, 0.04);
  color: #fff;
  font-weight: 600;
}

.state-message {
  text-align: center;
  padding: 60px 0;
  font-size: 16px;
}

.state-message.error {
  color: var(--color-danger);
}

.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton {
  border-radius: 4px;
  background: linear-gradient(90deg, hsla(0, 0%, 100%, 0.04) 25%, hsla(0, 0%, 100%, 0.02) 50%, hsla(0, 0%, 100%, 0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-meta { width: 30%; height: 14px; }
.skeleton-title { width: 70%; height: 36px; }
.skeleton-line { width: 100%; height: 14px; }
.skeleton-line:nth-child(4) { width: 95%; }
.skeleton-line:nth-child(5) { width: 85%; }
.skeleton-line:nth-child(6) { width: 90%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 768px) {
  .article-page {
    padding: calc(var(--header-height) + 40px) 16px 60px;
  }

  .article-title {
    font-size: 30px;
  }

  .article-body {
    font-size: 15px;
  }
}
</style>
