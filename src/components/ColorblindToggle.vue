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
      inset
      opacity="100"
      @click.stop="toggleColorblindMode"
    />
    <div class="label">
      Colorblind Mode: {{ isColorblindMode ? 'On' : 'Off' }}
    </div>
  </div>
</template>

<style scoped>
.colorblind-toggle-container {
  position: absolute;
  right: 0.7rem;
  top: -0.5rem;
  z-index: 2000;
  margin-right: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.colorblind-toggle {
  font-weight: 600;
  padding: 0.6rem;
}
.label {
  margin-right: 1rem;
  margin-bottom: 8%;
  cursor: default;
}
</style>
