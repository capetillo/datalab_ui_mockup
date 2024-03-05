<script setup>
import { ref, defineEmits, defineProps, onMounted, watch } from 'vue'
import OperationPipeline from './OperationPipeline.vue'
import { fetchApiCall, handleError } from '../../utils/api'
import { calculateColumnSpan } from '../../utils/common'
import { useStore } from 'vuex'
import ImageGrid from '../Global/ImageGrid'

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

const store = useStore()
const emit = defineEmits(['reloadSession'])
const images = ref([])
const filteredImages = ref([])

const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'
const imagesPerRow = 4
const operationMap = {}
var selectedOperation = -1

async function addCompletedOperationsOutput() {
	const url = dataSessionsUrl + props.data.id + '/operations/'

	function updateCompletedOperations(response) {
		response.results.forEach(operationResponse => {
			if (operationResponse.status == 'COMPLETED') {
				addCompletedOperation(operationResponse)
			}
		})
	}

	await fetchApiCall({ url: url, method: 'GET', successCallback: updateCompletedOperations, failCallback: handleError })
}


function imagesContainsFile(file) {
	return images.value.some(image => image.basename == file.basename && image.source == file.source && image.operation == file.operation)
}


function addCompletedOperation(operationResponse) {
	if ('output' in operationResponse && 'output_files' in operationResponse.output) {
		operationResponse.output.output_files.forEach(outputFile => {
			outputFile.operation = operationResponse.id
			outputFile.operationIndex = operationMap[operationResponse.id]
			if (!imagesContainsFile(outputFile)) {
				images.value.push(outputFile)
				if (selectedOperation == -1 || selectedOperation == outputFile.operationIndex) {
					filteredImages.value.push(outputFile)
				}
			}
		})
	}
}


function selectOperation(operationIndex) {
	if (operationIndex != selectedOperation){
		selectedOperation = operationIndex
		if (selectedOperation == -1){
			filteredImages.value = images.value
		}
		else {
			filteredImages.value = images.value.filter(image => image.operationIndex == operationIndex)
		}
	}
}

async function addOperation(operationDefinition) {
	const url = dataSessionsUrl + props.data.id + '/operations/'
	if ('input_files' in operationDefinition.input_data) {
		for (const image of operationDefinition.input_data.input_files) {
			image.source = 'archive'
		}
	}

	// first operation doesn't load unless this is here
	function postOperationSuccess() {
		emit('reloadSession')
	}

	await fetchApiCall({ url: url, method: 'POST', body: operationDefinition, successCallback: postOperationSuccess, failCallback: handleError })
}

watch(() => props.data, () => {
	props.data.operations.forEach((operation, index) => {
		operationMap[operation.id] = index
	})
}, { immediate: true })


onMounted(() => {
	images.value = [...props.data.input_data]
	filteredImages.value = [...images.value]
	addCompletedOperationsOutput()
})

</script>

<template>
	<v-container class="d-lg-flex ds-container">
		<image-grid :images="filteredImages" :column-span="calculateColumnSpan(data.input_data.length, imagesPerRow)" />
		<v-col cols="3" justify="center" align="center">
			<!-- The operations bar list goes here -->
			<operation-pipeline :images="images" :session_id="data.id" :operations="data.operations"
				@add-operation="addOperation" @operation-completed="addCompletedOperation" @select-operation="selectOperation"/>
		</v-col>
	</v-container>
</template>

<style scoped>
.ds-container {
	background-color: var(--metal);
	display: flex;
}
</style>
