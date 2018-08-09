<template>
<div id="app">
  <section class="columns myContainer container is-vcentered">
    <img src="~/static/img-thankyou.png" alt="Thank You" />
    <div class="column is-size-1 has-text-centered has-text-weight-bold">
      Please do not forget to collect your receipt! <br /><br /> Thank You!
    </div>
  </section>
</div>
</template>


<script scoped>
export default {
  data() {
    return {
      timer: null
    }
  },
  mounted() {
    let self = this;
    this.$store.commit('setScannedID', '');
    this.$store.commit('setPageTitle', '');

    function returnToHome() {
      self.$router.push('/');
    }
    this.timer = setTimeout(returnToHome, 5000);
  },
  onDestroy() {
    clearTimeout(this.timer);
  }
}
</script>

<style scoped>
img {
  height: 40%;
  width: 36%;
  margin: 50px;
}
</style>
