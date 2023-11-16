<script setup>

    import { ref } from 'vue'
    import { VCarousel, VCarouselItem } from 'vuetify/lib/components/VCarousel'

    const images = ref(['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/330px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg'])

</script>

<template>
    <v-carousel>
        <v-carousel-item v-for="(image, index) in images" :key="index">
            <v-row justify="center">
                <v-col cols="12" md="10" lg="8">
                    <img :src="image" class="responsive-image" />
                </v-col>
            </v-row>
        </v-carousel-item>
    </v-carousel>
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
