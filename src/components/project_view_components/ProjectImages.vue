<script setup>
    import { ref } from 'vue'
    import ImageList from './ImageList.vue';
    import ImageCarousel from '../ImageCarousel.vue';
    // TODO for now we will just import project data from mock data but in the future call an api based on selectedProject
    import MockData from '../../assets/MockData.JSON'

    // functionality to switch between image layouts while retaining selected images
    defineProps(['selectedProject'])

    let selectedImages = ref([])

    function updateSelectedImages(selected){
        selectedImages.value = selected
    }
</script>

<template>
    <v-card>
        <!-- These divs are just for demonstration purposes, feel free to remove them when implemented -->
        <div>{{ selectedProject }}</div>
        <image-list :data="MockData" :selectedImages="selectedImages" @update-selected="updateSelectedImages"/>
        <ImageCarousel></ImageCarousel>
    </v-card>
</template>