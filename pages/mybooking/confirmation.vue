<template>
  <div id="app">
    <section class="container is-centered myContainer" id="mySection">
      <div class="columns is-desktop is-multiline is-vcentered" id="bookedWrapper">
        <div class="column is-12">
          <div class="columns">
            <div class="column is-3 is-offset-2">
              <figure class="image is-3by4" id="roleImage">
                <img :src="roleImagePath">
              </figure>
            </div>
            <div class="column is-6">
              <div class="dialog">
                <div class="has-text-left-desktop" id="dialogText">
                  <p class="title">
                    Kai! Would you like to join us as a
                    <b class="has-text-danger">{{ roleName }}</b> at the
                    <b class="has-text-danger">{{ sessionStartTime }} - {{ sessionEndTime }}</b> session?
                  </p>
                  <!-- <p class="title"><b class="has-text-danger">{{ roleName }}</b> at the</p>
                  <p class="title"><b class="has-text-danger">{{ sessionStartTime }} to {{ sessionEndTime }}</b> session?</p>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="columns is-centered has-text-centered">
            <div class="column is-5">
              <a class="button is-success is-rounded is-large is-fullwidth" @click="bookingPopUp">
                <b>Confirm Booking</b>
              </a>
            </div>
            <div class="column is-5">
              <a class="button is-danger is-rounded is-large is-fullwidth" @click="confirmChange">
                <b>Change Booking</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <b-modal :active.sync="isComponentModalActive" :canCancel="false">
      <b-message
        title="Confirm Booking"
        type="is-success"
        size="is-large"
        :closable="false"
      >PleeZ scan your bracelet to confirm your booking.</b-message>
    </b-modal>
  </div>
</template>

<script>
import isEmpty from "~/plugins/dictionary-is-empty.js";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      bookingCart: state => state.bookingCart,
      dataList: state => state.stationsList
    })
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
      stationID: ""
    };
  },
  methods: {
    confirmChange() {
      if (!this.isComponentModalActive) {
        this.$dialog.confirm({
          title: "Oh no!",
          message:
            "You can only have <b>one booking</b> at a time. Press OK to <b>change</b> your current booking",
          confirmText: "OK",
          type: "is-danger",
          hasIcon: true,
          size: "is-large",
          onConfirm: () => this.$router.push("/station")
        });
      }
    },
    bookingPopUp() {
      this.isComponentModalActive = true;
      this.$store.commit("setConfirming", true);
    },
    setImagePath(role_id) {
      const self = this;
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
  created() {
    const booking = this.bookingCart;
    console.dir(booking);
    this.role_id = booking.role;
    this.stationName = booking.station.station_name;
    this.stationID = booking.station.station_id;
    this.sessionStartTime = booking.timeSlot.session_start;
    this.sessionEndTime = booking.timeSlot.session_end;
    this.setImagePath(this.role_id);
  },
  mounted() {
    this.$store.commit("setPageTitle", "My Booking");
  },
  beforeDestroy() {
    this.isComponentModalActive = false;
  }
};
</script>

<style scoped>
.dialog {
  display: flex;
  align-items: center;
  position: relative;
  width: 80%;
  height: 80%;
  margin: 10% auto auto auto;
  background-color: #f8faf4;
  border-radius: 15px;
  filter: drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.16));
}

.dialog::before {
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 17px 23px 17px 0px;
  border-color: transparent #f8faf4;
  display: block;
  width: 0;
  z-index: 1;
  left: -23px;
  top: 50%;
}

#dialogText {
  margin: 0 10%;
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
