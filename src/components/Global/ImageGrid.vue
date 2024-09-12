<script setup>
import { ref, watch } from 'vue'
import { useThumbnailsStore } from '@/stores/thumbnails'
import { useConfigurationStore } from '@/stores/configuration'
import FilterBadge from './FilterBadge.vue'
import ImageAnalyzer from '../Project/ImageAnalysis/ImageAnalyzer.vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  selectedImages: {
    type: Array,
    default: () => []
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
const configurationStore = useConfigurationStore()
const thumbnailsStore = useThumbnailsStore()
const emit = defineEmits(['selectImage'])
const showAnalysisDialog = ref(false)
const currLargeImage = ref({})

const launchAnalysis = (image) => {
  const url = image.large_url || image.largeThumbUrl || ''
  if (image.basename) {
    if (!image.largeCachedUrl) {
      image.largeCachedUrl = ref('')
      if (url || image.source == 'archive') {
        thumbnailsStore.cacheImage('large', configurationStore.archiveType, url, image.basename).then((cachedUrl) => {
          image.largeCachedUrl = cachedUrl
          currLargeImage.value = image
          showAnalysisDialog.value = true
        })
      }
    }
    else {
      currLargeImage.value = image
      showAnalysisDialog.value = true
    }
  }
}

const isSelected = (index) => {
  return props.selectedImages.includes(index)
}

watch(() => props.images, () => {
  props.images.forEach(image => {
    if (image.basename && !(image.basename in imageDetails.value)) {
      imageDetails.value[image.basename] = ref('')
      const url = image.thumbnail_url || image.smallThumbUrl || ''
      thumbnailsStore.cacheImage('small', configurationStore.archiveType, url, image.basename).then((cachedUrl) => {
        imageDetails.value[image.basename] = cachedUrl
      })
    }
  })
}, { deep: true, immediate: true })

</script>

<template>
  <v-row v-if="props.images.length">
    <v-col
      v-for="(image, index) in props.images"
      :key="index"
      :cols="columnSpan"
      class="image-grid-col"
    >
      <v-img
        v-if="image.basename in imageDetails && imageDetails[image.basename]"
        :src="imageDetails[image.basename]"
        :alt="image.basename"
        cover
        :class="{ 'selected-image': isSelected(index) }"
        aspect-ratio="1"
        @click="emit('selectImage', index)"
        @dblclick="launchAnalysis(image)"
      >
        <filter-badge
          v-if="image.filter"
          :filter="image.filter"
        />
        <span
          v-if="'operationIndex' in image"
          class="image-text-overlay"
        >{{ image.operationIndex }}</span>
      </v-img>
    </v-col>
  </v-row>
  <image-analyzer
    v-model="showAnalysisDialog"
    :image="currLargeImage"
  />
</template>

<style scoped>
.selected-image {
  border: 0.3rem solid var(--dark-green);
}

.image-text-overlay {
  color: var(--tan);
  font-weight: bold;
  margin-right: 5px;
  float: right;
}
.image-grid-col {
  max-width: 200px;
}
</style>
