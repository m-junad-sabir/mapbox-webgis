import axios from 'axios'

// API base URL — set VITE_API_BASE_URL in client/.env (defaults to /api via Vite proxy)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Request failed'
    return Promise.reject(new Error(message))
  },
)

export default api
