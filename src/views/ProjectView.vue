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
const dataSessionsUrl = store.state.dataSessionsUrl
const data = ref(null)
let imageDisplayToggle = ref(true)

// Logic for fetching data from OCS and Archive for displaying in Projects
const getUserImages = async () => {
    // url and body for getting the list of the user's images
    const url = ""
    const body = ""
    const imageLinks = await fetchApiCall(url, 'GET', body, console.log("success"), console.log("failure"))
    data.value = await fetchImagesfromLinks(imageLinks)
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
    console.log('sessionidurl', sessionIdUrl)
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
        'source': image.image,
        'basename': image.basefile_name
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
  getUserImages()
})

</script>
<template>
    <!-- only load if config is loaded -->
    <div class="container">
        <ProjectBar class="project-bar"/>
        <div class="image-area h-screen">
            <ImageCarousel v-if="imageDisplayToggle && data" :data="data"/>
            <ImageList v-if="!imageDisplayToggle && data" :data="data"/>
            <v-skeleton-loader v-else type="card"></v-skeleton-loader>
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
