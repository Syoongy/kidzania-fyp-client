import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default ({
	app
}) => {
	// Vue.use(VueSocketio, process.env.API_URL + '/user', app.store)
	const myStore = app.store
	Vue.use(new VueSocketIO({
    connection: process.env.API_URL + '/user',
    vuex: {
        myStore,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))
}
