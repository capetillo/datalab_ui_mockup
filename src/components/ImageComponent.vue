<script setup>

    import { ref } from 'vue'
    import { VCarousel, VCarouselItem } from 'vuetify/lib/components/VCarousel'
    import axios from 'axios'

    const images = ref([])
    const unsplashAccessKey = process.env.VUE_APP_UNSPLASH_ACCESS_KEY



    async function fetchRandomImages() {
        try {
            const response = await axios.get(`https://api.unsplash.com/photos/random?client_id=${unsplashAccessKey}&count=1`);
            images.value = response.data;
            console.log('response.data:', response.data)
        } catch (error) {
            console.error("Error fetching images:", error);
        }
}
</script>

<template>
    <v-carousel>
      <v-carousel-item v-for="(image, index) in images" :key="index">

            <img :src="image.urls.regular" class="responsive-image" />

      </v-carousel-item>
    </v-carousel>
    <button @click="fetchRandomImages" type="button">Load Random Images</button>

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
