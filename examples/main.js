import Vue from 'vue'
import App from './App.vue'
import router from './router'
import SUI from '../packages'
Vue.use(SUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
