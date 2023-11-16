<script setup>

    import { ref } from 'vue'
    import { VCarousel, VCarouselItem, VBtn } from 'vuetify/lib/components/VCarousel'
    import axios from 'axios'

    const images = ref([])
    const unsplashAccessKey = process.env.VUE_APP_UNSPLASH_ACCESS_KEY



    async function fetchRandomImages() {
        try {
            const response = await axios.get(`https://api.unsplash.com/photos/random?client_id=${unsplashAccessKey}&count=5`);
            images.value = response.data
            console.log("this is images:", images.value)
            console.log('response.data:', response.data)
        } catch (error) {
            console.error("Error fetching images:", error);
        }
}

const imageLoadError = (event) => {
  console.error("Error loading image:", event.target.src);
};

</script>

<template>
    <v-carousel>
      <v-carousel-item v-for="(image, index) in images" :key="index">

        <img :src="image.urls.regular" @error="imageLoadError" class="responsive-image" />

      </v-carousel-item>
    </v-carousel>
    <v-btn @click="fetchRandomImages">Load Random Images</v-btn>

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
