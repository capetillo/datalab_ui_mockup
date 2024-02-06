<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { defineProps } from 'vue'
defineProps(['project'])

</script>

<template>
  <v-expansion-panel
    :title="project.projectTitle"
    :text="project.projectDescription"
    class="custom-description"
  />
</template>

<style scoped>
.custom-description {
  padding: 2rem;
  font-size: 1.5rem;
}
</style>
