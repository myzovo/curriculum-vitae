# Blog Frontend (Vite + Vue 3)

Quick start:

1. Install dependencies:
   npm install

2. Start dev server (runs on http://localhost:5173):
   npm run dev

Notes:
- The Vite dev server proxies `/api` to `http://localhost:8080` so backend API calls to `/api/...` will reach your Spring Boot app.
- Axios instance is in `src/utils/api.js`.
- Pages:
  - `/` Article list (src/views/Home.vue)
  - `/article/:id` Article detail (src/views/ArticleView.vue)

