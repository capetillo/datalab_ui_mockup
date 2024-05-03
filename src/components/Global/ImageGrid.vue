<script setup>
import { defineProps, ref, defineEmits, watch } from 'vue'
import { useThumbnailsStore } from '@/stores/thumbnails'
import { useConfigurationStore } from '@/stores/configuration'

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
const configurationStore = useConfigurationStore()
const thumbnailsStore = useThumbnailsStore()
const emit = defineEmits(['selectImage'])


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
      imageDetails.value[image.basename] = ref('')
      thumbnailsStore.cacheImage('small', configurationStore.archiveType, '', image.basename).then((cachedUrl) => {
        imageDetails.value[image.basename] = cachedUrl
      })
    }
  })
}, { immediate: true })

</script>

<template>
  <v-row v-if="props.images.length">
    <v-col
      v-for="(image, index) in props.images"
      :key="index"
      :cols="columnSpan"
    >
      <v-img
        v-if="image.basename in imageDetails && imageDetails[image.basename]"
        :src="imageDetails[image.basename]"
        :alt="image.basename"
        cover
        :class="{ 'selected-image': isSelected(index) }"
        aspect-ratio="1"
        class="image-grid"
        @click="onImageClick(index)"
      >
        <span
          v-if="'operationIndex' in image"
          class="image-text-overlay"
        >{{ image.operationIndex }}</span>
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
