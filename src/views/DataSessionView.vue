<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const selectedImages = ref([]);

onMounted(() => {
  if (route.params.selectedImages) {
    selectedImages.value = JSON.parse(route.params.selectedImages);
  }
})

defineProps({
  selectedImages: {
    type: Array,
    default: () => []
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
</style>