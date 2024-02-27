<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isColorblindMode = ref(false)

function toggleColorblindMode() {
	store.dispatch('toggleColorblindMode')
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
