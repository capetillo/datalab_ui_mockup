<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { loadConfig } from './utils/api'

const store = useStore()
const loadedConfig = computed(() => store.state.isConfigLoaded)


// loads config data
async function loadConfiguration() {
  try {
    const response = await fetch('/config/config.json')
    if (!response.ok) {
      throw Error('Failed to load configuration')
    }
    const configData = response.json()
    return configData
  } catch (error) {
    console.error('Error loading configuration:', error)
  }
}
// invoking loadConfig when app first mounts
onMounted(async () => {
  const config = await loadConfiguration()

  // only render if config is loaded
  if (config) {
    store.commit('setIsConfigLoaded', true)
    store.commit('setApiBaseUrl', config.apiBaseUrl)
    store.commit('setDataSessionsUrl', config.dataSessionsUrl)
    store.commit('setArchiveUrl', config.dataLabArchiveUrl)
  }  
})
</script>

<template>
  <div v-if="loadedConfig">
    <router-view></router-view>
  </div>
</template>

<style>
</style>
