<template>
    <div id="app">
      <section class="container is-centered" id="mySection">
        <div class="columns">
          <div class="column is-4 is-offset-1" >
            <img src="/pic_fireman.png"/>
          </div>
          <div class="column is-6" >
            <p class="title">Come join me as a Pilot at the Aviation Academy from 11:20AM to 11:40AM !</p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4 is-offset-2">
            <a class="button is-success is-rounded is-large">Print receipt to confirm</a>
          </div>
          <div class="column is-4">
            <a class="button is-danger is-rounded is-large" @click="confirmChange">Change Booking</a>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
      import axios from "axios"
      export default {
          methods: {
              confirmChange() {
                  this.$dialog.confirm({
                      title: 'Oh no!',
                      message: 'You can only have one booking at a time. Press OK to change your current booking',
                      confirmText: 'OK',
                      type: 'is-danger',
                      hasIcon: true,
                      onConfirm: () => this.$toast.open('Booking Changed!')
                  })
              },
              getStations() {
  
              }
          },
          created() {
            axios.get('http://localhost:8000/stations/getAvailableTimeslots')
            .then((res) => {
              console.log(res.data)
              console.log('Success')
            })
            .catch((err) => {
              console.log('Fail')
            })
          },
          beforeCreate() {
            this.$store.commit('setPageTitle', 'My Booking');
          },
      }
  </script>
  