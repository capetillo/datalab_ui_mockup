<script setup>
import { ref, defineEmits, defineProps, watch, onBeforeUnmount } from 'vue'
import { useConfigurationStore } from '@/stores/configuration'
import { fetchApiCall, handleError } from '@/utils/api'
import OperationWizard from './OperationWizard.vue'

const store = useConfigurationStore()
const emit = defineEmits(['addOperation', 'operationCompleted', 'selectOperation'])

const props = defineProps({
  operations: {
    type: Array,
    required: true
  },
  session_id: {
    type: Number,
    required: true
  },
  images: {
    type: Array,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
})

const selectedOperation = ref(-1)
const showWizardDialog = ref(false)
const operationPollingTimers = {}
const operationPercentages = ref({})
const POLL_WAIT_TIME = 2000
const DEC_TO_PERCENT = 100
const COMPLETE_PERCENT = 100

function selectOperation(index) {
  if (index == selectedOperation.value) {
    selectedOperation.value = -1
  }
  else {
    selectedOperation.value = index
  }
  emit('selectOperation', selectedOperation.value)
}

function operationBtnColor(index) {
  if (index == selectedOperation.value) {
    return 'selected'
  }
  else {
    return 'not-selected'
  }
}

async function pollOperationCompletion(operationID) {
  const url = store.datalabApiBaseUrl + 'datasessions/' + props.session_id + '/operations/' + operationID + '/'

  const updateOperationStatus = (response) => {
    if(response){
      switch(response.status){
      case 'PENDING':
        break
      case 'IN_PROGRESS':
        operationPercentages.value[operationID] = response.percent_completion * DEC_TO_PERCENT
        break
      case 'COMPLETED':
        operationPercentages.value[operationID] = COMPLETE_PERCENT
        emit('operationCompleted', response)
        if (operationID in operationPollingTimers) {
          clearInterval(operationPollingTimers[operationID])
          setTimeout(clearPollingData(operationID), POLL_WAIT_TIME)
        }
        break
      default:
        console.error('Unknown Operation Status:', response.status)
      }
    }
    else{
      console.error('No response on status for operation:', operationID)
    }
  }

  await fetchApiCall({ url: url, method: 'GET', successCallback: updateOperationStatus, failCallback: handleError })
}

function clearPollingData(operationID) {
  delete operationPercentages.value[operationID]
  delete operationPollingTimers[operationID]
}

watch(() => props.operations, () => {
  if (props.active) {
    props.operations.forEach(operation => {
      if (!operationPollingTimers[operation.id]) {
        operationPollingTimers[operation.id] = setInterval(() => pollOperationCompletion(operation.id), POLL_WAIT_TIME)
      }
    })
  }
})

watch(
  () => props.active, (active, previousActive) => {
    if (active && !previousActive) {
      props.operations.forEach(operation => {
        if (!operationPollingTimers[operation.id]) {
          operationPollingTimers[operation.id] = setInterval(() => pollOperationCompletion(operation.id), POLL_WAIT_TIME)
        }
      })
    }
    else {
      Object.keys(operationPollingTimers).forEach(operationID => {
        clearInterval(operationPollingTimers[operationID])
        clearPollingData(operationID)
      })
    }
  }, { immediate: true }
)

onBeforeUnmount(() => {
  // Clean up Polling Intervals
  Object.keys(operationPollingTimers).forEach(operationID => {
    clearInterval(operationPollingTimers[operationID])
    clearPollingData(operationID)
  })
})

</script>
<template>
  <h3 class="operations">
    OPERATIONS
  </h3>
  <v-row
    v-for="(operation, index) in operations"
    :key="operation.id"
    align="center"
    justify="center"
    class="operation mb-2"
  >
    <v-btn
      :class="operationBtnColor(index)"
      variant="outlined"
      class="operation_button"
      @click="selectOperation(index)"
    >
      {{ index }}: {{ operation.name }}
    </v-btn>
    <v-progress-linear
      v-if="operationPercentages[operation.id] !== undefined"
      class="operation_completion"
      :model-value="operationPercentages[operation.id]"
      :height="5"
    />
  </v-row>
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
        @add-operation="emit('addOperation', $event); showWizardDialog = false;"
      />
    </v-dialog>
  </v-btn>
</template>

<style scoped>
.operations {
  color: var(--tan);
  letter-spacing: 0.05rem;
  font-size: 2rem;
}

.operation{
  margin-top: 1rem;
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

.operation_button {
  width: 12rem;
  height: 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-style: none;
}

.selected {
  background-color: var(--light-blue)
}

.not-selected {
  background-color: var(--light-gray);
  color: var(--metal);
}

@media (max-width: 1200px) {
  .operations {
    font-size: 1.3rem;
  }

  .addop_button {
    font-size: 1rem;
    height: 5vh;
  }

  .operation_button {
    width: 13vw;
    height: 4.5vh;
    font-size: 0.8rem;
  }
}

@media (max-width: 900px) {
  .operations {
    font-size: 1.2rem;
  }

  .addop_button {
    font-size: 0.9rem;
    height: 4vh;
  }

  .operation_button {
    width: 15vw;
    height: 3vh;
    font-size: 0.7rem;
  }
}
</style>
