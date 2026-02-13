import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // using vite proxy
  timeout: 5000
})

export default api
