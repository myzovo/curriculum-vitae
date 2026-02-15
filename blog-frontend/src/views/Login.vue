<template>
  <div class="page">
    <!-- 应用通用磨砂玻璃组件 -->
    <GlassSurface class="card" padding="40px" :blur="24" :backgroundOpacity="0.16" :borderOpacity="0.3">
      <h1>登录</h1>
      <form class="form" @submit.prevent="handleSubmit">
        <label>
          <span>用户名</span>
          <input v-model="form.username" required placeholder="请输入用户名" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" required placeholder="请输入密码" />
        </label>
        <button type="submit" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
      </form>
      <p class="helper">还没有账号？<router-link to="/register">去注册</router-link></p>
      <p v-if="error" class="error">{{ error }}</p>
    </GlassSurface>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../utils/api'
import GlassSurface from '../components/GlassSurface.vue'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!form.username || !form.password) return
  loading.value = true
  error.value = ''
  try {
    const user = await login({ username: form.username, password: form.password })
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/')
  } catch (e) {
    error.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  /* 登录注册页通用样式，居中显示一个卡片 */
  min-height: 80vh;
  /*我不理解为什么这里能改高度，下面却不能改宽度呢？这个磨砂毛玻璃 */

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.card {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

h1 {
  margin: 0 0 16px;
  font-size: 24px;
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

input {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.helper {
  margin: 12px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.error {
  margin-top: 8px;
  color: #b91c1c;
}
</style>
