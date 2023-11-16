<script setup>

import { ref } from 'vue';
import axios from 'axios';


const images = ref([]);
const dialog = ref(false);
const unsplashAccessKey = process.env.VUE_APP_UNSPLASH_ACCESS_KEY;

async function fetchRandomImages() {
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/random?client_id=${unsplashAccessKey}&count=5`);
    images.value = response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

function showImages() {
  fetchRandomImages();
  dialog.value = true; // Open the dialog after fetching images
}

</script>

<template>
    <v-container>
      <v-btn color="primary" @click="showImages">Import</v-btn>
  
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-carousel>
            <v-carousel-item v-for="(image, index) in images" :key="index">
              <img :src="image.urls.regular" class="responsive-image" />
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-dialog>
    </v-container>
  </template>


<style scoped>
.responsive-image {
  width: 100%;
  height: auto;
}

@media (max-width: 600px) { /* Phones */
  .responsive-image {
    /* Styles for phones */
  }
}

@media (min-width: 600px) and (max-width: 960px) { /* Tablets */
  .responsive-image {
    /* Styles for tablets */
  }
}

@media (min-width: 960px) { /* Desktop */
  .responsive-image {
    /* Styles for desktop */
  }
}
</style>
