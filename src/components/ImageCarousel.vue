<script setup>

import { reactive } from 'vue'
import MockData from '../assets/MockData.JSON'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const state = reactive({
    currentSlide: 0,
    selectedImages: []
})

const handleThumbnailClick = (item, index) => {


    // Updates current slide index
    state.currentSlide = index
    if (!state.selectedImages.find(img => img.basefile_name === item.basefile_name)) {
        state.selectedImages.push(item)
    }
}


// Refs for the carousels (if needed)
// const mainCarousel = ref(null);
// const thumbnailsCarousel = ref(null);

</script>

<template>
    <!-- Main Carousel -->
    <Carousel id="gallery" :items-to-show="1" :wrap-around="false" transition="0" v-model="state.currentSlide">
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
    v-model="state.currentSlide"
    ref="carousel"
  >
    <Slide v-for="(item, index) in MockData" :key="index">
      <div class="thumbnail__item" @click="handleThumbnailClick(item, index)">
        <!-- Thumbnail Image -->
        <img :src="require('@/assets/' + item.image)" :class="{'selected-thumbnail': currentSlide === index}" class="thumbnail__item"/>
      </div>
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel>
  </template>

<style scoped>
.carousel__item {
  text-align: center;
  /* Additional styling as needed for carousel item */
}

.thumbnail__item {
  max-width: 200px;
  max-height: 160px;
  object-fit: cover;
  margin: 0 auto;
}

.selected-thumbnail {
  border: 4px solid yellow;
}
</style>