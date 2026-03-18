# Blog Platform (Spring Boot + Vue)
[English | 简体中文](#博客平台spring-boot--vue)

A simple full-stack blog demo with a Spring Boot + MyBatis-Plus backend and a Vue 3 + Vite frontend. It supports user registration/login, article CRUD, categories, and nested comments.

## Tech Stack
- Backend: Spring Boot 2.7, MyBatis-Plus, MySQL 8, Redis (optional), Lombok, Validation
- Frontend: Vue 3, Vite, vue-router, axios
- Build/Runtime: JDK 8, Maven 3.8+, Node.js 16+, npm

## Repository Layout
- `blog-backend/` – Spring Boot service (REST APIs, MyBatis-Plus mappers, Redis config)
- `blog-frontend/` – Vue 3 SPA (Vite dev server with `/api` proxy)

## Backend Setup (`blog-backend`)
1) Ensure MySQL is running. Import the schema:
   ```sql
   -- from blog-backend/db/schema.sql
   source db/schema.sql;
   ```
2) Configure datasource/Redis in `src/main/resources/application.yml` (defaults: MySQL `localhost:3306`, db `blog_db`, user `root`, password `123456`; Redis `localhost:6379`).
3) Run in dev: `mvn spring-boot:run`
4) Build a jar: `mvn clean package`
5) Service listens on `http://localhost:8080`. Swagger is enabled in config; the Springfox/Knife4j deps are commented out by default.

## Frontend Setup (`blog-frontend`)
1) Install deps: `npm install`
2) Start dev server: `npm run dev` (Vite on `http://localhost:5173`, proxies `/api` to `http://localhost:8080`)
3) Build for production: `npm run build`; preview with `npm run serve`

## API Quick Reference
- Auth: `POST /api/auth/register` (body: user), `POST /api/auth/login` (username/password). Passwords are MD5-hashed server-side (demo only).
- Users: `GET /api/users/{id}`
- Articles: `POST /api/articles`, `PUT /api/articles/{id}`, `DELETE /api/articles/{id}` (requires `X-User-Id` header matching author or admin), `GET /api/articles/{id}`, `GET /api/articles/page?pageNum=&pageSize=`, `GET /api/articles/pageByCategory?pageNum=&pageSize=&categoryId=`
- Categories: `POST /api/categories`, `PUT /api/categories/{id}`, `DELETE /api/categories/{id}`, `GET /api/categories`
- Comments: `POST /api/comments`, `PUT /api/comments/{id}`, `DELETE /api/comments/{id}` (mutations may include `X-User-Id` header), `GET /api/comments/by-article/{articleId}?page=&size=`
- Response shape: `{ code, message, data }` (success code `200`)

## Data Model (from `db/schema.sql`)
Tables: `user` (role 0=user, 1=admin), `category`, `article` (FKs to user/category), `comment` (FK to article, self parent_id for replies). All use `utf8mb4` and soft-delete flags.

## Auth & Headers
- No JWT/session; frontend stores the returned user in `localStorage` and injects `X-User-Id` for comment mutations and article deletes (`src/utils/api.js`).
- To create an admin, set `role=1` manually in `user` table.

## Known Limitations / TODOs
- Password hashing uses MD5 (demo only); add salted strong hashing and tokens for production.
- Redis config present; caching layer is not wired in the current codebase.
- No Docker/deployment manifests; add if needed.
- Tests are minimal; add service/controller tests before shipping.

---

# 博客平台（Spring Boot + Vue）
[简体中文 | English](#blog-platform-spring-boot--vue)

一个简单的全栈博客示例，后端使用 Spring Boot + MyBatis-Plus，前端使用 Vue 3 + Vite，支持用户注册登录、文章增删改查、分类和嵌套评论。

## 技术栈
- 后端：Spring Boot 2.7、MyBatis-Plus、MySQL 8、Redis（可选）、Lombok、Validation
- 前端：Vue 3、Vite、vue-router、axios
- 构建/运行：JDK 8、Maven 3.8+、Node.js 16+、npm

## 仓库结构
- `blog-backend/` – Spring Boot 服务（REST API、MyBatis-Plus、Redis 配置）
- `blog-frontend/` – Vue 3 单页应用（Vite 开发服务器，`/api` 代理）

## 后端启动 (`blog-backend`)
1) 确保 MySQL 已运行，导入数据库：
   ```sql
   -- 来自 blog-backend/db/schema.sql
   source db/schema.sql;
   ```
2) 在 `src/main/resources/application.yml` 中配置数据源/Redis（默认：MySQL `localhost:3306`，库 `blog_db`，用户 `root`，密码 `123456`；Redis `localhost:6379`）。
3) 开发运行：`mvn spring-boot:run`
4) 构建可执行包：`mvn clean package`
5) 服务默认监听 `http://localhost:8080`。Swagger 已在配置中开启；Springfox/Knife4j 依赖默认注释掉。

## 前端启动 (`blog-frontend`)
1) 安装依赖：`npm install`
2) 启动开发服务器：`npm run dev`（Vite 运行在 `http://localhost:5173`，`/api` 代理到 `http://localhost:8080`）
3) 生产构建：`npm run build`；预览：`npm run serve`

## API 快速参考
- 认证：`POST /api/auth/register`（请求体为用户），`POST /api/auth/login`（用户名/密码）。密码在服务端做 MD5（仅示例）。
- 用户：`GET /api/users/{id}`
- 文章：`POST /api/articles`，`PUT /api/articles/{id}`，`DELETE /api/articles/{id}`（需要 `X-User-Id` 且匹配作者或管理员），`GET /api/articles/{id}`，`GET /api/articles/page?pageNum=&pageSize=`，`GET /api/articles/pageByCategory?pageNum=&pageSize=&categoryId=`
- 分类：`POST /api/categories`，`PUT /api/categories/{id}`，`DELETE /api/categories/{id}`，`GET /api/categories`
- 评论：`POST /api/comments`，`PUT /api/comments/{id}`，`DELETE /api/comments/{id}`（可携带 `X-User-Id`），`GET /api/comments/by-article/{articleId}?page=&size=`
- 返回格式：`{ code, message, data }`（成功码 `200`）

## 数据模型（来自 `db/schema.sql`）
表：`user`（role 0=普通用户，1=管理员）、`category`、`article`（外键到用户/分类）、`comment`（外键到文章，`parent_id` 支持回复）。均使用 `utf8mb4`，含软删除标记。

## 认证与请求头
- 无 JWT/Session；前端把登录成功的用户存到 `localStorage`，并在评论相关请求和删除文章时注入 `X-User-Id`（参见 `blog-frontend/src/utils/api.js`）。
- 如需管理员，手动将 `user` 表的 `role` 设置为 `1`。

## 已知限制 / TODO
- 密码哈希使用 MD5（仅示例）；生产需改为加盐强哈希并加 Token 鉴权。
- Redis 配置存在，但当前未接入缓存实现。
- 暂无 Docker/部署文件；如需可补充。
- 测试较少，发布前需补充服务/控制器测试。
