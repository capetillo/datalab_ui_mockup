<script setup>
import { ref } from 'vue'
import ProjectImages from './ProjectView/ProjectImages'
import ImageCarousel from './ImageCarousel'

const isCarouselView = ref(true)

const toggleView = () => {
  isCarouselView.value = !isCarouselView.value
}

</script>

<template>
    <v-btn @click="toggleView">
    TOGGLE
    </v-btn>
   
  <div v-if="isCarouselView">
    <ImageCarousel/>
  </div>

  <div v-else>
    <ProjectImages/>
  </div>
</template>