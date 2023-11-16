<script setup>

    import { ref } from 'vue'
    import { VCarousel, VCarouselItem } from 'vuetify/lib/components/VCarousel'

    const images = ref(['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/330px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg'])

</script>

<template>
    <v-carousel>
        <v-carousel-item
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        ></v-carousel-item>
  </v-carousel>
</template>


<style scoped>
.v-carousel-item {
  height: 400px;
}
</style>