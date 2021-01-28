import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import '../public/js/gif'
import '../public/js/gif.worker'

Vue.prototype.$ajax = axios;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
