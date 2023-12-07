<script setup>

    import ProjectBarComponent from './ProjectBarComponent.vue'
    import ImportButton from './ImportButton.vue'

</script>

<template>
  <ProjectBarComponent/>
  <ProjectBarComponent/>
  <ProjectBarComponent/>
  <ProjectBarComponent/>
  <ImportButton :selected-images="selectedImages"/>
</template>

<style scoped>

</style>
