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
            <a class="button is-success is-rounded is-large is-fullwidth" @click="confirmBooking">Print receipt to confirm</a>
          </div>
          <div class="column is-5">
            <a class="button is-danger is-rounded is-large is-fullwidth" @click="confirmChange">Change Booking</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
  //import isEmpty from 'dictionary-es-empty.js'
      function WebFormData(ssId, sId, rId, rfid, status) {
        this.session_id = ssId,
        this.station_id = sId,
        this.role_id = rId,
        this.rfid = rfid,
        this.status = status
      }

      export default {
          methods: {
              confirmChange() {
                  this.$dialog.confirm({
                      title: 'Oh no!',
                      message: 'You can only have one booking at a time. Press OK to change your current booking',
                      confirmText: 'OK',
                      type: 'is-danger',
                      hasIcon: true,
                      size: 'is-large',
                      onConfirm: () => this.$router.push('/station')
                  })
              },
              async confirmBooking(){
                let self = this;
                let bookingDetail = this.$store.state.bookingDetail;
                console.dir(bookingDetail);
                if (Object.keys(bookingDetail).length !== 0 && bookingDetail.constructor === Object) {
                  let webFormData = new WebFormData(bookingDetail.session_id, bookingDetail.station_id, bookingDetail.role_id, self.$store.state.scannedID, "Cancelled");
                  let res = await self.$axios.$put('/bookings/cancelBooking',
                      webFormData, {
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      });
                  console.log(res)
                  webFormData = new WebFormData(self.$store.state.bookingCart.timeSlot.session_id, self.$store.state.bookingCart.station.station_id, self.$store.state.bookingCart.role, self.$store.state.scannedID, "Confirmed");
                  console.dir(webFormData);
                  res = await self.$axios.$post('/bookings/makeBooking',
                      webFormData, {
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      });

                  self.$router.push('/thankyou')
                }else {
                  let webFormData = new WebFormData(self.$store.state.bookingCart.timeSlot.session_id, self.$store.state.bookingCart.station.station_id, self.$store.state.bookingCart.role, self.$store.state.scannedID, "Confirmed");
                  console.dir(webFormData);
                  self.$axios.$post('/bookings/makeBooking',
                      webFormData, {
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      })
                  self.$router.push('/thankyou')
                }

              },
              setImagePath(role_id){
                let self = this
                this.dataList.forEach(function(station) {
                  if(station.station_id == self.stationID){
                    station.roles.forEach(function(role) {
                      if(role.role_id == role_id){
                        self.roleImagePath = require('~/static/' + role.imagepath);
                        self.roleName = role.role_name;
                      }
                    });
                  }
                });
              }
          },
          data() {
            return {
              role_id: "",
              roleName: "",
              stationName: "",
              sessionStartTime: "",
              sessionEndTime:"",
              roleImagePath:"",
              stationID:"",
              dataList: this.$store.state.stationsList
            }
          },
          created() {
            //axios.get(`http://localhost:8000/bookings/checkBooking/${this.$store.state.scannedID}`)
            let booking = this.$store.state.bookingCart;
            console.dir(booking)
            //self.$store.commit('setBookingDetail', booking);
            this.role_id = booking.role;
            this.stationName = booking.station.station_name;
            this.stationID = booking.station.station_id;
            this.sessionStartTime = booking.timeSlot.session_start;
            this.sessionEndTime = booking.timeSlot.session_end;
            this.setImagePath(this.role_id);
            // axios.get(`http://localhost:8000/bookings/${this.$store.state.scannedID}`)
            //   .then((res) => {
            //     if(res.status == "200") {
            //       let booking = this.$store.state.bookingCart;
            //       console.dir(booking)
            //       //self.$store.commit('setBookingDetail', booking);
            //       this.role_id = booking.role;
            //       this.stationName = booking.station.station_name;
            //       this.stationID = booking.station.station_id;
            //       this.sessionStartTime = booking.selectedTimeSlot.session_start;
            //       this.sessionEndTime = booking.selectedTimeSlot.session_end;
            //       this.setImagePath(booking.role_id);
            //     }
            //     else {
            //       console.dir(res.status);
            //     }
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //   });
          },
          beforeCreate() {
            this.$store.commit('setPageTitle', 'My Booking');
          },
      }
  </script>

<style scoped>
.dialog {
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
  width: 80%;
  margin: 0 auto;
  padding-top: 15%;
}

.myLevel {
  height: 100%;
}

#bookedWrapper {
  height: 100%;
}
</style>
