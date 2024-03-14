<script setup>
import ColorblindToggle from './ColorblindToggle.vue'

</script>

<template>
  <div class="navbar-wrapper">
    <nav class="navbar">
      <ol>
        <li class="nav-item">
          PROJECTS
        </li>
        <li class="nav-item">
          DATA SESSION
        </li>
        <li class="nav-item">
          <colorblind-toggle />
        </li>
      </ol>
    </nav>
  </div>
</template>

<style scoped>
.navbar-wrapper {
  display: inline;
}
.navbar {
  background-color: var(--metal);
  display: flex;
  align-items: center;
  height: 65px;
}
ol {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  list-style: none;
}
.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tan);
  font-weight: 600;
  font-size: 1.2rem;
  padding: 0 1rem;
}

</style>
