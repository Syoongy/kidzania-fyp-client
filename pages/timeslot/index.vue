<template>
<div>
  <section class="container columns is-multiline is-centered">
    <div v-for="(timeslot, index) in dataList" :key="index" class="column is-one-third" :class="{selectedCard : selectedIndex == index}">
      <div class="card" @click="selectTimeSlot(timeslot, index)">
        <div class="media">
          <div class="media-left">
            <p class="noOfSlots">{{timeslot.capacity - timeslot.noBooked}}</p>
            <p class="slots">slot(s) left</p>
          </div>
          <div class="media-content">
            <p class="timing" :class="{selectedCard : selectedIndex == index}">{{timeslot.session_start}} - {{timeslot.session_end}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-one-third">
      <a class="button is-danger is-rounded is-medium" @click="makeBooking()" :disabled="disabled">Book</a>
    </div>
  </section>
</div>
</template>

<script>
import axios from "axios"

function WebFormData(ssId, sId, rName, rfid, status) {
  this.session_id = ssId,
    this.station_id = sId,
    this.role_name = rName,
    this.rfid = rfid,
    this.status = status
}

export default {
  methods: {
    selectTimeSlot(val, index) {
      this.selectedIndex = index;
      this.selectedTimeSlot = val;
      this.disabled = false;
    },
    makeBooking() {
      let self = this;
      let webFormData = new WebFormData(self.selectedTimeSlot.session_id, self.$store.state.bookingCart.station.station_id, self.$store.state.bookingCart.role, self.$store.state.scannedID, "Booked");
      console.dir(webFormData);
      axios.post('http://localhost:8000/bookings/makeBooking',
          webFormData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then((res) => {
          console.log('SUCCESS')
        })
        .catch((err) => {
          console.log('FAILURE')
        });
      this.$router.push('thankyou')
    }
  },
  data() {
    return {
      dataList: [],
      selectedIndex: null,
      selectedTimeSlot: null,
      disabled: true
    }
  },
  beforeCreate() {
    this.$store.commit("setPageTitle", "Select Timeslot");
  },
  created() {
    let stationId = this.$store.state.bookingCart.station.station_id;
    let roleId = this.$store.state.bookingCart.role;
    axios.get(`http://localhost:8000/sessions/${stationId}/${roleId}`)
      .then((res) => {
        console.log(res.data)
        console.log('Success')
        this.dataList = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  }
};
</script>

<style scoped>
.selectedCard .card,
.selectedCard .media-content,
.selectedCard .timing {
  background-color: #23d160;
  color: white !important;
}

.noSelection {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.64);
}

.noSelection article {
  width: 30%;
  margin: auto;
  top: 40%;
  position: relative;
}

#logo {
  position: absolute;
  right: 30px;
  bottom: 0;
}

.column {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 40px;
  height: 130px;
}

a {
  font-weight: bold;
  width: 65%;
}

.timing {
  color: #4d4d4d;
  font-size: 18px;
  font-weight: bold;
  padding-top: 20px;
  word-wrap: break-word;
}

.noOfSlots {
  font-size: 16px;
  font-weight: bold;
  padding-top: 5px;
  padding-left: 18px;
}

.slots {
  font-size: 12px;
  font-weight: bold;
  padding-top: 0px;
  padding-left: 5px;
}

.media-left {
  background-color: #23d160;
  height: 70px;
  width: 45px;
  color: white;
}

.media-content {
  height: 70px;
  width: 205px;
}

.card {
  width: 250px;
  height: 70px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
