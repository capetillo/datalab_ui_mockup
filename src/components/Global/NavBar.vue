<script setup>
import ColorblindToggle from './ColorblindToggle.vue'

</script>

<template>
  <div class="navbar-wrapper">
    <nav class="navbar">
      <ul>
        <li class="nav-item">
          home
        </li>
        <li class="nav-item">
          not home
        </li>
      </ul>
      <colorblind-toggle />
    </nav>
  </div>
</template>

<style scoped>
.navbar-wrapper {
  display: inline
}
.nav-item {
  display: inline;
}
</style>
