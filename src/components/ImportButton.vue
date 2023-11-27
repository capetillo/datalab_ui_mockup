<script setup>
import { useRouter } from 'vue-router';
import { inject } from 'vue';

const router = useRouter();
const selectedImages = inject('selectedImages');

const goToDataSession = () => {
  if (selectedImages.value && selectedImages.value.length > 0) {
    router.push({ 
      name: 'DataSession', 
      params: { selectedImages: JSON.stringify(selectedImages.value) }
    });
  } else {
    alert("No images selected");
  }
}
</script>

<template>
  <v-btn @click="goToDataSession">Import</v-btn>
</template>
