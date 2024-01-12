<script setup>
// libraries
import { ref } from 'vue'
// components
import ProjectBar from '@/components/ProjectView/ProjectBar.vue';
import ImageCarousel from '@/components/ProjectView/ImageCarousel.vue';
import ImageList from '@/components/ProjectView/ImageList.vue';
// data
import MockData from '../assets/MockData.JSON'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { fetchApiCall } from '../utils/api'

const router = useRouter()
const store = useStore()
const isPopupVisible = ref(false)
const uniqueDataSessions = ref([])
const newSessionName = ref('')
const errorMessage = ref('')

// toggle for optional data viewing, controlled by a v-switch
let imageDisplayToggle = ref(true)

const getDataSessions = async () => {
    const url = 'http://127.0.0.1:8000/api/datasessions/'
    try {
        const data = await fetchApiCall(url, 'GET')
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
    } catch (error) {
        console.error('Error getting data sessions: ', error)
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

    const url = 'http://127.0.0.1:8000/api/datasessions/' + session.id + '/'
    try {
        const data = await fetchApiCall(url, 'PATCH', requestBody)
    } catch (error) {
        console.error('Error importing images:', error)
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
            const url = 'http://127.0.0.1:8000/api/datasessions/'
            const data = await fetchApiCall(url, 'POST', requestBody)

            isPopupVisible.value = false
            newSessionName.value = ''
            errorMessage.value = ''

            router.push({ name: 'DataSessions' })
        } catch (error) {
        console.log('Error creating new data session:', error)
        errorMessage.value = 'Error creating new data session'
        }
}

const sessionNameExists = (name) => {
    return uniqueDataSessions.value.some(session => session.name === name)
}
</script>
<template>
    <div class="container">
        <ProjectBar class="project-bar"/>
        <div class="image-area">
            <ImageCarousel v-if="imageDisplayToggle" :data="MockData"/>
            <ImageList v-if="!imageDisplayToggle" :data="MockData"/>
            <div class="control-buttons">
                <v-switch class="d-flex mr-4" v-model="imageDisplayToggle" inset prepend-icon="mdi-view-list" append-icon="mdi-image"/>
                <v-btn @click="getDataSessions">Add to a Session</v-btn>
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
