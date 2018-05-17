<template>
<div id="app">
  <section class="mySection container columns is-multiline">

    <div class="column is-one-third" v-for="(station, index) in dataList" :key="index">
      <img :src="`${station.imgLoc}`"/>
      <!-- <img class="ellipse" src="~/static/images/ellipse.png" height="228" width="228" /> -->
      <a class="button is-danger is-rounded is-medium">{{station.name}}</a>
    </div>

  </section>
</div>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.commit('setPageTitle', 'Select Station');
  },
  data() {
    return {
      dataList: [
        {
          imgLoc: "pic_pizza.png",
          name: "Pizza Shop"
        },
        {
          imgLoc: "pic_fireman.png",
          name: "Fire Station"
        },
        {
          imgLoc: "pic_plane.png",
          name: "Aviation Academy"
        },
        {
          imgLoc: "pic_plane.png",
          name: "Aviation Academy"
        },
        {
          imgLoc: "pic_plane.png",
          name: "Aviation Academy"
        },
        {
          imgLoc: "pic_plane.png",
          name: "Aviation Academy"
        },
        {
          imgLoc: "pic_plane.png",
          name: "Aviation Academy"
        },
        {
          imgLoc: "pic_plane.png",
          name: "Aviation Academy"
        },
        {
          imgLoc: "pic_plane.png",
          name: "Aviation Academy"
        }
      ]
    }
  }
}
</script>

<style>
#logo {
  position: absolute;
  right: 30px;
  bottom: 0;
}

.column {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

img {
  margin-bottom: 20px;
  /* z-index: 1; */
  height: 200px;
}

/* .ellipse {
  position: absolute;
  top: 160px;
  z-index: 0;
} */

a {
  font-weight: bold;
  width: 65%;
}

.box1 {
  padding-top: 78px;
}

.mySection {
  overflow-y: auto;
}

::-webkit-scrollbar {
  display: none;
}
</style>
