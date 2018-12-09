import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Toasted from 'vue-toasted'
import App from './App'
import store from './store'
import messages from './i18n'
import ElementUI from 'element-ui'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import './globals.scss'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.use(contentmenu)
Vue.use(Toasted, {
  position: 'bottom-right',
  duration: 1500
})
const i18n = new VueI18n({
  locale: 'en',
  messages
})
const EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})
/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
store.subscribe((mutation) => {
  if (mutation.type === 'SET_LANGUAGE') {
    i18n.locale = mutation.payload
  }
})
