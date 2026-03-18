<template>
    <div class="page">
        <header class="top">
            <div class="top-actions">
                <button class="back" @click="goBack">返回</button>
                <button class="pill ghost" @click="goHome">返回首页</button>
                <button v-if="canDeleteArticle" class="danger" :disabled="articleDeleting" @click="removeArticle">
                    {{ articleDeleting ? '删除中...' : '删除' }}
                </button>
            </div>
            <div class="meta">
                <span class="cat">{{ article.categoryName || '未分类' }}</span>
                <span class="dot">•</span>
                <span>{{ formatDate(article.createTime || article.createdAt) }}</span>
                <span class="dot">•</span>
                <span>评论 {{ commentsTotal }}</span>
            </div>
            <h1 class="title">{{ article.title || '加载中...' }}</h1>
        </header>

        <section v-if="articleLoading" class="state">文章加载中...</section>
        <section v-else-if="articleError" class="state error">{{ articleError }}</section>
        <section v-else class="content" v-html="article.content"></section>

        <section class="comments">
            <h2>评论</h2>
            <form class="comment-form" @submit.prevent="submitComment">
                <textarea v-model="commentText" placeholder="写下你的看法..." rows="3" required></textarea>
                <div class="form-actions">
                    <button type="submit" :disabled="commentSubmitting">{{ commentSubmitting ? '发布中...' : '发布评论'
                    }}</button>
                </div>
            </form>

            <div v-if="commentsLoading" class="state">加载中...</div>
            <div v-else-if="commentsError" class="state error">{{ commentsError }}</div>
            <div v-else>
                <div v-if="!commentsList.length" class="state">暂无评论</div>
                <div v-else class="comment-list">
                    <div v-for="item in commentsList" :key="item.id" class="comment-item">
                        <div class="comment-header">
                            <span class="author">{{ item.user?.username || item.username || '匿名' }}</span>
                            <span class="time">{{ formatDateTime(item.createdAt) }}</span>
                        </div>

                        <div v-if="editingId === item.id" class="edit-box">
                            <textarea v-model="editText" rows="3" class="comment-input" placeholder="修改评论内容"></textarea>
                            <div class="comment-actions">
                                <button type="button" :disabled="commentSaving" @click="saveEdit(item)">
                                    {{ commentSaving ? '保存中...' : '保存' }}
                                </button>
                                <button type="button" class="ghost" :disabled="commentSaving" @click="cancelEdit">
                                    取消
                                </button>
                            </div>
                        </div>

                        <p v-else class="comment-body">{{ item.content }}</p>

                        <div v-if="canManage(item) && editingId !== item.id" class="comment-actions">
                            <button type="button" :disabled="commentDeletingId === item.id" @click="startEdit(item)">
                                编辑
                            </button>
                            <button type="button" class="danger" :disabled="commentDeletingId === item.id"
                                @click="removeComment(item)">
                                {{ commentDeletingId === item.id ? '删除中...' : '删除' }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="pager" v-if="commentPages > 1">
                    <button :disabled="commentPage === 1" @click="changeCommentPage(commentPage - 1)">上一页</button>
                    <span>第 {{ commentPage }} / {{ commentPages }} 页</span>
                    <button :disabled="commentPage === commentPages"
                        @click="changeCommentPage(commentPage + 1)">下一页</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticle, postComment, updateComment, deleteComment, deleteArticle } from '../utils/api'
import api from '../utils/api'

const route = useRoute()
const router = useRouter()

const article = ref({})
const articleLoading = ref(false)
const articleError = ref('')
const articleDeleting = ref(false)

const commentsList = ref([])
const commentsTotal = ref(0)
const commentPage = ref(1)
const commentSize = 10
const commentPages = ref(1)
const commentsLoading = ref(false)
const commentsError = ref('')
const commentText = ref('')
const commentSubmitting = ref(false)
const currentUser = ref(null)
const editingId = ref(null)
const editText = ref('')
const commentSaving = ref(false)
const commentDeletingId = ref(null)

const formatDate = val => {
    if (!val) return '未知时间'
    const d = new Date(val)
    return Number.isNaN(d.getTime()) ? val : d.toLocaleString()
}

// 标准化时间展示 YYYY-MM-DD HH:mm:ss
const formatDateTime = val => {
    if (!val) return '未知时间'
    const d = new Date(val)
    if (Number.isNaN(d.getTime())) return val
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const goBack = () => router.back()
const goHome = () => router.push('/')

const syncUser = () => {
    const raw = localStorage.getItem('user')
    currentUser.value = raw ? JSON.parse(raw) : null
}

const canDeleteArticle = computed(() => {
    const user = currentUser.value
    if (!user) return false
    const authorId = article.value?.authorId ?? article.value?.userId ?? article.value?.user?.id
    return Number(user.id) === Number(authorId) || Number(user.role) === 1
})

const canManage = item => {
    const user = currentUser.value
    if (!user || !item) return false
    const ownerId = item.userId ?? item.user?.id ?? item.user?.userId
    return Number(user.id) === Number(ownerId) || Number(user.role) === 1
}

const getErrorMessage = err => {
    const status = err?.response?.status
    if (status === 401) return '请先登录后再操作'
    if (status === 403) return '无权限操作该评论'
    if (status === 404) return '该评论已被删除'
    if (status === 500) return '服务器错误，请稍后重试'
    return err?.message || '操作失败，请稍后重试'
}

const fetchArticle = async () => {
    articleLoading.value = true
    articleError.value = ''
    try {
        article.value = await getArticle(route.params.id)
    } catch (err) {
        articleError.value = err.message || '文章加载失败'
    } finally {
        articleLoading.value = false
    }
}

const removeArticle = async () => {
    if (!currentUser.value?.id) {
        alert('请先登录后再操作')
        return
    }
    const ok = window.confirm('确定删除该文章吗？')
    if (!ok) return
    articleDeleting.value = true
    try {
        await deleteArticle(route.params.id)
        router.replace('/')
    } catch (err) {
        alert(getErrorMessage(err))
    } finally {
        articleDeleting.value = false
    }
}

// 将后端字段统一为前端需要的结构
const normalizeComments = list =>
    (list || []).map(item => ({
        ...item,
        id: item.id ?? item.commentId ?? item.comment_id,
        createdAt: item.createdAt || item.createTime || item.created_at,
        user: item.user || item.author || null,
        username: item.username || item.userName
    }))

// 获取评论列表
const fetchComments = async (page = 1) => {
    commentsLoading.value = true
    commentsError.value = ''
    try {
        const data = await api.get(`/comments/by-article/${route.params.id}?page=${page}&size=${commentSize}`)
        const list = normalizeComments(data.records || data.list || data || [])
        commentsList.value = list
        commentsTotal.value = data.total || list.length
        commentPages.value = data.pages || Math.max(1, Math.ceil(commentsTotal.value / commentSize))
        commentPage.value = page
    } catch (err) {
        commentsError.value = err.message || '评论加载失败'
    } finally {
        commentsLoading.value = false
    }
}

// 提交评论后刷新列表
const submitComment = async () => {
    if (!currentUser.value?.id) {
        alert('请先登录后再操作')
        return
    }
    if (!commentText.value.trim()) return
    commentSubmitting.value = true
    try {
        const payload = {
            articleId: route.params.id,
            content: commentText.value.trim()
        }
        await postComment(payload)
        commentText.value = ''
        await fetchComments(commentPage.value)
    } catch (err) {
        alert(getErrorMessage(err) || '评论提交失败')
    } finally {
        commentSubmitting.value = false
    }
}

const startEdit = item => {
    if (!currentUser.value?.id) {
        alert('请先登录后再操作')
        return
    }
    editingId.value = item.id
    editText.value = item.content || ''
}

const cancelEdit = () => {
    editingId.value = null
    editText.value = ''
}

const saveEdit = async item => {
    if (!currentUser.value?.id) {
        alert('请先登录后再操作')
        return
    }
    if (!editText.value.trim()) return
    commentSaving.value = true
    try {
        await updateComment(item.id, { content: editText.value.trim() })
        cancelEdit()
        await fetchComments(commentPage.value)
    } catch (err) {
        alert(getErrorMessage(err))
    } finally {
        commentSaving.value = false
    }
}

const removeComment = async item => {
    if (!currentUser.value?.id) {
        alert('请先登录后再操作')
        return
    }
    const ok = window.confirm('确定删除该评论吗？')
    if (!ok) return
    commentDeletingId.value = item.id
    try {
        await deleteComment(item.id)
        await fetchComments(commentPage.value)
    } catch (err) {
        alert(getErrorMessage(err))
    } finally {
        commentDeletingId.value = null
    }
}

const changeCommentPage = p => {
    if (p < 1 || p > commentPages.value) return
    fetchComments(p)
}

onMounted(() => {
    fetchArticle()
    fetchComments(1)
    syncUser()
    window.addEventListener('storage', syncUser)
})

onUnmounted(() => {
    window.removeEventListener('storage', syncUser)
})
</script>

<style scoped>
.page {
    max-width: 900px;
    margin: 0 auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.top {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.top-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
}

.back {
    align-self: flex-start;
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
}

.pill {
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(17, 24, 39, 0.9);
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    border: 1px solid #111827;
}

.pill.ghost {
    background: rgba(255, 255, 255, 0.8);
    color: #111827;
    border: 1px solid #111827;
}

.danger {
    padding: 6px 10px;
    border: 1px solid #111827;
    border-radius: 8px;
    background: #111827;
    color: #fff;
    cursor: pointer;
}

.danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.meta {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    color: #6b7280;
    font-size: 13px;
}

.cat {
    background: #f3f4f6;
    padding: 2px 8px;
    border-radius: 999px;
}

.title {
    margin: 0;
    font-size: 26px;
    line-height: 1.3;
}

.content {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px;
    background: #fff;
    line-height: 1.6;
}

.comments {
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
}

.comment-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.comment-form textarea {
    width: 100%;
    resize: vertical;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
}

.comment-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
}

.comment-actions button {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #111827;
    background: #111827;
    color: #fff;
    cursor: pointer;
}

.comment-actions button.ghost {
    background: rgba(255, 255, 255, 0.8);
    color: #111827;
}

.comment-actions button.danger {
    border-color: #111827;
    background: #111827;
    color: #fff;
}

.comment-actions button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.comment-input {
    width: 100%;
    resize: vertical;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
}

.form-actions button {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #111827;
    background: #111827;
    color: #fff;
    cursor: pointer;
}

.state {
    padding: 10px 0;
    color: #6b7280;
}

.state.error {
    color: #b91c1c;
}

.comment-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.comment-item {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 12px;
    background: #fff;
}

.comment-header {
    display: flex;
    gap: 8px;
    color: #6b7280;
    font-size: 13px;
}

.comment-body {
    margin: 6px 0;
    color: #111827;
}

.pager {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 12px;
}

.pager button {
    padding: 6px 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
}

@media (max-width: 640px) {
    .page {
        padding: 12px;
    }

    .title {
        font-size: 22px;
    }
}
</style>
