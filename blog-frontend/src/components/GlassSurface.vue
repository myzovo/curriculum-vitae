<template>
    <section class="glass-surface" :style="{
        '--glass-bg': `rgba(255, 255, 255, ${backgroundOpacity})`,
        '--glass-blur': `${blur}px`,
        '--glass-border': `rgba(255, 255, 255, ${borderOpacity})`,
        '--glass-shadow': shadow,
        '--glass-radius': radius,
        padding
    }">
        <slot />
    </section>
</template>

<script setup>
import { toRefs } from 'vue'

// Reusable glass-morphism surface.
// Defaults meet: bg 10-20% white, blur 20-40px, border 1px @30% white.
const props = defineProps({
    backgroundOpacity: { type: Number, default: 0.14 }, // 14% white
    blur: { type: Number, default: 24 }, // px
    borderOpacity: { type: Number, default: 0.3 },
    padding: { type: String, default: '20px' },
    radius: { type: String, default: '12px' },
    shadow: { type: String, default: '0 10px 30px rgba(0, 0, 0, 0.08)' }
})

const { padding, radius, backgroundOpacity, blur, borderOpacity, shadow } = toRefs(props)
</script>

<style scoped>
.glass-surface {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    border-radius: var(--glass-radius, 12px);
    color: #111827;
}

/* Optional: subtle inner highlight */
.glass-surface::after {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.12);
}
</style>
