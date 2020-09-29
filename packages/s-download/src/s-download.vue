<!--
 * @Description: 文件直接下载, 非直接打开浏览器
 -->
<template>
  <div class="s-download" @click="download">
    <slot></slot>
  </div>
</template>

<script>
import FileSaver from './file-saver'
export default {
  name: 'SDownload',
  props: {
    url: {          // 文件地址
      type: String,
      default: ''
    },  
    name: {         // 文件下载名称, 默认文件名
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  methods: {
    download () {
      if(!this.url) return
      let list = this.url.split('/')
      let name = this.fileName || list[list.length - 1]
      FileSaver(this.url, name)
    }
  }
}
</script>

<style lang='scss' scoped>
.s-download{
  display: inline-block;
  border-radius: 3px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin: 0 12px;
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
}
</style>
