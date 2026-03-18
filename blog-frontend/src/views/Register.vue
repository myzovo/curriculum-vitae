<template>
  <div class="auth">
    <div class="nav">
      <router-link class="pill ghost" to="/">返回首页</router-link>
    </div>
    <h1>注册</h1>
    <form class="form" @submit.prevent="handleSubmit">
      <label>
        用户名
        <input v-model="form.username" required placeholder="请输入用户名" />
      </label>
      <label>
        邮箱
        <input v-model="form.email" type="email" required placeholder="请输入邮箱" />
      </label>
      <label>
        密码
        <input v-model="form.password" type="password" required placeholder="请输入密码" />
      </label>
      <button type="submit" :disabled="loading">{{ loading ? '注册中...' : '注册' }}</button>
      <p class="tip">已有账号？<router-link to="/login">去登录</router-link></p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../utils/api'

const router = useRouter()
const form = reactive({ username: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!form.username || !form.email || !form.password) return
  loading.value = true
  error.value = ''
  try {
    await register({ ...form })
    router.push('/login')
  } catch (e) {
    error.value = e.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth {
  max-width: 400px;
  margin: 60px auto;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.nav {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

h1 { margin: 0 0 16px; }

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
  color: #374151;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

button {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tip {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.error {
  color: #b91c1c;
  font-size: 13px;
}

.pill {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.9);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid #111827;
}

.pill.ghost {
  background: rgba(255, 255, 255, 0.8);
  color: #111827;
  border: 1px solid #111827;
}
</style>
