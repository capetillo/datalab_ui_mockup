<!-- eslint-disable no-unused-vars -->
<script setup>
import { onUnmounted } from 'vue'
import { defineProps, ref} from 'vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps(['imageSrc'])
const zoomElement = ref(null)
let zoom = 1
const ZOOM_SPEED = 0.1

const handleScroll = (e) => {
	if(e.deltaY > 0){
		zoomElement.value.style.transform = `scale(${zoom += ZOOM_SPEED})`
	}else{
		zoomElement.value.style.transform = `scale(${zoom -= ZOOM_SPEED})`
	}
}

window.addEventListener('wheel', handleScroll)

onUnmounted(() => {
	window.removeEventListener('wheel', handleScroll)
})

</script>
<template>
  <div class="image_container">
    <img
      ref="zoomElement"
      :src="imageSrc"
      class="image"
    >
  </div>
</template>
<style scoped>
	.image_container{
  width:100%;
  display:grid;
	place-items:center;
}
</style>
