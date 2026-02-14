<template>
  <div class="page">
    <header class="top">
      <button class="back" @click="goBack">返回</button>
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
        <textarea
          v-model="commentText"
          placeholder="写下你的看法..."
          rows="3"
          required
        ></textarea>
        <div class="form-actions">
          <button type="submit" :disabled="commentSubmitting">{{ commentSubmitting ? '提交中...' : '发布评论' }}</button>
        </div>
      </form>

      <div v-if="commentsLoading" class="state">评论加载中...</div>
      <div v-else-if="commentsError" class="state error">{{ commentsError }}</div>
      <div v-else>
        <div v-if="!commentsTree.length" class="state">还没有评论，来占个沙发吧！</div>
        <div v-else class="comment-list">
          <CommentItem
            v-for="item in commentsTree"
            :key="item.id"
            :item="item"
            @reply="setReplyTarget"
          />
        </div>

        <div class="pager" v-if="commentPages > 1">
          <button :disabled="commentPage === 1" @click="changeCommentPage(commentPage - 1)">上一页</button>
          <span>第 {{ commentPage }} / {{ commentPages }} 页</span>
          <button :disabled="commentPage === commentPages" @click="changeCommentPage(commentPage + 1)">下一页</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticle, postComment } from '../utils/api'
import api from '../utils/api'

const route = useRoute()
const router = useRouter()

const article = ref({})
const articleLoading = ref(false)
const articleError = ref('')

const comments = ref([])
const commentsTotal = ref(0)
const commentPage = ref(1)
const commentSize = 10
const commentPages = ref(1)
const commentsLoading = ref(false)
const commentsError = ref('')
const commentText = ref('')
const replyTo = ref(null)
const commentSubmitting = ref(false)

const CommentItem = defineComponent({
  name: 'CommentItem',
  props: { item: { type: Object, required: true } },
  emits: ['reply'],
  methods: {
    handleReply() {
      this.$emit('reply', this.item)
    }
  },
  template: `
    <div class="comment-item">
      <div class="comment-header">
        <span class="author">{{ item.username || '匿名' }}</span>
        <span class="time">{{ item.createTime || item.createdAt || '' }}</span>
      </div>
      <p class="comment-body">{{ item.content }}</p>
      <div class="comment-actions">
        <button @click="handleReply">回复</button>
      </div>
      <div v-if="item.children && item.children.length" class="comment-children">
        <CommentItem
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          @reply="$emit('reply', $event)"
        />
      </div>
    </div>
  `
})

const formatDate = val => {
  if (!val) return '未知时间'
  const d = new Date(val)
  return isNaN(d.getTime()) ? val : d.toLocaleString()
}

const goBack = () => router.back()

const fetchArticle = async () => {
  articleLoading.value = true
  articleError.value = ''
  try {
    const data = await getArticle(route.params.id)
    article.value = data
  } catch (err) {
    articleError.value = err.message || '文章加载失败'
  } finally {
    articleLoading.value = false
  }
}

const buildTree = flat => {
  const map = new Map()
  const roots = []
  flat.forEach(item => map.set(item.id, { ...item, children: [] }))
  map.forEach(node => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId).children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

const fetchComments = async (page = 1) => {
  commentsLoading.value = true
  commentsError.value = ''
  try {
    const data = await api.get(`/comments/by-article/${route.params.id}?page=${page}&size=${commentSize}`)
    const list = data.records || data.list || data || []
    comments.value = list
    commentsTotal.value = data.total || list.length
    commentPages.value = data.pages || Math.max(1, Math.ceil(commentsTotal.value / commentSize))
    commentPage.value = page
  } catch (err) {
    commentsError.value = err.message || '评论加载失败'
  } finally {
    commentsLoading.value = false
  }
}

const commentsTree = computed(() => buildTree(comments.value))

const setReplyTarget = item => {
  replyTo.value = item
  commentText.value = `@${item.username || '用户'} `
}

const submitComment = async () => {
  if (!commentText.value.trim()) return
  commentSubmitting.value = true
  try {
    await postComment({
      articleId: route.params.id,
      content: commentText.value.trim(),
      parentId: replyTo.value?.id || null
    })
    commentText.value = ''
    replyTo.value = null
    fetchComments(commentPage.value)
  } catch (err) {
    alert(err.message || '评论提交失败')
  } finally {
    commentSubmitting.value = false
  }
}

const changeCommentPage = p => {
  if (p < 1 || p > commentPages.value) return
  fetchComments(p)
}

onMounted(() => {
  fetchArticle()
  fetchComments(1)
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

.back {
  align-self: flex-start;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
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

.comment-actions button {
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
}

.comment-children {
  margin-top: 8px;
  padding-left: 14px;
  border-left: 2px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
