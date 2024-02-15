<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted } from 'vue'
import { defineProps, ref} from 'vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps(['imageSrc'])
const image_container = ref(null)
const image = ref(null)

let currentZoom = 1 
let minZoom = 1
let maxZoom = 4
let stepSize = 0.1

const handleScroll = (e) => {
	let direction = e.deltaY > 0 ? -1 : 1 
	let newZoom = currentZoom + direction * stepSize 
  
	// Limit the zoom level to the minimum and maximum values 
	if (newZoom < minZoom || newZoom > maxZoom) { 
		return 
	} 
  
	currentZoom = newZoom 
  
	image.value.style.transform = 'scale(' + currentZoom + ')' 
}

onMounted(() => {
	image.value.addEventListener('wheel', handleScroll)
})
//TODO set the height and width of the container equal to the image, so that when we zoom the image it just crops
</script>
<template>
  <div
    ref="image_container"
    class="image_container"
  >
    <img
      ref="image"
      :src="imageSrc"
      class="image"
    >
  </div>
</template>
<style scoped>
.image_container{
	overflow: hidden;
	height: 1000px;
	width: 1000px;
}
</style>
