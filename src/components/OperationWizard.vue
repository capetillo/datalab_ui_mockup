<script setup>
import { ref, onMounted, computed, defineEmits, defineProps } from 'vue'
import { fetchApiCall, handleError } from '../utils/api'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['closeWizard', 'addOperation'])
const dataSessionsUrl = store.state.datalabApiBaseUrl

const availableOperations = ref({})
const selectedOperation = ref('')
const selectedOperationInput = ref({})
const selectedDataSessionImages = ref([])

let displayImages = ref(false)

defineProps({
	images: {
		type: Array,
		required: true
	}
})

onMounted(async () => {
	const url = dataSessionsUrl + 'available_operations/'
	await fetchApiCall({url: url, method: 'GET', successCallback: (data) => {availableOperations.value = data}, failCallback: handleError})
	if (Object.keys(availableOperations.value).length > 0){
		selectOperation(Object.keys(availableOperations.value)[0])
	}
})

const page = ref('select')

function selectOperation(name) {
	selectedOperation.value = name
	selectedOperationInput.value = {}
	for (const [key, value] of Object.entries(selectedOperationInputs.value)) {
		if ('default' in value){
			selectedOperationInput.value[key] = value.default
		}
		else {
			selectedOperationInput.value[key] = null
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
		return 'Select Operation'
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
				...selectedOperationInput.value,
				'input_files': selectedDataSessionImages.value
			}
		}
		emit('addOperation', operationDefinition)
	}
}

const calculateColumnSpan = (imageCount) => {
	const imagesPerRow = 5
	const totalColumns = Math.floor(12 / Math.min(imagesPerRow, imageCount))
	return totalColumns
}

const handleThumbnailClick = (item) => {
	const index = selectedDataSessionImages.value.findIndex(selectedImage => selectedImage.basename === item.basename)
	if (index === -1) {
		selectedDataSessionImages.value.push(item)
	} else {
		selectedDataSessionImages.value.splice(index, 1)
	}
}

</script>

<template>
  <v-card>
    <v-toolbar
      dark
      color="primary"
    >
      <v-toolbar-title>{{ wizardTitle }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text v-show="page == 'select'">
      <v-row>
        <v-col cols="4">
          <v-list density="compact">
            <v-list-subheader>Operation</v-list-subheader>
            <v-list-item
              v-for="(name, i) in Object.keys(availableOperations)"
              :key="i"
              :value="name"
              color="primary"
              :title="name"
              :active="name == selectedOperation"
              @click="selectOperation(name)"
            />
          </v-list>
        </v-col>
        <v-col cols="8">
          <v-card :title="selectedOperation">
            <v-card-text>
              <span style="white-space: pre;">
                {{ selectedOperationDescription }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-slide-y-reverse-transition hide-on-leave>
      <v-card-text
        v-show="page == 'configure'"
        class="wizard-card"
      >
        <div
          v-for="(inputDescription, inputKey) in selectedOperationInputs"
          :key="inputKey"
        >
          <v-text-field
            v-if="inputDescription.type !== 'file'"
            v-model="selectedOperationInput[inputKey]"
            :label="inputDescription.name"
            :type="inputDescription.type"
            class="operation-input"
          />
          <div
            v-else-if="inputDescription.type == 'file'"
            class="images-container"
          >
            <v-col
              v-for="image in images"
              :key="image.basename"
              :cols="calculateColumnSpan(images.length)"
              class="wizard-images"
            >
              <v-img
                :src="image.url"
                :alt="image.basename"
                cover
                aspect-ratio="1"
                :class="{ 'selected-image': selectedDataSessionImages.some(selectedImage => selectedImage.basename === image.basename) }"
                @click="handleThumbnailClick(image)"
              />
            </v-col>
          </div>
        </div>
      </v-card-text>
    </v-slide-y-reverse-transition>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="blue-darken-1"
        variant="text"
        @click="goBack"
      >
        Go Back
      </v-btn>
      <v-btn
        color="green-darken-1"
        variant="text"
        @click="goForward"
      >
        {{ goForwardText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
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
  margin-bottom: 50vw; 
  padding-left: 2rem; 
  padding-right: 2rem; 
}
.wizard-images {
  max-width: 20%; 
  height: auto; 
  box-sizing: border-box; 
}
.selected-image {
  border: 0.3rem solid $dark-green;
}
.operation-input {
  width: 10vw;
  margin-bottom: 1rem;
}
</style>
