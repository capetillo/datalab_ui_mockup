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

    // toggle for optional data viewing, controlled by a v-switch
    let imageDisplayToggle = ref(true)
</script>
<template>
    <div class="d-flex">
        <ProjectBar class="w-25"/>
        <div class="w-75">
            <ImageCarousel v-if="imageDisplayToggle" :data="MockData"/>
            <ImageList class="overflow-auto" v-if="!imageDisplayToggle" :data="MockData"/>
            <v-switch class="d-flex ml-auto" v-model="imageDisplayToggle" inset prepend-icon="mdi-view-list" append-icon="mdi-image"/>
        </div>
    </div>
    <ImportButton/>
</template>
