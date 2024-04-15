<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const store = useSettingsStore()

const isColorblindMode = ref(false)

const toggleColorblindMode = () => {
  isColorblindMode.value = !isColorblindMode.value
  store.toggleColorblindMode()
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
  display: flex;
  align-items: center;
  max-width: 17%;
}
.colorblind-toggle {
  font-weight: 800;
  padding: 0.2rem;
  align-items: center;
}
.label {
  margin-bottom: 9.5%;
  cursor: default;
  font-size: 1.2rem;
}
@media (max-width: 900px) {
.colorblind-toggle {
  display: flex;
  flex-direction: row-reverse;
  right: 0.25%;
  top: 0.5%;
}
.label {
  margin-top: 12%;
  font-size: 0.7rem;
}
}
</style>
