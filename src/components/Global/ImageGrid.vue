<script setup>
import { defineProps, ref, defineEmits, watch } from 'vue'
import { useThumbnailsStore } from '@/stores/thumbnails'
import { useConfigurationStore } from '@/stores/configuration'
import FilterBadge from './FilterBadge.vue'

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
    if (image.basename && !(image.basename in imageDetails.value)) {
      imageDetails.value[image.basename] = ref('')
      const url = image.thumbnail_url || ''
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
        @click="onImageClick(index)"
      >
        <span
          v-if="'operationIndex' in image"
          class="image-text-overlay"
        >{{ image.operationIndex }}</span>
      </v-img>
      <filter-badge
        v-if="image.filter"
        :filter="image.filter"
      />
    </v-col>
  </v-row>
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
  max-width: 300px;
}
</style>
