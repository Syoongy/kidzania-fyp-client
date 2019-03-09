<template>
  <div id="myLayout">
    <section class="hero myHero" v-if="scannedID != ''">
      <div class="hero-body" v-if="pageName != ''">
        <h1 id="title">{{pageName}}</h1>
        <div
          class="backBtnTxt"
          @click="$router.go(-1);"
          v-if="pageName != 'My Booking' && pageName != 'Thank You'"
        >
          <img src="baseline_arrow_back_white_48dp.png">
        </div>
        <div class="exitBtnTxt" @click="exitDialog" v-if="pageName != 'Thank You'">
          <img src="exit-run.png">
        </div>
      </div>
    </section>
    <nuxt/>
    <footer id="myFooter">
      <figure class="image is-3by1 logo">
        <img src="~/static/kzLogo.svg" class="staticLogo">
      </figure>
    </footer>
    <div id="print" v-if="$router.currentRoute.path === '/mybooking/confirmation'">
      <div id="print-content" style="text-align: center;">
        <div class="space"></div>
        <div class="space"></div>
        <p>Welcome to KidZania Singapore</p>
        <div class="space"></div>
        <div class="space"></div>
        <h2>{{ stationNameUppers }}</h2>
        <div class="space"></div>
        <h3 class="roleTxt">{{ roleNames }}</h3>
        <div class="space"></div>
        <p>Date: {{ todayDate }}</p>
        <div class="space"></div>
        <p>Session Time:</p>
        <h2>{{ sessionStartTimes }} - {{ sessionEndTimes }}</h2>
        <div class="space"></div>
        <p>Queue Number:</p>
        <h1>{{ queueNums }}</h1>
        <p>PleeZ report 5 mins earlier</p>
        <p>PleeZ do not lose the receipt</p>
        <p>Failure to comply may</p>
        <p>result in denied entry</p>
        <p>--------------------</p>
      </div>
    </div>
  </div>
</template>

<script>
import jwtDecode from "jwt-decode";
import Cookie from "js-cookie";
import moment from "moment";
import isEmpty from "~/plugins/dictionary-is-empty.js";
import { mapState } from "vuex";

let scannedArray = [];
let scannedID = "";

function WebFormData(ssId, sId, rId, rfid, status) {
  (this.session_id = ssId),
    (this.station_id = sId),
    (this.role_id = rId),
    (this.rfid = rfid),
    (this.status = status);
}

export default {
  computed: {
    ...mapState({
      stationsList: state => state.stationsList,
      bookingDetail: state => state.bookingDetail,
      allBookingDetails: state => state.allBookingDetails,
      scannedID: state => state.scannedID,
      bookingCart: state => state.bookingCart,
      auth: state => state.auth,
      confirming: state => state.confirming,
      pageName: state => state.pageName,
      queueNums: state => state.currQNum
    }),
    roleNames() {
      let self = this;
      if (this.booking && this.booking.station) {
        const stationsList = self.stationsList;
        for (const station of stationsList) {
          if (station.station_id == this.booking.station.station_id) {
            for (const role of station.roles) {
              if (role.role_id == this.booking.role) {
                return role.role_name;
              }
            }
          }
        }
      }
    },
    stationNameUppers() {
      if (this.booking && this.booking.station !== undefined) {
        return this.booking.station.station_name.toUpperCase();
      }
    },
    sessionStartTimes() {
      if (this.booking && this.booking.timeSlot) {
        return this.booking.timeSlot.session_start;
      }
    },
    sessionEndTimes() {
      if (this.booking && this.booking.timeSlot) {
        return this.booking.timeSlot.session_end;
      }
    },
    todayDate() {
      let today = new Date();
      return moment(today).format("DD MMM YYYY");
    }
  },
  data() {
    return {
      booking: null,
      bookingBeingMade: false
    };
  },
  methods: {
    exitDialog() {
      const self = this;
      self.bookingBeingMade = true;
      this.$dialog.confirm({
        title: `Exit`,
        message: "Would you like to <b>exit</b>?",
        confirmText: "Exit",
        size: "is-large",
        type: "is-danger",
        onConfirm: () => {
          self.$router.push("/");
          self.bookingBeingMade = false;
        },
        onCancel: () => (self.bookingBeingMade = false)
      });
    },
    async confirmBooking() {
      const self = this;
      const bookingDetail = this.bookingDetail;
      this.booking = this.bookingCart;
      this.bookingBeingMade = true;
      console.log("Booking being made");

      console.dir(bookingDetail);
      if (!isEmpty(bookingDetail)) {
        //Reprint
        let webFormData = new WebFormData(
          bookingDetail.session_id,
          bookingDetail.station_id,
          bookingDetail.role_id,
          self.scannedID.toUpperCase(),
          "Cancelled"
        );
        let res = await self.$axios
          .$put("/bookings/cancelBooking", webFormData, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .catch(e => {
            console.log(e);
            this.$dialog.alert({
              title: `Booking Failed`,
              message:
                "Oh No! Your booking has <b>failed</b>. PleeZ try again.",
              confirmText: "Exit",
              size: "is-large",
              type: "is-danger",
              onConfirm: () => self.$router.push("/")
            });
            self.booking = null;
            self.bookingBeingMade = false;
            self.$store.commit("setQNum", 0);
            return;
          });
        console.log(res);
        webFormData = new WebFormData(
          self.bookingCart.timeSlot.session_id,
          self.bookingCart.station.station_id,
          self.bookingCart.role,
          self.scannedID.toUpperCase(),
          "Confirmed"
        );
        console.dir(webFormData);
        self.$axios
          .$post("/bookings/makeBooking", webFormData, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            this.$store.dispatch("addQNumAsync", {
              qNum: res.queue_no
            });
          })
          .then(() => {
            let printContents = document.getElementById("print-content")
              .innerHTML;
            window.onafterprint = function() {
              self.booking = null;
              self.bookingBeingMade = false;
              self.$store.commit("setQNum", 0);
              self.$router.push("/thankyou");
            };
            window.print();
          })
          .catch(e => {
            console.log(e);
            this.$dialog.alert({
              title: `Booking Failed`,
              message: "Oh no! Your booking has failed. Please try again",
              confirmText: "Exit",
              size: "is-large",
              type: "is-danger",
              onConfirm: () => self.$router.push("/")
            });
            self.booking = null;
            self.bookingBeingMade = false;
            self.$store.commit("setQNum", 0);
            return;
          });
      } else {
        //New booking
        let webFormData = new WebFormData(
          self.bookingCart.timeSlot.session_id,
          self.bookingCart.station.station_id,
          self.bookingCart.role,
          self.scannedID.toUpperCase(),
          "Confirmed"
        );
        console.dir(webFormData);
        let res = await self.$axios
          .$post("/bookings/makeBooking", webFormData, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(res => {
            this.$store.dispatch("addQNumAsync", {
              qNum: res.queue_no
            });
          })
          .then(() => {
            let printContents = document.getElementById("print-content")
              .innerHTML;
            window.onafterprint = function() {
              self.booking = null;
              self.bookingBeingMade = false;
              self.$store.commit("setQNum", 0);
              self.$router.push("/thankyou");
            };
            window.print();
          })
          .catch(e => {
            console.log(e);
            this.$dialog.alert({
              title: `Booking Failed`,
              message: "Oh no! Your booking has failed. Please try again",
              confirmText: "Exit",
              size: "is-large",
              type: "is-danger",
              onConfirm: () => self.$router.push("/")
            });
            self.booking = null;
            self.bookingBeingMade = false;
            self.$store.commit("setQNum", 0);
            return;
          });
      }
    },
    async login() {
      try {
        let res = await this.$axios.post(`/auth/login`, {
          username: "guest",
          password: "password"
        });
        if (res.status === 200) {
          const auth = res.data;
          this.$store.commit("updateAuthState", auth);
          Cookie.set("auth", auth);
          this.$axios.setToken(auth.token, "Bearer");
        }
      } catch (err) {
        let msg = "Internal server error. Please contact Administrator.";
        if (err.response.data) {
          msg = err.response.data.message;
        }
        this.$dialog.alert({
          title: `Login Failed`,
          message: msg,
          type: "is-danger",
          hasIcon: true,
          iconPack: "mdi"
        });
      }
    }
  },
  async mounted() {
    let self = this;
    let timer;

    function timeOutUser() {
      self.$router.push("/");
    }

    function resetTimer() {
      if (self.scannedID !== "") {
        console.log("reset Timer is being called");
        clearTimeout(timer);
        timer = setTimeout(timeOutUser, 15000); // time is in milliseconds
      }
    }
    document.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onmousedown = resetTimer; // catches touchscreen presses as well
    document.ontouchstart = resetTimer; // catches touchscreen swipes as well
    document.onclick = resetTimer; // catches touchpad clicks as well
    document.onkeypress = resetTimer;

    if (this.auth === null) {
      await self.login();
    }

    let stationList;
    let roleList;

    if (this.stationsList.length === 0) {
      //Retrieve Roles and store in roleList
      roleList = await self.$axios.$get(`/roles`).catch(e => {
        console.log(e);
      });
      roleList = roleList[0];
      //Retrieve Stations and store in Vuex Store
      stationList = await this.$axios.$get(`/stations`);
      for (const station of stationList) {
        station.imagepath =
          process.env.API_URL + "/image/getStationImage/" + station.station_id;
        const tempRoleList = [];
        for (const role of roleList) {
          if (role.station_id == station.station_id) {
            role.imagepath =
              process.env.API_URL + "/image/getRoleImage/" + role.role_id;
            tempRoleList.push(role);
          }
        }
        station.roles = tempRoleList;
        self.$store.commit("addStation", station);
      }
    }

    //Scanning Function
    window.onkeypress = async function(e) {
      if (e.key === "Enter" && !self.bookingBeingMade) {
        scannedID = scannedArray.join("");
        scannedID = scannedID.toUpperCase();
        scannedArray = [];
        console.dir(scannedID);
        const prevScannedID = self.scannedID.toUpperCase();
        console.log(prevScannedID);
        if (
          !self.confirming &&
          ((prevScannedID === "" && isEmpty(self.bookingDetail)) ||
            (prevScannedID !== "" &&
              ((prevScannedID !== scannedID &&
                self.$router.currentRoute.path !== "/mybooking") ||
                (prevScannedID === scannedID &&
                  self.$router.currentRoute.path === "/"))))
        ) {
          self.$store.commit("popBookingDetails");
          self.$store.commit("setScannedID", scannedID);
          self.$store.commit("setBookingDetail", {});
          const res = await self.$axios
            .$get(`/bookings/rfid/${self.scannedID}`)
            .catch(e => {
              console.log(e);
            });
          const bookings = res;
          if (res !== undefined) {
            for (const b of bookings) {
              console.log(b);
              self.$store.commit("addAllBookingDetails", b);
              if (b.booking_status === "Confirmed") {
                self.$store.commit("setBookingDetail", b);
              }
            }
          }
          resetTimer();
          self.$router.push(`/mybooking`);
        } else if (
          prevScannedID !== "" &&
          prevScannedID !== scannedID &&
          self.$router.currentRoute.path === "/mybooking"
        ) {
          console.log("Reload Page");
          self.$store.commit("popBookingDetails");
          self.$store.commit("setScannedID", scannedID);
          self.$store.commit("setBookingDetail", {});
          let res = await self.$axios
            .$get(`/bookings/rfid/${self.scannedID}`)
            .catch(e => {
              console.log(e);
            });
          if (res !== undefined) {
            const bookings = res;
            for (const b of bookings) {
              console.log(b);
              self.$store.commit("addAllBookingDetails", b);
              if (b.booking_status === "Confirmed") {
                self.$store.commit("setBookingDetail", b);
              }
            }
          }
          console.dir(self.bookingDetail);
          self.$router.push(`reload`);
        } else if (
          prevScannedID === scannedID &&
          self.$router.currentRoute.path === "/mybooking/confirmation" &&
          self.confirming === true
        ) {
          self.confirmBooking();
        } else if (
          prevScannedID !== scannedID &&
          self.$router.currentRoute.path === "/mybooking/confirmation" &&
          self.confirming === true
        ) {
          self.$store.commit("setConfirming", false);
          self.$dialog.alert({
            title: "Error",
            message: "You have scanned a different bracelet",
            confirmText: "Exit",
            size: "is-large",
            type: "is-danger",
            onConfirm: () => self.$router.push("/")
          });
        }
        scannedID = "";
      } else if (!self.bookingBeingMade) {
        scannedArray.push(e.key);
      }
    };
  }
};
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
  background-color: #f8faf4;
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
  background-color: #03a9f4;
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
  background-color: #fff;
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

@media print {
  .roleTxt {
    font-size: 1.3rem;
    font-weight: bold;
    padding: 4px;
  }
  .space {
    height: 10px;
  }
  * {
    font-family: "Times New Roman";
  }
  h2 {
    line-height: 0.9;
    font-size: 1.9rem;
    font-weight: bold;
  }
  h1 {
    font-size: 3rem;
    font-weight: bold;
  }
  #print-content {
    display: block;
    visibility: show;
  }
  .staticLogo {
    display: none;
    visibility: hidden;
  }
  .myHero {
    display: none;
    visibility: hidden;
  }
  html {
    background-color: white;
  }
}

@media screen {
  #print-content {
    /* display: block; */
    visibility: hidden;
  }
  .staticLogo {
    display: block;
    visibility: show;
  }
  .myHero {
    /* display: block; */
    visibility: show;
  }
}
</style>
