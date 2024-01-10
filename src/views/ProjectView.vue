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

const getDataSessions = async () => {
  try {
    const url = 'http://127.0.0.1:8000/api/datasessions/'
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
  try {
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
    const data = await fetchApiCall(url, 'PATCH', requestBody)

    console.log('Response:', data)
  } catch (error) {
    console.error('Error importing images:', error)
  }
}

const selectDataSession = (session) => {
  isPopupVisible.value = false
  addImagesToExistingSession(session)
  router.push({ name: 'DataSessions' })
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
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="isPopupVisible = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  