<script setup>
// TODO change this to let the parent pass an object with download options and then iterate on that to create the buttons
// This way the component can be reused for different download options
// eslint-disable-next-line no-unused-vars
const props = defineProps(['image'])

const fitsUrl = props.image.url
const jpgUrl = props.image.largeCachedUrl
// TODO think about how we should generate this URL, in fits2img library? Part of the archive, an analysis action, or unique api call?
const tifUrl = null

function downloadLink(link, filename) {
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
      @click="downloadLink(fitsUrl, props.image.basename)"
    />
    <v-btn
      key="2"
      :disabled="true"
      text=".TIF"
      @click="downloadLink(tifUrl, props.image.basename)"
    />
    <v-btn
      key="3"
      text=".JPG"
      @click="downloadLink(jpgUrl, props.image.basename)"
    />
  </v-speed-dial>
</template>
<style scoped>
.v-btn{
  background-color: var(--metal);
}
</style>
