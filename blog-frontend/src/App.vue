<template>
  <div class="app-shell" :class="{ 'is-home': isHome }">
    <header class="site-header" :class="{ scrolled: isScrolled }">
      <div class="header-inner">
        <nav class="nav-links">
          <router-link to="/">首页</router-link>
          <router-link to="/blog">博客</router-link>
          <router-link to="/portfolio">作品集</router-link>
        </nav>
        <div class="header-right">
          <template v-if="user">
            <span class="user-name">{{ user.username }}</span>
            <button class="btn-header btn-outline" @click="logout">退出</button>
          </template>
          <template v-else>
            <router-link class="btn-header btn-outline" to="/login">登录</router-link>
            <router-link class="btn-header btn-solid" to="/register">注册</router-link>
          </template>
        </div>
        <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
          <span :class="{ open: menuOpen }"></span>
        </button>
      </div>
      <transition name="slide">
        <div v-if="menuOpen" class="mobile-menu">
          <router-link to="/" @click="menuOpen = false">首页</router-link>
          <router-link to="/blog" @click="menuOpen = false">博客</router-link>
          <router-link to="/portfolio" @click="menuOpen = false">作品集</router-link>
          <template v-if="user">
            <span class="mobile-user">{{ user.username }}</span>
            <button class="btn-header btn-outline" @click="logout; menuOpen = false">退出</button>
          </template>
          <template v-else>
            <router-link class="btn-header btn-outline" to="/login" @click="menuOpen = false">登录</router-link>
            <router-link class="btn-header btn-solid" to="/register" @click="menuOpen = false">注册</router-link>
          </template>
        </div>
      </transition>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-left">
          <span class="footer-logo">FeiTwnd</span>
          <p class="footer-copy">&copy; {{ new Date().getFullYear() }} FeiTwnd. All rights reserved.</p>
        </div>
        <div class="footer-right">
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.bilibili.com" target="_blank" rel="noreferrer">Bilibili</a>
          <a href="https://leetcode.com" target="_blank" rel="noreferrer">LeetCode</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/')
const isScrolled = ref(false)
const user = ref(null)
const menuOpen = ref(false)

const syncUser = () => {
  const raw = localStorage.getItem('user')
  user.value = raw ? JSON.parse(raw) : null
}

const logout = () => {
  localStorage.removeItem('user')
  syncUser()
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  syncUser()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('storage', syncUser)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('storage', syncUser)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');

:root {
  --color-bg: #000;
  --color-surface: #0d0d0d;
  --color-border: hsla(0, 0%, 100%, 0.1);
  --color-border-hover: hsla(0, 0%, 100%, 0.2);
  --color-text: #fff;
  --color-text-secondary: hsla(0, 0%, 100%, 0.85);
  --color-text-muted: hsla(0, 0%, 100%, 0.55);
  --color-accent: #10B981;
  --color-danger: #E11D48;
  --font-primary: 'Poppins', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  --max-width: 1312px;
  --header-height: 72px;
  --transition: cubic-bezier(.48, .04, .52, .96);
  --radius: 8px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-primary);
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  letter-spacing: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

::selection {
  background: hsla(0, 0%, 100%, 0.15);
  color: #fff;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 100%, 0.15);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsla(0, 0%, 100%, 0.25);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes opacityIn {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

@keyframes bounceArrow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.page-enter-active {
  animation: fadeInUp 0.3s var(--transition) both;
}

.page-leave-active {
  animation: opacityIn 0.15s var(--transition) reverse both;
}
</style>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell.is-home {
  height: 100vh;
  overflow: hidden;
}

.app-shell.is-home .site-footer {
  display: none;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-shell.is-home .main-content {
  overflow: hidden;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.3s var(--transition), backdrop-filter 0.3s var(--transition);
}

.site-header.scrolled {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.06);
}

.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  font-size: 14px;
  font-weight: 500;
  color: hsla(0, 0%, 100%, 0.75);
  text-decoration: none;
  transition: color 0.3s var(--transition);
  letter-spacing: 0.5px;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.55);
  font-weight: 500;
}

.btn-header {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-primary);
  cursor: pointer;
  transition: all 0.3s var(--transition);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.btn-outline {
  background: transparent;
  border: 1px solid hsla(0, 0%, 100%, 0.3);
  color: #fff;
}

.btn-outline:hover {
  border-color: hsla(0, 0%, 100%, 0.6);
  background: hsla(0, 0%, 100%, 0.05);
}

.btn-solid {
  background: #fff;
  border: 1px solid #fff;
  color: #000;
}

.btn-solid:hover {
  background: hsla(0, 0%, 100%, 0.9);
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  position: relative;
  width: 36px;
  height: 36px;
}

.hamburger span,
.hamburger span::before,
.hamburger span::after {
  display: block;
  width: 20px;
  height: 1.5px;
  background: #fff;
  position: absolute;
  left: 8px;
  transition: all 0.3s var(--transition);
}

.hamburger span {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger span::before {
  content: '';
  top: -6px;
}

.hamburger span::after {
  content: '';
  top: 6px;
}

.hamburger span.open {
  background: transparent;
}

.hamburger span.open::before {
  top: 0;
  transform: rotate(45deg);
}

.hamburger span.open::after {
  top: 0;
  transform: rotate(-45deg);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-top: 1px solid hsla(0, 0%, 100%, 0.06);
}

.mobile-menu a {
  font-size: 16px;
  color: hsla(0, 0%, 100%, 0.85);
  padding: 8px 0;
}

.mobile-user {
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.55);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s var(--transition);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.site-footer {
  margin-top: auto;
  border-top: 1px solid hsla(0, 0%, 100%, 0.06);
  background: #000;
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-logo {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.footer-copy {
  font-size: 13px;
  color: hsla(0, 0%, 100%, 0.35);
}

.footer-right {
  display: flex;
  gap: 24px;
}

.footer-right a {
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.55);
  transition: color 0.3s var(--transition);
  text-decoration: none;
}

.footer-right a:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .nav-links,
  .header-right {
    display: none;
  }

  .hamburger {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }

  .footer-inner {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .footer-left {
    align-items: center;
  }
}
</style>
