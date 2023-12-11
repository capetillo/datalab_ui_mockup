<script setup>
import images from '../assets/images'

</script>

<template>
    <li v-for="image in images" :key="image.id">
        <img src={{ image }}>
    </li>
</template>

<style scoped>
</style>