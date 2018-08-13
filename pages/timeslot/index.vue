<template>
<div id="app">
  <section class="myContainer container columns is-multiline is-centered">
    <b-tabs type="is-toggle" size="is-large" class="container" expanded v-if="dataList.length > 0">
      <b-tab-item :label="'Page ' + i" v-for="i in Math.ceil(dataList.length / 8)" :key="i" class="columns is-multiline is-centered myTabItem">
        <div v-for="timeslot in dataList.slice((i-1)*8, i*8)" :key="timeslot.session_id" class="column is-one-quarter" :class="{selectedCard : selectedIndex == timeslot.session_id}">
          <div class="card myCard" @click="selectTimeSlot(timeslot, timeslot.session_id)" :class="{disabledCard: isDisabled(timeslot.capacity - timeslot.noBooked, timeslot.session_id)}">
            <div class="media fullHeight">
              <div class="media-left fullHeight">
                <div class="centerTextBox" v-if="timeslot.session_id != selectedTimeSlot.session_id">
                  <p class="has-text-weight-bold is-size-4 has-text-centered">{{timeslot.capacity - timeslot.noBooked}}</p>
                </div>
                <div class="centerTextBox" v-if="timeslot.session_id != selectedTimeSlot.session_id">
                  <p class="has-text-centered is-size-5">slot(s) left</p>
                </div>
                <div class="centerTextBox fullHeight" v-if="timeslot.session_id == selectedTimeSlot.session_id">
                  <p class="has-text-centered has-text-weight-bold is-size-4">✓</p>
                </div>
              </div>
              <div class="media-content centerTextBox fullHeight">
                <p class="has-text-centered has-text-weight-bold is-size-4" :class="{selectedCard : selectedIndex == timeslot.session_id}">{{timeslot.session_start}}<br /> - <br /> {{timeslot.session_end}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
    <div class="column is-one-third myBtn" v-if="dataList.length > 0">
      <a class="button is-danger is-rounded is-large is-fullwidth" @click="makeBooking()" :disabled="disabled">Book</a>
    </div>

    <div class="column is-half level" v-else>
      <p class="level-item has-text-weight-bold is-size-2 has-text-grey">There are <b>&nbsp;no slots&nbsp;</b> left for the day.</p>
    </div>
  </section>
</div>
</template>

<script>
import isEmpty from "~/plugins/dictionary-is-empty.js"

export default {
  methods: {
    isDisabled(noBooked, index) {
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
      let check = true;
      let prevBooking = this.$store.state.bookingDetail;
      console.log(prevBooking.session_id);
      console.log(this.selectedTimeSlot.session_id);
      if (!isEmpty(prevBooking)) {
        if (this.selectedTimeSlot.session_id === prevBooking.session_id) {
          check = false
        }
      }
      if (this.disabled === false && check) {
        this.socket.emit('makeBooking', this.selectedTimeSlot.session_id);
        this.$store.commit('addTimeSlotToCart', this.selectedTimeSlot);
        this.$router.push('mybooking/confirmation');
      } else {
        this.$dialog.alert({
          title: 'Error',
          message: 'This is your current time slot.<br />PleeZ select a <b>different</b> one.',
          confirmText: 'Ok',
          size: 'is-large',
          type: 'is-danger'
        })
      }
    }
  },
  data() {
    return {
      dataList: [],
      selectedIndex: null,
      selectedTimeSlot: {},
      disabled: true,
      socket: null
    }
  },
  async beforeMount() {
    let roleId = this.$store.state.bookingCart.role;
    let res = await this.$axios.$get(`/sessions/getSessionList/${roleId}`)
    this.dataList = res
    console.log(this.dataList.length)
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
  mounted() {
    this.$store.commit("setPageTitle", "Select Timeslot");
  }
};
</script>

<style scoped>
.myTabItem {
  height: 50vh;
}

.myCard {
  background: linear-gradient(to right, #23d160 50%, white 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 0.3s ease;
  height: 50%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: auto;
  width: 100%;
}

.selectedCard .card,
.selectedCard .media-content,
.selectedCard .timing {
  /* background-color: #23d160; */
  color: white !important;
  background-position: left bottom;
  /* transition: width 0.5s; */
}

.disabledCard {
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
  word-wrap: break-word;
}

.fullHeight {
  height: 100% !important;
}

.centerTextBox {
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-left {
  background-color: #23d160;
  width: 25%;
  color: white;
  margin-right: 0;
}

.media-content {
  width: 20vh;
}

/* .card {
  height: 50%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: auto;

}*/

.myBtn {
  position: fixed;
  bottom: 20vh;
}
</style>
