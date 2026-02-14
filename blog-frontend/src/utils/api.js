import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// Unified response interceptor; unwrap business payload or throw on error code
api.interceptors.response.use(res => {
  const payload = res.data
  if (!payload) return Promise.resolve(null)
  if (payload.code && payload.code !== 200 && payload.code !== 0) {
    return Promise.reject(new Error(payload.message || 'API error'))
  }
  return payload.data !== undefined ? payload.data : payload
})

export default api

export const getArticlesPage = (page = 1, size = 10) =>
  api.get(`/articles/page?pageNum=${page}&pageSize=${size}`)

export const getArticle = id => api.get(`/articles/${id}`)

export const getCategories = () => api.get('/categories')

export const postComment = payload => api.post('/comments', payload)

export const register = payload => api.post('/auth/register', payload)

export const login = payload => api.post('/auth/login', payload)
