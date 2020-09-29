import SCalendar from './s-calendar'
import SPdf from './s-pdf'
import SSuspend from './s-suspend'
import SDownload from './s-download'
// 存储组件列表
const components = [
  SCalendar,
  SPdf,
  SSuspend,
  SDownload
] 
/* 
  定义install 方法，接收Vue作为参数，如果使用use注册插件，则所有的组件都将被注册
*/
const install = function (Vue) {
  // 判断是否安装
  if(install.installed){return}
  // 遍历所有组件
  components.map(item => {
    Vue.component(item.name,item)
  })
}
// 判断是否引入文件
if(typeof window !== 'undefined' && window.Vue){
  install(window.Vue)
}
export default {
  install,
  SCalendar,
  SPdf,
  SSuspend,
  SDownload
}
