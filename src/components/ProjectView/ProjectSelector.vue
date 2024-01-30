<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { defineProps } from 'vue'
defineProps(['project'])

</script>

<template>
  <v-expansion-panel
    :title="project.projectTitle"
    :text="project.projectDescription"
  />
</template>
