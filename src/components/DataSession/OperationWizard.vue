<script setup>
import { ref, onMounted, onUnmounted, computed, defineEmits, defineProps } from 'vue'
import { fetchApiCall, handleError } from '../../utils/api'
import { calculateColumnSpan } from '../../utils/common'
import ImageGrid from '../Global/ImageGrid'
import { useStore } from 'vuex'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const store = useStore()
const emit = defineEmits(['closeWizard', 'addOperation'])
const dataSessionsUrl = store.state.datalabApiBaseUrl

const availableOperations = ref({})
const selectedOperation = ref('')
const selectedOperationInput = ref({})
const selectedImages = ref({})
const imagesPerRow = ref(3)

const updateImagesPerRow = () => {
  const width = window.innerWidth
  if (width >= 1200) {
    imagesPerRow.value = 5
  } else if (width >= 900) {
    imagesPerRow.value = 4
  } else {
    imagesPerRow.value = 3
  }
}

let displayImages = ref(false)

onMounted(async () => {
  const url = dataSessionsUrl + 'available_operations/'
  await fetchApiCall({ url: url, method: 'GET', successCallback: (data) => { availableOperations.value = data }, failCallback: handleError })
  if (Object.keys(availableOperations.value).length > 0) {
    selectOperation(Object.keys(availableOperations.value)[0])
  }
  updateImagesPerRow()
  window.addEventListener('resize', updateImagesPerRow)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateImagesPerRow)
})

const page = ref('select')

function selectOperation(name) {
  selectedOperation.value = name
  selectedOperationInput.value = {}
  selectedImages.value = {}
  for (const [key, value] of Object.entries(selectedOperationInputs.value)) {
    if ('default' in value) {
      selectedOperationInput.value[key] = value.default
    }
    else {
      selectedOperationInput.value[key] = null
    }
    if (value.type == 'file') {
      selectedImages.value[key] = []
    }
  }
}

function goBack() {
  displayImages.value = false
  if (page.value == 'select') {
    emit('closeWizard')
  }
  else {
    page.value = 'select'
  }
}

const selectedOperationDescription = computed(() => {
  if (availableOperations.value && selectedOperation.value) {
    return availableOperations.value[selectedOperation.value].description
  }
  return ''
})

const selectedOperationInputs = computed(() => {
  if (availableOperations.value && selectedOperation.value) {
    return availableOperations.value[selectedOperation.value].inputs
  }
  return {}
})

const goForwardText = computed(() => {
  if (page.value == 'select') {
    return 'Configure Operation'
  }
  else {
    return 'Add Operation'
  }
})

const wizardTitle = computed(() => {
  if (page.value == 'select') {
    return 'SELECT OPERATION'
  }
  else {
    return 'Configure ' + selectedOperation.value + ' Operation'
  }
})

function goForward() {
  if (page.value == 'select') {
    page.value = 'configure'
    displayImages.value = true
  }
  else {
    displayImages.value = false
    let operationDefinition = {
      'name': selectedOperation.value,
      'input_data': {
        ...selectedOperationInput.value
      }
    }
    for (const inputKey in selectedImages.value) {
      let selected = []
      selectedImages.value[inputKey].forEach(index => {
        selected.push(props.images[index])
      })
      operationDefinition.input_data[inputKey] = selected
    }
    emit('addOperation', operationDefinition)
  }
}

function selectImage(inputKey, imageIndex) {
  if (selectedImages.value[inputKey].includes(imageIndex)) {
    selectedImages.value[inputKey].splice(selectedImages.value[inputKey].indexOf(imageIndex), 1)
  }
  else {
    selectedImages.value[inputKey].push(imageIndex)
  }
}

</script>

<template>
  <v-card class="wizard-background">
    <v-toolbar class="wizard-toolbar">
      <v-toolbar-title class="wizard-title">
        {{ wizardTitle }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text v-show="page == 'select'">
      <v-row>
        <v-col cols="4">
          <v-list density="compact" class="wizard-list">
            <v-list-subheader class="wizard-subheader">
              OPERATION
            </v-list-subheader>
            <v-list-item v-for="(name, i) in Object.keys(availableOperations)" :key="i" :value="name" :title="name"
              :active="name == selectedOperation" class="wizard-operations" @click="selectOperation(name)" />
          </v-list>
        </v-col>
        <v-col cols="8">
          <v-card :title="selectedOperation" class="selected-operation">
            <v-card-text>
              <span class="operation-description">
                {{ selectedOperationDescription }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-slide-y-reverse-transition hide-on-leave>
      <v-card-text v-show="page == 'configure'" class="wizard-card">
        <div v-for="(inputDescription, inputKey) in selectedOperationInputs" :key="inputKey"
          class="operation-input-wrapper">
          <v-text-field v-if="inputDescription.type !== 'file'" v-model="selectedOperationInput[inputKey]"
            :label="inputDescription.name" :type="inputDescription.type" class="operation-input" />
          <div v-else-if="inputDescription.type == 'file'" class="images-container">
            <image-grid :images="images" :column-span="calculateColumnSpan(images.length, imagesPerRow)"
              class="wizard-images" :allow-selection="true" @select-image="selectImage(inputKey, $event)" />
          </div>
        </div>
      </v-card-text>
    </v-slide-y-reverse-transition>

    <v-card-actions class="buttons-container">
      <v-spacer />
      <v-btn variant="text" class="goback-btn" @click="goBack">
        Go Back
      </v-btn>
      <v-btn variant="text" class="gofwd-btn" @click="goForward">
        {{ goForwardText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.wizard-background {
  background-color: var(--dark-blue);
  height: 100vh;
}

.wizard-toolbar {
  background-color: var(--metal);
}

.wizard-title {
  color: var(--tan);
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 1.7rem;
  letter-spacing: 0.05rem;
  margin-left: 2%;
}

.wizard-list {
  background-color: var(--metal);
}

.wizard-subheader {
  color: var(--tan);
  font-weight: 500;
  letter-spacing: 0.05rem;
  font-size: 1.4rem;
}

.wizard-operations {
  color: var(--tan);
}

.selected-operation {
  color: var(--tan);
  background-color: var(--metal);
  text-transform: uppercase;
  font-family: 'Open Sans', sans-serif;
  font-size: 3rem;
}

.operation-description {
  font-size: 1rem;
}

.wizard-card {
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
}

.images-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
}

.wizard-images {
  max-width: 100%;
  height: auto;
  box-sizing: border-box;
  cursor: pointer;
}

.selected-image {
  border: 0.3rem solid var(--dark-green);
}

.operation-input {
  width: 10vw;
  margin-left: 2%;
  margin-bottom: 2%;
  background-color: var(--metal);
}

.buttons-container {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
}

.goback-btn {
  color: var(--cancel);
  font-size: 1.2rem;
}

.gofwd-btn {
  color: var(--light-blue);
  font-size: 1.2rem;
}

@media (max-width: 1200px) {
  .operation-input {
    margin-left: 3%;
  }

  .images-container {
    margin-top: 2%;
  }
}

@media (max-width: 900px) {
  .selected-operation {
    height: 120%;
  }

  .operation-description {
    font-size: 1rem;
  }

  .operation-input {
    margin-left: 4%;
    width: 15vw;
  }

  .images-container {
    margin-top: 3%;
  }
}
</style>
