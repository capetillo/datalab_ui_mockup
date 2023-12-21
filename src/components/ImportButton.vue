<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const importImages = async () => {
  try {
    const selectedImages = store.state.selectedImages
    const response = await fetch('http://127.0.0.1:8000/api/datasessions/', {
      method: 'POST',
      headers: {
        'Authorization': 'Token 123456789abcdefg',
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({ images: selectedImages }) 
    })
    const data = await response.json()
    router.push({ name: 'DataSessions' })
    console.log(data)
  } catch (error) {
    console.log('Error importing images: ', error)
  }
}
</script>

<template>
  <v-btn @click="importImages">Import</v-btn>
</template>
