<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { defineProps, ref, onMounted, watch } from 'vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps(['imageSrc'])
const image = ref(null)
const canvas = ref(null)
const ctx = ref(null)
const imageLeftPos = ref(0)
const imageTopPos = ref(0)
const currentZoom = ref(1)
const drawing = ref(false)
const startPoint = ref({ x: 0, y: 0 })
const endPoint = ref({ x: 0, y: 0 })

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const STEP_SIZE = 0.1
let mouseX
let mouseY

const zoom = (e, direction) => {
  if (!direction) direction = e.deltaY > 0 ? -1 : 1
  let newZoom = currentZoom.value + direction * STEP_SIZE 
  if (newZoom > MIN_ZOOM && newZoom < MAX_ZOOM) currentZoom.value = newZoom
}

// save the position clicked and add the pointermove listener
const pointerDown = (e) => {
  mouseX = e.pageX
  mouseY = e.pageY
  image.value.onpointermove = pointerMove
}

// use mouse movement delta to set position, limit so image stays on screen
const pointerMove = (e) => {
  let x = imageLeftPos.value+e.pageX-mouseX
  let y = imageTopPos.value+e.pageY-mouseY
  // TODO change this to be bounded by the condition of whether overflow will happen for a more natural use
  if( x > -800 && x < 800) imageLeftPos.value   = x
  if( y > -800 && y < 800) imageTopPos.value    = y
  mouseX = e.pageX
  mouseY = e.pageY
}

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
  }
})

watch([currentZoom, imageLeftPos, imageTopPos], () => {
  updateCanvas()
})

const updateCanvas = () => {
  if (image.value && canvas.value) {
    const rect = image.value.getBoundingClientRect()
    canvas.value.style.left = `${rect.left}px`
    canvas.value.style.top = `${rect.top}px`
    canvas.value.width = rect.width
    canvas.value.height = rect.height
  }
}

const startDrawing = (ev) => {
  drawing.value = true
  startPoint.value = { x: ev.offsetX, y: ev.offsetY }
}

const drawLine = (ev) => {
  if (!drawing.value) return
  endPoint.value = { x: ev.offsetX, y: ev.offsetY }
  
  if (ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.value.beginPath()
    ctx.value.moveTo(startPoint.value.x, startPoint.value.y)
    ctx.value.lineTo(endPoint.value.x, endPoint.value.y)
    ctx.value.strokeStyle = 'yellow'
    ctx.value.stroke()
  }
}

const stopDrawing = (ev) => {
  if (!drawing.value) return
  drawing.value = false
  drawLine(ev)
  console.log(`Start Point: ${startPoint.value.x}, ${startPoint.value.y}, End Point: ${endPoint.value.x}, ${endPoint.value.y}`)
}

</script>
<template>
  <div
    class="image_container"
    @pointerdown.prevent="startDrawing"
    @pointermove="drawLine"
    @pointerup="stopDrawing"
    @pointerleave="stopDrawing"
  >
    <img
      ref="image"
      :src="imageSrc"
      class="image"
      :style="{left:imageLeftPos+'px', top:imageTopPos+'px', transform: `scale(${currentZoom})`}"
      @wheel="zoom"
      @pointerdown.prevent="pointerDown"
      @pointerup="image.onpointermove = null"
      @pointerleave="image.onpointermove = null"
    >
    <canvas
      ref="canvas"
      class="drawing-canvas"
    />
    <v-btn-group class="zoom_buttons">
      <v-btn
        icon="mdi-magnify-plus"
        variant="plain"
        @click="zoom(e, 1)"
      />
      <v-btn
        icon="mdi-magnify-minus"
        variant="plain"
        @click="zoom(e, -1)"
      />
    </v-btn-group>
  </div>
</template>
<style scoped>
.image .drawing-canvas{
	position: absolute;
	top: 0px;
	left: 0px;
  height: 100%;
}
.drawing-canvas {
  pointer-events: none; /* Ensure canvas doesn't interfere with image panning */
}
.image:hover{
	cursor: grab;
}
.image_container{
	position: relative;
	overflow: hidden;
  height: 100%;
}
.zoom_buttons{
	position: absolute;
	bottom: 0;
	right: 0;
}
</style>
