<template>
<section class="main-container">
  <div class="level">
    <p id="text"> I want to <br /> become a(n): </p>
      <div class="level-item">
        <img src="~/static/pic_pilot.png" height="118" width="118" />
        <div><a class="button is-danger is-rounded is-medium">Pilot</a></div>
      </div>
      <div class="level-item">
        <img src="~/static/pic_cabincrew.png" height="188" width="188" />
        <div><a class="button is-danger is-rounded is-medium">Cabin Crew</a></div>
      </div>
    </div>
  <hr />
  <div class="level">
    <div id="selectedStation" class="level-item">
      <img src="~/static/pic_plane.png" height="180" width="180" />
      <p>Aviation Academy</p>
    </div>
    <p class="level-item" id="description">
      Get a rare opportunity to be inside a cockpit and have a taste of what it feels like to operate an aircraft!
      Work in the sky as you flash your brightest smile and serve the passengers on board the flight as an esteemed Cabin Crew!
    </p>
  </div>
</section>
</template>

<script>

</script>

<style>
#logo {
  position: absolute;
  right: 30px;
  bottom: 20px;
}

#text {
  color: #4D4D4D;
  font-size: 42px;
  font-weight: bold;
  text-align: center;
  padding-left: 160px;
  padding-top: 28px;
}

a {
  font-weight: bold;
  width: 160px;
}

.level-item {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

#selectedStation {
  font-weight: bold;
  color: #4D4D4D;
  font-size: 20px;
  padding-top: 20px;
}

#description {
  color: #4D4D4D;
  font-size: 18px;
  font-weight: 400;
  padding-top: 30px;
  margin-right: 180px;
  width: 100px;
  word-wrap: break-word;
}
</style>
