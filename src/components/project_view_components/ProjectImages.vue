<script setup>
    import ImageList from './ImageList.vue';
import ImageCarousel from '../ImageCarousel.vue';
    // this prop should be enough to know which project to fetch images from
    defineProps(['selectedProject'])

    // functionality to switch between image layouts while retaining selected images
    let selectedImages = []

    function updateSelectedImages(selected){
        selectedImages = selected
    }
</script>
<template>
    <v-card>
        <!-- These divs are just for demonstration purposes, feel free to remove them when implemented -->
        <div>{{ selectedProject }}</div>
        <div>under construction: Image format toggle</div>
        <div>under construction: Image Carousel or Archive List</div>
        <image-list :selectedImages="selectedImages" @update-selected="updateSelectedImages"/>
        <ImageCarousel></ImageCarousel>
    </v-card>
</template>