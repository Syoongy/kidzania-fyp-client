<template>
<section class="container has-text-centered">
  <div class="subtitle">
    From the store = {{$store.state.scannedID}}
  </div>
  <a class="button is-primary" v-on:click="$router.push(`station`);">Primary</a>
</section>
</template>

<script>
export default {
  //middleware: 'scan'
}
</script>
