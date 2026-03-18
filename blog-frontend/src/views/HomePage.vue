<template>
  <div class="home-shell">
    <div class="topbar">
      <div class="spacer" />
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
    </div>

    <main class="card-wrap">
      <section class="card">
        <img class="avatar" :src="profile.avatar" alt="avatar" />
        <h1 class="name">{{ profile.name }}</h1>
        <p class="bio">{{ profile.bio }}</p>

        <div class="links">
          <router-link class="pill" to="/blog">博客</router-link>
          <a
            v-for="link in profile.links"
            :key="link.label"
            class="pill ghost"
            :href="link.href"
            target="_blank"
            rel="noreferrer"
          >
            {{ link.label }}
          </a>
        </div>

        <p class="footer">{{ profile.footer }}</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

// 个人资料配置，可按需替换
const profile = reactive({
  name: 'FeiTwnd',
  bio: '初出茅庐 | 科班码农 | 欢迎来到我的主页',
  avatar: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
  links: [
    { label: '简历', href: 'https://example.com/resume' },
    { label: '邮箱', href: 'mailto:hi@example.com' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'B站', href: 'https://www.bilibili.com' },
    { label: 'LeetCode', href: 'https://leetcode.com' }
  ],
  footer: '© 2024 FeiTwnd | ICP 备案号示例'
})

const user = ref(null)

const syncUser = () => {
  const raw = localStorage.getItem('user')
  user.value = raw ? JSON.parse(raw) : null
}

const logout = () => {
  localStorage.removeItem('user')
  syncUser()
}

onMounted(() => {
  syncUser()
  window.addEventListener('storage', syncUser)
})

onUnmounted(() => {
  window.removeEventListener('storage', syncUser)
})
</script>

<style scoped>
.home-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pill {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.9);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid #111827;
  cursor: pointer;
}

.pill.ghost {
  background: rgba(255, 255, 255, 0.8);
  color: #111827;
  border: 1px solid #111827;
}

.card-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 48px;
}

.card {
  width: min(520px, 92vw);
  text-align: center;
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  color: #111827;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
}

.name {
  margin: 8px 0 4px;
  font-size: 28px;
  line-height: 1.2;
}

.bio {
  margin: 0;
  color: #1f2937;
  font-size: 14px;
}

.links {
  margin: 16px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer {
  margin: 0;
  color: #374151;
  font-size: 12px;
}

@media (max-width: 640px) {
  .card {
    padding: 28px 18px;
  }

  .name {
    font-size: 24px;
  }
}
</style>
