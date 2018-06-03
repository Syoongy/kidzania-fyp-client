import Vuex from 'vuex'

const createStore = () => {
	return new Vuex.Store({
		state: {
			scannedID: '',
			io: {},
			pageName: '',
			stationsList: [],
			bookingCart: {}
		},
		mutations: {
			setScannedID(state, payload) {
				state.scannedID = payload;
			},
			setPageTitle(state, payload) {
				state.pageName = payload;
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
			}
		},
		getters: {
			getStationById: (state) => (id) => {
				return state.stationsList.find(station => station.station_id == id);
			}
		}
	})
}

export default createStore
