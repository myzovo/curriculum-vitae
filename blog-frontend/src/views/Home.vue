<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Minimal Blog</p>
        <h1>最新文章</h1>
        <p class="sub">探索技术、思考与分享。</p>
      </div>
      <div class="actions">
        <template v-if="user">
          <span class="user">你好，{{ user.username }}</span>

          <button class="pill ghost" @click="logout">退出</button>
        </template>
        <template v-else>
          <router-link class="pill" to="/login">登录</router-link>
          <router-link class="pill ghost" to="/register">注册</router-link>
        </template>
      </div>
    </header>


    <!-- 把“发文章”按钮放在这里 -->
    <div class="create-btn-wrapper" v-if="user">
      <router-link class="pill" to="/create-article">发文章</router-link>
    </div>



    <!-- ... 文章列表 ... -->


    <section class="list" v-if="!loading && articles.length">
      <article v-for="item in articles" :key="item.id" class="card">
        <div class="meta">
          <span class="cat">{{ item.categoryName || '未分类' }}</span>
          <span class="dot">•</span>
          <span class="date">{{ formatDate(item.createTime || item.createdAt) }}</span>
        </div>
        <router-link class="title" :to="`/article/${item.id}`">{{ item.title }}</router-link>
        <p class="excerpt">{{ item.summary || item.description || '点击查看详情' }}</p>
      </article>
    </section>

    <div v-if="loading" class="state">加载中...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else-if="!articles.length" class="state">暂无文章</div>

    <footer class="pager" v-if="totalPages > 1">
      <button :disabled="page === 1 || loading" @click="goPage(page - 1)">上一页</button>
      <div class="pages">
        <button v-for="p in totalPages" :key="p" :class="['page-btn', { active: p === page }]" @click="goPage(p)"
          :disabled="loading">
          {{ p }}
        </button>
      </div>
      <button :disabled="page === totalPages || loading" @click="goPage(page + 1)">下一页</button>
    </footer>
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
const user = ref(null)

const syncUser = () => {
  const raw = localStorage.getItem('user')
  user.value = raw ? JSON.parse(raw) : null
}

const logout = () => {
  localStorage.removeItem('user')
  syncUser()
}

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

const goPage = p => {
  if (p < 1 || p > totalPages.value) return
  fetchPage(p)
}

const formatDate = val => {
  if (!val) return '未知时间'
  const d = new Date(val)
  return Number.isNaN(d.getTime()) ? val : d.toLocaleDateString()
}

onMounted(() => {
  fetchPage(1)
  syncUser()
  window.addEventListener('storage', syncUser)
})
</script>


<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.create-btn-wrapper {
  text-align: right;
  /* 按钮靠右 */
  margin-bottom: 16px;
  /* 和下面的文章列表拉开一点距离 */
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
}

.eyebrow {
  color: #4b5563;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 4px 0;
  font-size: 28px;
}

.sub {
  color: #6b7280;
}

.actions {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.pill {
  padding: 8px 14px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid #111827;
}

.pill.ghost {
  background: #fff;
  color: #6592f3;
}

.list {
  display: grid;
  gap: 12px;
}

.card {
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.meta {
  color: #6b7280;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cat {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 999px;
}

.title {
  display: block;
  margin: 8px 0 4px;
  color: #111827;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
}

.title:hover {
  text-decoration: underline;
}

.excerpt {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

.state {
  text-align: center;
  color: #6b7280;
  padding: 12px 0;
}

.state.error {
  color: #b91c1c;
}

.pager {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pager button {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}

.pager button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pages {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.page-btn.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

@media (max-width: 640px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .pager {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
