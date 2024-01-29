<script setup>
import { ref, computed, onMounted } from 'vue'
import ProjectBar from '@/components/ProjectView/ProjectBar.vue';
import ImageCarousel from '@/components/ProjectView/ImageCarousel.vue';
import ImageList from '@/components/ProjectView/ImageList.vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { fetchApiCall, fetchImagesfromLinks } from '../utils/api'

const router = useRouter()
const store = useStore()
const isPopupVisible = ref(false)
const uniqueDataSessions = ref([])
const newSessionName = ref('')
const errorMessage = ref('')
const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'

const authHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Token ${store.state.authToken}`,
}

// toggle for optional data viewing, controlled by a v-switch
let imageDisplayToggle = ref(true)
let userFrames = ref(null)

// Loads the user's Images from their profile into userImages
const loadUserImages = async () => {
    // TODO Get profile Data from store
    // Get s3 image links for user for all proposals
    // user links to get images from the archive
    // cache images a ref
    const url = 'https://datalab-archive.photonranch.org/frames/?reduction_level=95'
    userFrames.value = await fetchApiCall({url: url, method: 'GET', token: 'Token 2da74cb5262a52bc479e5b63b548fd5910592475'})
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
        await fetchApiCall({ url: dataSessionsUrl, method: 'GET', headers: authHeaders, successCallback: mapDataSessions, failCallback: handleError })
    } catch (error) {
        handleError(error)
    }
}

// updates an existing session with selected images
const addImagesToExistingSession = async (session) => {
    const sessionIdUrl = dataSessionsUrl + session.id + '/'
    try {
        // fetches existing session data
        const currentSessionResponse = await fetchApiCall({ url: sessionIdUrl, method: 'GET', headers: authHeaders })
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
        await fetchApiCall({ url: sessionIdUrl, method: 'PATCH', body: requestBody, headers: authHeaders })
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
        await fetchApiCall({ url: dataSessionsUrl, method: 'POST', body: requestBody, headers: authHeaders })

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
  loadUserImages()
})

</script>
<template>
    <!-- only load if config is loaded -->
    <div class="container">
        <ProjectBar class="project-bar"/>
        <div class="image-area h-screen">
            <ImageCarousel v-if="imageDisplayToggle && userFrames" :data="userFrames.results"/>
            <ImageList v-if="!imageDisplayToggle && userFrames" :data="userFrames.results"/>
            <v-skeleton-loader v-if="!userFrames" type="card"></v-skeleton-loader>
            <div class="control-buttons">
                <v-switch class="d-flex mr-4" v-model="imageDisplayToggle" inset prepend-icon="mdi-view-list" append-icon="mdi-image"/>
                <v-btn :disabled="noSelectedImages" @click="getDataSessions">Add to a Session</v-btn>
            </div>
        </div>
    </div>
    <v-dialog v-model="isPopupVisible" width="300">
        <v-card>
            <v-card-title>Data Sessions</v-card-title>
            <v-card-text>
            <v-list>
                <v-list-item v-for="session in uniqueDataSessions" :key="session.id" @click="selectDataSession(session)">
                <v-list-item-content>
                    {{ session.name }}
                </v-list-item-content>
                </v-list-item>
            </v-list>
            <!-- Input for new session name -->
            <v-text-field v-model="newSessionName" label="New Session Name" />
            <!-- Error message -->
            <div v-if="errorMessage">{{ errorMessage }}</div>
            </v-card-text>
            <v-card-actions>
            <v-btn color="primary" text @click="createNewDataSession">Create New Session</v-btn>
            <v-btn color="primary" text @click="isPopupVisible = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped>
@media (min-width: 900px){
    .container{
        margin: 20px;
        display: grid;
        grid-template-columns: [col1-start] 1fr [col1-end col2-start] 80% [col2-end];
        grid-template-rows: [row-start] 100% [row-end];
    }
    .project-bar{
        display: flex;
        grid-column-start: col1-start;
        grid-column-end: col1-end;
        grid-row-start: row-start;
        grid-row-end: row-end;
    }
    .image-area{
        grid-column-start: col2-start;
        grid-column-end: col2-end;
    }
}
.control-buttons{
    margin-top: 10px;
    display: flex;
    align-items: center;
    float: right;
}
</style>
