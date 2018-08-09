<template>
<div id="app">
  <section class="container is-centered myContainer" id="mySection">
    <div class="columns is-desktop is-multiline is-vcentered" id="bookedWrapper">
      <div class="column is-12">
        <div class="columns">
          <div class="column is-3 is-offset-2">
            <figure class="image is-3by4" id="roleImage">
              <img :src="roleImagePath" />
            </figure>
          </div>
          <div class="column is-6">
            <div class="dialog">
              <div class="has-text-left-desktop" id="dialogText">
                <p class="title">
                  Come join me as a <b class="has-text-danger">{{ roleName }}</b>
                </p>
                <p class="title">
                  at the <b class="has-text-danger">{{ stationName }}</b>
                </p>
                <p class="title">
                  from <b class="has-text-danger">{{ sessionStartTime }} to {{ sessionEndTime }}</b> !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="columns is-centered has-text-centered">
          <div class="column is-5">
            <a class="button is-success is-rounded is-large is-fullwidth" @click="bookingPopUp">Print receipt to confirm</a>
          </div>
          <div class="column is-5">
            <a class="button is-danger is-rounded is-large is-fullwidth" @click="confirmChange">Change Booking</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  <b-modal :active.sync="isComponentModalActive" :canCancel="false">
    <b-message title="Confirm Booking" type="is-success" size="is-large" :closable="false">
      Please scan your bracelet to confirm the booking!
    </b-message>
  </b-modal>
</div>
</template>

<script>
import isEmpty from "~/plugins/dictionary-is-empty.js"
export default {
  methods: {
    confirmChange() {
      if (!this.isComponentModalActive) {
        this.$dialog.confirm({
          title: 'Oh no!',
          message: 'You can only have one booking at a time. Press OK to change your current booking',
          confirmText: 'OK',
          type: 'is-danger',
          hasIcon: true,
          size: 'is-large',
          onConfirm: () => this.$router.push('/station')
        })
      }
    },
    bookingPopUp() {
      this.isComponentModalActive = true
      this.$store.commit('setConfirming', true)
    },
    setImagePath(role_id) {
      let self = this
      this.dataList.forEach(function(station) {
        if (station.station_id == self.stationID) {
          station.roles.forEach(function(role) {
            if (role.role_id == role_id) {
              self.roleImagePath = role.imagepath;
              self.roleName = role.role_name;
            }
          });
        }
      });
    }
  },
  data() {
    return {
      isComponentModalActive: false,
      role_id: "",
      roleName: "",
      stationName: "",
      sessionStartTime: "",
      sessionEndTime: "",
      roleImagePath: "",
      stationID: "",
      dataList: this.$store.state.stationsList
    }
  },
  created() {
    let booking = this.$store.state.bookingCart;
    console.dir(booking)
    this.role_id = booking.role;
    this.stationName = booking.station.station_name;
    this.stationID = booking.station.station_id;
    this.sessionStartTime = booking.timeSlot.session_start;
    this.sessionEndTime = booking.timeSlot.session_end;
    this.setImagePath(this.role_id);
  },
  mounted() {
    this.$store.commit('setPageTitle', 'My Booking');
  },
  beforeDestroy() {
    this.isComponentModalActive = false;
  }
}
</script>

<style scoped>
.dialog {
  display: flex;
  align-items: center;
  position: relative;
  width: 80%;
  height: 80%;
  margin: 10% auto auto auto;
  background-color: #F8FAF4;
  border-radius: 15px;
  filter: drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.16));
}

.dialog::before {
  content: '';
  position: absolute;
  border-style: solid;
  border-width: 17px 23px 17px 0px;
  border-color: transparent #F8FAF4;
  display: block;
  width: 0;
  z-index: 1;
  left: -23px;
  top: 50%;
}

#dialogText {
  margin: 0 auto;
}

.myLevel {
  height: 100%;
}

#bookedWrapper {
  height: 100%;
}

@media print {
  #print-content {
    display: block;
    visibility: show;
  }
  #app {
    display: none;
    visibility: hidden;
  }
  html {
    background-color: white;
  }
}

@media screen {
  #app {
    display: block;
    visibility: show;
  }
}
</style>
