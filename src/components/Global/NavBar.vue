<script setup>
import UserMenu from './UserMenu.vue'

</script>

<template>
  <v-toolbar
    rounded
    color="var(--metal)"
  >
    <v-img
      class="ms-6"
      max-height="30"
      max-width="30"
      min-width="30"
      contain
      src="../../assets/PTR-lambda.png"
    />
    <v-toolbar-title class="nav-text">
      DATALAB
    </v-toolbar-title>
    <v-tabs>
      <v-tab
        class="nav-text"
        to="/projects"
      >
        Projects
      </v-tab>
      <v-tab
        class="nav-text"
        to="/datasessions"
      >
        Data Sessions
      </v-tab>
    </v-tabs>
    <template #append>
      <user-menu />
    </template>
  </v-toolbar>
</template>
<style scoped>
  .nav-text {
  color: var(--tan);
  font-weight: 600;
  font-size: 1rem;
  }
</style>

