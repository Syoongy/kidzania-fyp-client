<template>
<div id="app">
  <section class="container myContainer">
    <div class="level myLevel">
      <div class="level-item">
        <p class="is-size-2 has-text-weight-bold has-text-centered"> I want to <br /> roleplay as a(n) : </p>
      </div>

      <div class="level-item" v-for="(role, index) in dataList" :key="index">
        <img :src="`${role.imagepath}`" class="is-4by3" />
        <a class="button is-danger is-rounded is-medium" @click="addRoleToCart(role)">{{role.role_name}}</a>
      </div>

    </div>
    <hr />
    <div class="level" id="stationDetails">
      <div class="level-item">
        <img :src="`${stationData.imagepath}`" class="is-square" />
        <p class="is-size-5 has-text-weight-bold">{{stationData.station_name}}</p>
      </div>
      <p id="description" class="has-text-left level-item is-size-4">{{stationData.description}}</p>
    </div>
  </section>
</div>
</template>

<script>
export default {
  /*asyncData({
    query
  }) {
    return {
      sID: query.stationID
    }
  },*/
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
    },
    addRoleToCart(role) {
      this.$store.commit('addRoleToCart', role.role_id);
      this.$router.push('timeslot');
    }
  },
  beforeCreate() {
    this.$store.commit('setPageTitle', 'Select Role');
  },
  mounted() {
    let currStation = this.$store.state.bookingCart.station;
    console.dir(currStation);
    this.getData(currStation);
    this.stationData = currStation;
  }
}
</script>

<style scoped>
.myLevel {
  margin-bottom: 0;
  height: 50%;
}

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

.level-item img {
  height: 20vh;
}

#selectedStation {
  font-weight: bold;
  color: #4D4D4D;
  font-size: 20px;
  padding-top: 20px;
}

#description {
  color: #4D4D4D;
  width: 50%!important;
  word-wrap: break-word;
  padding-right: 7rem;
  padding-left: 4rem;
}

#stationDetails .level-item {
  width: 35%;
}
</style>
