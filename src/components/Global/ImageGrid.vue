<script setup>
import { defineProps, ref, defineEmits, watch } from 'vue'
import { useStore } from 'vuex'
import { fetchApiCall, handleError } from '../../utils/api'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  columnSpan: {
    type: Number,
    required: true
  },
  allowSelection: {
    type: Boolean,
    default: false
  }
})

let imageDetails = ref({})
let selectedImages = ref([])
const store = useStore()
const emit = defineEmits(['selectImage'])

const saveImage = (data) => {
  const results = data.results
  if (results.length) {
    const imageBasename = data.results[0].basename.replace('-small', '')
    imageDetails.value[imageBasename] = data.results[0]
  }
}

async function loadImage(basename) {
  const url = store.state.datalabArchiveApiUrl + 'frames/?basename_exact=' + basename + '-small'
  await fetchApiCall({ url: url, method: 'GET', successCallback: saveImage, failCallback: handleError })
}

const isSelected = (index) => {
  return selectedImages.value.includes(index)
}

const onImageClick = (index) => {
  if (props.allowSelection) {
    if (selectedImages.value.includes(index)) {
      selectedImages.value.splice(selectedImages.value.indexOf(index), 1)
    }
    else {
      selectedImages.value.push(index)
    }
    emit('selectImage', index)
  }
}

watch(() => props.images, () => {
  selectedImages.value = []
  props.images.forEach(image => {
    if (!(image.basename in imageDetails.value)) {
      loadImage(image.basename)
    }
  })
}, { immediate: true })

</script>

<template>
  <v-row v-if="props.images.length">
    <v-col v-for="(image, index) in props.images" :key="index" :cols="columnSpan">
      <v-img v-if="image.basename in imageDetails" :src="imageDetails[image.basename].url" :alt="image.basename" cover
        :class="{ 'selected-image': isSelected(index) }" aspect-ratio="1" class="image-grid" @click="onImageClick(index)">
        <span v-if="'operationIndex' in image" class="image-text-overlay">{{ image.operationIndex }}</span>
      </v-img>
    </v-col>
  </v-row>
</template>

<style scoped>
.image-grid-container {
  display: flex;
  max-width: 200px;
  max-height: 200px;
}
.selected-image {
  border: 0.3rem solid var(--dark-green);
}

.image-text-overlay {
  color: white;
  font-weight: bold;
  margin-right: 5px;
  float: right;
}
.image-grid {
  max-width: 200px;
  height: auto;
}
@media (max-width: 900px) {
.image-grid {
  width: 20vw;
  height: auto;
}
}
</style>
