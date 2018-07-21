import Vue from 'vue'
import VueSocketio from 'vue-socket.io'

export default ({
	app
}) => {
	Vue.use(VueSocketio, process.env.API_URL + '/user', app.store)
}
