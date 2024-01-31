<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { fetchApiCall, handleError } from '../utils/api'
import DataSession from '@/components/DataSession.vue'
import DeleteSessionDialog from '@/components/DeleteSessionDialog.vue'

const store = useStore()
const dataSessions = ref([])
const tab = ref()
const deleteSessionId = ref(-1)
const showDeleteDialog = ref(false)
const dataSessionsUrl = store.state.datalabApiBaseUrl + 'datasessions/'

const authHeaders = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Token ${store.state.authToken}`,
}

onMounted(() => {
	loadAllSessions()
})

function deleteSession(id) {
	deleteSessionId.value = id
	showDeleteDialog.value = true
}

async function loadAllSessions() {
	await fetchApiCall({url: dataSessionsUrl, method: 'GET', headers: authHeaders, successCallback: (data) => {dataSessions.value = data.results}, failCallback: handleError})
}

</script>

<template>
  <v-container class="d-lg">
    <v-card>
      <v-tabs 
        v-model="tab"
        bg-color="indigo"
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        show-arrows
      >
        <v-tab
          v-for="ds in dataSessions"
          :key="ds.id"
          :value="ds.id"
          class="pr-0"
        >
          {{ ds.name }}
          <v-btn
            variant="text"
            icon="mdi-close"
            color="grey-darken-1"
            @click="deleteSession(ds.id)"
          />
        </v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item
          v-for="ds in dataSessions"
          :key="ds.id"
          :value="ds.id"
        >
          <data-session
            :data="ds"
            @reload-session="loadAllSessions()"
          />
        </v-window-item>
      </v-window>
    </v-card>
    <delete-session-dialog
      v-model="showDeleteDialog"
      :delete-id="deleteSessionId"
      @reload-session="loadAllSessions()"
    />
  </v-container>
</template>
