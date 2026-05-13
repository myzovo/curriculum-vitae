<template>
  <div class="auth-page">
    <GridCanvas :speed="0.1" :squareSize="80" borderColor="rgba(255, 255, 255, 0.02)" />
    <div class="auth-card">
      <h1 class="auth-title">注册</h1>
      <form class="auth-form" @submit.prevent="handleSubmit">
        <label class="form-label">
          <span>用户名</span>
          <input v-model="form.username" required placeholder="请输入用户名" />
        </label>
        <label class="form-label">
          <span>邮箱</span>
          <input v-model="form.email" type="email" required placeholder="请输入邮箱" />
        </label>
        <label class="form-label">
          <span>密码</span>
          <input v-model="form.password" type="password" required placeholder="请输入密码" />
        </label>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      <p class="auth-link">已有账号？<router-link to="/login">去登录</router-link></p>
      <p v-if="error" class="auth-error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import GridCanvas from '../components/GridCanvas.vue'
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
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  padding-top: var(--header-height);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: rgba(13, 13, 13, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 48px 40px;
  animation: fadeInUp 0.5s var(--transition) both;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
}

.auth-title {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 32px;
  letter-spacing: -0.01em;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: hsla(0, 0%, 100%, 0.75);
}

.form-label input {
  padding: 12px 16px;
  background: #1a1a1a;
  border: 1px solid hsla(0, 0%, 100%, 0.15);
  border-radius: 4px;
  color: #fff;
  font-size: 15px;
  font-family: var(--font-primary);
  outline: none;
  transition: border-color 0.3s var(--transition);
}

.form-label input:focus {
  border-color: hsla(0, 0%, 100%, 0.4);
}

.form-label input::placeholder {
  color: hsla(0, 0%, 100%, 0.25);
}

.submit-btn {
  padding: 14px;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-primary);
  cursor: pointer;
  transition: all 0.3s var(--transition);
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: hsla(0, 0%, 100%, 0.9);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-link {
  margin-top: 24px;
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.55);
  text-align: center;
}

.auth-link a {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}

.auth-error {
  margin-top: 16px;
  font-size: 14px;
  color: var(--color-danger);
  text-align: center;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
  }

  .auth-title {
    font-size: 28px;
  }
}
</style>
