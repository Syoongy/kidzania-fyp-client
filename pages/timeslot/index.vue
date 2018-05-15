<template>
  <div>
    <section class="container">

      <div class="level">

        <div class="level-item">
          <div class="card">
            <div class="media">
              <div class="media-left">
                <p class="noOfSlots">6</p>
                <p class="slots">slot(s) left</p>
              </div>
              <div class="media-content">
                <p class="timing">10:00AM-10:20AM</p>
              </div>
            </div>
          </div>
        </div>
      //testing
        <div class="level-item">
          <div class="card">
            <div class="media">
              <div class="media-left">
                <p class="noOfSlots">6</p>
                <p class="slots">slot(s) left</p>
              </div>
              <div class="media-content">
                <p class="timing">10:00AM-10:20AM</p>
              </div>
            </div>
          </div>
        </div>
        <div class="level-item">
          <div class="card">
            <div class="media">
              <div class="media-left">
                <p class="noOfSlots">6</p>
                <p class="slots">slot(s) left</p>
              </div>
              <div class="media-content">
                <p class="timing">10:00AM-10:20AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="level">

        <div class="level-item">
          <div class="card">
            <div class="media">
              <div class="media-left">
                <p class="noOfSlots">6</p>
                <p class="slots">slot(s) left</p>
              </div>
              <div class="media-content">
                <p class="timing">10:00AM-10:20AM</p>
              </div>
            </div>
          </div>
        </div>

        <div class="level-item">
          <div class="card">
            <div class="media">
              <div class="media-left">
                <p class="noOfSlots">6</p>
                <p class="slots">slot(s) left</p>
              </div>
              <div class="media-content">
                <p class="timing">10:00AM-10:20AM</p>
              </div>
            </div>
          </div>
        </div>
        <div class="level-item">
          <div class="card">
            <div class="media">
              <div class="media-left">
                <p class="noOfSlots">6</p>
                <p class="slots">slot(s) left</p>
              </div>
              <div class="media-content">
                <p class="timing">10:00AM-10:20AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="bookBtn"><a class="button is-danger is-rounded is-medium">Book</a></div>
    </section>
  </div>
</template>

<script>
  export default {
    beforeCreate() {
      this.$store.commit("setPageTitle", "Select Timeslot");
    }
  };
</script>

<style>
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
  .level{
    padding-top: 40px;
  }
</style>
