<!--
 * @Description: pdf预览, 不支持跨域, 请自行代理
 -->
<template>
  <div  class='black-box'>
    <div v-if="loading">loading...</div>
    <div class="pdf-box">
      <div id="mycanvas" ref="mycanvas"></div>
    </div>
    <div class="pdf-handler" v-if="control">
      <span @click="changeSize(1)">+</span>
      <span @click="changeSize(-1)">-</span>
    </div>
  </div>
</template>

<script>
let PDFJS = require('pdfjs-dist') // 保持版本为"pdfjs-dist": "2.0.943"
let worker = require('pdfjs-dist/build/pdf.worker.min')
PDFJS.GlobalWorkerOptions.workerSrc = worker
let DEFAULT_UP = 1.2
export default {
  name: 'SPdf',
  props: {
    src: {          // 文件地址
      type: String,
      default: ''
    },
    control: {      // 控制放大缩小
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      total: 0,
      pdf: null,
      pages: 1,
      loading: false,
      scale: 0
    }
  },
  mounted () {
  },
  computed: {
    box () {
      return this.$refs.mycanvas
    }
  },
  watch: {
    src: {
      handler(url) {
        if( url ){
          this.$nextTick(() => {
            if(this.box) this.box.innerHTML = ''
            this.getPdf(url)
          })
        }
     },
     deep: true,
     immediate: true
    } 
  },
  methods: {
    changeSize (type) {
      let scale = this.scale
      if(type > 0){
        scale = (scale * DEFAULT_UP).toFixed(1)
      } else {
        scale = (scale / DEFAULT_UP).toFixed(1)
      }
      if(this.loading || scale > 2.4 || scale < 0.5) return
      this.scale = scale
      if(this.box) this.box.innerHTML = ''
      this.pageRender(this.pages)
    },
    // 根据路径获取pdf信息
    async getPdf (url) {
      try {
        let pdf = await PDFJS.getDocument(url)
        if(pdf && pdf.numPages){
          this.pdf = pdf
          this.total = pdf.numPages
          this.pageRender(this.pages)
        }
      } catch (e) {
        throw new Error(e.message)
      }
    },
    // 用canvas绘制每个pdf页面加到页面上
    async pageRender (num) {
      if(!num || !this.pdf) return
      this.loading = true
      let page = await this.pdf.getPage(num)
      if(!this.scale) this.scale = (this.box.offsetWidth / page.view[2]).toFixed(1)
      let scale = this.scale
      let view = page.getViewport(scale)
      let canvas = document.createElement('canvas')
      canvas.width = view.width
      canvas.height = view.height
      this.box.appendChild(canvas)
      let ctx = canvas.getContext('2d')
      let content = {
        canvasContext: ctx,
        transform: [1, 0, 0, 1, 0, 0],
        viewport: view,
        intent: 'print'
      }
      await page.render(content)
      if(++num <= this.total){
        this.pageRender(num)
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.pdf-box{
  width: 900px;
  margin: 0 auto;
  display:flex;
  justify-content: center;
  #mycanvas{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /deep/ canvas {
      border: 1px solid #ccc;
      margin-bottom: 12px;
    }
  }
}
.pdf-handler{
  position: fixed;
  bottom: 20px;
  right: 50px;
  span{
    display: inline-block;
    width: 30px;
    height: 30px;
    background: #ccc;
    border-radius: 100%;
    text-align: center;
    font-size: 20px;
    line-height: 30px;
    margin: 12px;
    cursor:pointer;
  }
}
</style>
