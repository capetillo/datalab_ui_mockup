<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { fetchApiCall, handleError } from '../utils/api'
import DataSession from '@/components/DataSession.vue'
import DeleteSessionDialog from '@/components/DeleteSessionDialog.vue'
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
	if (route.params.sessionId) {
		tab.value = Number(route.params.sessionId)
		// if user is navigating to just /datasessions then their first datasession loads
	} else {
		tab.value = dataSessions.value[0].id
	}
})

function deleteSession(id) {
	deleteSessionId.value = id
	showDeleteDialog.value = true
}

async function loadSessions() {
	await fetchApiCall({url: dataSessionsUrl, method: 'GET', successCallback: (data) => {dataSessions.value = data.results}, failCallback: handleError})
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
        <v-btn
          variant="plain"
          icon="mdi-plus-box"
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
