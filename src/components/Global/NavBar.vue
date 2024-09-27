<script setup>
import { RouterLink } from 'vue-router'
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
      <RouterLink to="/projects">
        <v-tab
          class="nav-text"
        >
          Projects
        </v-tab>
      </RouterLink>
      <RouterLink to="/datasessions">
        <v-tab
          class="nav-text"
        >
          Data Sessions
        </v-tab>
      </RouterLink>
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
