<script setup>

    import { ref } from 'vue'
    // import axios from 'axios'

    // const images = ref([])
    // const unsplashAccessKey = process.env.VUE_APP_UNSPLASH_ACCESS_KEY
    // async function fetchRandomImages() {
    //     try {
    //         const response = await axios.get(`https://api.unsplash.com/photos/random?client_id=${unsplashAccessKey}&count=5`);
    //         images.value = response.data
    //         console.log("this is images:", images.value)
    //         console.log('response.data:', response.data)
    //     } catch (error) {
    //         console.error("Error fetching images:", error);
    //     }
// }

import { inject } from 'vue';

const selectedImages = inject('selectedImages');

const showProject1 = ref(false);
const project1Images = ref([
  require('@/assets/images/image1.png'),
  require('@/assets/images/image2.png'),
  require('@/assets/images/image3.png'),
  require('@/assets/images/image4.png'),
  require('@/assets/images/image5.png'),
  require('@/assets/images/image6.png'),
  require('@/assets/images/image7.png'),
  require('@/assets/images/image8.png'),
  require('@/assets/images/image9.png'),
  require('@/assets/images/image10.png'),
  require('@/assets/images/image11.png'),
  require('@/assets/images/image12.png'),
  require('@/assets/images/image13.png'),
  require('@/assets/images/image14.png'),
  require('@/assets/images/image15.png'),
])


const toggleSelection = (image) => {
  const index = selectedImages.value.indexOf(image);
  if (index === -1) {
    selectedImages.value.push(image);
  } else {
    selectedImages.value.splice(index, 1);
  }
};

const isSelected = (image) => {
  return selectedImages.value.includes(image);
};

</script>

<template>
  <v-container>
    <v-btn @click="showProject1 = !showProject1">Project 1</v-btn>
    <v-row v-if="showProject1">
      <v-col cols="12" sm="6" md="3" v-for="(image, index) in project1Images" :key="index">
        <div class="image-wrapper">
            <img :src="image" class="responsive-image" @click="toggleSelection(image)" :class="{ 'selected-image': isSelected(image) }" />
        </div>
      </v-col>
    </v-row>
  </v-container>
  </template>

<style scoped>

.v-col {
    padding: 0;
}

.image-wrapper {
    width: 250px;
    height: 250px;
}
.responsive-image {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  margin: 0;
  padding:0;
}

.selected-image {
  border: 3px solid rgb(241, 183, 36)
}

@media (max-width: 932px) { /* Phones */
  .responsive-image {
   width: 12rem;
   height: 12rem;
  }
}

@media (min-width: 932px) and (max-width: 1366px) { /* Tablets */
  .responsive-image {
    width: 12rem;
    height: 12rem;
  }
}

</style>
