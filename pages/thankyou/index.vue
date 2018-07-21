<template>
<div id="app">
  <section class="columns myContainer container is-vcentered">
    <img src="~/static/img-thankyou.png" alt="Italian Trulli" />
    <div class="column is-size-1 has-text-centered has-text-weight-bold">
      Please do not forget to collect your receipt! <br /><br /> Thank You!
    </div>
  </section>
</div>
</template>


<script scoped>
export default {
  methods: {

  },
  beforeCreate() {
    this.$store.commit("setPageTitle", "Thank You");
  },
  mounted() {
    let self = this;

    function returnToHome() {
      self.$router.push('/');
      self.$store.commit("setPageTitle", "");
    }
    setTimeout(returnToHome, 5000)
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
