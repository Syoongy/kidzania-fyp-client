<template>
<div id="app">
  <section class="container myContainer">
    <div class="level myLevel">
      <div class="level-item">
        <p class="is-size-2 has-text-weight-bold has-text-centered"> I want to <br /> roleplay as a(n) : </p>
      </div>

      <div class="level-item" v-for="(role, index) in dataList" :key="index">
        <img :src="`${role.imagepath}`" class="is-4by3" />
        <a class="button is-danger is-rounded is-medium" @click.prevent="addRoleToCart(role)" :disabled="isDisable(role.role_id)">{{role.role_name}}</a>
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
import isEmpty from "~/plugins/dictionary-is-empty.js"

export default {
  data() {
    return {
      dataList: [],
      stationData: {},
      limitList: [],
      bookingDetail: this.$store.state.bookingDetail,
      allBookings: this.$store.state.allBookingDetails
    }
  },
  methods: {
    getData(station) {
      let self = this;
      for (let role of station.roles) {
        self.dataList.push(role);
      }
    },
    addRoleToCart(role) {
      let check = true;
      let noBooked = 0;
      for (let b of this.allBookings) {
        if (b.role_id === role.role_id && b.booking_status === 'Admitted') {
          noBooked += 1;
        }
      }
      if (this.limitList !== undefined) {
        if (this.limitList.find(i => i.role_id === role.role_id) !== undefined) {
          let roleLimit = this.limitList.find(i => i.role_id === role.role_id).booking_limit;
          if (noBooked >= roleLimit) {
            check = false
          }
        }
      }
      if (check === true) {
        this.$store.commit('addRoleToCart', role.role_id);
        this.$router.push('timeslot');
      }
    },
    isDisable(role_id) {
      let check = true;
      let noBooked = 0;
      console.log(this.allBookings)
      for (let b of this.allBookings) {
        if (b.role_id === role_id && b.booking_status === 'Admitted') {
          noBooked += 1;
        }
      }
      if (this.limitList !== undefined) {
        if (this.limitList.find(i => i.role_id === role_id) !== undefined) {
          let roleLimit = this.limitList.find(i => i.role_id === role_id).booking_limit;
          if (noBooked >= roleLimit) {
            check = false
          }
        }
      }
      if (!check) {
        return true;
      }
      return false;
    }
  },
  async mounted() {
    let currStation = this.$store.state.bookingCart.station;
    let res = await this.$axios.$get(`/limit/checkRoleLimit/${currStation.station_id}`)
      .catch(e => {
        console.log(e);
      });
    console.log(res)
    this.limitList = res;
    console.dir(currStation);
    this.getData(currStation);
    this.stationData = currStation;
    this.$store.commit('setPageTitle', 'Select Role');
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
  width: 50% !important;
  word-wrap: break-word;
  padding-right: 7rem;
  padding-left: 4rem;
}

#stationDetails .level-item {
  width: 35%;
}
</style>
