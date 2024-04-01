
<script setup>
import { onMounted, ref } from 'vue'
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

const mapContainer = ref(null)
let map = null
let imageOverlay = null
let imageBounds

const loadImageOverlay = (src) => {
  const img = new Image()
  img.onload = () => {
    // Getting image bounds based on img's size
    imageBounds = [[0, 0], [img.height, img.width]] 
    console.log('Image dimensions:', img.width, 'x', img.height)

    if (imageOverlay) {
      map.removeLayer(imageOverlay)
    }
    // Add new overlay with correct bounds
    imageOverlay = L.imageOverlay(src, imageBounds).addTo(map)
    // Fit map view to the bounds of the image
    map.fitBounds(imageBounds)
    map.setMaxBounds(imageBounds)
  }
  img.src = src
}

onMounted(() => {
  map = L.map(mapContainer.value, {
    center: [0, 0],
    zoom: 1,
    crs: L.CRS.Simple,
    minZoom: 0,
    dragging: false,
  })

  loadImageOverlay(props.imageSrc)

  const zoomedInThreshold = 1

  map.pm.addControls({
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

  // Disable dragging until zoomed in
  map.on('zoomend', () => {
    if (map.getZoom() >= zoomedInThreshold) {
      map.dragging.enable()
    } else {
      map.dragging.disable()
    }
    if (map.getZoom() === map.getMinZoom() && imageBounds) {
      const centerOfImage = [(imageBounds[0][0] + imageBounds[1][0]) / 2, (imageBounds[0][1] + imageBounds[1][1]) / 2]
      map.panTo(new L.LatLng(centerOfImage[0], centerOfImage[1]))
    }
  })

  let pointsCount = 0
  // Finish line after 2 points
  map.on('pm:drawstart', ({ workingLayer }) => {
    pointsCount = 0
    workingLayer.on('pm:vertexadded', () => {
      pointsCount++
      if (pointsCount === 2) {
        map.pm.Draw.Line._finishShape()
      }
    })
  })


  map.on('pm:create', (e) => {
    const latLngs = e.layer.getLatLngs()

    const startPoint = latLngs[0]
    const endPoint = latLngs[1]
    const baseZoomLevel = 1
    const currentZoomLevel = map.getZoom() + 1
    // Calculate scale factor
    const zoomScaleFactor = Math.pow(2, currentZoomLevel - baseZoomLevel)
    // Adjust coordinates based on zoom level
    const latLngToImagePixelAdjusted = (latLng) => {
      const point = map.latLngToContainerPoint(latLng)
      const boundsTopLeft = map.latLngToContainerPoint(L.latLng(imageBounds[1][0], imageBounds[0][1]))
      // Apply zoom scale factor to adjust coordinates
      const x = (point.x - boundsTopLeft.x) / zoomScaleFactor
      const y = (point.y - boundsTopLeft.y) / zoomScaleFactor
      return { x, y }
    }

    const startPixel = latLngToImagePixelAdjusted(startPoint)
    const endPixel = latLngToImagePixelAdjusted(endPoint)

    console.log(`Start: ${startPixel.x}, ${startPixel.y}`)
    console.log(`End: ${endPixel.x}, ${endPixel.y}`)
  })
})

</script>


<template>
  <div
    ref="mapContainer"
    class="leaflet-map-container"
  />
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; 
}
.toolbar {
  z-index: 1000;
  margin: 2% 1% 0 0;
}

select {
  padding: 4px;
  margin: 0;
  background-color: var(--metal);
  color: var(--tan);
  border-radius: 4px;
  text-align: center;
}

.leaflet-map-container {
  flex: 1; 
  width: 100%;
  background-color: transparent;
}
</style>
