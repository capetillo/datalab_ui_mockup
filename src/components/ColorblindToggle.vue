<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isColorblindMode = ref(false)

const toggleColorblindMode = () => {
	isColorblindMode.value = !isColorblindMode.value
	store.dispatch('toggleColorblindMode')
}
</script>

<template>
  <div class="colorblind-toggle-container">
    <v-switch
      v-model="isColorblindMode"
      class="colorblind-toggle"
      opacity="100"
      d-inline-block
      @click.stop="toggleColorblindMode"
    />
    <div class="label">
      COLORBLIND MODE: {{ isColorblindMode ? 'ON' : 'OFF' }}
    </div>
  </div>
</template>

<style scoped>
.colorblind-toggle-container {
  position: fixed;
  right: 1%;
  top: 0.25%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 17%;
}
.colorblind-toggle {
  font-weight: 800;
  padding: 0.2rem;
}
.label {
  margin-bottom: 12%;
  cursor: default;
  font-size: 0.82rem;
}
</style>
