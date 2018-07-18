<template>
<div id="myLayout">
  <section class="hero" v-if="$store.state.scannedID != ''">
    <i class="mdi mdi-arrow-left mdi-48px mdi-light" @click="$router.go(-1);" v-if="$store.state.pageName != 'My Booking' && $store.state.pageName != 'Thank You'"></i>
    <div class="hero-body" v-if="$store.state.pageName != ''">
      <h1 id="title">
          {{$store.state.pageName}}
      </h1>
    </div>
  </section>
  <nuxt/>
  <footer id="myFooter">
    <figure class="image is-3by1 logo">
      <img src="~/static/kzLogo.svg" class="staticLogo" />
    </figure>
  </footer>
</div>
</template>

<script>
import axios from "axios"
let scannedArray = [];
let scannedID = '';
export default {

  mounted() {
    let self = this;
    window.onkeypress = function(e) {
      if (e.key == 'Enter') {
        scannedID = scannedArray.join('');
        scannedArray = [];
        console.dir(scannedID);
        self.$store.commit('setScannedID', scannedID);
        axios.get(`http://localhost:8000/bookings/${self.$store.state.scannedID}`)
          .then((res) => {
            if (res.status == "200") {
              let booking = res.data[0];
              booking.isBooked = true;
              self.$store.commit('setBookingDetail', booking);
              console.log(self.$store.state.bookingDetail)
            }
          })
          .catch((err) => {
            self.$store.commit('setBookingDetail', null);
            console.log(self.$store.state.bookingDetail)
          });

        self.$router.push(`mybooking`);
        scannedID = '';
      } else {
        scannedArray.push(e.key);
      }
    };
  },

  async beforeCreate() {
    let self = this;
    let stationList;
    let roleList;
    //Retrieve Roles and store in roleList
    await axios.get(`http://localhost:8000/roles`)
      .then((res) => {
        roleList = res.data[0];
      })
      .catch((err) => {
        console.log(err)
      });

    //Retrieve Stations and store in Vuex Store
    await axios.get(`http://localhost:8000/stations`)
      .then((res) => {
        stationList = res.data;
        stationList.forEach(function(station) {
          let tempRoleList = [];
          roleList.forEach(function(role) {
            if (role.station_id == station.station_id) {
              tempRoleList.push(role);
            }
          });
          station.roles = tempRoleList;
          self.$store.commit('addStation', station);
        });
      })
      .catch((err) => {
        console.log(err)
      });
  }
}
</script>

<style>
html {
  background-color: #F8FAF4;
  overflow: hidden;
  height: 100%;
}

body,
#__nuxt,
#__layout,
#myLayout {
  height: 100%;
}

#app {
  height: 80%;
}

.mdi {
  position: fixed;
  margin-left: 10px;
  margin-top: 3px;
  cursor: pointer;
}

.hero {
  background-color: #03A9F4;
}

.material-icons {
  position: fixed;
  padding: 12px;
  color: white;
}

.hero-body {
  align-self: center;
  padding: 10px;
}

#title {
  color: white;
  position: relative;
  font-weight: bold;
  font-size: 36px;
}

.myContainer {
  background-color: #FFF;
  height: 90%;
  width: 85%;
  margin: 5% auto 5% auto;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
  border-radius: 15px;
}

#myFooter {
  position: absolute;
  bottom: 2%;
  left: 90%;
}

.logo {
  max-width: 80%;
}

.staticLogo {
  position: static !important;
}
</style>
