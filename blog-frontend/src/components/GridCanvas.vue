<template>
  <canvas ref="canvasRef" class="grid-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  speed: { type: Number, default: 0.3 },
  squareSize: { type: Number, default: 60 },
  borderColor: { type: String, default: 'rgba(255, 255, 255, 0.03)' },
  direction: { type: String, default: 'diagonal' }
})

const canvasRef = ref(null)
let animationFrame = null
let gridOffset = { x: 0, y: 0 }

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const w = canvas.width / dpr
  const h = canvas.height / dpr

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const size = props.squareSize
  const startX = Math.floor(gridOffset.x / size) * size
  const startY = Math.floor(gridOffset.y / size) * size

  ctx.strokeStyle = props.borderColor
  ctx.lineWidth = 0.5

  for (let x = startX - size; x < w + size; x += size) {
    const drawX = Math.round(x - (gridOffset.x % size))
    ctx.beginPath()
    ctx.moveTo(drawX, 0)
    ctx.lineTo(drawX, h)
    ctx.stroke()
  }

  for (let y = startY - size; y < h + size; y += size) {
    const drawY = Math.round(y - (gridOffset.y % size))
    ctx.beginPath()
    ctx.moveTo(0, drawY)
    ctx.lineTo(w, drawY)
    ctx.stroke()
  }

  // Vignette
  const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.sqrt(w * w + h * h) / 2)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
}

function update() {
  const s = props.speed
  if (props.direction === 'diagonal') {
    gridOffset.x = (gridOffset.x + s + props.squareSize) % props.squareSize
    gridOffset.y = (gridOffset.y + s + props.squareSize) % props.squareSize
  } else if (props.direction === 'right') {
    gridOffset.x = (gridOffset.x + s + props.squareSize) % props.squareSize
  } else if (props.direction === 'down') {
    gridOffset.y = (gridOffset.y + s + props.squareSize) % props.squareSize
  }
  draw()
  animationFrame = requestAnimationFrame(update)
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  update()
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.grid-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
