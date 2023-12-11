<script setup>
    // this prop should be enough to know which project to fetch images from
    const props = defineProps(['selectedProject'])
</script>
<template>
    <v-card>
        <!-- These divs are just for demonstration purposes, feel free to remove them when implemented -->
        <div>{{ props.selectedProject }}</div>
        <div>under construction: Image format toggle</div>
        <div>under construction: Image Carousel or Archive List</div>
    </v-card>
</template>