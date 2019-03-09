<template>
  <div id="app">
    <section class="container is-centered myContainer" id="mySection">
      <div v-if="isBooked" class="columns is-desktop is-multiline is-vcentered" id="bookedWrapper">
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
                    Come join me as a
                    <b class="has-text-danger">{{ roleName }}</b>
                  </p>
                  <p class="title">
                    at the
                    <b class="has-text-danger">{{ stationName }}</b>
                  </p>
                  <p class="title">
                    from
                    <b class="has-text-danger">{{ sessionStartTime }} to {{ sessionEndTime }}</b> !
                  </p>
                  <p class="title">
                    Your Queue Number is
                    <b class="has-text-danger">{{queueNum}}</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="columns is-multiline is-centered has-text-centered">
            <div class="column is-5">
              <a class="button is-success is-rounded is-large is-fullwidth" @click="bookingPopUp">
                <b>Reprint receipt</b>
              </a>
            </div>
            <div class="column is-5">
              <a class="button is-danger is-rounded is-large is-fullwidth" @click="confirmChange">
                <b>Change Booking</b>
              </a>
            </div>
            <div class="column is-5">
              <a
                class="button is-danger is-rounded is-large is-fullwidth"
                @click="cancelBookingDialogPopup"
              >
                <b>Cancel Booking</b>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="level myLevel">
        <div class="level-item has-text-centered">
          <div>
            <p class="title myTitle">You currently have no booking</p>
            <div class="columns is-centered has-text-centered">
              <a
                class="button is-danger is-rounded is-large is-fullwidth"
                @click="$router.push(`station`);"
              >
                <b>Start Booking</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div id="print">
      <div id="print-content" style="text-align: center;">
        <div class="space"></div>
        <div class="space"></div>
        <p>Welcome to KidZania Singapore</p>
        <div class="space"></div>
        <div class="space"></div>
        <h2>{{ stationNameUpper }}</h2>
        <div class="space"></div>
        <h3 class="roleTxt">{{ roleName }}</h3>
        <div class="space"></div>
        <p>Date: {{ todayDate }}</p>
        <div class="space"></div>
        <p>Session Time:</p>
        <h2>{{ sessionStartTime }} - {{ sessionEndTime }}</h2>
        <div class="space"></div>
        <p>Queue Number:</p>
        <h1>{{ queueNum }}</h1>
        <p>Pleez report 5 mins earlier</p>
        <p>Pleez do not lose the receipt</p>
        <p>Failure to comply may</p>
        <p>result in denied entry</p>
        <p>--------------------</p>
      </div>
    </div>
  </div>
</template>

<script>
import isEmpty from "~/plugins/dictionary-is-empty.js";
import moment from "moment";
import { mapState } from "vuex";

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
      bookingDetail: state => state.bookingDetail,
      dataList: state => state.stationsList,
      scannedID: state => state.scannedID
    }),
    todayDate() {
      let today = new Date();
      return moment(today).format("DD MMM YYYY");
    }
  },
  data() {
    return {
      queueNum: 0,
      role_id: "",
      roleName: "",
      stationName: "",
      stationNameUpper: "",
      isBooked: "",
      sessionStartTime: "",
      sessionEndTime: "",
      roleImagePath: "",
      stationID: ""
    };
  },
  methods: {
    bookingPopUp() {
      const self = this;
      this.isComponentModalActive = true;
      this.$store.commit("setConfirming", true);
      console.log(this.stationName.toUpperCase());
      this.stationNameUpper = this.stationName.toUpperCase();
      let printContents = document.getElementById("print-content").innerHTML;
      window.onafterprint = function() {
        self.$router.push("/thankyou");
      };
      window.print();
    },
    confirmChange() {
      this.$dialog.confirm({
        title: "Oh no!",
        message:
          "You can only have one booking at a time. Press OK to change your current booking.",
        confirmText: "OK",
        type: "is-danger",
        hasIcon: true,
        size: "is-large",
        onConfirm: () => this.$router.push("station")
      });
    },
    cancelBookingDialogPopup() {
      this.$dialog.confirm({
        title: "Are you sure?",
        message: "You are about to cancel your booking.",
        confirmText: "OK",
        type: "is-danger",
        hasIcon: true,
        size: "is-large",
        onConfirm: () => this.cancelBooking()
      });
    },
    async cancelBooking() {
      const self = this;
      const webFormData = new WebFormData(
        self.bookingDetail.session_id,
        self.bookingDetail.station_id,
        self.bookingDetail.role_id,
        self.scannedID.toUpperCase(),
        "Cancelled"
      );
      const res = await self.$axios
        .$put("/bookings/cancelBooking", webFormData, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .catch(e => {
          console.log(e);
          this.$dialog.alert({
            title: `Cancellation Failed`,
            message:
              "Oh No! Your booking has <b>failed</b> to cancel. PleeZ try again.",
            confirmText: "Exit",
            size: "is-large",
            type: "is-danger",
            onConfirm: () => self.$router.push("/")
          });
          return;
        });
      this.$router.push("/");
    },
    setImagePath(role_id) {
      const self = this;
      for (const station of this.dataList) {
        if (station.station_id == self.stationID) {
          for (const role of station.roles) {
            if (role.role_id == role_id) {
              self.roleImagePath = role.imagepath;
              self.roleName = role.role_name;
            }
          }
        }
      }
    }
  },
  created() {
    const booking = this.bookingDetail;
    console.log(booking);
    if (!isEmpty(booking)) {
      this.role_id = booking.role_id;
      this.stationName = booking.station_name;
      this.stationNameUpper = this.stationName.toUpperCase();
      this.sessionStartTime = booking.session_start;
      this.sessionEndTime = booking.session_end;
      this.stationID = booking.station_id;
      this.setImagePath(booking.role_id);
      this.queueNum = booking.queue_no;
      this.isBooked = true;
    } else {
      this.isBooked = false;
    }
  },
  mounted() {
    this.$store.commit("setPageTitle", "My Booking");
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
  margin: 0 auto;
}

.myLevel {
  height: 100%;
}

#bookedWrapper {
  height: 100%;
}

.myTitle {
  margin-bottom: 20%;
}

/*
#print-content {
  display: none;
  visibility: hidden;
} */

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
  #mySection {
    display: none;
    visibility: hidden;
  }
}

@media screen {
  #print-content {
    /* display: block; */
    visibility: hidden;
  }
  #mySection {
    display: block;
    visibility: show;
  }
}
</style>
