<template>
  <div class="blog-page">
    <div class="blog-header">
      <h1 class="page-title">博客文章</h1>
      <p class="page-subtitle">探索技术、思考与分享</p>
    </div>

    <div v-if="loading" class="article-list">
      <div v-for="n in 5" :key="n" class="skeleton-card">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line long"></div>
        <div class="skeleton-line medium"></div>
      </div>
    </div>

    <div v-else-if="error" class="state-message error">{{ error }}</div>
    <div v-else-if="!articles.length" class="state-message empty">暂无文章</div>

    <div v-else class="article-list">
      <article
        v-for="(item, i) in articles"
        :key="item.id"
        class="article-card"
        :class="{ visible: true }"
        :style="{ animationDelay: `${i * 80}ms` }"
        @click="$router.push(`/article/${item.id}`)"
      >
        <div class="card-meta">
          <span class="card-category">{{ item.categoryName || '未分类' }}</span>
          <span class="card-date">{{ formatDate(item.createdAt) }}</span>
        </div>
        <h2 class="card-title">{{ item.title }}</h2>
        <p class="card-excerpt">{{ item.summary || '点击查看详情' }}</p>
      </article>
    </div>

    <div v-if="!loading && totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="page === 1"
        @click="goPage(page - 1)"
      >
        上一页
      </button>
      <div class="page-numbers">
        <button
          v-for="p in totalPages"
          :key="p"
          :class="['page-num', { active: p === page }]"
          @click="goPage(p)"
        >
          {{ p }}
        </button>
      </div>
      <button
        class="page-btn"
        :disabled="page === totalPages"
        @click="goPage(page + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getArticlesPage } from '../utils/api'

const articles = ref([])
const page = ref(1)
const size = 10
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

const fetchPage = async (pageNum = 1) => {
  loading.value = true
  error.value = ''
  try {
    const data = await getArticlesPage(pageNum, size)
    articles.value = data.records || data.list || []
    totalPages.value = data.pages || data.totalPages || 1
    page.value = pageNum
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

const goPage = (p) => {
  if (p < 1 || p > totalPages.value) return
  fetchPage(p)
}

const formatDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return Number.isNaN(d.getTime()) ? val : d.toLocaleDateString('zh-CN')
}

onMounted(() => fetchPage(1))
</script>

<style scoped>
.blog-page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: calc(var(--header-height) + 60px) 24px 80px;
  min-height: 100vh;
}

.blog-header {
  margin-bottom: 48px;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: hsla(0, 0%, 100%, 0.55);
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 28px 32px;
  cursor: pointer;
  transition: all 0.3s var(--transition);
  animation: fadeInUp 0.5s var(--transition) both;
}

.article-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.card-category {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent);
  background: hsla(160, 84%, 39%, 0.1);
  padding: 3px 12px;
  border-radius: 999px;
}

.card-date {
  font-size: 13px;
  color: hsla(0, 0%, 100%, 0.35);
  font-family: 'Poppins', sans-serif;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-excerpt {
  font-size: 15px;
  color: hsla(0, 0%, 100%, 0.55);
  line-height: 1.6;
  max-width: 65ch;
}

.state-message {
  text-align: center;
  padding: 60px 0;
  font-size: 16px;
}

.state-message.error {
  color: var(--color-danger);
}

.state-message.empty {
  color: hsla(0, 0%, 100%, 0.35);
}

.skeleton-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, hsla(0, 0%, 100%, 0.04) 25%, hsla(0, 0%, 100%, 0.02) 50%, hsla(0, 0%, 100%, 0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.short { width: 30%; }
.skeleton-line.long { width: 90%; }
.skeleton-line.medium { width: 60%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 48px;
}

.page-btn {
  padding: 10px 24px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: hsla(0, 0%, 100%, 0.75);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-primary);
  cursor: pointer;
  transition: all 0.3s var(--transition);
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-border-hover);
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-num {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: hsla(0, 0%, 100%, 0.55);
  font-size: 14px;
  font-family: var(--font-primary);
  cursor: pointer;
  transition: all 0.3s var(--transition);
}

.page-num:hover {
  color: #fff;
  border-color: var(--color-border);
}

.page-num.active {
  background: #fff;
  color: #000;
  border-color: #fff;
}

@media (max-width: 768px) {
  .blog-page {
    padding: calc(var(--header-height) + 40px) 16px 60px;
  }

  .page-title {
    font-size: 36px;
  }

  .article-card {
    padding: 20px;
  }

  .card-title {
    font-size: 18px;
  }
}
</style>
