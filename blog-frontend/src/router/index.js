import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/blog',
    name: 'BlogPage',
    component: () => import('@/views/BlogPage.vue')
  },
  {
    path: '/article/:id',
    name: 'ArticleView',
    component: () => import('@/views/ArticleView.vue')
  },
  {
    path: '/ai-tools',
    name: 'AiTools',
    component: () => import('@/views/AiTools.vue')
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: () => import('@/views/Portfolio.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
