<template>
<section class="columns container is-vcentered">
  <div class="column is-size-1 has-text-centered has-text-weight-bold">
    Do not forget to collect your receipt!
  </div>
</section>
</template>

<script>
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
    setTimeout(returnToHome, 10000)
  }
}
</script>

<style scoped>
  </style>
