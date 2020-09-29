<template>
  <div id="app">
    <h3>下载组件</h3>
    <s-download :url="pdfUrl">下载</s-download>
    <h3>日历组件</h3>
    <div style="width: 500px;margin: 0 auto;">
      <s-calendar/>
    </div>
    <h3>拖拽组件</h3>
    <s-suspend :src="iconUrl"></s-suspend>
    <h3>pdf预览组件</h3>
    <s-pdf :src="pdfUrl"></s-pdf>
  </div>
</template>
<script>
export default {
  data(){
    return {
      iconUrl: require('./assets/logo.png'),
      pdfUrl: 'http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf'
    }
  }
}
</script>
<style lang="scss">

</style>
