<script setup>
import { ref, watch } from 'vue'
import { useAlertsStore } from '../../stores/alerts'

const alertStore = useAlertsStore()
const showAlert = ref(false)

watch(() => alertStore.alertText, () => {showAlert.value = true})

</script>
<template>
  <v-fade-transition>
    <v-alert
      v-model="showAlert"
      closable
      :type="alertStore.alertType"
      :text="alertStore.alertText"
    />
  </v-fade-transition>
</template>
<style scoped>
  .v-alert {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9999;
    padding: 10px;
    margin: 2rem;
  }
</style>
