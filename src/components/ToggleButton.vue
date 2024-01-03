<script setup>
import { ref } from 'vue'
import ProjectList from './ProjectView/ProjectList'
import ImageCarousel from './ImageCarousel'

const isCarouselView = ref(true)

const toggleView = () => {
  isCarouselView.value = !isCarouselView.value
}

</script>

<template>     
  <v-btn @click="toggleView">
    <div v-if="isCarouselView">List Display</div>
    <div v-else> Image Display </div>
  </v-btn>
  <div v-if="isCarouselView">
    <ImageCarousel/>
  </div>
  <div v-else>
    <ProjectList/>
  </div>
</template>
