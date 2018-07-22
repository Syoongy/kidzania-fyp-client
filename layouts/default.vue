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
//import axios from "axios"
let scannedArray = [];
let scannedID = '';
export default {
  methods: {
    createTimer() {
      this.myTimer = setInterval(console.log('hi'), 1000)
    }
  },
  data() {
    return {
      myTimer: ''
    }
  },
  async mounted() {
    let self = this;
    let imageData = await this.$axios.$get('http://ec2-52-33-181-199.us-west-2.compute.amazonaws.com:8000/stations/image')
      .then(data => {
        console.log(data.constructor.name)
        let fileReader = new FileReader();
        let image = new File([data], 'RetrievedFile.jpeg');
        console.log(image.constructor.name)
        let formData = new FormData();
        formData.append('RetrievedFile', image);
        self.$axios.$post('http://localhost:8080/api/getImages', formData)
          .catch(err => {
            console.log(err)
          });
      });

    let stationList;
    let roleList;
    //Retrieve Roles and store in roleList
    roleList = await this.$axios.$get(`/roles`)
      .catch(e => {
        console.log(e);
      });
    console.dir('hi');
    console.dir(roleList);
    roleList = roleList[0];
    //Retrieve Stations and store in Vuex Store
    stationList = await this.$axios.$get(`/stations`);
    stationList.forEach(function(station) {
      let tempRoleList = [];
      roleList.forEach(function(role) {
        if (role.station_id == station.station_id) {
          tempRoleList.push(role);
        }
      });
      station.roles = tempRoleList;
      self.$store.commit('addStation', station);
    })
    this.createTimer()
    window.onkeypress = async function(e) {
      if (e.key == 'Enter') {
        scannedID = scannedArray.join('');
        scannedArray = [];
        console.dir(scannedID);
        let prevScannedID = self.$store.state.scannedID;
        console.log(prevScannedID);
        if (prevScannedID == '' && Object.keys(self.$store.state.bookingDetail).length === 0 && self.$store.state.bookingDetail.constructor === Object) {
          self.$store.commit('setScannedID', scannedID);
          let res = self.$axios.$get(`/bookings/rfid/${self.$store.state.scannedID}`)
            .catch(e => {
              console.log(e);
            });
          console.log(res.constructor === Object)
          if(res.constructor === Object) {
            let booking = res.data[0];
            booking.isBooked = true;
            self.$store.commit('setBookingDetail', booking);
            console.log(self.$store.state.bookingDetail)
          }
          self.$router.push(`mybooking`);

        } else if (prevScannedID != '' && prevScannedID !== scannedID && self.$router.currentRoute.path === '/mybooking') {
          console.log('Reload Page')
          self.$store.commit('setScannedID', scannedID);
          let res = await self.$axios.$get(`/bookings/rfid/${self.$store.state.scannedID}`);
          let booking = res.data[0];
          booking.isBooked = true;
          self.$store.commit('setBookingDetail', booking);
          console.dir(self.$store.state.bookingDetail)
          self.$router.push(`reload`);
        }
        scannedID = '';
      } else {
        scannedArray.push(e.key);
      }
    }
  },

  async beforeCreate() {
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
