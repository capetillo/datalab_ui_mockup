<script setup>
import { ref, defineEmits, defineProps, onMounted, watch } from 'vue'
import OperationPipeline from './OperationPipeline.vue'
import { fetchApiCall, handleError } from '../../utils/api'
import { calculateColumnSpan } from '@/utils/common'
import { useConfigurationStore } from '@/stores/configuration'
import ImageGrid from '../Global/ImageGrid'
import OperationWizard from './OperationWizard.vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
})

const store = useConfigurationStore()

const emit = defineEmits(['reloadSession'])
const images = ref([...props.data.input_data])
const filteredImages = ref([...images.value])
const showWizardDialog = ref(false)

const dataSessionsUrl = store.datalabApiBaseUrl + 'datasessions/'
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
  if (operationIndex != selectedOperation) {
    selectedOperation = operationIndex
    if (selectedOperation == -1) {
      filteredImages.value = images.value
    }
    else {
      filteredImages.value = images.value.filter(image => image.operationIndex == operationIndex)
    }
  }
}

function deleteOperation(operationID) {
  const url = dataSessionsUrl + props.data.id + '/operations/' + operationID + '/'
  fetchApiCall({ url: url, method: 'DELETE', successCallback: () => {emit('reloadSession')}, failCallback: handleError })
}

async function addOperation(operationDefinition) {
  const url = dataSessionsUrl + props.data.id + '/operations/'

  // first operation doesn't load unless this is here
  function postOperationSuccess() {
    emit('reloadSession')
  }

  await fetchApiCall({ url: url, method: 'POST', body: operationDefinition, successCallback: postOperationSuccess, failCallback: handleError })
}

watch(
  () => props.data.operations, () => {
    props.data.operations.forEach((operation, index) => {
      operationMap[operation.id] = index
    })
  },
  { immediate: true })


onMounted(() => {
  addCompletedOperationsOutput()
})

</script>

<template>
  <v-container class="d-lg-flex ds-container">
    <v-col
      cols="3"
      justify="center"
      align="center"
    >
      <!-- The operations bar list goes here -->
      <operation-pipeline
        :session-id="data.id"
        :operations="data.operations"
        :active="props.active"
        @operation-completed="addCompletedOperation"
        @select-operation="selectOperation"
        @delete-operation="deleteOperation"
      />
      <v-btn
        variant="flat"
        class="addop_button"
      >
        Add Operation
        <v-dialog
          v-model="showWizardDialog"
          activator="parent"
          fullscreen
          transition="dialog-bottom-transition"
        >
          <operation-wizard
            :images="images"
            @close-wizard="showWizardDialog = false"
            @add-operation="addOperation"
          />
        </v-dialog>
      </v-btn>
    </v-col>
    <image-grid
      :images="filteredImages"
      :column-span="calculateColumnSpan(filteredImages.length, imagesPerRow)"
    />
  </v-container>
</template>

<style scoped>
.ds-container {
  background-color: var(--metal);
  display: flex;
}
.addop_button {
  width: 16rem;
  height: 4rem;
  font-size: 1.3rem;
  align-content: center;
  background-color: var(--light-blue);
  font-weight: 700;
  color: white;
  margin-top: 1rem;
}
</style>
