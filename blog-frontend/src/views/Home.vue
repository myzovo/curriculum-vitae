<template>
  <!-- 背景底层：默认浅灰或用户自定义图，无模糊 -->
  <div class="shell" :style="bgBaseStyle">
    <!-- 关键修改：内容层毛玻璃容器，仅对内部生效 -->
    <div class="page">
      <header class="hero">
        <div class="hero-text">
          <p class="eyebrow">Minimal Blog</p>
          <h1>最新文章</h1>
          <p class="sub">探索技术、思考与分享。</p>
        </div>
        <div class="actions">
          <!-- 按钮顺序：导入 -> 重置 -> 发文章 -> 退出/登录注册 -->
          <button class="pill" type="button" @click="pickBackground">导入背景图</button>
          <button v-if="hasCustomBackground" class="pill ghost" type="button" @click="resetBackground">重置背景</button>
          <router-link v-if="user" class="pill" to="/create-article">发文章</router-link>
          <span v-if="bgLoading" class="bg-tip">背景加载中...</span>
          <span v-if="toast" class="bg-tip">{{ toast }}</span>
          <template v-if="user">
            <span class="user">你好，{{ user.username }}</span>
            <button class="pill ghost" @click="logout">退出</button>
          </template>
          <template v-else>
            <router-link class="pill" to="/login">登录</router-link>
            <router-link class="pill ghost" to="/register">注册</router-link>
          </template>
          <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/webp" class="file-input"
            @change="handleFileChange" />
        </div>
      </header>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getArticlesPage } from '../utils/api'

const articles = ref([])
const page = ref(1)
const size = 10
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')
const user = ref(null)

// 关键修改：背景状态与提示
const BG_KEY = 'blog_bg'
const bgImage = ref('')
const bgLoading = ref(false)
const toast = ref('')
const toastTimer = ref(null)
const fileInput = ref(null)

const hasCustomBackground = computed(() => !!bgImage.value)

// 底层背景：默认浅灰或自定义图，无模糊
const bgBaseStyle = computed(() => ({
  backgroundColor: '#f8f9fa',
  backgroundImage: bgImage.value ? `url(${bgImage.value})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh'
}))

const showToast = msg => {
  toast.value = msg
  if (toastTimer.value) clearTimeout(toastTimer.value)
  toastTimer.value = setTimeout(() => {
    toast.value = ''
  }, 2000)
}

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

// 关键修改：选择背景文件
const pickBackground = () => {
  fileInput.value?.click()
}

// 关键修改：处理文件导入并转 Base64
const handleFileChange = e => {
  const file = e.target.files?.[0]
  if (!file) return
  e.target.value = ''
  if (!file.type.startsWith('image/')) {
    showToast('请选择 jpg/png/webp 图片')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片过大，请选择 5MB 以内')
    return
  }
  const reader = new FileReader()
  bgLoading.value = true
  reader.onload = () => {
    const result = reader.result
    bgImage.value = result
    localStorage.setItem(BG_KEY, result)
    bgLoading.value = false
    showToast('背景设置成功')
  }
  reader.onerror = () => {
    bgLoading.value = false
    showToast('图片读取失败，请重试')
  }
  reader.readAsDataURL(file)
}

// 关键修改：重置背景
const resetBackground = () => {
  bgImage.value = ''
  localStorage.removeItem(BG_KEY)
  showToast('已恢复默认背景')
}

const formatDate = val => {
  if (!val) return '未知时间'
  const d = new Date(val)
  return Number.isNaN(d.getTime()) ? val : d.toLocaleDateString()
}

onMounted(() => {
  // 关键修改：初始化背景
  const cached = localStorage.getItem(BG_KEY)
  if (cached) bgImage.value = cached

  fetchPage(1)
  syncUser()
  window.addEventListener('storage', syncUser)
})

onUnmounted(() => {
  window.removeEventListener('storage', syncUser)
  if (toastTimer.value) clearTimeout(toastTimer.value)
})
</script>


<style scoped>
.shell {
  min-height: 100vh;
}

.page {
  /* 关键修改：内容层毛玻璃，仅作用于内部 */
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  color: #111827;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.eyebrow {
  color: #374151;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 4px 0;
  font-size: 28px;
  color: #111827;
}

.sub {
  color: #1f2937;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: flex-end;
}

.pill {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.9);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid #111827;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.pill.ghost {
  background: rgba(255, 255, 255, 0.6);
  color: #111827;
  border: 1px solid #111827;
}

.file-input {
  display: none;
}

.bg-tip {
  color: #1f2937;
  font-size: 12px;
}

.list {
  display: grid;
  gap: 12px;
}

.card {
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  color: #111827;
}

.meta {
  color: #374151;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cat {
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
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
  color: #1f2937;
  line-height: 1.5;
}

.state {
  text-align: center;
  color: #1f2937;
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
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #111827;
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
  background: rgba(17, 24, 39, 0.9);
  color: #fff;
  border-color: #111827;
}

@media (max-width: 640px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .actions {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
