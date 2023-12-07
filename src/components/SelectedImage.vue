<script setup>

    import ProjectBar from './ProjectBar.vue'
    import ImportButton from './ImportButton.vue'

</script>

<template>
  <ProjectBar/>
  <ProjectBar/>
  <ProjectBar/>
  <ProjectBar/>
  <ImportButton :selected-images="selectedImages"/>
</template>

<style scoped>

</style>
