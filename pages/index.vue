<template>
<section id="background"></section>
</template>

<script>
export default {
  beforeCreate() {
    let self = this;
    for (let b of this.$store.state.allBookingDetails) {
      self.$store.commit('popBookingDetails');
    }
    this.$store.commit('setScannedID', '');
    this.$store.commit('setPageTitle', '');
    this.$store.commit('setBookingCart', {});
    this.$store.commit('setBookingDetail', {});
    this.$store.commit('setConfirming', false);
  }
}
</script>

<style>
#background {
  background-image: url('~static/img-default.svg');
  width: 100%;
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
