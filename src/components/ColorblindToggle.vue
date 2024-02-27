<script setup>

import { ref } from 'vue'

const isColorblindMode = ref(false)

function toggleColorblindMode() {
	isColorblindMode.value = !isColorblindMode.value
}

</script>

<template>
  <div :class="{ 'colorblind-mode': isColorblindMode }">
    <v-switch
      v-model="isColorblindMode"
      :label="`Colorblind Mode: ${isColorblindMode ? 'On' : 'Off'}`"
      @click="toggleColorblindMode"
    />
  </div>
</template>

<style>
.colorblind-mode {
	filter: invert(1)
}
</style>
