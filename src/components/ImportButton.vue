<script setup>
import { useRouter } from 'vue-router';
import { inject } from 'vue';

const router = useRouter();
const selectedImages = inject('selectedImages');

const goToDataSession = () => {
  router.push({ 
    name: 'DataSession', 
    params: { selectedImages: JSON.stringify(selectedImages.value) }
  });
};
</script>

<template>
  <v-btn @click="goToDataSession">Import</v-btn>
</template>
