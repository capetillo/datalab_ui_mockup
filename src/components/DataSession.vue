<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue'
import OperationPipeline from './OperationPipeline.vue'
import { fetchApiCall, handleError } from '../utils/api'
import { useStore } from 'vuex'

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

const store = useStore()
const emit = defineEmits(['reloadSession'])
let images = ref([])
const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'


async function addOperation(operationDefinition) {
	const url = dataSessionsUrl + props.data.id + '/operations/'
	//TODO: Remove this once we have the ability to select images in the wizard
	if ('input_files' in operationDefinition.input_data){
		operationDefinition.input_data.input_files = structuredClone(images.value)
		for (const image of operationDefinition.input_data.input_files){
			image.source = 'archive'
		}
	}
	await fetchApiCall({url: url, method: 'POST', body: operationDefinition, successCallback: emit('reloadSession'), failCallback: handleError})
}

const saveImages = (data) => {
	const results = data.results
	images.value = [...images.value, ...results]
}

const getImages = async () => {
	const responseData = props.data
	const inputData = responseData.input_data
	for (const data of inputData) {
		const basename = data.basename
		const url =  `https://datalab-archive.photonranch.org/frames/?basename_exact=${basename}-small`
		await fetchApiCall({url: url, method: 'GET', successCallback: saveImages, failCallback: handleError})
	}
}

const calculateColumnSpan = (imageCount) => {
	const imagesPerRow = 4
	const columnsPerImage = Math.floor(12 / Math.min(imagesPerRow, imageCount))
	return columnsPerImage
}

onMounted(() => {
	getImages()
})

</script>


<template>
  <v-container class="d-lg-flex">
    <v-row v-if="images.length">
      <v-col
        v-for="image of images"
        :key="image.basename"
        :cols="calculateColumnSpan(images.length)"
      >
        <v-img
          :src="image.url"
          :alt="image.basename"
          cover
          aspect-ratio="1"
        />
      </v-col>
    </v-row>
    <v-col
      cols="3"
      justify="center"
      align="center"
    >
      <!-- The operations bar list goes here -->
      <operation-pipeline
        :operations="data.operations"
        @add-operation="addOperation"
      />
    </v-col>
  </v-container>
</template>
