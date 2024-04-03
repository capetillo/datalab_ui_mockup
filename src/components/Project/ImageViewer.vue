
<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet/dist/leaflet.css'
// import { fetchApiCall, handleError } from '../../utils/api'

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  }
})

const store = useStore()

const isLoading = ref(true)

const imageContainer = ref(null)
const startCoordinates = ref({x1: 0, y1: 0})
const endCoordinates = ref({x2: 0, y2: 0})
let image = null
let imageOverlay = null
let imageBounds
let initialCenter = [0, 0]
let initialZoom = 1
let lastDrawnLine = null
const imageWidth = ref(0)
const imageHeight = ref(0)

// loads image overlay and set bounds
const loadImageOverlay = (src) => {
  const img = new Image()
  img.onload = () => {
    // Getting image bounds based on img's size
    imageBounds = [[0, 0], [img.height, img.width]] 
    if (imageOverlay) {
      image.removeLayer(imageOverlay)
    }
    imageWidth.value = img.width
    imageHeight.value = img.height
    // Add new overlay with correct bounds
    imageOverlay = L.imageOverlay(src, imageBounds).addTo(image)
    // Fit image view to the bounds of the image
    image.fitBounds(imageBounds)
    image.setMaxBounds(imageBounds)

    // waits for DOM to load then recalculates image's size and position after the container's dimensions have changed (built in method of Leaflet)
    nextTick(() => {
      image.invalidateSize()
    })

    initialCenter = image.getCenter()
    initialZoom = image.getZoom()
    isLoading.value = false
  }
  img.src = src
}

// TO DO: Implement success callback to display line profile
const displayLineProfile = (data) =>{
  if (data) {
    console.log(data)
  }
}

// TO DO: Implement API call to get line profile
async function getLineProfile(startPoint, endPoint) {
  // const url = 'http://localhost:8000/api/line-profile/'
  // await fetchApiCall({ 
  //   url: url,
  //   method: 'GET', 
  //   data: {startPoint, endPoint}, 
  //   successCallback: displayLineProfile, 
  //   failCallback: handleError 
  // })
  if (startPoint && endPoint) {
    displayLineProfile({startPoint, endPoint})
  }
}

// creates random numbers for the line chart to display
// TO DO: get rid of this code and actually implement real data
function getRandomArrNumbers(max) {
  const randomNumbers = Array.from({length: 10}, () => Math.floor(Math.random() * max))
  store.commit('setRandomNumbers', randomNumbers)
  console.log('random numbers', store.state.randomNumbers)
}



onMounted(() => {
  // Create leaflet map (here referred to as image)
  image = L.map(imageContainer.value, {
    center: [0, 0],
    zoom: 1,
    crs: L.CRS.Simple,
    minZoom: 0,
    dragging: false,
  })

  loadImageOverlay(props.imageSrc)

  // Create custom control to reset view after zooming in
  image.pm.Toolbar.createCustomControl({
    name: 'resetView',
    block: 'custom',
    title: 'Reset View',
    className: 'leaflet-pm-icon-drag',
    onClick: () => {
      image.setView(initialCenter, initialZoom)
    },
    actions: [],
    toggle: false,
    disabled: false,
  })

  // Disabling default controls
  image.pm.addControls({
    position: 'topleft',
    drawMarker: false,
    drawCircle: false,
    drawCircleMarker: false,
    drawPolygon: false,
    drawText: false,
    drawRectangle: false,
    editMode: false,
    dragMode: false,
    cutPolygon: false,
    rotateMode: false,
    removalMode: true
  })

  const zoomedInThreshold = 1
  // Disable dragging until zoomed in
  image.on('zoomend', () => {
    if (image.getZoom() >= zoomedInThreshold) {
      image.dragging.enable()
    } else {
      image.dragging.disable()
    }
    // Pan to the center of the image when zoomed out
    if (image.getZoom() === image.getMinZoom() && imageBounds) {
      const centerOfImage = [(imageBounds[0][0] + imageBounds[1][0]) / 2, (imageBounds[0][1] + imageBounds[1][1]) / 2]
      image.panTo(new L.LatLng(centerOfImage[0], centerOfImage[1]))
    }
  })

  let pointsCount = 0
  // Finish line after 2 points (default is multiple points for a line)
  image.on('pm:drawstart', ({ workingLayer }) => {
    // remove last drawn line when starting new one
    if (lastDrawnLine && image.hasLayer(lastDrawnLine)) {
      image.removeLayer(lastDrawnLine)
    }
    pointsCount = 0
    workingLayer.on('pm:vertexadded', () => {
      pointsCount++
      if (pointsCount === 2) {
        image.pm.Draw.Line._finishShape()
      }
    })
  })

  // Get coordinates of the line
  image.on('pm:create', (e) => {
    // Save last drawn line
    lastDrawnLine = e.layer
    const latLngs = e.layer.getLatLngs()

    const startPoint = latLngs[0]
    const endPoint = latLngs[1]
    const baseZoomLevel = 1
    const currentZoomLevel = image.getZoom() + baseZoomLevel
    // Calculate scale factor
    const zoomScaleFactor = Math.pow(2, currentZoomLevel - baseZoomLevel)
    // Adjust coordinates based on zoom level
    const latLngToImagePixelAdjusted = (latLng) => {
      const point = image.latLngToContainerPoint(latLng)
      const boundsTopLeft = image.latLngToContainerPoint(L.latLng(imageBounds[1][0], imageBounds[0][1]))
      // Apply zoom scale factor to adjust coordinates
      const x = (point.x - boundsTopLeft.x) / zoomScaleFactor
      const y = (point.y - boundsTopLeft.y) / zoomScaleFactor
      return { x, y }
    }

    const startPixel = latLngToImagePixelAdjusted(startPoint)
    const endPixel = latLngToImagePixelAdjusted(endPoint)

    startCoordinates.value = { x1: startPixel.x, y1: startPixel.y }
    endCoordinates.value = { x2: endPixel.x, y2: endPixel.y }
    getLineProfile(startCoordinates.value, endCoordinates.value)
    getRandomArrNumbers(65000)
  })
})

</script>


<template>
  <div
    v-if="isLoading"
    class="image-loading-container"
  >
    <v-progress-circular
      indeterminate
      model-value="20"
      :size="50"
      :width="9"
    />
  </div>
  <div
    ref="imageContainer"
    class="leaflet-map-container"
    :style="{ width: imageWidth + 'px', height: imageHeight + 'px' }"
  />
</template>

<style scoped>
.leaflet-map-container {
  background-color: transparent;
  margin-left: 2%;
  margin-top: 2%;
}
.leaflet-image-layer {
  width: 100% !important;
  height: 100% !important;
}
.leaflet-tooltip {
  display: none !important;
}
.button-container.active .leaflet-pm-actions-container {
  display: none !important;
}
</style>
