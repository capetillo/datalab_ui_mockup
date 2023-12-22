<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const importImages = async () => {
  try {
    const selectedImages = store.state.selectedImages;
    const inputData = selectedImages.map(image => ({
      'source': image.image,
      'basename': image.basefile_name
    }));

    const requestBody = {
      'name': 'My New Session Name',
      'input_data': inputData
    };

    const response = await fetch('http://127.0.0.1:8000/api/datasessions/', {
      method: 'POST',
      headers: {
        'Authorization': 'Token 123456789abcdefg',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Response Data:', errorData);
      throw new Error('Bad request');
    }

    const data = await response.json();
    console.log(data);
    router.push({ name: 'DataSessions' });
  } catch (error) {
    console.log('Error importing images: ', error);
  }
};


</script>

<template>
  <v-btn @click="importImages">Import</v-btn>
</template>
