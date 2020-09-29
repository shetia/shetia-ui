<!--
 * @Author: shetia
 * @Date: 2020-01-07 09:31:54
 * @LastEditors: somebody
 * @LastEditTime: 2020-03-21 14:51:44
 * @Description: 浮窗, 可拖动
 -->
<template>
  <div class="s-suspend"
    @touchstart="robotDown"
    @mousedown="robotDown"
    @mousemove="robotMove"
    @mouseup="robotUp"
    @touchmove="robotMove"
    @touchend="robotUp"
    ref="aiRobotRef"
    :style="{
      '--width': `${width}px`,
      '--height': `${height}px`,
      '--top': `${top}`,
      '--left': `${left}`,
      'background-image': `url(${src})`
    }"
    >
    <slot></slot>
  </div>
</template>

<script>
function bodyScroll (event) {
  event.preventDefault()
}
export default {
  name: 'SSuspend',
  props: {
    width: {
      type:[Number, String],
      default: 50
    },
    height: {
      type:[Number, String],
      default: 50
    },
    top: {
      type: String,
      default: '80%'
    },
    left: {
      type: String,
      default: '90%'
    },
    src: {           // 路径请使用网络路径 或使用 import require引入的路径
      type: String,
      default: ''
    },
  },
  data () {
    return {
      position: {     // 机器人部分
        x: '',
        y: ''
      },
      robotX: '',
      robotY: '',
      isRobotDown: false
    }
  },
  mounted () {
    window.addEventListener('mouseup', this.robotUp)
    window.addEventListener('mousemove', this.robotMove)
  },
  beforeDestroy () {
    window.removeEventListener('mouseup', this.robotUp)
    window.removeEventListener('mousemove', this.robotMove)
  },
  methods: {
    robotDown (e) {
      this.isRobotDown = true
      let touch = e
      if (e.touches) {
        touch = event.touches[0]
      }
      this.position.x = touch.clientX
      this.position.y = touch.clientY
      this.robotX = this.$refs.aiRobotRef.offsetLeft
      this.robotY = this.$refs.aiRobotRef.offsetTop
    },
    robotMove (e) {
      if (!this.isRobotDown) return
      let touch = e
      if (e.touches) {
        touch = event.touches[0]
      }
      let diffeX = this.robotX + touch.clientX - this.position.x
      let diffeY = this.robotY + touch.clientY - this.position.y
      let robotDom = this.$refs.aiRobotRef
      // 超出边界
      let screenX = document.documentElement.clientWidth
      let screenY = document.documentElement.clientHeight
      let robotW = this.$refs.aiRobotRef.offsetWidth
      let robotH = this.$refs.aiRobotRef.offsetHeight
      let boundaryL = touch.clientX - (this.position.x - this.robotX)
      let boundaryT = touch.clientY - (this.position.y - this.robotY)
      let boundaryR = touch.clientX + (this.robotX + robotW - this.position.x)
      let boundaryB = touch.clientY + (this.robotY + robotH - this.position.y)
      if (boundaryL < 0) {
        diffeX = 0
      } else if (boundaryR > screenX) {
        diffeX = screenX - robotW
      }
      if (boundaryT < 0) {
        diffeY = 0
      } else if (boundaryB > screenY) {
        diffeY = screenY - robotH
      }
      robotDom.style.left = diffeX + 'px'
      robotDom.style.top = diffeY + 'px'
      // 阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
      document.body.addEventListener('touchmove', bodyScroll, { passive: false })
    },
    robotUp () {
      this.isRobotDown = false
      document.body.removeEventListener('touchmove', bodyScroll, { passive: false })
    }
  }
}
</script>

<style lang='scss' scoped>
// 浮窗
.s-suspend{
  --right: 10px;
  --width: 50px;
  --height: 50px;
  --top: 10%;
  --left: 10%;
  cursor: move;
  position:fixed;
  top:var(--top);
  left: var(--left);
  width: var(--width);
  height: var(--height);
  display:inline-block;
  z-index: 99999;
  outline: none;
  background-size: cover;
  background-repeat: no-repeat;
  // background-color: #eee;
}
</style>
