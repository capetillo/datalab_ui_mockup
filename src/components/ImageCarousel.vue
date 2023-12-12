<script setup>
import MockData from '../assets/MockData.JSON'


</script>

<template>
    <div class="image-gallery">
        <div v-for="(item, index) in MockData" :key="index" class="image-container">
            <img :src="require('@/assets/' + item.image)" />
        </div>
  </div>
</template>

<style scoped>
</style>