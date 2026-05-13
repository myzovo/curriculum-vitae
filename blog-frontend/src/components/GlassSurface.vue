<template>
  <section
    class="glass-surface"
    :style="{
      '--glass-bg': `rgba(255, 255, 255, ${backgroundOpacity})`,
      '--glass-blur': `${blur}px`,
      '--glass-border': `rgba(255, 255, 255, ${borderOpacity})`,
      '--glass-shadow': shadow,
      '--glass-radius': radius,
      padding
    }"
  >
    <slot />
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  backgroundOpacity: { type: Number, default: 0.04 },
  blur: { type: Number, default: 20 },
  borderOpacity: { type: Number, default: 0.1 },
  padding: { type: String, default: '24px' },
  radius: { type: String, default: '8px' },
  shadow: { type: String, default: '0 8px 32px rgba(0, 0, 0, 0.3)' }
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
  border-radius: var(--glass-radius, 8px);
  color: #fff;
}

.glass-surface::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  pointer-events: none;
  border: 1px solid hsla(0, 0%, 100%, 0.05);
}
</style>
