<template>
<section class="columns container is-vcentered">
  <div class="column is-size-1 has-text-centered has-text-weight-bold">
    Do not forget to collect your receipt!
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
  </style>
