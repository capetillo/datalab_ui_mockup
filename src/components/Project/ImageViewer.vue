
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

onMounted(() => {
  const map = L.map(mapContainer.value, {
    center: [0, 0],
    zoom: 1,
    crs: L.CRS.Simple,
    minZoom: 0,
    dragging: false,
  })


  const bounds = [[0, 0], [1000, 1000]]
  const centerBounds = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
  const zoomedInThreshold = 1

  L.imageOverlay(props.imageSrc, bounds).addTo(map)
  map.fitBounds(bounds)

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
    if (map.getZoom() === map.getMinZoom()) {
      map.panTo(new L.LatLng(centerBounds[0], centerBounds[1]))
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
    const zoomScaleFactor = Math.pow(2, currentZoomLevel - baseZoomLevel) // Calculate scale factor

    // Updated function to adjust for zoom level
    const latLngToImagePixelAdjusted = (latLng) => {
      const point = map.latLngToContainerPoint(latLng)
      const boundsTopLeft = map.latLngToContainerPoint(L.latLng(bounds[1][0], bounds[0][1]))
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
