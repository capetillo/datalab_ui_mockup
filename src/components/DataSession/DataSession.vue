<script setup>
import { defineEmits, defineProps } from 'vue'
import OperationPipeline from './OperationPipeline.vue'
import { fetchApiCall, handleError } from '../../utils/api'
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

const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'

async function addOperation(operationDefinition) {
  const url = dataSessionsUrl + props.data.id + '/operations/'
  if ('input_files' in operationDefinition.input_data){
    for (const image of operationDefinition.input_data.input_files) {
      image.source = 'archive'
    }
  }

  // first operation doesn't load unless this is here
  function postOperationSuccess(){
    emit('reloadSession')
  }
	
  await fetchApiCall({url: url, method: 'POST', body: operationDefinition, successCallback: postOperationSuccess, failCallback: handleError})
}

</script>

<template>
  <v-container class="d-lg-flex ds-container">
    <image-grid
      :data="data"
    />
    <v-col
      cols="3"
      justify="center"
      align="center"
    >
      <!-- The operations bar list goes here -->
      <operation-pipeline
        :data="data"
        :operations="data.operations"
        @add-operation="addOperation"
      />
    </v-col>
  </v-container>
</template>

<style scoped>
.ds-container {
  background-color: var(--metal);
  display:flex;
}
</style>
