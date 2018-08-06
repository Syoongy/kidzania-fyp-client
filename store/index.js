import Vuex from 'vuex'
const cookieparser = require('cookieparser')

const createStore = () => {
	return new Vuex.Store({
		state: {
			auth: null,
			scannedID: '',
			io: {},
			pageName: '',
			stationsList: [],
			role: '',
			bookingCart: {},
			bookingDetail: {},
			confirming: false
		},
		mutations: {
			updateAuthState (state, data) {
				state.auth = data
			},
			setScannedID(state, payload) {
				state.scannedID = payload;
			},
			setPageTitle(state, payload) {
				state.pageName = payload;
			},
			setBookingDetail(state, payload) {
				state.bookingDetail = payload;
			},
			setSocket: (state, socket) => {
				state.io = socket;
				console.log("Socket Connected");
			},
			addStation: (state, payload) => {
				state.stationsList.push(payload);
			},
			addStationToCart: (state, payload) => {
				state.bookingCart.station = payload;
			},
			addRoleToCart: (state, payload) => {
				state.bookingCart.role = payload;
			},
			addTimeSlotToCart: (state, payload) => {
				state.bookingCart.timeSlot = payload;
			},
			setBookingCart: (state, payload) => {
				state.bookingCart = payload;
			},
			setConfirming: (state, payload) => {
				state.confirming = payload;
			},
		},
		actions: {
			nuxtServerInit ({commit}, {req}) {
				let accessToken = null
				if (req.headers.cookie) {
					let parsed = cookieparser.parse(req.headers.cookie)
					if (parsed.auth) {
						accessToken = JSON.parse(parsed.auth)
					}
				}
				commit('updateAuthState', accessToken)
			}
		}
	})
}

export default createStore
