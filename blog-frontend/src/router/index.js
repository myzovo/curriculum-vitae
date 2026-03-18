import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import BlogPage from '../views/BlogPage.vue'
import ArticleView from '../views/ArticleView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Category from '../views/Category.vue'
import CreateArticle from '../views/CreateArticle.vue'

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/blog', name: 'BlogPage', component: BlogPage },
  { path: '/article/:id', name: 'ArticleView', component: ArticleView },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/categories', name: 'Category', component: Category },
  { path: '/create-article', name: 'CreateArticle', component: CreateArticle }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/create-article') {
    const raw = localStorage.getItem('user')
    const authed = raw ? JSON.parse(raw) : null
    if (!authed) return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  next()
})

export default router
