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
			currQNum: 0,
			bookingCart: {},
			bookingDetail: {},
			allBookingDetails: [],
			confirming: false
		},
		mutations: {
			updateAuthState(state, data) {
				state.auth = data;
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
			addAllBookingDetails(state, payload) {
				state.allBookingDetails.push(payload);
			},
			popBookingDetails(state) {
				state.allBookingDetails.pop();
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
			setQNum: (state, payload) => {
				state.currQNum = payload;
			},
			setConfirming: (state, payload) => {
				state.confirming = payload;
			},
		},
		actions: {
			nuxtServerInit({
				commit
			}, {
				req
			}) {
				let accessToken = null;
				if (req.headers.cookie) {
					let parsed = cookieparser.parse(req.headers.cookie);
					if (parsed.auth) {
						accessToken = JSON.parse(parsed.auth);
					}
				}
				commit('updateAuthState', accessToken);
			},
			addQNumAsync({ commit }, qNum) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						commit('setQNum', qNum.qNum)
						resolve()
					}, 5000)
				})
			}
		}
	})
}

export default createStore