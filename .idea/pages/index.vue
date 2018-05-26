<template>
<section class="hero">
  <div class="hero-body">
    <div class="container">
      <div class="columns  is-centered">
        <app-logo class="column is-narrow"/>
      </div>
      <h1 class="title has-text-centered">
        fyp-client-side
      </h1>
      <h2 class="subtitle has-text-centered">
        Scan to move on
      </h2>
    </div>
  </div>
</section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue';

export default {
  components: {
    AppLogo
  }
}
</script>
