
<script setup>
import { ref, defineProps } from 'vue'
import { useStore } from 'vuex'
import { Carousel, Slide  } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'


const store = useStore()
const currentSlide = ref(0)
const props = defineProps(['data'])
let smallImageBasename = ref('')
let largeImageSrc = ref('')

let data = ref(props.data)

// Checking if image isSelected to either add or remove yellow borderline
const isSelected = (item) => store.getters.isSelected(item)

// Getting large images by using the thumbnail's basename and finding the large image that matches it
const getLargeImageSource = () => {
	const largeImages = store.state.largeImageCache
	let selectedLargeImage = largeImages.find(obj => obj.basename.replace('-large', '') === smallImageBasename.value)
	largeImageSrc.value = selectedLargeImage ? selectedLargeImage.url : ''
}

// Invoked any time an image is clicked
const handleThumbnailClick = (item, index) => {
	store.dispatch('toggleImageSelection', item)
	// Checking if there are any selected images after the toggle action
	if (store.state.selectedImages.length > 0) {
		const lastSelectedImage = store.state.selectedImages[store.state.selectedImages.length - 1]
		const lastSelectedIndex = data.value.findIndex(img => img.basename === lastSelectedImage.basename)
		currentSlide.value = lastSelectedIndex
		// Used to get large images
		smallImageBasename.value = lastSelectedImage.basename.replace('-small', '')
	} else {
		currentSlide.value = index
	}
	getLargeImageSource()
}

const getImageSrc = (src) => {
	return src || store.getters.firstLargeImage || ''
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
          :src="getImageSrc(largeImageSrc)"
          class="selected__image"
          :alt="item.OBJECT"
        >
      </div>
    </Slide>
  </Carousel>
  <div
    id="thumbnails"
    class="thumbnail__carousel__container"
  >
    <div
      v-for="(item, index) in data"
      :key="index"
      class="thumbnail__container"
      @click="handleThumbnailClick(item, index)"
    >
      <!-- Use lazy-src for lazy loading -->
      <v-img
        :src="item.url"
        :lazy-src="item.url"
        height="160"
        width="200"
        cover
        class="thumbnail__item"
        :class="{'selected-thumbnail': isSelected(item)}"
        :alt="item.OBJECT"
      />
    </div>
  </div>
</template>

<style scoped>

#gallery {
  height: auto;
}

.carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected__image {
  transform: scale(0.8);
  object-fit: contain;
}
.thumbnail__carousel__container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  padding: 10px 0;
}

.thumbnail__container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: calc(20% - 20px)
}

.thumbnail__item {
  max-width: 100%;
  max-height: 160px;
  object-fit: cover;
}

.selected-thumbnail {
  border: 4px solid rgb(241, 183, 36);
}
.thumbnail__carousel__container::-webkit-scrollbar {
  display: none;
}

.thumbnail__carousel__container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
@media (max-width: 768px) {
  .thumbnail__carousel__container {
    overflow-x: auto;
  }
}
</style>
