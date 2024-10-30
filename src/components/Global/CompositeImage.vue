<script setup>
import { ref, defineProps, computed, watch, onMounted } from 'vue'
import { useScalingStore } from '@/stores/scaling'
// import _ from 'lodash'

const props = defineProps({
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  imageName: {
    type: String,
    required: true
  }
})

const store = useScalingStore()

const isLoading = ref(false)
const imageCanvas = ref(null)
var context = null
// var imageData = null

// const debouncedRedraw = _.debounce(function() {
//   redrawImage()
//   isLoading.value = false
// }, 50)

const ableToDraw = computed(() => {
  return (store.scaledImageArrays[props.imageName] && store.scaledImageArrays[props.imageName].combined)
})

function redrawImage() {
  if (ableToDraw.value) {

    // for (let i = 0; i < store.scaledImageArrays[props.imageName].r.length; i++) {
    //   imageData.data[i * 4] = store.scaledImageArrays[props.imageName].r[i]
    //   imageData.data[i * 4 + 1] = store.scaledImageArrays[props.imageName].g[i]
    //   imageData.data[i * 4 + 2] = store.scaledImageArrays[props.imageName].b[i]
    //   imageData.data[i * 4 + 3] = 255
    // }

    // const newImageDataObject = new ImageData(store.scaledImageArrays[props.imageName].combined, props.width, props.height)
    createImageBitmap(store.scaledImageArrays[props.imageName].combined).then(function (image) {
      context.drawImage(image, 0, 0)
    })
    // context.putImageData(store.scaledImageArrays[props.imageName].combined, 0, 0)
  }
}

onMounted(() => {
  context = imageCanvas.value.getContext('2d')
  // imageData = context.createImageData(props.width, props.height)
})

watch(
  () => store.arrayChanged[props.imageName], () => {
    // isLoading.value = true
    // debouncedRedraw()
    redrawImage()
    // setTimeout(() => {
    //   redrawImage()
    //   isLoading.value = false
    // }, 100)
  },
  { deep: true }
)

</script>
<template>
  <div class="image-container mt-4" :id="'image-container-' + imageName" :style="'max-width: ' + props.width">
    <canvas ref="imageCanvas" :width="props.width" :height="props.height">
    </canvas>
    <v-progress-circular v-show="isLoading" color="primary" size="200" indeterminate></v-progress-circular>
  </div>
</template>
<style scoped>

.v-progress-circular {
  position:fixed;
  bottom: 40%;
  left: 60%;
}

</style>
