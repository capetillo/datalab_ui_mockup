<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import ProjectBar from '@/components/ProjectView/ProjectBar.vue'
import ImageCarousel from '@/components/ProjectView/ImageCarousel.vue'
import ImageList from '@/components/ProjectView/ImageList.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { fetchApiCall } from '../utils/api'

const router = useRouter()
const store = useStore()
const isPopupVisible = ref(false)
const uniqueDataSessions = ref([])
const newSessionName = ref('')
const errorMessage = ref('')
const isLoading = ref(true)
const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'

onBeforeMount(()=>{
	if(!store.getters['userData/userIsAuthenticated']) router.push({ name: 'Registration' })
})

// toggle for optional data viewing, controlled by a v-switch
let imageDisplayToggle = ref(true)

// Loads the user's Images from their profile into userImages ( currently just fetches all frames from archive regardless of proposal )
const loadUserImages = async (option) => {
	isLoading.value = true
	await store.dispatch('loadAndCacheImages', { option })
	isLoading.value = false
}

// boolean computed property used to disable the add to session button
const noSelectedImages = computed(() => {
	return store.getters.selectedImages.length === 0
})

// manages successful api response by mapping data to unique sessions
const mapDataSessions = (data) => {
	const results = data.results
	uniqueDataSessions.value = results
		.map(session => ({ id: session.id, name: session.name }))
	isPopupVisible.value = true
}

// manages api call failures by logging errors
const handleError = (error) => {
	console.error('API call failed with error:', error)
	errorMessage.value = error.message || 'An error occurred'
}

// fetches session data from API and handles response or error using the callbacks
const getDataSessions = async () => {
	try {
		await fetchApiCall({ url: dataSessionsUrl, method: 'GET', successCallback: mapDataSessions, failCallback: handleError })
	} catch (error) {
		handleError(error)
	}
}

// updates an existing session with selected images
const addImagesToExistingSession = async (session) => {
	const sessionIdUrl = dataSessionsUrl + session.id + '/'
	try {
		// fetches existing session data
		const currentSessionResponse = await fetchApiCall({ url: sessionIdUrl, method: 'GET' })
		const currentSessionData = currentSessionResponse.input_data

		// merging existing and new image data
		// this is temporary since the backend has to be updated to handle this
		// remove this when backend gets updated
		const selectedImages = store.state.selectedImages
		const inputData = [...currentSessionData, ...selectedImages.map(image => ({
			'source': image.image,
			'basename': image.basefile_name
		}))]

		const requestBody = {
			'name': session.name,
			'input_data': inputData
		}

		// sending the PATCH request with the merged data
		await fetchApiCall({ url: sessionIdUrl, method: 'PATCH', body: requestBody })
	} catch (error) {
		console.error('Error importing images:', error)
		handleError(error)
	}
}

// closes popup, invokes addImagesToExistingSession, and reroutes user to DataSessions view
const selectDataSession = (session) => {
	isPopupVisible.value = false
	addImagesToExistingSession(session)
	router.push({ name: 'DataSessions' })
}

// handles creation of a new session 
const createNewDataSession = async () => { 
	if (sessionNameExists(newSessionName.value)) {
		errorMessage.value = 'Data Session name already exists. Please choose a different name.'
		return
	}
	const selectedImages = store.state.selectedImages
	const inputData = selectedImages.map(image => ({
		'source': image.url,
		'basename': image.basename
	}))
	const requestBody = { 
		'name': newSessionName.value,
		'input_data': inputData 
	}
	try {
		// attempting a POST request for new session
		await fetchApiCall({ url: dataSessionsUrl, method: 'POST', body: requestBody })

		// resetting state an rerouting to DataSessions view upon successful creation of new session
		isPopupVisible.value = false
		newSessionName.value = ''
		errorMessage.value = ''
		router.push({ name: 'DataSessions' })
	} catch (error) {
		console.error('Error creating new data session:', error)
		errorMessage.value = 'Error creating new data session'
	}
}

const sessionNameExists = (name) => {
	return uniqueDataSessions.value.some(session => session.name === name)
}

onMounted(() => {
	loadUserImages('reduction_level=95')
	loadUserImages('reduction_level=96')
})

</script>
<template>
  <!-- only load if config is loaded -->
  <div class="container">
    <ProjectBar class="project-bar" />
    <div class="image-area h-screen">
      <div
        v-if="isLoading"
        class="loading-indicator-container"
      >
        <v-progress-circular
          indeterminate
          model-value="20"
          :size="50"
          :width="9"
        />
      </div>

      <div v-else>
        <ImageCarousel
          v-if="imageDisplayToggle && store.state.smallImageCache.length && store.state.largeImageCache.length"
        />
        <ImageList
          v-if="!imageDisplayToggle && store.state.smallImageCache.length && store.state.largeImageCache.length"
        />
      </div>
      <v-skeleton-loader
        v-if="!store.state.smallImageCache"
        type="card"
      />
      <div class="control-buttons">
        <v-switch
          v-model="imageDisplayToggle"
          class="d-flex mr-4"
          inset
          prepend-icon="mdi-view-list"
          append-icon="mdi-image"
        />
        <v-btn
          :disabled="noSelectedImages"
          class="add_button"
          @click="getDataSessions"
        >
          Add to a Session
        </v-btn>
      </div>
    </div>
  </div>
  <v-dialog
    v-model="isPopupVisible"
    width="300"
  >
    <v-card class="card">
      <v-card-title class="sessions_header">
        DATA SESSIONS
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="session in uniqueDataSessions"
            :key="session.id"
            class="sessions"
            @click="selectDataSession(session)"
          >
            {{ session.name }}
          </v-list-item>
        </v-list>
        <!-- Input for new session name -->
        <v-text-field
          v-model="newSessionName"
          label="New Session Name"
          class="sessions"
        />
        <!-- Error message -->
        <div v-if="errorMessage">
          {{ errorMessage }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          class="button create_button"
          @click="createNewDataSession"
        >
          Create New Session
        </v-btn>
        <v-btn
          text
          class="button cancel_button"
          @click="isPopupVisible = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped lang="scss">
.card{
  height: 450px;
  width: 700px;
  align-self: center;
}
.container{
  margin: 20px;
  display: grid;
  grid-template-columns: [col1-start] 1fr [col1-end col2-start] 80% [col2-end];
  grid-template-rows: [row-start] 100% [row-end];
}
.sessions_header {
  font-family: 'Open Sans', sans-serif;
  font-size: 1.6rem;
  padding: 1.5rem;
  text-align: center;
  color: $tan;
  font-weight: 600;
  letter-spacing: 0.05rem;
}
.loading-indicator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.project-bar{
  display: flex;
  grid-column-start: col1-start;
  grid-column-end: col1-end;
  grid-row-start: row-start;
  grid-row-end: row-end;
  height: 50%;
}
.add_button {
  width: 16rem;
  height: 4rem;
  font-size: 1.3rem;
  align-content: center;
  margin-right: 3rem;
  background-color: $light-blue;
  opacity: calc(1);
  font-weight: 700;
  color: white;
}
.add_button:disabled {
  background-color:$light-blue;
  color: white;  
  opacity: calc(0.7);
}
.button {
  font-family: 'Open Sans', sans-serif;
  font-size: 1.4rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
}
.create_button {
  color: $light-blue;
  font-weight: 700;
}
.cancel_button {
  color: $cancel;
  font-weight: 700;
  padding-left: 38%;
}
.image-area {
  grid-column-start: col2-start;
  grid-column-end: col2-end;
}
.control-buttons {
  margin-top: 10px;
  display: flex;
  align-items: center;
  float: right;
}
.sessions {
  font-family: 'Open Sans', sans-serif;
  color: $tan;
  font-size: 1.5rem;
}
@media (max-width: 1200px) {
  .card {
    height: 55vh;
    width: 30vw;
    align-self: center;
  }
  .sessions_header {
    font-size: 1.2rem;
    padding: 0.8rem;
  }
  .add_button {
    width: 12rem;
    height: 3rem;
    font-size: 1rem;
  }
  .project-bar {
    height: 60%;
  }
  .button {
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    padding: 0 1rem;
    margin-bottom: 1rem;
  }
  .sessions {
    font-family: 'Open Sans', sans-serif;
    font-size: 0.85rem;
  }
}
@media (max-width: 900px) {
  .card {
    width: 40vw;
    height: 35vh;
  } 
  .add_button {
    width: 22vw;
    height: 4.8vh;
    font-size: 1rem;
  } 
  .project-bar {
    height: 35vh;
    width: 25vw;
    margin-right: 1.5rem;
  }
}
</style>
