<template>
  <div>
    <section class="container columns is-multiline">
        <div v-for="(timeslot, index) in dataList" :key="index" class="column is-one-third">
          <div class="card">
            <div class="media">
              <div class="media-left">
                <p class="noOfSlots">{{timeslot.capacity - timeslot.noBooked}}</p>
                <p class="slots">slot(s) left</p>
              </div>
              <div class="media-content">
                <p class="timing">{{timeslot.session_start}} - {{timeslot.session_end}}</p>
              </div>
            </div>
          </div>
        </div>
      <div id="bookBtn"><a class="button is-danger is-rounded is-medium">Book</a></div>
    </section>
  </div>
</template>

<script>
  import axios from "axios"
  export default {
    data() {
      return {
        dataList: []
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
        console.log('Fail')
        })
    }
  };
</script>

<style scoped>
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

  #bookBtn{
    padding-left: 500px;
    padding-top: 100px;
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
