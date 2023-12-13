<script setup>
import { ref, provide } from 'vue';
import ThemeSwitch from './components/ThemeSwitch.vue';


const selectedImages = ref([]);
provide('selectedImages', selectedImages);
</script>

<template>
  <div>
    <!-- feel free to move the theme switch once more is added here, it can be placed in any component-->
    <theme-switch></theme-switch>
    <router-view></router-view>
  </div>
</template>

<style>
</style>
