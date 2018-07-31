<template>
<div id="app">
  <section class="myContainer mySection container columns is-multiline">

    <div class="column is-one-third" v-for="(station, index) in dataList" :key="index">
      <div @click="addStationToCart(station)" class="stationBox">
        <img :src="`${station.imagepath}`"/>
        <!-- <img class="ellipse" src="~/static/images/ellipse.png" height="228" width="228" /> -->
        <a class="button is-danger is-rounded is-medium">{{station.station_name}}</a>
      </div>
    </div>

  </section>
</div>
</template>

<script>
export default {
  methods: {
    addStationToCart(station) {
      this.$store.commit('addStationToCart', station);
      this.$router.push({ name: 'role-id', query: { stationID: station.station_id }});
    }
  },
  beforeCreate() {
    this.$store.commit('setPageTitle', 'Select Station');
  },
  mounted() {
    let self = this;
    let stations = this.$store.state.stationsList;
    console.log(stations);
    stations.forEach(function(station) {
      if(station.is_active == 1) {
        self.dataList.push(station)
      }
    })
  },
  data() {
    return {
      dataList: []
    }
  }
}
</script>

<style scoped>
#logo {
  position: absolute;
  right: 30px;
  bottom: 0;
}

.column {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

img {
  margin-bottom: 20px;
  /* z-index: 1; */
  height: 200px;
}

/* .ellipse {
  position: absolute;
  top: 160px;
  z-index: 0;
} */

a {
  font-weight: bold;
  width: 65%;
}

.box1 {
  padding-top: 78px;
}

.mySection {
  overflow-y: auto;
}

.stationBox {
  text-align: center;
}

.button {
  width: 275px;
}

::-webkit-scrollbar {
  display: none;
}
</style>
