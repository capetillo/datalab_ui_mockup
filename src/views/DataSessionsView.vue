<script setup>
import { ref, onMounted } from 'vue'
import DataSession from '@/components/DataSession.vue';

const dataSessions = ref([]);
const tab = ref();
const deleteSessionId = ref(-1);
const showDeleteSessionDialog = ref(false);

onMounted(() => {
  loadAllSessions();
})

function deleteSession(id) {
  deleteSessionId.value = id;
  showDeleteSessionDialog.value = true;
}

function loadAllSessions() {
  // Load in the session details from the API
  fetch('http://127.0.0.1:8000/api/datasessions/', {
    'headers': {'Authorization': 'Token 123456789abcdefg'}
  })
    .then(response => response.json())
    .then(data => dataSessions.value = data.results);
}

function confirmDeleteSession() {
  if (deleteSessionId.value != -1) {
    console.log('deleting session id ' + deleteSessionId.value);
    deleteSessionId.value = -1;
  }
  showDeleteSessionDialog.value = false;
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
      show-arrows>
        <v-tab v-for="ds in dataSessions" :key="ds.id" :value="ds.id" class="pr-0">{{ ds.name }}
          <v-btn variant="text" @click="deleteSession(ds.id)" icon="mdi-close" color="grey-darken-1">
          </v-btn>
        </v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item v-for="ds in dataSessions" :key="ds.id" :value="ds.id">
          <data-session :data="ds" @reload-session="loadAllSessions()"></data-session>
        </v-window-item>
      </v-window>
    </v-card>
  <!-- Shared dialog used to confirm deleting of sessions -->
  <v-dialog
    v-model="showDeleteSessionDialog"
    persistent
    width="auto"
  >
    <v-card>
      <v-card-title class="text-h5" color="red-lighten-1">
        Delete Session
      </v-card-title>
      <v-card-text>Are you sure you want to delete this Datalab Session? This operation is not reversible!</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="showDeleteSessionDialog = false"
        >
          Go Back
        </v-btn>
        <v-btn
          color="red-darken-1"
          variant="text"
          @click="confirmDeleteSession()"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-container>
</template>
