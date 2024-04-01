<script setup>
import { defineProps, defineEmits } from 'vue'
import ImageViewer from './Project/ImageViewer.vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps(['modelValue', 'image'])
const emit = defineEmits(['update:modelValue'])

function closeDialog() { 
  emit('update:modelValue', false)
}

</script>
<template>
  <v-dialog
    :model-value="modelValue"
    fullscreen
  >
    <v-sheet class="analysis-sheet">
      <v-toolbar
        class="analysis-toolbar"
        density="comfortable"
        :title="image.target_name"
      >
        <a
          :href="image.url"
          :download="image.basename"
          target="_blank"
        >
          <v-btn
            icon="mdi-download"
          />
        </a>
        <v-btn
          icon="mdi-close"
          @click="closeDialog()"
        />
      </v-toolbar>
      <div class="analysis-content">
        <image-viewer
          class="image"
          :image-src="image.url"
        />
        <!-- <line-analysis /> -->
        <v-sheet class="side-panel">
          <h1>Details</h1>
          <p>Basename: {{ image.basename }}</p>
          <p>Date & Time: {{ image.observation_date }}</p>
          <p>Site: {{ image.site_id }}</p>
          <p>Telescope: {{ image.telescope_id }}</p>
          <p>Instrument: {{ image.instrument_id }}</p>
        </v-sheet>
      </div>
    </v-sheet>
  </v-dialog>
</template>
<style scoped>
.analysis-sheet{
  background-color: var(--dark-blue);
  font-family: 'Open Sans', sans-serif;
  text-transform: uppercase;
}
.analysis-toolbar{
  color: var(--tan);
  background-color: var(--metal);
}
.analysis-content{
  margin-top: 20px;
  margin-left: 20px;
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: 1fr;
  height: 90%;
}
.image{
  background-color: var(--dark-blue);
}
.side-panel{
  background-color: var(--dark-blue);
  color: var(--tan);
  position: fixed;
  right: 20px;
}
</style>
