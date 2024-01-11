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
    <div class="container">
        <ProjectBar class="project-bar"/>
        <div class="image-area">
            <ImageCarousel v-if="imageDisplayToggle" :data="MockData"/>
            <ImageList v-if="!imageDisplayToggle" :data="MockData"/>
            <div class="control-buttons">
                <v-switch class="d-flex mr-4" v-model="imageDisplayToggle" inset prepend-icon="mdi-view-list" append-icon="mdi-image"/>
                <ImportButton/>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container{
    margin: 20px;
    display: grid;
    grid-template-columns: [col1-start] 1fr [col1-end col2-start] 80% [col2-end];
    grid-template-rows: [row-start] 100% [row-end];
}
.project-bar{
    display: flex;
    grid-column-start: col1-start;
    grid-column-end: col1-end;
    grid-row-start: row-start;
    grid-row-end: row-end;
}
.image-area{
    grid-column-start: col2-start;
    grid-column-end: col2-end;
}
.control-buttons{
    margin-top: 10px;
    display: flex;
    align-items: center;
    float: right;
}
</style>
