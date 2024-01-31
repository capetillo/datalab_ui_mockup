<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue'
import OperationPipeline from './OperationPipeline.vue'
import { fetchApiCall, handleError } from '../utils/api'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['reloadSession'])
let images = ref([])
const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'

const authHeaders = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Token ${store.state.authToken}`,
}

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

async function addOperation(operationDefinition) {
	const url = dataSessionsUrl + props.data.id + '/operations/'
	await fetchApiCall({url: url, method: 'POST', body: operationDefinition, headers: authHeaders, successCallback: emit('reloadSession'), failCallback: handleError})
}

const getImages = async () => {
	const url = dataSessionsUrl + props.data.id
	await fetchApiCall({url: url, method: 'GET', headers: authHeaders, successCallback: (data) => {images.value = data.input_data}, failCallback: handleError})
}

onMounted(() => {
	getImages()
})

</script>

<template>
  <v-container class="d-lg-flex">
    <v-row>
      <v-col cols="9">
        <v-carousel v-if="images.length">
          <v-carousel-item
            v-for="(image) in images"
            :key="image.basename"
            :src="image.source"
            :alt="image.basename"
            cover
          />
        </v-carousel>
      </v-col>
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
    </v-row>
  </v-container>
</template>
