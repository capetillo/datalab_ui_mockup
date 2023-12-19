<script setup>
import { reactive } from 'vue'
import MockData from '../assets/MockData.JSON'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

// Will move state to parent component or store
const state = reactive({
    currentSlide: 0,
    selectedImages: []
})

// Gets invoked when thumbnail images are selected and does 2 things:
// 1. toggles the status of thumbnail images to add and remove from state
// 2. updates the current slide (displayed image) 
const handleThumbnailClick = (item, index) => {
 // Toggles the selection of thumbnail iamages
 const existingIndex = state.selectedImages.findIndex(img => img.basefile_name === item.basefile_name)
    if (existingIndex >= 0) {
        // Remove the image from selectedImages if it's already there
        state.selectedImages.splice(existingIndex, 1)
    } else {
        // Add the image to selectedImages if it's not already there
        state.selectedImages.push(item)
    }
    // Update the current slide to the last image in the selectedImages array, or the clicked image if none are selected
    if (state.selectedImages.length > 0) {
        const lastSelectedImage = state.selectedImages[state.selectedImages.length - 1]
        const lastSelectedIndex = MockData.findIndex(img => img.basefile_name === lastSelectedImage.basefile_name)
        state.currentSlide = lastSelectedIndex
    } else {
        state.currentSlide = index
    }
}

// Method to check if a thumbnail image is selected
const isSelected = (item) => {
    return state.selectedImages.some(selectedItem => selectedItem.basefile_name === item.basefile_name);
}
</script>

<template>
    <!-- Main Carousel -->
    <Carousel id="gallery" :items-to-show="1" :wrap-around="false" transition=0 v-model="state.currentSlide">
      <Slide v-for="(item, index) in MockData" :key="index">
        <div class="carousel__item">
          <img :src="require('@/assets/' + item.image)" class="div__item"/>
        </div>
      </Slide>
    </Carousel>
  
    <!-- Thumbnails Carousel -->
    <Carousel
    id="thumbnails"
    :items-to-show="5"
    :wrap-around="false"
    transition=0
    v-model="state.currentSlide"
    ref="carousel"
  >
    <Slide v-for="(item, index) in MockData" :key="index">
      <div class="thumbnail__item" @click="handleThumbnailClick(item, index)">
        <!-- Thumbnail Image -->
        <img :src="require('@/assets/' + item.image)"  :class="{'selected-thumbnail': isSelected(item)}" class="thumbnail__item"/>
      </div>
    </Slide>
    <template #addons>
      <Navigation/>
    </template>
  </Carousel>
  </template>

<style scoped>
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
  border: 4px solid rgb(241, 183, 36)
}
</style>