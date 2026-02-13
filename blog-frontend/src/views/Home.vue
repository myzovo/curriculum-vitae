<template>
  <div>
    <h1>Articles</h1>
    <ul>
      <li v-for="a in articles" :key="a.id">
        <router-link :to="`/article/${a.id}`">{{ a.title }}</router-link>
      </li>
    </ul>
    <button v-if="page < totalPages" @click="loadMore">Load more</button>
  </div>
</template>

<script>
import api from '../utils/api'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const articles = ref([])
    const page = ref(1)
    const pageSize = 10
    const totalPages = ref(1)

    const load = async () => {
      const res = await api.get(`/articles/page?pageNum=${page.value}&pageSize=${pageSize}`)
      // when using R wrapper, data may be in res.data.data
      const data = res.data.data || res.data
      articles.value = articles.value.concat(data.records || data)
      totalPages.value = data.pages || 1
    }

    const loadMore = () => { page.value++; load() }

    onMounted(load)
    return { articles, loadMore, page, totalPages }
  }
}
</script>
