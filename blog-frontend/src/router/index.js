import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ArticleView from '../views/ArticleView.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/article/:id', name: 'ArticleView', component: ArticleView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
