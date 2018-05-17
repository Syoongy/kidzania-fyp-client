<template>
<div>
  <section class="hero">
    <i class="mdi mdi-arrow-left mdi-48px mdi-light" @click="$router.go(-1);"></i>
    <div class="hero-body">
      <h1 id="title">
          {{$store.state.pageName}}
      </h1>
    </div>
  </section>
  <nuxt/>
</div>
</template>

<script>
let scannedArray = [];
let scannedID = '';
export default {

  mounted() {
    let self = this;
    window.onkeypress = function(e) {
      if (e.key == 'Enter') {
        scannedID = scannedArray.join('');
        scannedArray = [];
        if (self.$store.state.scannedID == '') {
          self.$store.commit('setScannedID', scannedID);
          self.$router.push(`home`);
          scannedID = '';
        } else {
          console.dir(scannedID);
          self.$store.commit('setScannedID', scannedID);
          self.$router.push(`home`);
          scannedID = '';
        }
      } else {
        scannedArray.push(e.key);
      }
    }
  }
}
</script>

<style>

html {
  background-color: #F8FAF4;
  overflow: hidden;
}

.mdi {
  position: fixed;
  margin-left: 10px;
  margin-top: 3px;
  cursor: pointer;
}

.hero {
  background-color: #03A9F4;
}

.material-icons {
  position: fixed;
  padding: 12px;
  color: white;
}

.hero-body {
  align-self: center;
  padding: 10px;
}

#title {
  color: white;
  position: relative;
  font-weight: bold;
  font-size: 36px;
}

.container {
  background-color: #FFF;
  height: 800px;
  width: 85%;
  margin: 50px auto 100px auto;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
  border-radius: 15px;
}

</style>
