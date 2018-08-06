<template>
<div id="myLayout">
  <section class="hero myHero" v-if="$store.state.scannedID != ''">
    <div class="backBtnTxt" @click="$router.go(-1);" v-if="$store.state.pageName != 'My Booking' && $store.state.pageName != 'Thank You'">
      <img src="baseline_arrow_back_white_48dp.png" />
    </div>

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
import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
import isEmpty from "~/plugins/dictionary-is-empty.js"
let scannedArray = [];
let scannedID = '';

function WebFormData(ssId, sId, rId, rfid, status) {
  this.session_id = ssId,
    this.station_id = sId,
    this.role_id = rId,
    this.rfid = rfid,
    this.status = status
}

export default {
  methods: {
    createTimer() {
      this.myTimer = setInterval(console.log('hi'), 1000)
    },
    async confirmBooking() {
      let self = this;
      let bookingDetail = this.$store.state.bookingDetail;
      console.dir(bookingDetail);
      if (!isEmpty(self.$store.state.bookingDetail)) {
        let webFormData = new WebFormData(bookingDetail.session_id, bookingDetail.station_id, bookingDetail.role_id, self.$store.state.scannedID, "Cancelled");
        let res = await self.$axios.$put('/bookings/cancelBooking',
          webFormData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        console.log(res);
        webFormData = new WebFormData(self.$store.state.bookingCart.timeSlot.session_id, self.$store.state.bookingCart.station.station_id, self.$store.state.bookingCart.role, self.$store.state.scannedID, "Confirmed");
        console.dir(webFormData);
        res = await self.$axios.$post('/bookings/makeBooking',
          webFormData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        self.$router.push('/thankyou');
      } else {
        let webFormData = new WebFormData(self.$store.state.bookingCart.timeSlot.session_id, self.$store.state.bookingCart.station.station_id, self.$store.state.bookingCart.role, self.$store.state.scannedID, "Confirmed");
        console.dir(webFormData);
        self.$axios.$post('/bookings/makeBooking',
          webFormData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
        self.$router.push('/thankyou');
      }
      self.$store.commit('setScannedID', '');
      self.$store.commit('setBookingCart', {});
      self.$store.commit('setConfirming', false);
    },
    async login() {
      try {
        let res = await this.$axios.post(`/auth/login`, {
          username: 'guest',
          password: 'password'
        });
        if (res.status === 200) {
          const auth = res.data;
          this.$store.commit('updateAuthState', auth);
          Cookie.set('auth', auth);
          this.$axios.setToken(auth.token, 'Bearer');
        }
      } catch (err) {
        let msg = 'Internal Server Error. Please Contact Administrator.';
        if (err.response.data) {
          msg = err.response.data.message
        }
        this.$dialog.alert({
          title: `Login Failed`,
          message: msg,
          type: 'is-danger',
          hasIcon: true,
          iconPack: 'mdi'
        });
      }
    }
  },
  data() {
    return {
      myTimer: ''
    }
  },
  async mounted() {
    let self = this;
    let stationList;
    let roleList;
    let token = this.$store.state.auth;
    if (token !== null) {
      // let decoded = jwtDecode(token);
      // let current_time = Date.now() / 1000;
      // if (jwt.exp < current_time) {
      //   self.login();
      // }
    } else {
      self.login();
    }

    if (this.$store.state.stationsList.length === 0) {
      //Retrieve Roles and store in roleList
      roleList = await self.$axios.$get(`/roles`)
        .catch(e => {
          console.log(e);
        });
      console.dir(roleList);
      roleList = roleList[0];
      //Retrieve Stations and store in Vuex Store
      stationList = await this.$axios.$get(`/stations`);
      stationList.forEach(function(station) {
        station.imagepath = process.env.API_URL + "/image/getStationImage/" + station.station_id;
        let tempRoleList = [];
        roleList.forEach(function(role) {
          if (role.station_id == station.station_id) {
            role.imagepath = process.env.API_URL + "/image/getRoleImage/" + role.role_id;
            tempRoleList.push(role);
          }
        });
        station.roles = tempRoleList;
        self.$store.commit('addStation', station);
      })
    }


    //Scanning Function
    window.onkeypress = async function(e) {
      if (e.key == 'Enter') {
        scannedID = scannedArray.join('');
        scannedArray = [];
        console.dir(scannedID);
        let prevScannedID = self.$store.state.scannedID;
        console.log(prevScannedID);
        console.log(self.$store.state.confirming);
        console.log(self.$router.currentRoute.path !== '/mybooking/confirmation' && ((prevScannedID == '' && isEmpty(self.$store.state.bookingDetail)) || (prevScannedID !== '' && ((prevScannedID !== scannedID && self.$router.currentRoute.path !==
          '/mybooking') || (prevScannedID === scannedID && self.$router.currentRoute
          .path === '/')))));
        if (self.$router.currentRoute.path !== '/mybooking/confirmation' && ((prevScannedID == '' && isEmpty(self.$store.state.bookingDetail)) || (prevScannedID !== '' && ((prevScannedID !== scannedID && self.$router.currentRoute.path !==
            '/mybooking') || (prevScannedID === scannedID && self.$router.currentRoute
            .path === '/'))))) {
          self.$store.commit('setScannedID', scannedID);
          let res = await self.$axios.$get(`/bookings/rfid/${self.$store.state.scannedID}`)
            .catch(e => {
              console.log(e);
            });
          console.log(res)
          let booking = {}
          if (res !== undefined) {
            booking = res[0];
          }
          self.$store.commit('setBookingDetail', booking);
          console.log(self.$store.state.bookingDetail)
          self.$router.push(`mybooking`);
        } else if (prevScannedID !== '' && prevScannedID !== scannedID && self.$router.currentRoute.path === '/mybooking') {
          console.log('Reload Page')
          self.$store.commit('setScannedID', scannedID);
          let res = await self.$axios.$get(`/bookings/rfid/${self.$store.state.scannedID}`)
            .catch(e => {
              console.log(e);
            });
          let booking = {}
          if (res !== undefined) {
            booking = res[0];
          }
          self.$store.commit('setBookingDetail', booking);
          console.dir(self.$store.state.bookingDetail)
          self.$router.push(`reload`);
        } else if (prevScannedID === scannedID && self.$router.currentRoute.path === '/mybooking/confirmation' && self.$store.state.confirming) {
          self.confirmBooking();
        }
        scannedID = '';
      } else {
        scannedArray.push(e.key);
      }
    };
  }
}
</script>

<style>
html {
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
     supported by Chrome and Opera */
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
  margin-left: 1vh;
  margin-top: 0.2vh;
  cursor: pointer;
}

.backBtnTxt {
  position: fixed;
  top: 1vh;
  left: 1vw;
  height: 36px;
}

.hero {
  background-color: #03A9F4;
}

.myHero {
  height: 12vh;
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
  font-size: 3.5rem;
}

.myContainer {
  background-color: #FFF;
  height: 90%;
  width: 85%;
  margin: 4% auto;
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
