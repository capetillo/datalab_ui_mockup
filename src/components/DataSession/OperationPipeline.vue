<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useConfigurationStore } from '@/stores/configuration'
import { useAlertsStore } from '@/stores/alerts'
import { fetchApiCall, handleError } from '@/utils/api'
import LoadBarButton from '@/components/DataSession/LoadBarButton.vue'

const store = useConfigurationStore()
const alertStore = useAlertsStore()
const emit = defineEmits(['operationCompleted', 'selectOperation', 'deleteOperation'])

const props = defineProps({
  operations: {
    type: Array,
    required: true
  },
  sessionId: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
})

const selectedOperation = ref(-1)
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

async function pollOperationCompletion(operationID) {
  // Success Callback for checking operation status
  const updateOperationStatus = (response) => {
    if(response){
      switch(response.status){
      case 'PENDING':
        break
      case 'IN_PROGRESS':
        operationPercentages.value[operationID] = response.operation_progress * DEC_TO_PERCENT
        break
      case 'COMPLETED':
        operationPercentages.value[operationID] = COMPLETE_PERCENT
        emit('operationCompleted', response)
        clearPolling(operationID)
        break
      case 'FAILED':
        alertStore.setAlert('error', response.message ? response.message : 'Failed', 'Operation Error:')
        operationPercentages.value[operationID] = COMPLETE_PERCENT
        emit('deleteOperation', operationID)
        clearPolling(operationID)
        break
      default:
        console.error('Unknown Operation Status:', response.status)
      }
    }
    else{
      alertStore.setAlert('error', 'Operation status not found')
    }
  }

  const url = store.datalabApiBaseUrl + 'datasessions/' + props.sessionId + '/operations/' + operationID + '/'
  await fetchApiCall({ url: url, method: 'GET', successCallback: updateOperationStatus, failCallback: handleError })
}

function clearPolling(operationID) {
  if (operationID in operationPollingTimers){
    clearInterval(operationPollingTimers[operationID])
    delete operationPollingTimers[operationID]
  }
}

watch(() => props.operations, () => {
  if (props.active) {
    props.operations.forEach(operation => {
      if (!operationPollingTimers[operation.id]) {
        // call once so buttons progress is updated immediately
        operationPollingTimers[operation.id] = pollOperationCompletion(operation.id)
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
          // call once so buttons progress is updated immediately
          operationPollingTimers[operation.id] = pollOperationCompletion(operation.id)
          operationPollingTimers[operation.id] = setInterval(() => pollOperationCompletion(operation.id), POLL_WAIT_TIME)
        }
      })
    }
    else {
      Object.keys(operationPollingTimers).forEach(operationID => {
        clearPolling(operationID)
      })
    }
  }, { immediate: true }
)

onBeforeUnmount(() => {
  // Clean up Polling Intervals
  Object.keys(operationPollingTimers).forEach(operationID => {
    clearPolling(operationID)
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
    <load-bar-button
      :class="{selected: index == selectedOperation}"
      class="operation_button"
      :progress="operationPercentages[operation.id] ?? 0"
      @click="selectOperation(index)"
    >
      <p>
        {{ index }}: {{ operation.name }}
      </p>
    </load-bar-button>
  </v-row>
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

.operation_button {
  width: 12rem;
  height: 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-style: none;
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
