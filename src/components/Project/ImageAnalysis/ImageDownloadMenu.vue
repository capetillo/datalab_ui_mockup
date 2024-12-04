<script setup>
import { useAlertsStore } from '@/stores/alerts'

const props = defineProps({
  imageName: {
    type: String,
    required: true,
    default: null,
  },
  fitsUrl: {
    type: String,
    required: false,
    default: null,
  },
  jpgUrl: {
    type: String,
    required: false,
    default: null,
  },
})

defineEmits(['analysisAction'])

const alertStore = useAlertsStore()

function downloadLink(link, filename, fileType='file'){
  if(!link){
    alertStore.setAlert('error', `No ${fileType} available for download`)
    return
  }
  // Create a link element and click it to download the file
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
      v-if="props.fitsUrl"
      key="1"
      text=".FITS"
      @click="downloadLink(props.fitsUrl, props.imageName, 'FITs')"
    />
    <v-btn
      key="2"
      text=".TIF"
      @click="$emit('analysisAction', 'get-tif', {'basename': props.imageName}, downloadLink)"
    />
    <v-btn
      v-if="props.jpgUrl"
      key="3"
      text=".JPG"
      @click="downloadLink(props.jpgUrl, props.imageName, 'JPG')"
    />
  </v-speed-dial>
</template>
<style scoped>
.v-btn{
  background-color: var(--metal);
}
</style>
