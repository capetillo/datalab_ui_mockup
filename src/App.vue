<script setup>
import { onMounted, computed } from "vue"
import { useStore } from "vuex"

const store = useStore()
const loadedConfig = computed(() => store.state.isConfigLoaded)

// loading config  when app first mounts
onMounted(async () => {
	try {
		const response = await fetch("/config/config.json")
		if (!response.ok) {
			throw Error("Failed to load configuration")
		}
		const config = await response.json()
		if (config) {
			store.commit("setIsConfigLoaded", true)
			store.commit("setDatalabApiBaseUrl", config.datalabApiBaseUrl)
			store.commit("setObservationPortalUrl", config.observationPortalUrl)
		}  
	} catch (error) {
		console.error("Error loading configuration:", error)
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
