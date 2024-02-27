<script setup>

import { ref } from 'vue'

const isColorblindMode = ref(false)

function toggleColorblindMode() {
	isColorblindMode.value = !isColorblindMode.value
}

</script>

<template>
  <div :class="{ 'colorblind-mode': isColorblindMode }">
    <button @click="toggleColorblindMode">
      {{ isColorblindMode ? 'Disable' : 'Enable' }} Colorblind Mode
    </button>
  </div>
</template>

<style>
.colorblind-mode {
	filter: invert(1)
}
</style>
