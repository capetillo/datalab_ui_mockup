
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

// SAVING THIS CODE WHEN WE HAVE TO SAVE LAZY LOADED IMAGES IN STORE

// const loadImage = (index) => {
// 	return index <= currentSlide.value + 6
// }

// const handleScroll = () => {
// 	const carousel = document.getElementById('thumbnails')
// 	if (!carousel) return

// 	const containerWidth = carousel.offsetWidth
// 	// Calculating thumbnail width, scrolling position, and finding the currentSlide based on the scrollPosition
// 	const thumbnailWidth = containerWidth * 0.2 - 20 
// 	const scrollPosition = carousel.scrollLeft
// 	const visibleThumbnails = Math.floor(scrollPosition / thumbnailWidth)

// 	// Updating the currentSlide reactive variable
// 	currentSlide.value = visibleThumbnails
// }

// onMounted(() => {
// 	const carousel = document.getElementById('thumbnails')
// 	if (carousel) {
// 		carousel.addEventListener('scroll', handleScroll, { passive: true })
// 	}
// })

// onUnmounted(() => {
// 	const carousel = document.getElementById('thumbnails')
// 	if (carousel) {
// 		carousel.removeEventListener('scroll', handleScroll)
// 	}
// })

// watch(currentSlide, (newValue) => {
// 	for (let i = newValue; i <= newValue + 3 && i < data.value.length; i++) {
// 		const imageToLoad = data.value[i]
// 		imageToLoad.loaded = true
// 	}
// }, { immediate: true })

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
      <div class="selected__item">
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
        loading="lazy"
        cover
        class="thumbnail__item"
        :class="{'selected-thumbnail': isSelected(item)}"
        :alt="item.OBJECT"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
#gallery {
  height: auto;
}
.selected__item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  margin-top: -3rem;
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
  padding: 0.3rem 0;
}
.thumbnail__container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: calc(20% - 20px)
}
.thumbnail__item {
  transform: scale(0.7);
  object-fit: cover;
}
.selected-thumbnail {
  border: 0.5rem solid $dark-green;
}
.thumbnail__carousel__container::-webkit-scrollbar {
  display: none;
}
.thumbnail__carousel__container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
@media (max-width: 1200px) {
  .selected__image {
    max-height: 70vh; 
    object-fit: contain; 
    transform: scale(0.95); 
  }
  .thumbnail__carousel__container {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    padding: 0;
  }
  .thumbnail__container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: calc(25% - 20px)
  }

  .thumbnail__item {
    transform: scale(0.75);
    object-fit: cover;
  }

  .selected-thumbnail {
    border: 0.3rem solid $dark-green;
  }
  .thumbnail__carousel__container::-webkit-scrollbar {
    display: none;
  }
  .thumbnail__carousel__container {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .thumbnail__carousel__container {
    overflow-x: auto;
  }
}
@media (max-width: 900px) {
  .selected__image {
    transform: scale(0.7);
    margin: -8rem 5rem 0 0;
  }
  .thumbnail__container {
    margin: 0;
  }
}
</style>
