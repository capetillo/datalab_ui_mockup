<script setup>
import ImageCarousel from '../ImageCarousel.vue';
    // this prop should be enough to know which project to fetch images from
    defineProps(['selectedProject'])
</script>
<template>
    <v-card>
        <!-- These divs are just for demonstration purposes, feel free to remove them when implemented -->
        <div>{{ selectedProject }}</div>
        <ImageCarousel></ImageCarousel>
    </v-card>
</template>