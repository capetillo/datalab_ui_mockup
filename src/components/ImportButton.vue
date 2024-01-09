<script setup>
// import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { ref } from 'vue'

// const router = useRouter()
// const store = useStore()
const isPopupVisible = ref(false)
const uniqueDataSessions = ref([])

// on click of add to session button, display dataSessions
// select a dataSession (or):
// onClick of the dataSession, post to that dataSession name??
// OR
// on click of new data session, check text 
// and if it doesn't exist in datasessions, add to datasessions
// and post to the api 


async function getDataSessions() {
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
    const dataSessionName = result.name
    if (!uniqueDataSessions.value.includes(dataSessionName)) {
      uniqueDataSessions.value.push(dataSessionName)
    }
    }
    isPopupVisible.value = true
  
  } catch (error) {
    console.log('Error getting images: ', error)
  }

}


// const importImages = async () => {
//   getDataSessions()
//   try {
//     const selectedImages = store.state.selectedImages
//     const inputData = selectedImages.map(image => ({
//       'source': image.image,
//       'basename': image.basefile_name
//     }))

//     const requestBody = {
//       'name': 'My New Session Name',
//       'input_data': inputData
//     }

//     const response = await fetch('http://127.0.0.1:8000/api/datasessions/', {
//       method: 'POST',
//       headers: {
//         'Authorization': 'Token 123456789abcdefg',
//         'Content-Type': 'application/json; charset=UTF-8'
//       },
//       body: JSON.stringify(requestBody)
//     })

//     if (!response.ok) {
//       const errorData = await response.json()
//       console.error('Error Response Data:', errorData)
//       throw new Error('Bad request');
//     }

//     const data = await response.json()
//     console.log(data)
//     router.push({ name: 'DataSessions' })
//   } catch (error) {
//     console.log('Error importing images: ', error)
//   }
// }


</script>

<template>
  <v-btn @click="getDataSessions">Add to a Session</v-btn>
  
  <v-dialog v-model="isPopupVisible" width="300">
    <v-card>
      <v-card-title>Data Sessions</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(name, index) of uniqueDataSessions" :key="index">
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

