<template>
<section ref='loadingPage' id="app">
</section>
</template>

<script>
export default {
  mounted() {
    const self = this;
    const loadingComponent = this.$loading.open({
      container: this.$refs.loadingPage
    });
    setTimeout(() => loadingComponent.close(), 1000);
    setTimeout(() => self.$router.back(), 1000);
  }
}
</script>
