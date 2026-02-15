<template>
    <div class="global-shell" :style="baseStyle">
        <div class="bg-controls" v-if="showBgControls">
            <button class="pill" type="button" @click="pickBackground">导入背景图</button>
            <button v-if="hasCustomBackground" class="pill ghost" type="button" @click="resetBackground">重置背景</button>
            <span v-if="bgLoading" class="bg-tip">背景加载中...</span>
            <span v-if="toast" class="bg-tip">{{ toast }}</span>
            <input ref="fileInput" class="file-input" type="file" accept="image/png,image/jpeg,image/webp"
                @change="handleFileChange" />
        </div>

        <div class="content-wrap">
            <GlassSurface class="content-glass" padding="24px 16px" :radius="'16px'" :blur="24"
                :backgroundOpacity="0.16" :borderOpacity="0.3">
                <slot />
            </GlassSurface>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import GlassSurface from './GlassSurface.vue'

const BG_KEY = 'blog_bg'
const bgImage = ref('')
const bgLoading = ref(false)
const toast = ref('')
const toastTimer = ref(null)
const fileInput = ref(null)
const route = useRoute()

const hasCustomBackground = computed(() => !!bgImage.value)
const showBgControls = computed(() => route.path === '/')

const baseStyle = computed(() => ({
    backgroundColor: '#f8f9fa',
    backgroundImage: bgImage.value ? `url(${bgImage.value})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh'
}))

const showToast = msg => {
    toast.value = msg
    if (toastTimer.value) clearTimeout(toastTimer.value)
    toastTimer.value = setTimeout(() => {
        toast.value = ''
    }, 2000)
}

const pickBackground = () => {
    fileInput.value?.click()
}

const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (!file.type.startsWith('image/')) {
        showToast('请选择 jpg/png/webp 图片')
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        showToast('图片过大，请选择 5MB 以内')
        return
    }
    const reader = new FileReader()
    bgLoading.value = true
    reader.onload = () => {
        const result = reader.result
        bgImage.value = result
        localStorage.setItem(BG_KEY, result)
        bgLoading.value = false
        showToast('背景设置成功')
    }
    reader.onerror = () => {
        bgLoading.value = false
        showToast('图片读取失败，请重试')
    }
    reader.readAsDataURL(file)
}

const resetBackground = () => {
    bgImage.value = ''
    localStorage.removeItem(BG_KEY)
    showToast('已恢复默认背景')
}

onMounted(() => {
    const cached = localStorage.getItem(BG_KEY)
    if (cached) bgImage.value = cached
})

onUnmounted(() => {
    if (toastTimer.value) clearTimeout(toastTimer.value)
})
</script>

<style scoped>
.global-shell {
    min-height: 100vh;
    position: relative;
}

.bg-controls {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
    padding: 12px 16px;
    z-index: 10;
}

.content-wrap {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
}

.content-glass {
    max-width: 900px;
    margin: 0 auto;
}

.pill {
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(17, 24, 39, 0.9);
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    border: 1px solid #111827;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    cursor: pointer;
}

.pill.ghost {
    background: rgba(255, 255, 255, 0.6);
    color: #111827;
    border: 1px solid #111827;
}

.file-input {
    display: none;
}

.bg-tip {
    color: #1f2937;
    font-size: 12px;
}

@media (max-width: 640px) {
    .bg-controls {
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .content-wrap {
        padding: 12px;
    }
}
</style>
