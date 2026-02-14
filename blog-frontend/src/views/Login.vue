<template>
  <div class="page">
    <div class="card">
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
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../utils/api'

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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f9fafb;
}

.card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
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
