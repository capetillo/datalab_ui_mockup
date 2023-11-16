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
</script>

<template>
    <v-container>
      <v-btn @click="showProject1 = !showProject1">Project 1</v-btn>
  
      <v-row v-if="showProject1">
        <v-col cols="12" sm="6" md="3" v-for="image in project1Images" :key="image">
          <img :src="image" class="responsive-image" />
        </v-col>
      </v-row>
    </v-container>
  </template>

<style scoped>

.responsive-image {
  width: 200px;
  height: 200px;
  object-fit: cover; 

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
