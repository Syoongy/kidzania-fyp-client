<template>
<div>
  <section class="container">
    <div class="level">
      <p id="text"> I want to <br /> become a(n): </p>

      <div class="level-item" v-for="(role, index) in dataList" :key="index">
        <img :src="`${role.imagepath}`" />
        <a class="button is-danger is-rounded is-medium" @click="$router.push('timeslot');">{{role.role_name}}</a>
      </div>

    </div>
    <hr />
    <div class="level" id="stationDetails">
      <div id="selectedStation" class="level-item">
        <img :src="`${stationData.imagepath}`" height="180" width="180" />
        <p>{{stationData.station_name}}</p>
      </div>
      <p id="description" class="level-item">
        {{stationData.description}}
      </p>
    </div>
  </section>
  <!-- <div id="logo">
    <img src="~/static/images/pic_official_logo.png" height="158" width="158" />
  </div> -->
</div>
</template>

<script>
export default {
  asyncData({
    query
  }) {
    return {
      sID: query.stationID
    }
  },
  data() {
    return {
      dataList: [],
      stationData: ''
    }
  },
  methods: {
    getData(station) {
      let self = this;
      station.roles.forEach(function(role) {
        self.dataList.push(role);
      });
    }
  },
  beforeCreate() {
    this.$store.commit('setPageTitle', 'Select Role');
  },
  mounted() {
    let currStation = this.$store.getters.getStationById(this.sID);
    console.dir(currStation);
    this.getData(currStation);
    this.stationData = currStation;
  }
}
</script>

<style scoped>
/* #logo {
  position: absolute;
  right: 30px;
  bottom: 20px;
} */

#text {
  color: #4D4D4D;
  font-size: 42px;
  font-weight: bold;
  text-align: center;
  padding-left: 160px;
  padding-top: 28px;
}

a {
  font-weight: bold;
  width: 160px;
}

.level-item {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

#selectedStation {
  font-weight: bold;
  color: #4D4D4D;
  font-size: 20px;
  padding-top: 20px;
}

#description {
  color: #4D4D4D;
  font-size: 18px;
  font-weight: 400;
  padding-top: 30px;
  margin-right: 180px;
  width: 100px;
  word-wrap: break-word;
}

#stationDetails {}

img {
  height: 188px;
  width: 188px;
}
</style>
