<script setup>
import { useAlertsStore } from '@/stores/alerts'

const props = defineProps(['image', 'tifUrl'])

defineEmits(['analysisAction'])

const alertStore = useAlertsStore()

function downloadLink(link, filename, fileType='file'){
  if(!link){
    alertStore.setAlert('error', `No ${fileType} available for download`)
    return
  }
  const a = document.createElement('a')
  a.href = link
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

</script>
<template>
  <v-speed-dial
    location="left center"
    transition="fade-transition"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        icon="mdi-download"
      />
    </template>
    <v-btn
      key="1"
      text=".FITS"
      @click="downloadLink(props.image.url, props.image.basename, 'FITs')"
    />
    <v-btn
      key="2"
      text=".TIF"
      @click="$emit('analysisAction', 'get-tif', {'basename': props.image.basename}, downloadLink)"
    />
    <v-btn
      key="3"
      text=".JPG"
      @click="downloadLink(props.image.largeCachedUrl, props.image.basename, 'JPG')"
    />
  </v-speed-dial>
</template>
<style scoped>
.v-btn{
  background-color: var(--metal);
}
</style>
