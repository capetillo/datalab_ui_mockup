<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { fetchApiCall, handleError } from '../utils/api'
import DataSession from '@/components/DataSession/DataSession.vue'
import DeleteSessionDialog from '@/components/DataSession/DeleteSessionDialog.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useStore()
const dataSessions = ref([])
const tab = ref()
const deleteSessionId = ref(-1)
const showDeleteDialog = ref(false)
const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'

onBeforeMount(()=>{
	if(!store.getters['userData/userIsAuthenticated']) router.push({ name: 'Registration' })
})

onMounted(async () => {
	await loadSessions()
	// if user created or selected a specific datasession, load that tab
	if (route.params.sessionId && dataSessions.value.some(ds => ds.id == route.params.sessionId)) {
		tab.value = Number(route.params.sessionId)
		// if user is navigating to just /datasessions then their first datasession loads and adds /[first id] as params
	} else {
		if (dataSessions.value.length > 0) {
			const firstSessionId = dataSessions.value[0].id
			tab.value = firstSessionId
		} else {
			console.log('no data sessions available to display')
		}
	}
})

function onTabChange(newSessionId) {
	tab.value = newSessionId
}

function openDeleteDialog(id) {
	deleteSessionId.value = id
	showDeleteDialog.value = true
}

async function loadSessions() {
	await fetchApiCall({url: dataSessionsUrl, method: 'GET', successCallback: updateData, failCallback: handleError})
}

// if tab is not in new data default to displaying first tab
function updateData(data) {
	dataSessions.value = data.results
	if(!dataSessions.value.some(ds => ds.id == tab.value)){
		tab.value = dataSessions.value[0]?.id
	}
}

function tabColor(index) {
	if (dataSessions.value[index] && tab.value === dataSessions.value[index].id) {
		return 'selected'
	} else {
		return 'not-selected'
	}
}

</script>

<template>
  <v-container class="d-lg datasession-container">
    <v-card>
      <v-tabs 
        v-model="tab"
        class="tabs"
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        show-arrows
        @update:model-value="onTabChange"
      >
        <v-tab
          v-for="(ds, index) in dataSessions"
          :key="ds.id"
          :value="ds.id"
          :class="tabColor(index)"
          class="pr-0 tab"
        >
          {{ ds.name }}
          <v-btn
            variant="text"
            icon="mdi-close"
            class="tab_button"
            :class="tabColor(index)"
            @click="openDeleteDialog(ds.id)"
          />
        </v-tab>
        <v-btn
          variant="plain"
          icon="mdi-plus-box"
          class="tab_button"
          @click="router.push({ name: 'ProjectView' })"
        />
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item
          v-for="ds in dataSessions"
          :key="ds.id"
          :value="ds.id"
        >
          <data-session
            :data="ds"
            @reload-session="loadSessions()"
          />
        </v-window-item>
      </v-window>
    </v-card>
    <delete-session-dialog
      v-model="showDeleteDialog"
      :delete-id="deleteSessionId"
      @reload-session="loadSessions()"
    />
  </v-container>
</template>

<style scoped>
.datasession-container {
  position: fixed;
  left: 2%;
  width: 80vw;
}
.tabs {
  background-color: var(--metal);
  border-bottom: 0.1rem solid var(--tan);
}
.tab {
  font-size: 1.2rem;
  text-decoration: none;
  color: var(--tan);
  font-weight: 600;
  background-color: var(--metal);
}
.tab_button {
  color: var(--tan);
  text-decoration: none;
  margin: 0 0.5rem;
}
.selected { 
  background-color: var(--light-blue);
  color: white;
}
.not-selected {
  background-color: var(--metal);
}
@media (max-width: 1200px) {
.datasession-container {
  width: 85vw;
  justify-content: left;
}
  .tab {
    font-size: 0.85rem;
  }
  .tab_button {
    margin: 0;
  }
}
@media (max-width: 900px) {
  .datasession-container {
    width: 80vw;
  }
}
</style>
