const environment = {
	baseUrl: 'http://localhost:8000'
	// baseUrl: 'http://172.22.76.104:8000'
	// baseUrl: 'http://25.30.64.144:8000'
}
module.exports = {
	modules: [
		'@nuxtjs/axios',
		'nuxt-buefy'
	],
	plugins: [{
			src: '~/plugins/socket.io.js',
			ssr: false
		},
		'~/plugins/axios.js',
		'~/plugins/dictionary-is-empty.js'
	],
	axios: {
		baseURL: environment.baseUrl,
		proxy: false
	},
	env: {
		API_URL: environment.baseUrl
	},
	/*
	 ** Headers of the page
	 */
	head: {
		title: 'Q-zee Booking',
		meta: [{
				charset: 'utf-8'
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: 'Nuxt.js project'
			}
		],
		link: [{
			rel: 'icon',
			type: 'image/x-icon',
			href: '/favicon.ico'
		}]
	},
	/*
	 ** Customize the progress bar color
	 */
	loading: {
		color: '#3B8070'
	},
	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** Run ESLint on save
		 */
		extend(config, {
			isDev,
			isClient
		}) {
			if (isDev && isClient) {
				config.resolve.alias['vue'] = 'vue/dist/vue.common'
				// config.module.rules.push({
				// 	enforce: 'pre',
				// 	test: /\.(js|vue)$/,
				// 	loader: 'eslint-loader',
				// 	exclude: /(node_modules)/
				// })
			}
		}
	}
}
