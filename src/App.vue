<script setup>
import { onMounted, computed, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useConfigurationStore } from './stores/configuration'
import NavBar from './components/Global/NavBar.vue'

const configurationStore = useConfigurationStore()
const settingsStore = useSettingsStore()
const loadedConfig = computed(() => configurationStore.isConfigLoaded)

// loading config  when app first mounts
onMounted(async () => {
  try {
    const response = await fetch('/config/config.json')
    if (!response.ok) {
      throw Error('Failed to load configuration')
    }
    const config = await response.json()
    if (config) {
      configurationStore.datalabApiBaseUrl = config.datalabApiBaseUrl
      configurationStore.observationPortalUrl = config.observationPortalUrl
      configurationStore.datalabArchiveApiUrl = config.datalabArchiveApiUrl
      configurationStore.thumbnailServiceUrl = config.thumbnailServiceUrl || ''
      configurationStore.archiveType = config.archiveType || 'ptr'
      configurationStore.isConfigLoaded = true
    }
  } catch (error) {
    console.error('Error loading configuration:', error)
  }
})

watch(() => settingsStore.isColorblindMode, (newVal) => {
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
