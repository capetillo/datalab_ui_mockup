<script setup>
import { ref, computed, onMounted, defineEmits, defineProps } from 'vue'
import { useConfigurationStore } from '@/stores/configuration'
import { fetchApiCall } from '@/utils/api'
import RawScaledImage from './RawScaledImage.vue'
import HistogramSlider from './HistogramSlider.vue'

// This component gets the raw image data from the server for an image
// and then displays the image and the scaling controls under it

const props = defineProps({
  image: {
    type: Object,
    required: true
  },
  maxSize: {
    type: Number,
    default: 500
  },
  imageName: {
    type: String,
    required: true
  },
  compositeName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['updateScaling'])
const store = useConfigurationStore()
const dataSessionsUrl = store.datalabApiBaseUrl
const isLoading = ref(true)
const errorReason = ref('')
const rawData = ref({})
const sliderRange = ref([0, 65535])
const zScaleValues = ref([0, 65535])

const titleText = computed(() => {
  return props.imageName.replace('_', ' ')
})

const maxPixelValue = computed(() => {
  if (rawData.value && rawData.value.bitdepth) {
    return Math.pow(2, rawData.value.bitdepth) - 1
  }
  else {
    // Assume 16 bit depth to start as default
    return 65535
  }
})

const histogram = computed(() => {
  if (rawData.value && rawData.value.histogram) {
    return rawData.value.histogram
  }
  else {
    return [0, 10, 10, 5, 4, 3, 2, 1]
  }
})

const bins = computed(() => {
  if (rawData.value && rawData.value.bins) {
    return rawData.value.bins
  }
  else {
    return [0, 1, 2, 3, 4, 5, 6, 7]
  }
})

function updateScaleRange(lowerValue, upperValue) {
  sliderRange.value = [Number(lowerValue), Number(upperValue)]
  emit('updateScaling', props.imageName, sliderRange.value[0], sliderRange.value[1])
}

onMounted(async () => {
  const url = dataSessionsUrl + 'analysis/raw-data/'
  const body = {
    'basename': props.image.basename,
    'source': props.image.source,
    'max_size': props.maxSize
  }
  fetchApiCall({url: url, method: 'POST', body: body,
    successCallback: (response) => {
      rawData.value = response
      zScaleValues.value = [response.zmin, response.zmax]
      isLoading.value = false
    },
    failCallback: (error) => {
      isLoading.value = false
      errorReason.value = error
      console.error('API call failed with error:', error)
    }
  })
})

</script>
<template>
  <div :style="'max-width: ' + props.maxSize">
    <v-row class="mt-4">
      <h3 class="image-scale-title">Adjust Scaling for <span class="text-capitalize">{{ titleText }}</span></h3>
    </v-row>
    <v-row class="mt-1">
      <raw-scaled-image
        :image-data="rawData"
        :scale-points="sliderRange"
        :filter="props.image.filter"
        :image-name="props.imageName"
        :composite-name="props.compositeName"
      >
      </raw-scaled-image>
    </v-row>
    <v-row>
      <v-col>
        <histogram-slider
          :histogram="histogram"
          :bins="bins"
          :max-value="maxPixelValue"
          :z-min="zScaleValues[0]"
          :z-max="zScaleValues[1]"
          @update-scaling="updateScaleRange"
        >
        </histogram-slider>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped>
.image-scale-title {
  width: 100%;
  text-align: center;
  color: var(--tan);
  font-weight: bold;
}

</style>
