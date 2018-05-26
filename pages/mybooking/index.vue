<template>
    <div id="app">
      <section class="container is-centered" id="mySection">
        <div class="columns">
          <div class="column is-4 is-offset-1" >
            <img src="/pic_fireman.png"/>
          </div>
          <div class="column is-6" >
            <div class="dialog">

                <p style="margin:20px" class="title">Come join me as a Pilot at the Aviation Academy from 11:20AM to 11:40AM !</p>

              <div style="clear: both"></div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4 is-offset-2">
            <a class="button is-success is-rounded is-large">Print receipt</a>
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

<style>
  .dialog{
    position:relative;
    width:80%;
    height:80%;
    margin-right:auto;
    margin-top:10%;
    margin-bottom: auto;
    border:1px solid #a9a9a9;
    margin-left:45px;
    background-color: #fff;
    border-radius: 4px;
  }
  .dialog:before{
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    left:-59px;
    top:88px;
    border-top:26px solid transparent;
    border-right: 59px solid #a9a9a9;
  }
  .dialog:after{
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    left:-51px;
    top:89px;
    border-top:18px solid transparent;
    border-right: 51px solid #fff;
  }
</style>
