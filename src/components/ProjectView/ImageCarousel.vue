<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const store = useStore()
const currentSlide = ref(0)
const props = defineProps(['data'])

let data = ref(props.data)

// Checking if image isSelected to either add or remove yellow borderline
const isSelected = (item) => store.getters.isSelected(item)

// Invoked any time an image is clicked
const handleThumbnailClick = (item, index) => {
	store.dispatch('toggleImageSelection', item)

	// Checking if there are any selected images after the toggle action
	if (store.state.selectedImages.length > 0) {
		const lastSelectedImage = store.state.selectedImages[store.state.selectedImages.length - 1]
		const lastSelectedIndex = data.value.findIndex(img => img.basename === lastSelectedImage.basename)
		currentSlide.value = lastSelectedIndex
	} else {
		currentSlide.value = index
	}
}
</script>

<template>
  <!-- Main Carousel -->
  <Carousel
    id="gallery"
    v-model="currentSlide"
    :items-to-show="1"
    :wrap-around="false"
    :transition="0"
  >
    <Slide
      v-for="(item, index) in data"
      :key="index"
    >
      <div class="carousel__item">
        <img
          :src="item.url"
          class="div__item"
          :alt="item.OBJECT"
        >
      </div>
    </Slide>
  </Carousel>

  <!-- Thumbnails Carousel -->
  <Carousel
    id="thumbnails"
    ref="carousel"
    v-model="currentSlide"
    :items-to-show="5"
    :wrap-around="false"
    :transition="0"
  >
    <Slide
      v-for="(item, index) in data"
      :key="index"
    >
      <div
        class="thumbnail__item"
        @click="handleThumbnailClick(item, index)"
      >
        <!-- Thumbnail Image -->
        <img
          :src="item.url"
          :class="{'selected-thumbnail': isSelected(item)}"
          class="thumbnail__item"
          :alt="item.OBJECT"
        >
      </div>
    </Slide>
    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</template>

<style scoped>
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
