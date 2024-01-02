<script setup>
import { ref } from 'vue'
import ProjectImages from './ProjectView/ProjectImages'
import ProjectList from './ProjectView/ProjectList.vue'

const isCarouselView = ref(true)

const toggleView = () => {
  isCarouselView.value = !isCarouselView.value
  console.log("Toggled, new value:", isCarouselView.value)
}

</script>

<template>
    <v-btn @click="toggleView">
    TOGGLE
    </v-btn>
   
  <div v-if="isCarouselView">
    <ProjectImages/>
  </div>

  <div v-else>
    <ProjectList/>
  </div>
</template>