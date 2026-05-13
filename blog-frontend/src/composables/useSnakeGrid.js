/**
 * Snake Grid Animation - adapted from HomePage-master GridAnimation class
 * Vue 3 composable for interactive snake-on-grid canvas background
 */

const isPhone = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent)

class GridAnimation {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.options = {
      direction: options.direction || 'right',
      speed: options.speed || 1,
      borderColor: options.borderColor || 'rgba(255, 255, 255, 0.05)',
      squareSize: options.squareSize || 40,
      hoverFillColor: options.hoverFillColor || 'rgba(255, 255, 255, 0.6)',
      hoverShadowColor: options.hoverShadowColor || 'rgba(255, 255, 255, 0.3)',
      transitionDuration: options.transitionDuration || 200,
      trailDuration: options.trailDuration || 1000,
      specialBlockColor: options.specialBlockColor || 'rgba(255, 100, 100, 0.8)',
      specialHoverColor: options.specialHoverColor || 'rgba(100, 255, 100, 0.8)',
      snakeHeadColor: options.snakeHeadColor || 'rgba(255, 255, 255, 0.9)',
      snakeTailColor: options.snakeTailColor || 'rgba(100, 100, 255, 0.3)',
      snakeColorDecay: options.snakeColorDecay || 0.7,
      touchSensitivity: options.touchSensitivity || 1.0,
      vibrationEnabled: options.vibrationEnabled || false,
      ...options,
    }

    this.gridOffset = { x: 0, y: 0 }
    this.hoveredSquare = null
    this.animationFrame = null
    this.currentOpacity = 0
    this.targetOpacity = 0
    this.lastTimestamp = 0
    this.trailSquares = new Map()
    this.specialBlock = null
    this.isSpecialBlockHovered = false
    this.snakeBody = []
    this.shouldGrow = false
    this._boundHandlers = {}
  }

  init() {
    this.resizeCanvas()
    this.setupEventListeners()

    if (isPhone) {
      this.optimizeForMobile()
    }

    this.animate()

    if (isPhone) {
      setTimeout(() => this.createSpecialBlock(), 500)
    } else {
      this.createSpecialBlock()
    }

    this._boundHandlers.visibility = () => this.handleVisibilityChange()
    document.addEventListener('visibilitychange', this._boundHandlers.visibility)
  }

  optimizeForMobile() {
    const ctx = this.canvas.getContext('2d')
    const startTime = performance.now()
    for (let i = 0; i < 1000; i++) ctx.fillRect(0, 0, 1, 1)
    const performanceScore = performance.now() - startTime

    if (performanceScore > 10) {
      this.options.squareSize = Math.max(this.options.squareSize * 1.5, 60)
      this.options.speed *= 0.7
      this.options.trailDuration *= 0.5
    } else if (performanceScore > 5) {
      this.options.squareSize = Math.max(this.options.squareSize * 1.2, 50)
      this.options.speed *= 0.8
    }
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1
    const displayWidth = this.canvas.offsetWidth
    const displayHeight = this.canvas.offsetHeight
    this.canvas.width = Math.floor(displayWidth * dpr)
    this.canvas.height = Math.floor(displayHeight * dpr)
    this.canvas.style.width = `${displayWidth}px`
    this.canvas.style.height = `${displayHeight}px`
    this.ctx.scale(dpr, dpr)
  }

  setupEventListeners() {
    this._boundHandlers.resize = () => this.resizeCanvas()
    this._boundHandlers.mousemove = (e) => this.handleMouseMove(e)
    this._boundHandlers.mouseleave = () => this.handleMouseLeave()

    window.addEventListener('resize', this._boundHandlers.resize)
    this.canvas.addEventListener('mousemove', this._boundHandlers.mousemove)
    this.canvas.addEventListener('mouseleave', this._boundHandlers.mouseleave)

    if (isPhone) {
      this.setupTouchEvents()
    }
  }

  setupTouchEvents() {
    let touchStartPos = null
    let isTouching = false
    let lastTouchTime = 0
    let touchCount = 0

    this._boundHandlers.touchstart = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastTouchTime < 16) return
      lastTouchTime = now

      if (e.touches.length === 1) {
        const touch = e.touches[0]
        const rect = this.canvas.getBoundingClientRect()
        touchStartPos = { x: touch.clientX - rect.left, y: touch.clientY - rect.top, time: now }
        isTouching = true
        touchCount++
        this.handleTouchMove(touchStartPos.x, touchStartPos.y)
        if (!this.hoveredSquare) {
          this.targetOpacity = 0.8 * this.options.touchSensitivity
        }
        if (this.options.vibrationEnabled && navigator.vibrate) navigator.vibrate(10)
      }
    }

    this._boundHandlers.touchmove = (e) => {
      e.preventDefault()
      if (isTouching && e.touches.length === 1) {
        const touch = e.touches[0]
        const rect = this.canvas.getBoundingClientRect()
        this.handleTouchMove(touch.clientX - rect.left, touch.clientY - rect.top)
      }
    }

    this._boundHandlers.touchend = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (touchStartPos && now - touchStartPos.time < 300) {
        touchCount++
        if (touchCount === 2) {
          this.resetSnake()
          touchCount = 0
          if (this.options.vibrationEnabled && navigator.vibrate) navigator.vibrate([50, 50, 50])
          return
        }
      } else {
        touchCount = 0
      }
      isTouching = false
      touchStartPos = null
      this.handleTouchEnd()
    }

    this._boundHandlers.touchcancel = (e) => {
      e.preventDefault()
      isTouching = false
      touchStartPos = null
    }

    this.canvas.addEventListener('touchstart', this._boundHandlers.touchstart, { passive: false })
    this.canvas.addEventListener('touchmove', this._boundHandlers.touchmove, { passive: false })
    this.canvas.addEventListener('touchend', this._boundHandlers.touchend, { passive: false })
    this.canvas.addEventListener('touchcancel', this._boundHandlers.touchcancel, { passive: false })
  }

  handleTouchMove(x, y) {
    const startX = Math.floor(this.gridOffset.x / this.options.squareSize) * this.options.squareSize
    const startY = Math.floor(this.gridOffset.y / this.options.squareSize) * this.options.squareSize
    const hoveredSquareX = Math.floor((x + this.gridOffset.x - startX) / this.options.squareSize)
    const hoveredSquareY = Math.floor((y + this.gridOffset.y - startY) / this.options.squareSize)

    if (this.hoveredSquare?.x !== hoveredSquareX || this.hoveredSquare?.y !== hoveredSquareY) {
      if (this.hoveredSquare) {
        this.snakeBody.unshift({ x: this.hoveredSquare.x, y: this.hoveredSquare.y })
        if (!this.shouldGrow && this.snakeBody.length > 0) this.snakeBody.pop()
        this.shouldGrow = false
      }
      this.hoveredSquare = { x: hoveredSquareX, y: hoveredSquareY }
      this.targetOpacity = 0.8 * this.options.touchSensitivity

      if (this.specialBlock && hoveredSquareX === this.specialBlock.x && hoveredSquareY === this.specialBlock.y) {
        this.shouldGrow = true
        this.createSpecialBlock()
        if (this.options.vibrationEnabled && navigator.vibrate) navigator.vibrate(100)
      }
    }
  }

  handleTouchEnd() {
    if (this.hoveredSquare) {
      this.snakeBody.unshift({ x: this.hoveredSquare.x, y: this.hoveredSquare.y })
      if (!this.shouldGrow && this.snakeBody.length > 0) this.snakeBody.pop()
      this.shouldGrow = false
      this.targetOpacity = 0.4
    }
  }

  resetSnake() {
    this.snakeBody = []
    this.hoveredSquare = null
    this.targetOpacity = 0
    this.trailSquares.clear()
    this.createSpecialBlock()
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    const startX = Math.floor(this.gridOffset.x / this.options.squareSize) * this.options.squareSize
    const startY = Math.floor(this.gridOffset.y / this.options.squareSize) * this.options.squareSize
    const hoveredSquareX = Math.floor((mouseX + this.gridOffset.x - startX) / this.options.squareSize)
    const hoveredSquareY = Math.floor((mouseY + this.gridOffset.y - startY) / this.options.squareSize)

    if (this.hoveredSquare?.x !== hoveredSquareX || this.hoveredSquare?.y !== hoveredSquareY) {
      if (this.hoveredSquare) {
        this.snakeBody.unshift({ x: this.hoveredSquare.x, y: this.hoveredSquare.y })
        if (!this.shouldGrow && this.snakeBody.length > 0) this.snakeBody.pop()
        this.shouldGrow = false
      }
      this.hoveredSquare = { x: hoveredSquareX, y: hoveredSquareY }
      this.targetOpacity = 0.6

      if (this.specialBlock && hoveredSquareX === this.specialBlock.x && hoveredSquareY === this.specialBlock.y) {
        this.shouldGrow = true
        this.createSpecialBlock()
      }
    }
  }

  handleMouseLeave() {
    if (this.hoveredSquare) {
      const startX = Math.floor(this.gridOffset.x / this.options.squareSize) * this.options.squareSize
      const startY = Math.floor(this.gridOffset.y / this.options.squareSize) * this.options.squareSize
      const key = `${this.hoveredSquare.x},${this.hoveredSquare.y}`
      this.trailSquares.set(key, {
        x: this.hoveredSquare.x * this.options.squareSize + startX,
        y: this.hoveredSquare.y * this.options.squareSize + startY,
        opacity: 0.6,
      })
    }
    this.hoveredSquare = null
    this.targetOpacity = 0
  }

  createSpecialBlock() {
    const dpr = window.devicePixelRatio || 1
    const numSquaresX = Math.ceil(this.canvas.width / dpr / this.options.squareSize)
    const numSquaresY = Math.ceil(this.canvas.height / dpr / this.options.squareSize)

    let newX, newY
    do {
      newX = 1 + Math.floor(Math.random() * (numSquaresX - 2))
      newY = 1 + Math.floor(Math.random() * (numSquaresY - 2))
    } while (this.snakeBody.some((seg) => seg.x === newX && seg.y === newY))

    this.specialBlock = { x: newX, y: newY, color: this.options.specialBlockColor }
  }

  drawGrid() {
    const dpr = window.devicePixelRatio || 1
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const startX = Math.floor(this.gridOffset.x / this.options.squareSize) * this.options.squareSize
    const startY = Math.floor(this.gridOffset.y / this.options.squareSize) * this.options.squareSize

    this.ctx.lineWidth = isPhone ? 1.0 : 0.5

    // Draw snake body
    this.snakeBody.forEach((segment, index) => {
      const squareX = Math.round(segment.x * this.options.squareSize + startX - (this.gridOffset.x % this.options.squareSize))
      const squareY = Math.round(segment.y * this.options.squareSize + startY - (this.gridOffset.y % this.options.squareSize))

      this.ctx.shadowColor = this.options.hoverShadowColor
      this.ctx.shadowBlur = 15
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0

      if (index === 0) {
        this.ctx.fillStyle = this.options.snakeHeadColor
      } else {
        const gradientFactor = Math.pow(this.options.snakeColorDecay, index)
        const headColorMatch = this.options.snakeHeadColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/)
        const tailColorMatch = this.options.snakeTailColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/)

        if (headColorMatch && tailColorMatch) {
          const headR = parseInt(headColorMatch[1])
          const headG = parseInt(headColorMatch[2])
          const headB = parseInt(headColorMatch[3])
          const headA = headColorMatch[4] ? parseFloat(headColorMatch[4]) : 1
          const tailR = parseInt(tailColorMatch[1])
          const tailG = parseInt(tailColorMatch[2])
          const tailB = parseInt(tailColorMatch[3])
          const tailA = tailColorMatch[4] ? parseFloat(tailColorMatch[4]) : 1

          const r = Math.round(headR + (tailR - headR) * (1 - gradientFactor))
          const g = Math.round(headG + (tailG - headG) * (1 - gradientFactor))
          const b = Math.round(headB + (tailB - headB) * (1 - gradientFactor))
          const a = headA + (tailA - headA) * (1 - gradientFactor)
          this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
        } else {
          const opacity = Math.max(0.2, gradientFactor)
          this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        }
      }

      this.ctx.fillRect(squareX, squareY, this.options.squareSize, this.options.squareSize)
      this.ctx.shadowColor = 'transparent'
      this.ctx.shadowBlur = 0
    })

    // Draw food, hover square, and grid lines
    for (let x = startX; x < this.canvas.width + this.options.squareSize; x += this.options.squareSize) {
      for (let y = startY; y < this.canvas.height + this.options.squareSize; y += this.options.squareSize) {
        const squareX = Math.round(x - (this.gridOffset.x % this.options.squareSize))
        const squareY = Math.round(y - (this.gridOffset.y % this.options.squareSize))
        const gridX = Math.floor((x - startX) / this.options.squareSize)
        const gridY = Math.floor((y - startY) / this.options.squareSize)

        // Food
        if (this.specialBlock && gridX === this.specialBlock.x && gridY === this.specialBlock.y) {
          this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
          this.ctx.shadowBlur = 20
          this.ctx.fillStyle = this.specialBlock.color
          this.ctx.fillRect(squareX, squareY, this.options.squareSize, this.options.squareSize)
          this.ctx.shadowColor = 'transparent'
          this.ctx.shadowBlur = 0
        }

        // Hover (snake head)
        if (this.hoveredSquare && gridX === this.hoveredSquare.x && gridY === this.hoveredSquare.y) {
          this.ctx.shadowColor = this.options.hoverShadowColor
          this.ctx.shadowBlur = 15
          this.ctx.shadowOffsetX = 0
          this.ctx.shadowOffsetY = 0
          const color = this.options.hoverFillColor.replace('0.6', this.currentOpacity.toString())
          this.ctx.fillStyle = color
          this.ctx.fillRect(squareX, squareY, this.options.squareSize, this.options.squareSize)
          this.ctx.shadowColor = 'transparent'
          this.ctx.shadowBlur = 0
        }

        // Grid lines
        this.ctx.strokeStyle = this.options.borderColor
        this.ctx.strokeRect(squareX, squareY, this.options.squareSize, this.options.squareSize)
      }
    }

    // Vignette
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / dpr / 2, this.canvas.height / dpr / 2, 0,
      this.canvas.width / dpr / 2, this.canvas.height / dpr / 2,
      Math.sqrt(Math.pow(this.canvas.width / dpr, 2) + Math.pow(this.canvas.height / dpr, 2)) / 2
    )
    gradient.addColorStop(0, 'rgba(6, 6, 6, 0)')
    gradient.addColorStop(1, '#060606')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr)
  }

  updateAnimation(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp
    const deltaTime = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp

    if (this.currentOpacity !== this.targetOpacity) {
      const progress = Math.min(deltaTime / this.options.transitionDuration, 1)
      this.currentOpacity += (this.targetOpacity - this.currentOpacity) * progress
    }

    for (const [key, square] of this.trailSquares) {
      square.opacity -= deltaTime / this.options.trailDuration
      if (square.opacity <= 0) this.trailSquares.delete(key)
    }

    const effectiveSpeed = Math.max(isPhone ? this.options.speed * 0.8 : this.options.speed, 0)

    switch (this.options.direction) {
      case 'right':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + this.options.squareSize) % this.options.squareSize
        break
      case 'left':
        this.gridOffset.x = (this.gridOffset.x + effectiveSpeed + this.options.squareSize) % this.options.squareSize
        break
      case 'up':
        this.gridOffset.y = (this.gridOffset.y + effectiveSpeed + this.options.squareSize) % this.options.squareSize
        break
      case 'down':
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + this.options.squareSize) % this.options.squareSize
        break
      case 'diagonal':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + this.options.squareSize) % this.options.squareSize
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + this.options.squareSize) % this.options.squareSize
        break
    }

    // Check if food went offscreen
    if (this.specialBlock) {
      const dpr = window.devicePixelRatio || 1
      const startX = Math.floor(this.gridOffset.x / this.options.squareSize) * this.options.squareSize
      const startY = Math.floor(this.gridOffset.y / this.options.squareSize) * this.options.squareSize
      const foodX = Math.round(this.specialBlock.x * this.options.squareSize + startX - (this.gridOffset.x % this.options.squareSize))
      const foodY = Math.round(this.specialBlock.y * this.options.squareSize + startY - (this.gridOffset.y % this.options.squareSize))
      if (foodX < -this.options.squareSize || foodX > this.canvas.width / dpr || foodY < -this.options.squareSize || foodY > this.canvas.height / dpr) {
        this.createSpecialBlock()
      }
    }

    this.drawGrid()
    this.animationFrame = requestAnimationFrame((ts) => this.updateAnimation(ts))
  }

  animate() {
    this.animationFrame = requestAnimationFrame((ts) => this.updateAnimation(ts))
  }

  handleVisibilityChange() {
    if (document.hidden) {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
        this.animationFrame = null
      }
    } else {
      if (!this.animationFrame) {
        this.lastTimestamp = 0
        this.animate()
      }
    }
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
    window.removeEventListener('resize', this._boundHandlers.resize)
    this.canvas.removeEventListener('mousemove', this._boundHandlers.mousemove)
    this.canvas.removeEventListener('mouseleave', this._boundHandlers.mouseleave)

    if (isPhone && this._boundHandlers.touchstart) {
      this.canvas.removeEventListener('touchstart', this._boundHandlers.touchstart)
      this.canvas.removeEventListener('touchmove', this._boundHandlers.touchmove)
      this.canvas.removeEventListener('touchend', this._boundHandlers.touchend)
      this.canvas.removeEventListener('touchcancel', this._boundHandlers.touchcancel)
    }

    document.removeEventListener('visibilitychange', this._boundHandlers.visibility)
  }
}

export function useSnakeGrid() {
  let animation = null

  function init(canvas) {
    animation = new GridAnimation(canvas, {
      direction: 'diagonal',
      speed: isPhone ? 0.03 : 0.05,
      borderColor: isPhone ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
      squareSize: isPhone ? 50 : 40,
      hoverFillColor: 'rgba(255, 255, 255, 0.8)',
      hoverShadowColor: 'rgba(255, 255, 255, 0.8)',
      transitionDuration: isPhone ? 150 : 200,
      trailDuration: isPhone ? 2000 : 1500,
      specialBlockColor: 'rgba(100, 255, 152, 0.8)',
      specialHoverColor: 'rgba(29, 202, 29, 0.8)',
      snakeHeadColor: 'rgba(255, 255, 255, 0.95)',
      snakeTailColor: 'rgba(218, 231, 255, 0.25)',
      snakeColorDecay: 0.85,
      touchSensitivity: isPhone ? 1.2 : 1.0,
      vibrationEnabled: isPhone,
    })
    animation.init()
  }

  function destroy() {
    if (animation) {
      animation.destroy()
      animation = null
    }
  }

  return { init, destroy }
}
