import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      scannedID: '',
      io: {},
      pageName: ''
    },
    mutations: {
      setScannedID (state, payload) {
        state.scannedID = payload;
      },
      setPageTitle (state, payload) {
        state.pageName = payload;
      },
      setSocket: (state, socket) => {
        state.io = socket;
        console.log("Socket Connected");
      }
    }
  })
}

export default createStore
