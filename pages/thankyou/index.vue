<template>
  <div id="app">
    <section class="columns myContainer container is-vcentered">
      <img src="~/static/img-thankyou.png" alt="Thank You">
      <div
        class="column is-size-1 has-text-centered has-text-weight-bold"
      >PleeZ remember to collect your receipt.
        <br>
        <br>ZanK-U!
      </div>
    </section>
  </div>
</template>


<script scoped>
export default {
  data() {
    return {
      timer: null
    };
  },
  mounted() {
    const self = this;
    this.$store.commit("setScannedID", "");
    this.$store.commit("setPageTitle", "");
    for (let b of this.$store.state.allBookingDetails) {
      self.$store.commit("popBookingDetails");
    }
    this.$store.commit("setScannedID", "");
    this.$store.commit("setPageTitle", "");
    this.$store.commit("setBookingCart", {});
    this.$store.commit("setBookingDetail", {});
    this.$store.commit("setConfirming", false);

    function returnToHome() {
      self.$router.push("/");
    }
    this.timer = setTimeout(returnToHome, 5000);
  },
  beforeDestroy() {
    if (this.timer) {
      console.log("clearing");
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style scoped>
img {
  height: 40%;
  width: 36%;
  margin: 50px;
}
</style>
