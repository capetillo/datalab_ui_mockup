<script setup>
import { onMounted, ref, nextTick, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  }
})

const store = useSettingsStore()

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

const scaledHeight = computed(() => imageHeight.value * 0.7)
const scaledWidth = computed(() => imageWidth.value * 0.7)

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

// Create random numbers for the plot to display
// TO DO: get rid of this code and actually implement real data
function getRandomArrNumbers(max) {
  const randomNumbers = Array.from({length: 10}, () => Math.floor(Math.random() * max))
  store.randomNumbers = randomNumbers
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
    editMode: true,
    dragMode: true,
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
    // Remove last drawn line when starting new one
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

  // Checks if the point is within the bounds of the image
  function isWithinBounds(point) {
    return point.lat >= 0 && point.lat <= imageBounds[1][0] && point.lng >= 0 && point.lng <= imageBounds[1][1]
  }

  // Adjusts the point to be within the bounds of the image
  function adjustToBounds(point) {
    const lat = Math.max(0, Math.min(imageBounds[1][0], point.lat))
    const lng = Math.max(0, Math.min(imageBounds[1][1], point.lng))
    // Returns a new point with adjusted coordinates if the point is outside the bounds
    return L.latLng(lat, lng)
  }

  // Callback function for when a line is edited and checks if it's within bounds
  function handleEdit(event) {
    let latLngs = event.layer.getLatLngs()

    // Checking if the line is within the bounds
    const adjustedLatLngs = latLngs.map(point => {
      return isWithinBounds(point) ? point : adjustToBounds(point)
    })

    // Removes the existing layer from the image
    image.removeLayer(event.layer)

    // Creates a new line with the adjusted coordinates
    const newLine = L.polyline(adjustedLatLngs)
    newLine.addTo(image)

    // Re-enable editing and attach the edit handler
    newLine.pm.enable({
      allowSelfIntersection: false,
    })

    // Set this new line as the last drawn line if you're tracking that
    lastDrawnLine = newLine

    // Re-attach the edit handling logic
    newLine.on('pm:edit', handleEdit)
  }
  // Get coordinates of the line
  image.on('pm:create', (e) => {
    // Save last drawn line
    lastDrawnLine = e.layer
    const latLngs = e.layer.getLatLngs()

    e.layer.on('pm:edit', handleEdit)

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

    // Calculate line length in pixels
    const dx = endPixel.x - startPixel.x
    const dy = endPixel.y - startPixel.y
    const lineLengthInPixels = Math.round(Math.sqrt(dx * dx + dy * dy)) 
    store.lineLength = lineLengthInPixels

    startCoordinates.value = { x1: startPixel.x, y1: startPixel.y }
    endCoordinates.value = { x2: endPixel.x, y2: endPixel.y }
    getLineProfile(startCoordinates.value, endCoordinates.value)
    getRandomArrNumbers(65000)
  })
})

</script>


<template>
  <div
    class="wrapper"
    :style="{ width: scaledWidth + 'px', height: scaledHeight + 'px' }"
  >
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
  </div>
</template>
<style>
.leaflet-map-container .marker-icon-middle {
  display: none !important;
}
</style>
<style scoped>
.wrapper{
  background-color: var(--dark-blue);
}
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
@media (max-width: 1200px) {
  .wrapper {
    overflow: visible;
  }
  .leaflet-map-container{
    transform: scale(0.6);
    transform-origin: top left;
    background-color: transparent;
  }
}
@media (max-width: 900px) {
  .wrapper {
    overflow: visible;
    margin-left: 10%;
  }
  .leaflet-map-container{
    transform: scale(0.7);
    transform-origin: top left;
    background-color: transparent;
  }
}
</style>
