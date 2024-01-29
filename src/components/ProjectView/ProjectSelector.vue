<!-- eslint-disable vue/require-prop-types -->
<script setup>
defineProps(["project"])

</script>

<template>
  <v-expansion-panel
    :title="project.projectTitle"
    :text="project.projectDescription"
  />
</template>
