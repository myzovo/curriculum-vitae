<template>
  <div class="page">
    <header class="top">
      <h1>分类管理</h1>
      <button class="primary" @click="openModal()">新增分类</button>
    </header>

    <div v-if="loading" class="state">加载中...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else class="list">
      <div v-for="c in categories" :key="c.id" class="item">
        <div>
          <p class="name">{{ c.name }}</p>
          <p class="desc">{{ c.description || '暂无描述' }}</p>
        </div>
        <div class="actions">
          <button @click="openModal(c)">编辑</button>
          <button class="danger" @click="remove(c)">删除</button>
        </div>
      </div>
      <div v-if="!categories.length" class="state">暂无分类</div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="dialog">
        <h2>{{ editing?.id ? '编辑分类' : '新增分类' }}</h2>
        <form class="form" @submit.prevent="save">
          <label>
            名称
            <input v-model="form.name" required placeholder="请输入分类名称" />
          </label>
          <label>
            描述（可选）
            <textarea v-model="form.description" rows="3" placeholder="描述"></textarea>
          </label>
          <div class="dialog-actions">
            <button type="button" @click="closeModal">取消</button>
            <button type="submit" class="primary" :disabled="saving">{{ saving ? '保存中...' : '保存' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCategories } from '../utils/api'
import api from '../utils/api'

const categories = ref([])
const loading = ref(false)
const error = ref('')

const showModal = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = reactive({ name: '', description: '' })

const fetchList = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await getCategories()
    categories.value = data || []
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

const openModal = item => {
  editing.value = item || null
  form.name = item?.name || ''
  form.description = item?.description || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editing.value = null
}

const save = async () => {
  if (!form.name.trim()) return
  saving.value = true
  try {
    if (editing.value?.id) {
      await api.put(`/categories/${editing.value.id}`, { ...form })
    } else {
      await api.post('/categories', { ...form })
    }
    closeModal()
    fetchList()
  } catch (e) {
    alert(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const remove = async item => {
  if (!item?.id) return
  const ok = window.confirm(`确认删除分类 “${item.name}” 吗？`)
  if (!ok) return
  try {
    await api.delete(`/categories/${item.id}`)
    fetchList()
  } catch (e) {
    alert(e.message || '删除失败')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.primary {
  background: #111827;
  color: #fff;
  border: 1px solid #111827;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}

.name {
  margin: 0 0 4px;
  font-weight: 600;
}

.desc {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.actions button {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
}

.actions .danger {
  color: #b91c1c;
  border-color: #fca5a5;
}

.state {
  text-align: center;
  color: #6b7280;
  padding: 12px 0;
}

.state.error { color: #b91c1c; }

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.dialog {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

input, textarea {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

@media (max-width: 640px) {
  .item { flex-direction: column; }
  .actions { justify-content: flex-start; }
}
</style>
