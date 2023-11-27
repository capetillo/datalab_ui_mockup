<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const selectedImages = ref([]);

onMounted(() => {
  // Parse the route parameter as JSON
  if (route.params.selectedImages) {
    try {
      selectedImages.value = JSON.parse(route.params.selectedImages);
    } catch (e) {
      console.error('Error parsing selected images:', e);
      selectedImages.value = [];
    }
  }
});
</script>

<template>
  <div>
    <h1>Data Session View</h1>
    <div v-for="(image, index) in selectedImages" :key="index">
      <img :src="image" class="responsive-image" />
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: white;
}
.responsive-image {
  width: 50%;
  height: auto; 
  object-fit: cover; 
}
</style>
