<script setup>
import { defineEmits, defineProps } from 'vue'
import OperationPipeline from './OperationPipeline.vue'
import { fetchApiCall, handleError } from '../../utils/api'
import { calculateColumnSpan } from '../../utils/common'
import { useStore } from 'vuex'
import ImageGrid from '../Global/ImageGrid'

const store = useStore()
const emit = defineEmits(['reloadSession'])

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
</script>

<template>
  <v-container class="d-lg-flex ds-container">
    <image-grid
      :data="data"
      :column-span="calculateColumnSpan(props.data.input_data.length, 4)"
    />
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

<style scoped lang="scss">
.ds-container {
  background-color: $metal;
  display:flex;
}
</style>
