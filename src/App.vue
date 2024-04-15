<script setup>
import { onMounted, computed, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import NavBar from './components/Global/NavBar.vue'

const store = useSettingsStore()
const loadedConfig = computed(() => store.isConfigLoaded)

// loading config  when app first mounts
onMounted(async () => {
  try {
    const response = await fetch('/config/config.json')
    if (!response.ok) {
      throw Error('Failed to load configuration')
    }
    const config = await response.json()
    if (config) {
      store.datalabApiBaseUrl = config.datalabApiBaseUrl
      store.observationPortalUrl = config.observationPortalUrl
      store.datalabArchiveApiUrl = config.dataLabArchiveApiUrl
      store.isConfigLoaded = true
    }
  } catch (error) {
    console.error('Error loading configuration:', error)
  }
})

watch(() => store.isColorblindMode, (newVal) => {
  if (newVal) {
    document.documentElement.setAttribute('colorblind', 'true')
  } else {
    document.documentElement.removeAttribute('colorblind')
  }
}, { immediate: true })

</script>

<template>
  <nav-bar />
  <template v-if="loadedConfig">
    <router-view />
  </template>
</template>

<style>
body {
  background-color: var(--dark-blue);
}

#app {
  font-family: 'Open Sans', sans-serif;
}
</style>
