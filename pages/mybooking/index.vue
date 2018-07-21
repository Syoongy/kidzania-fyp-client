<template>
  <div id="app">
    <section class="container is-centered myContainer" id="mySection">
      <div v-if="isBooked" class="columns is-desktop is-multiline is-vcentered" id="bookedWrapper">
        <div class="column is-12">
          <div class="columns">
            <div class="column is-3 is-offset-2" >
              <figure class="image is-3by4" id="roleImage">
                <img :src="roleImagePath"/>
              </figure>
            </div>
            <div class="column is-6" >
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
              <a class="button is-success is-rounded is-large is-fullwidth"><b>Print receipt</b></a>
            </div>
            <div class="column is-5">
              <a class="button is-danger is-rounded is-large is-fullwidth" @click="confirmChange" ><b>Change Booking</b></a>
            </div>
          </div>
        </div>
    </div>
    <div v-else class="level myLevel">
      <div class="level-item has-text-centered">
        <div>
          <p class="title">You currently have no Bookings</p>
          <br />
          <div class="columns is-centered has-text-centered">
            <a class="button is-danger is-rounded is-large is-fullwidth" @click="$router.push(`station`);"><b>Start Booking</b></a>
          </div>
        </div>
      </div>
    </div>
    </section>
  </div>
</template>

<script>
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
                    onConfirm: () => this.$router.push('station')
                })
            },
            scanRFID(){
            },
            setImagePath(role_id){
              let self = this
              this.dataList.forEach(function(station) {
                if(station.station_id == self.stationID){
                  station.roles.forEach(function(role) {
                    if(role.role_id == role_id){
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
            // role_id: this.$store.state.bookingDetail.role_id,
            // roleName: "",
            // stationName: this.$store.state.bookingDetail.station_name,
            // isBooked: this.$store.state.bookingDetail.isBooked,
            // sessionStartTime: this.$store.state.bookingDetail.session_start,
            // sessionEndTime: this.$store.state.bookingDetail.session_end,
            // roleImagePath:"",
            // stationID: this.$store.state.bookingDetail.station_id,
            // dataList: this.$store.state.stationsList
            role_id: "",
            roleName: "",
            stationName: "",
            isBooked: "",
            sessionStartTime: "",
            sessionEndTime: "",
            roleImagePath:"",
            stationID: "",
            dataList: this.$store.state.stationsList
          }
        },
        beforeCreate() {
          this.$store.commit('setPageTitle', 'My Booking');
        },
        created() {
          console.log('created');
          let booking = this.$store.state.bookingDetail;
          console.log(booking)
          if(Object.keys(booking).length !== 0 && booking.constructor === Object) {
            this.role_id = booking.role_id;
            this.stationName = booking.station_name;
            this.sessionStartTime = booking.session_start;
            this.sessionEndTime = booking.session_end;
            this.stationID = booking.station_id;
            this.setImagePath(booking.role_id);
            this.isBooked = true;
          }
          else {
            this.isBooked = false;
          }
        },
        mounted() {
        }
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
