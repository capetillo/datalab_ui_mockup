<script setup>
import { onMounted } from 'vue'
import { defineProps, ref} from 'vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps(['imageSrc'])
const image_container = ref(null)
const image = ref(null)

const minZoom = 1
const maxZoom = 3
const stepSize = 0.1
let currentZoom = 1
let mouseX
let mouseY

const zoom = (e) => {
	let direction = e.deltaY > 0 ? -1 : 1 
	let newZoom = currentZoom + direction * stepSize 
  
	// limit zoom
	if (newZoom < minZoom || newZoom > maxZoom) { 
		return 
	}
  
	currentZoom = newZoom 
  
	image.value.style.transform = 'scale(' + newZoom + ')' 
}

// save the position clicked and add the pointermove listener
const pointerDown = (e) => {
	e.preventDefault()
	mouseX = e.pageX
	mouseY = e.pageY
	image.value.onpointermove = pointerMove
}

// adjust the top and left css properties of the image using the delta from mouse movement, limit to 90% size of the image so it can't be dragged off screen
const pointerMove = (e) => {
	let dx 						= e.pageX-mouseX
	let dy 						= e.pageY-mouseY
	mouseX 						= e.pageX
	mouseY 						= e.pageY
	let x 						= parseInt(getComputedStyle(image.value).left)+dx
	let y 						= parseInt(getComputedStyle(image.value).top)+dy
	if( x < 800 && x > -800)
		image.value.style.left   = x+'px'
	if( y < 800 && y > -800)
		image.value.style.top    = y+'px'
}

onMounted(() => {
	image.value.addEventListener('wheel', zoom)
	image.value.onpointerdown = pointerDown
	image.value.onpointerup = () => { image.value.onpointermove = null }
})

//TODO instead of hardcoding width and height set it equal to the size of the image
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
.image{
	position: relative;
	top: 0px;
	left: 0px;
}
.image_container{
	overflow: hidden;
	height: 1000px;
	width: 1000px;
}
</style>
