import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// Inject X-User-Id for comment/article mutation requests.
api.interceptors.request.use(config => {
  const userRaw = localStorage.getItem('user')
  const user = userRaw ? JSON.parse(userRaw) : null
  const url = config.url || ''
  const method = (config.method || '').toLowerCase()
  const isComments = url.startsWith('/comments') && ['post', 'put', 'delete'].includes(method)
  const isArticleDelete = url.startsWith('/articles') && method === 'delete'
  if ((isComments || isArticleDelete) && user?.id) {
    config.headers = config.headers || {}
    config.headers['X-User-Id'] = user.id
  }
  return config
})

// Unified response interceptor; unwrap business payload or throw on error code
api.interceptors.response.use(res => {
  const payload = res.data
  if (!payload) return Promise.resolve(null)
  if (payload.code && payload.code !== 200 && payload.code !== 0) {
    return Promise.reject(new Error(payload.message || 'API error'))
  }
  return payload.data !== undefined ? payload.data : payload
}, err => Promise.reject(err))

export default api

export const getArticlesPage = (page = 1, size = 10) =>
  api.get(`/articles/page?pageNum=${page}&pageSize=${size}`)

export const getArticle = id => api.get(`/articles/${id}`)

export const getCategories = () => api.get('/categories')

export const postComment = payload => api.post('/comments', payload)

export const updateComment = (id, payload) => api.put(`/comments/${id}`, payload)

export const deleteComment = id => api.delete(`/comments/${id}`)

export const deleteArticle = id => api.delete(`/articles/${id}`)

export const register = payload => api.post('/auth/register', payload)

export const login = payload => api.post('/auth/login', payload)
