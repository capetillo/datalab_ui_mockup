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
  <v-switch
    v-model="isColorblindMode"
    :label="`Colorblind Mode: ${isColorblindMode ? 'On' : 'Off'}`"
    @click="toggleColorblindMode"
  />
</template>
