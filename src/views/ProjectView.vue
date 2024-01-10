<script setup>
    // libraries
    import { ref } from 'vue'
    // components
    import ImportButton from '../components/ImportButton.vue'
    import ProjectBar from '@/components/ProjectView/ProjectBar.vue';
    import ImageCarousel from '@/components/ProjectView/ImageCarousel.vue';
    import ImageList from '@/components/ProjectView/ImageList.vue';
    // data
    import MockData from '../assets/MockData.JSON'

    let imageDisplayToggle = ref(true)
</script>
<template>
    <ProjectBar/>
    <div>
        <v-switch v-model="imageDisplayToggle" inset prepend-icon="mdi-view-list" append-icon="mdi-image"/>
        <ImageCarousel v-if="imageDisplayToggle" :data="MockData"/>
        <ImageList v-if="!imageDisplayToggle" :data="MockData"/>
    </div>
    <ImportButton/>
</template>
