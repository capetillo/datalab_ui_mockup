<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { fetchApiCall } from '../utils/api'
import ToggleButton from '../components/ToggleButton.vue'

const router = useRouter()
const store = useStore()
const isPopupVisible = ref(false)
const uniqueDataSessions = ref([])
const newSessionName = ref('')
const errorMessage = ref('')
const apiBaseUrl = 'http://127.0.0.1:8000/api/datasessions/'

// manages successful api response by filtering and mapping data to unique sessions
const handleSuccess = (data) => {
    const results = data.results
    const uniqueNames = new Set()
    uniqueDataSessions.value = results
    // filtering to ensure each session is unique by name and id, then map to required structure
    .filter(session => {
        const isUnique = !uniqueNames.has(session.name) && !uniqueNames.has(session.id)
        uniqueNames.add(session.name)
        uniqueNames.add(session.id)
        return isUnique
    })
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
        await fetchApiCall(apiBaseUrl, 'GET', null, handleSuccess, handleError)
    } catch (error) {
        handleError(error)
    }
}

// updates an existing session with selected images
const addImagesToExistingSession = async (session) => {
    const url = apiBaseUrl + session.id + '/'
    try {
        // fetches existing session data
        const currentSessionResponse = await fetchApiCall(url, 'GET', handleSuccess, handleError)
        const currentSessionData = currentSessionResponse.input_data

        // merging existing and new image data
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
        await fetchApiCall(url, 'PATCH', requestBody)
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
        const data = await fetchApiCall(apiBaseUrl, 'POST', requestBody)

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

</script>

<template>
    <ToggleButton/>
    <v-btn @click="getDataSessions">Add to a Session</v-btn>

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
