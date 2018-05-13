import Vue from 'vue'
import VueSocketio from 'vue-socket.io'

export default ({ app }) => {
  Vue.use(VueSocketio, 'http://localhost:8080', app.store)
}
