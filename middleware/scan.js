export default function({params, store}) {
  store.commit('setScannedID', params.id);
}
