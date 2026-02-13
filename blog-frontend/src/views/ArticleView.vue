<template>
  <div>
    <button @click="$router.back()">Back</button>
    <h1>{{ article.title }}</h1>
    <div v-html="article.content"></div>
  </div>
</template>

<script>
import api from '../utils/api'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const article = ref({})
    const route = useRoute()
    const load = async () => {
      const id = route.params.id
      const res = await api.get(`/articles/${id}`)
      const data = res.data.data || res.data
      article.value = data
    }
    onMounted(load)
    return { article }
  }
}
</script>
