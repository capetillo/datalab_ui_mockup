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
  <div class="colorblind-toggle-container">
    <v-switch
      v-model="isColorblindMode"
      :label="`Colorblind Mode: ${isColorblindMode ? 'On' : 'Off'}`"
      class="colorblind-toggle"
      @click="toggleColorblindMode"
    />
  </div>
</template>

<style scoped>
.colorblind-toggle-container {
  position: absolute;
  right: 0.7rem;
  top: -0.5rem;
  z-index: 2000;
  margin-right: 0.3rem;
}
.colorblind-toggle {
  color: white;
  font-weight: 600;
  padding: 0.6rem;
}
</style>
