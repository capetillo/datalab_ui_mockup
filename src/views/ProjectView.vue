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
    console.log('this is results:', results)
    uniqueDataSessions.value = results
      .map(result => result.name)
      .filter((name, index, self) => self.indexOf(name) === index)

    isPopupVisible.value = true
  } catch (error) {
    console.error('Error getting data sessions: ', error)
  }
}

const addImagesToExistingSession = async (selectedSessionName) => {
  console.log("Selected Data Session for Importing Images: ", selectedSessionName)
  try {
    const selectedImages = store.state.selectedImages
    const inputData = selectedImages.map(image => ({
      'source': image.image,
      'basename': image.basefile_name
    }))

    const requestBody = {
      'name': 'My New Session Name',
      'input_data': inputData
    }

    const url = 'http://127.0.0.1:8000/api/datasessions/'
    const data = await fetchApiCall(url, 'PATCH', requestBody)

    console.log('Response:', data)
  } catch (error) {
    console.error('Error importing images:', error)
  }
}

const selectDataSession = (name) => {
  isPopupVisible.value = false
  addImagesToExistingSession(name)
  router.push({ name: 'DataSessions' })
}
</script>

<template>
    <ToggleButton/>
    <!--Add to a Session Button Functionality -->
    <v-btn @click="getDataSessions">Add to a Session</v-btn>
    
    <v-dialog v-model="isPopupVisible" width="300">
      <v-card>
        <v-card-title>Data Sessions</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item 
              v-for="(name, index) in uniqueDataSessions" 
              :key="index" 
              @click="selectDataSession(name)"
            >
              <v-list-item-content>
                {{ name }}
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
  