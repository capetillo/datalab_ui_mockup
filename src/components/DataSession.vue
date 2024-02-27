<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue'
import OperationPipeline from './OperationPipeline.vue'
import { fetchApiCall, handleError } from '../utils/api'
import { calculateColumnSpan } from '../utils/common'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['reloadSession'])
let images = ref([])
const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

async function addOperation(operationDefinition) {
	const url = dataSessionsUrl + props.data.id + '/operations/'
	if ('input_files' in operationDefinition.input_data){
		for (const image of operationDefinition.input_data.input_files) {
			image.source = 'archive'
		}
	}
	await fetchApiCall({url: url, method: 'POST', body: operationDefinition, successCallback: emit('reloadSession'), failCallback: handleError})
}

const saveImages = (data) => {
	const results = data.results
	if (results.length) {
		images.value.push(data.results[0])
	}
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

onMounted(() => {
	getImages()
})

</script>

<template>
  <v-container class="d-lg-flex ds-container">
    <v-row v-if="images.length">
      <v-col
        v-for="image of images"
        :key="image.basename"
        :cols="calculateColumnSpan(images.length, 4)"
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
        :images="images"
        @add-operation="addOperation"
      />
    </v-col>
  </v-container>
</template>

<style scoped lang="scss">
.ds-container {
  background-color: $metal;
  display:flex;
}
</style>
