<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { loadConfig } from './utils/api'

const store = useStore()
const loadedConfig = computed(() => store.state.isConfigLoaded)

// invoking loadConfig when app first mounts
onMounted(async () => {
  const config = await loadConfig()

  // only render if config is loaded
  if (config) {
    store.commit('setIsConfigLoaded', true)
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
