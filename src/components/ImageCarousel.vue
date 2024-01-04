<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import MockData from '../assets/MockData.JSON'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import ProjectBar from './ProjectBar.vue'


const store = useStore()
const currentSlide = ref(0)

// Checking if image isSelected to either add or remove yellow borderline
const isSelected = (item) => store.getters.isSelected(item)

// Invoked any time an image is clicked
const handleThumbnailClick = (item, index) => {
  // Dispatch an action to toggle the selection status of the clicked image
  // This will add the image to the selectedImages array in the store if it's not there
  // or remove it if it is already in the array
  store.dispatch('toggleImageSelection', item)

  // Checking if there are any selected images after the toggle action
  if (store.state.selectedImages.length > 0) {
    // If there are selected images, then we find the last selected image
    const lastSelectedImage = store.state.selectedImages[store.state.selectedImages.length - 1]
    // Then we find the index of the last selected image in the MockData array
    // This is used to set the current slide to the last selected image
    const lastSelectedIndex = MockData.findIndex(img => img.basefile_name === lastSelectedImage.basefile_name)
    // Set the current slide to the last selected image
    currentSlide.value = lastSelectedIndex
  } else {
    // If no images are selected, set the current slide to the index of the clicked image
    // This ensures that the carousel shows the clicked image
    currentSlide.value = index;
  }
}
  // Used for ProjectBar (temporarily)
  let selectedProject = ref('no project selected')

  const handleProjectSelection = (projectTitle) => {
    selectedProject.value = projectTitle
  }
  
</script>

<template>
  <div class="project-bar-wrapper">
    <ProjectBar @update:selectedProject="handleProjectSelection" class="project-bar"/>
    <!-- Main Carousel -->
    <Carousel id="gallery" :items-to-show="1" :wrap-around="false" transition=0 v-model="currentSlide">
      <Slide v-for="(item, index) in MockData" :key="index">
        <div class="carousel__item">
          <img :src="require('@/assets/' + item.image)" class="div__item"/>
        </div>
      </Slide>
    </Carousel>
  </div>

  <!-- Thumbnails Carousel -->
  <Carousel
    id="thumbnails"
    :items-to-show="5"
    :wrap-around="false"
    transition=0
    v-model="currentSlide"
    ref="carousel"
  >
    <Slide v-for="(item, index) in MockData" :key="index">
      <div class="thumbnail__item" @click="handleThumbnailClick(item, index)">
        <!-- Thumbnail Image -->
        <img :src="require('@/assets/' + item.image)" :class="{'selected-thumbnail': isSelected(item)}" class="thumbnail__item"/>
      </div>
    </Slide>
    <template #addons>
      <Navigation/>
    </template>
  </Carousel>
</template>

<style scoped>

.project-bar-wrapper {
  display: flex;
  align-items: flex-start; /* Aligns items at the start of the container */
  justify-content: space-between; /* Spaces out the items */
}

.project-bar {
  width: 20%; /* Adjust width as needed */
  /* Ensure no extra margin or padding is causing misalignment */
  margin: 0;
  padding: 2%;
}

#gallery{
  width: 75%;
  margin: 0;
  padding: 0;
}
.carousel__item {
  text-align: center;
}

.thumbnail__item {
  max-width: 200px;
  max-height: 160px;
  object-fit: cover;
  margin: 0 auto;
}

.selected-thumbnail {
  border: 4px solid rgb(241, 183, 36);
}
</style>
