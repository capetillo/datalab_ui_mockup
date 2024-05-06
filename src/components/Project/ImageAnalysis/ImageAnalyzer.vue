<script setup>
import { ref } from 'vue'
import { fetchApiCall } from '../../../utils/api'
import { useSettingsStore } from '@/stores/settings'
import ImageViewer from './ImageViewer.vue'
import LinePlot from './LinePlot.vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps(['modelValue', 'image'])
const emit = defineEmits(['update:modelValue'])
const settingsStore = useSettingsStore()

const lineProfile = ref([])
const lineProfileLength = ref(0)

function closeDialog() { 
  lineProfile.value = []
  lineProfileLength.value = 0
  emit('update:modelValue', false)
}

function requestAnalysis(action, input){
  const url = settingsStore.datalabApiBaseUrl + 'analysis/' + action + '/'
  const body = {
    'basename': props.image.basename,
    ...input
  }
  fetchApiCall({url: url, method: 'POST', body: body, successCallback: (response) => {handleAnalysisOutput(response, action)}})
}

function handleAnalysisOutput(response, action){
  switch (action) {
  case 'line-profile':
    lineProfile.value = response.line_profile
    lineProfileLength.value = response.arcsec
    break
  default:
    console.error('Invalid action:', action)
    break
  }
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
          :image-src="image.url"
          @analysis-action="requestAnalysis"
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
          <line-plot
            :y-axis-luminosity="lineProfile"
            :x-axis-arcsecs="lineProfileLength"
          />
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
