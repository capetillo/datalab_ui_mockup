<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { defineProps } from 'vue'
defineProps(['project'])

</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-title
      expand-icon="mdi-menu-down"
      class="projects_title"
    >
      {{ project.projectTitle }}
    </v-expansion-panel-title>
    <v-expansion-panel-text class="project_description">
      {{ project.projectDescription }}
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped>
.projects_title {
  letter-spacing: 0.1rem;
  font-size: 1.5rem;
  color: var(--tan);
  font-weight: 500; 
  background-color: var(--metal);
}
.project_description {
  font-size: 1.2rem;
  text-align: left;
  color: var(--light-gray);
}

@media (max-width: 1200px) {
  .projects_title {
    font-size: 1.1rem;
  }
  .project_description {
    font-size: 0.9rem;
  }
}
@media (max-width: 900px) {
  .projects_title {
    letter-spacing: 0.1rem;
    font-size: 0.9rem;
    font-weight: 500; 
  }
}
</style>
