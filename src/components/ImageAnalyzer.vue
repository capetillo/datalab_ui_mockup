<script setup>
import { defineProps, defineEmits } from 'vue'
import ImageViewer from './Project/ImageViewer.vue'
import LinePlot from './Project/LinePlot.vue'

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
          :image-src="image.largeCachedUrl"
        />
        <div class="side-panel-container">
          <v-sheet class="side-panel">
            <h1>Details</h1>
            <p>Basename: {{ image.basename }}</p>
            <p>Date & Time: {{ image.observation_date }}</p>
            <p>Site: {{ image.site_id }}</p>
            <p>Telescope: {{ image.telescope_id }}</p>
            <p>Instrument: {{ image.instrument_id }}</p>
          </v-sheet>
          <line-plot />
        </div>
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
  display: flex;
  width: 100%;
  height: 100%;
}
.side-panel-container {
  margin-top: 2%;
  display: flex;
  flex-direction: column
}
.side-panel{
  background-color: var(--dark-blue);
  color: var(--tan);
  margin-left: 10px;
  margin-bottom: 5%;
}
@media (min-width: 1201px) { 
  .side-panel-container {
    margin-left: 20%;
  }
}
@media (max-width: 1200px) {
.analysis-sheet {
  overflow: hidden !important;
}
.side-panel {
  font-size: 0.75em;
}
}
@media (max-width: 900px) {
.analysis-sheet {
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
}
.analysis-content {
  flex-direction: column;
}
.side-panel-container {
  margin-left: 11%;
  margin-top: 5%;
  flex-direction: row;
  height: 30%;
}
.side-panel {
  width: 25%;
  height: 50%;
  margin: 0;
}
.line-plot {
  flex-grow: 1;
  height: 100%;
}
.image-viewer {
  order: -1;
  height: 70%;
}
}

</style>
