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
    <v-toolbar-title 
      text="DATALAB"
      class="nav-text"
    />
    <v-tabs>
      <RouterLink to="/projects">
        <v-tab
          text="Projects"
          class="nav-text"
        />
      </RouterLink>
      <RouterLink to="/datasessions">
        <v-tab
          text="Data Sessions"
          class="nav-text"
        />
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
