<template>
<section class="columns container is-vcentered">
  <img src="~/static/img-thankyou.png" alt="Italian Trulli" />
  <div class="column is-size-1 has-text-centered has-text-weight-bold">
    Please do not forget to collect your receipt! <br /><br /> Thank You!
  </div>
</section>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.commit("setPageTitle", "Thank You");
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
