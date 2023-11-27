<script setup>
import { ref, provide } from 'vue';
import NavBarComponent from './components/NavBarComponent.vue';


const selectedImages = ref([]);
provide('selectedImages', selectedImages);
</script>

<template>
  <div>
    <NavBarComponent/>
    <router-view></router-view>
  </div>
</template>

<style>
body {
  background-color: rgb(21,23,24);
}
</style>
