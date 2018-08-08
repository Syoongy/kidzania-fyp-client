<template>
<div id="myLayout">
  <section class="hero myHero" v-if="$store.state.scannedID != ''">
    <div class="hero-body" v-if="$store.state.pageName != ''">
      <h1 id="title">
          {{$store.state.pageName}}
      </h1>
      <div class="backBtnTxt" @click="$router.go(-1);" v-if="$store.state.pageName != 'My Booking' && $store.state.pageName != 'Thank You'">
        <img src="baseline_arrow_back_white_48dp.png" />
      </div>
      <div class="exitBtnTxt" @click="$router.push('/');" v-if="$store.state.pageName != 'Thank You'">
        <img src="exit-run.png" />
      </div>
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
  async mounted() {
    let self = this;
    let timer;

    function timeOutUser() {
      self.$router.push('/')
    }

    function resetTimer() {
      clearTimeout(timer);
      //timer = setTimeout(timeOutUser, 15000); // time is in milliseconds
    }
    document.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer; // catches touchscreen presses as well
    document.ontouchstart = resetTimer; // catches touchscreen swipes as well
    document.onclick = resetTimer; // catches touchpad clicks as well
    document.onkeypress = resetTimer;

    let token = this.$store.state.auth;
    //console.log(token[0]);
    //console.log(jwtDecode(token.token).exp)
    //let decoded = jwtDecode(token.token);
    let current_time = Date.now().valueOf() / 1000;
    if (token === null) {
      self.login();
    }
    // } else if (decoded.exp < current_time && decoded.exp !== undefined) {
    //   self.login();
    // }

    let stationList;
    let roleList;

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
      for (let station of stationList) {
        station.imagepath = process.env.API_URL + "/image/getStationImage/" + station.station_id;
        let tempRoleList = [];
        for (let role of roleList) {
          if (role.station_id == station.station_id) {
            role.imagepath = process.env.API_URL + "/image/getRoleImage/" + role.role_id;
            tempRoleList.push(role);
          }
        }
        station.roles = tempRoleList;
        self.$store.commit('addStation', station);
      }
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
        if (self.$router.currentRoute.path !== '/mybooking/confirmation' && ((prevScannedID == '' && isEmpty(self.$store.state.bookingDetail)) || (prevScannedID !== '' && ((prevScannedID !== scannedID && self.$router.currentRoute.path !==
            '/mybooking') || (prevScannedID === scannedID && self.$router.currentRoute
            .path === '/'))))) {
          for (let b of self.$store.state.allBookingDetails) {
            self.$store.commit('popBookingDetails');
          }
          self.$store.commit('setScannedID', scannedID);
          let res = await self.$axios.$get(`/bookings/rfid/${self.$store.state.scannedID}`)
            .catch(e => {
              console.log(e);
            });
          let booking = {};
          if (res !== undefined) {
            let bookings = res;
            for (let b of bookings) {
              console.log(b)
              self.$store.commit('addAllBookingDetails', b);
              if (b.booking_status === 'Confirmed') {
                booking = b;
              }
            }
          }
          self.$store.commit('setBookingDetail', booking);
          console.log(self.$store.state.bookingDetail);
          self.$router.push(`mybooking`);
        } else if (prevScannedID !== '' && prevScannedID !== scannedID && self.$router.currentRoute.path === '/mybooking') {
          console.log('Reload Page')
          for (let b of self.$store.state.allBookingDetails) {
            self.$store.commit('popBookingDetails');
          }
          self.$store.commit('setScannedID', scannedID);
          let res = await self.$axios.$get(`/bookings/rfid/${self.$store.state.scannedID}`)
            .catch(e => {
              console.log(e);
            });
          let booking = {}
          if (res !== undefined) {
            let bookings = res;
            for (let b of bookings) {
              console.log(b)
              self.$store.commit('addAllBookingDetails', b);
              if (b.booking_status === 'Confirmed') {
                booking = b;
              }
            }
          }
          self.$store.commit('setBookingDetail', booking);
          console.dir(self.$store.state.bookingDetail)
          self.$router.push(`reload`);
        } else if (prevScannedID === scannedID && self.$router.currentRoute.path === '/mybooking/confirmation' && self.$store.state.confirming === true) {
          self.confirmBooking();
        } else if (prevScannedID !== scannedID && self.$router.currentRoute.path === '/mybooking/confirmation' && self.$store.state.confirming === true) {
          self.$dialog.alert({
            title: 'Error',
            message: 'You have scanned a different bracelet',
            confirmText: 'Exit',
            size: 'is-large',
            type: 'is-danger',
            onConfirm: () => self.$router.push('/')
          })
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
}

.exitBtnTxt {
  position: fixed;
  top: 1vh;
  right: 1vw;
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
/*
@media print {
  #print-content {
    display: block;
    visibility: show;
  }
  #mySection {
    display: none;
    visibility: hidden;
  }
  .staticLogo {
    display: none;
    visibility: hidden;
  }
  .myHero {
    display: none;
    visibility: hidden;
  }
}

@media screen {
  #print-content {
    display: none;
    visibility: hidden;
  }
  #mySection {
    display: block;
    visibility: show;
  }
  .staticLogo {
    display: block;
    visibility: show;
  }
  .myHero {
    display: block;
    visibility: show;
  }
}*/
</style>
