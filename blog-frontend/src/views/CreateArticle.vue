<template>
  <div class="page">
    <h1>创建文章</h1>
    <form class="form" @submit.prevent="handleSubmit">
      <label>
        标题
        <input v-model="form.title" required placeholder="请输入标题" />
      </label>
      <label>
        分类
        <select v-model="form.categoryId" required>
          <option value="" disabled>请选择分类</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <p class="tip" v-if="!loadingCategories && !categories.length">
          暂无分类，可先前往 <router-link to="/categories">分类管理</router-link> 添加。
        </p>
        <p class="tip" v-if="loadingCategories">分类加载中...</p>
        <p class="tip error" v-if="error && !loadingCategories">{{ error }}</p>
      </label>
      <label>
        内容 (支持 HTML)
        <textarea v-model="form.content" rows="8" required placeholder="请输入内容"></textarea>
      </label>
      <button type="submit" :disabled="submitting">{{ submitting ? '提交中...' : '提交' }}</button>
      <p v-if="submitError" class="error">{{ submitError }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api, { getCategories } from '../utils/api'

const router = useRouter()
const form = reactive({ title: '', categoryId: '', content: '' })
const categories = ref([])
const submitting = ref(false)
const submitError = ref('')
const error = ref('')
const loadingCategories = ref(false)

// 加载分类列表，失败仅提示不阻塞填写
const loadCategories = async () => {
  loadingCategories.value = true
  error.value = ''
  try {
    categories.value = await getCategories()
  } catch (e) {
    console.error('加载分类失败', e)
    error.value = '分类加载失败，可稍后重试'
  } finally {
    loadingCategories.value = false
  }
}

// 提交前校验必填项，提交创建文章
const handleSubmit = async () => {
  if (!form.title || !form.categoryId || !form.content) {
    alert('请填写完整表单')
    return
  }
  submitting.value = true
  submitError.value = ''
  try {
    await api.post('/articles', { ...form })
    router.push('/')
  } catch (e) {
    submitError.value = e.message || '提交失败'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  const raw = localStorage.getItem('user')
  if (!raw) {
    router.replace('/login')
    return
  }
  loadCategories()
})
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

input,
select,
textarea {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.tip {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}

button {
  align-self: flex-start;
  padding: 10px 14px;
  border: 1px solid #111827;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #b91c1c;
}
</style>
