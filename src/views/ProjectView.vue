<script setup>
import ToggleButton from '../components/ToggleButton.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const isPopupVisible = ref(false)
const uniqueDataSessions = ref([])

const getDataSessions = async ()=> {
  try {
    const response = await fetch ('http://127.0.0.1:8000/api/datasessions/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token 123456789abcdefg',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error Response Data:', errorData)
      throw new Error('Bad request')
    }
    const data = await response.json()
    const results = data.results

  for (const result of results) {
    if (!uniqueDataSessions.value.includes(result.name)) {
      uniqueDataSessions.value.push(result.name)
    }
    }
    isPopupVisible.value = true
  } catch (error) {
    console.log('Error getting images: ', error)
  }
}

const addImagesToExistingSession = async (selectedSessionName) => {
  console.log("Selected Data Session for Importing Images: ", selectedSessionName);
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
    const response = await fetch('http://127.0.0.1:8000/api/datasessions/', {
      method: 'GET',
      headers: {
        'Authorization': 'Token 123456789abcdefg',
        'Content-Type': 'application/json; charset=UTF-8'
      },

      body: JSON.stringify(requestBody)
    })
    console.log('response', response)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error Response Data:', errorData)
      throw new Error('Bad request');
    }

    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.log('Error importing images: ', error)
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
    <!--Add to Session Button Functionality -->
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
  
