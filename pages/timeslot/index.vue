<template>
<div id="app">
  <section class="myContainer container columns is-multiline is-centered">
    <b-tabs type="is-boxed" class="container" expanded>
        <b-tab-item :label="'Page ' + i" v-for="i in Math.ceil(dataList.length / 8)" :key="i" class="columns is-multiline is-centered myTabItem">
          <div v-for="timeslot in dataList.slice((i-1)*8, i*8)" :key="timeslot.session_id" class="column is-one-quarter" :class="{selectedCard : selectedIndex == timeslot.session_id}">
            <div class="card" @click="selectTimeSlot(timeslot, timeslot.session_id)" :class="{disabledCard: isDisabled(timeslot.capacity - timeslot.noBooked, timeslot.session_id)}">
              <div class="media">
                <div class="media-left">
                  <p class="noOfSlots">{{timeslot.capacity - timeslot.noBooked}}</p>
                  <p class="slots has-text-centered">slot(s) left</p>
                </div>
                <div class="media-content">
                  <p class="timing" :class="{selectedCard : selectedIndex == timeslot.session_id}">{{timeslot.session_start}} - {{timeslot.session_end}}</p>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
    </b-tabs>
    <!-- <div v-for="(timeslot, index) in dataList" :key="index" class="column is-one-third" :class="{selectedCard : selectedIndex == index}">
      <div class="card" @click="selectTimeSlot(timeslot, index)" :class="{disabledCard: isDisabled(timeslot.capacity - timeslot.noBooked, index)}">
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
    </div> -->
    <div class="column is-one-third myBtn">
      <a class="button is-danger is-rounded is-large is-fullwidth" @click="makeBooking()" :disabled="disabled">Book</a>
    </div>
  </section>
</div>
</template>

<script>
export default {
  methods: {
    isDisabled(noBooked, index) {
      console.log(noBooked);
      console.log(index);
      if (noBooked == 0) {
        console.log('returning True');
        return true;
      } else {
        return false;
      }
    },
    selectTimeSlot(val, index) {
      if (val.capacity - val.noBooked != 0) {
        this.selectedIndex = index;
        this.selectedTimeSlot = val;
        this.disabled = false;
      }
    },
    makeBooking() {
      this.socket.emit('makeBooking', this.selectedTimeSlot.session_id);
      this.$store.commit('addTimeSlotToCart', this.selectedTimeSlot);
      this.$router.push('mybooking/confirmation');
      //this.$store.commit('setScannedID', '');
    }
  },
  data() {
    return {
      dataList: [],
      selectedIndex: null,
      selectedTimeSlot: null,
      disabled: true,
      socket: null
    }
  },
  async beforeMount() {
    let stationId = this.$store.state.bookingCart.station.station_id;
    let roleId = this.$store.state.bookingCart.role;
    let res = await this.$axios.$get(`/sessions/${stationId}/${roleId}`)
    console.log(res)
    this.dataList = res
    console.log(this.dataList)
    this.$store.commit('setSocket', this.$socket)
    this.socket = this.$store.state.io
    this.socket.on('newSlotBooked', (sessionId) => {
      console.log('newSlotBooked Received')
      this.dataList.forEach(function(timeSlot) {
        if (sessionId == timeSlot.session_id) {
          timeSlot.noBooked += 1
        }
      })
    })

  },
  beforeCreate() {
    this.$store.commit("setPageTitle", "Select Timeslot");
  },
  created() {

  }
};
</script>

<style scoped>
.myTabItem {
  height: 50vh;
}

.selectedCard .card,
.selectedCard .media-content,
.selectedCard .timing {
  background-color: #23d160;
  color: white !important;
}

.disabledCard .media-content {
  opacity: 0.5;
}

.disabledCard .media-left {
  background-color: #ff3860;
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
  margin: auto;
}

.myBtn {
  position: fixed;
  bottom: 25vh;
}
</style>
