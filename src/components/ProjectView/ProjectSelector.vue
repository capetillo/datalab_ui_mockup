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
  color: rgb(233,205,156);
  font-weight: 500; 
}
.project_description {
  font-size: 1.2rem;
  text-align: left;
  color: rgb(204, 208, 211);
}

@media (max-width: 1200px) {
  .projects_title {
    letter-spacing: 0.1rem;
    font-size: 1.1rem;
    color: rgb(233,205,156);
    font-weight: 500;
  }
  .project_description {
    font-size: 0.9rem;
  }
}
</style>
