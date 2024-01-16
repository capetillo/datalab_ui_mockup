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


const handleSuccess = (data) => {
    const results = data.results
    const uniqueNames = new Set()
    uniqueDataSessions.value = results
    .filter(session => {
        const isUnique = !uniqueNames.has(session.name) && !uniqueNames.has(session.id)
        uniqueNames.add(session.name)
        uniqueNames.add(session.id)
        return isUnique
    })
    .map(session => ({ id: session.id, name: session.name }))
    isPopupVisible.value = true
}

const handleError = (error) => {
    console.error('API call failed with error:', error)
    errorMessage.value = error.message || 'An error occurred'
}

const getDataSessions = async () => {
    try {
        await fetchApiCall(apiBaseUrl, 'GET', null, handleSuccess, handleError)
    } catch (error) {
        handleError(error)
    }
}


const addImagesToExistingSession = async (session) => {
    const selectedImages = store.state.selectedImages
    const inputData = selectedImages.map(image => ({
      'source': image.image,
      'basename': image.basefile_name
    }))

    const requestBody = {
      'name': session.name,
      'input_data': inputData
    }

    const url = apiBaseUrl + session.id + '/'
    try {
        await fetchApiCall(url, 'PATCH', requestBody)
    } catch (error) {
        console.error('Error importing images:', error)
        handleError(error)
    }
}

const selectDataSession = (session) => {
    isPopupVisible.value = false
    addImagesToExistingSession(session)
    router.push({ name: 'DataSessions' })
}

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
            const data = await fetchApiCall(apiBaseUrl, 'POST', requestBody)

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
