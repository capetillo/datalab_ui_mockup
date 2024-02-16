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
const selectedDSImages = ref([])

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
			'input_data': selectedOperationInput.value
		}
		emit('addOperation', operationDefinition)
	}
}

const calculateColumnSpan = (imageCount) => {
	const imagesPerRow = 6
	const columnsPerImage = Math.floor(12 / Math.min(imagesPerRow, imageCount))
	return columnsPerImage
}

const handleThumbnailClick = (item) => {
	const index = selectedDSImages.value.findIndex(selectedImage => selectedImage.basename === item.basename)
	if (index === -1) {
		selectedDSImages.value.push(item)
	} else {
		selectedDSImages.value.splice(index, 1)
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
        <v-row
          v-for="(inputDescription, inputKey) in selectedOperationInputs"
          :key="inputKey"
        >
          <p
            v-if="inputDescription.type == 'file'"
            class="mt-4 mb-4"
          >
            {{ inputKey }}: Insert a filepicker widget for {{ inputDescription.name }}
          </p>
          <v-text-field
            v-if="inputDescription.type != 'file'"
            v-model="selectedOperationInput[inputKey]"
            :label="inputDescription.name"
            :type="inputDescription.type"
          />
        </v-row>
      </v-card-text>
    </v-slide-y-reverse-transition>
    <v-row
      v-if="images.length && displayImages == true"
      class="images-container"
    >
      <v-col
        v-for="image of images"
        :key="image.basename"
        :cols="calculateColumnSpan(images.length)"
        class="wizard-images"
      >
        <v-img
          :src="image.url"
          :alt="image.basename"
          :class="{ 'selected-image': selectedDSImages.some(selectedImage => selectedImage.basename === image.basename) }"
          cover
          aspect-ratio="1"
          @click="handleThumbnailClick(image)"
        />
      </v-col>
    </v-row>
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
  height: 5vh;
  width: 20%;
}
.images-container {
  margin: -1rem 2rem;
  display: flex;
}
.selected-image {
  border: 0.3rem solid $dark-green;
}
</style>
