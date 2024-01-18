<script setup>
import { ref, onMounted } from 'vue'
import DataSession from '@/components/DataSession.vue';
import DeleteSessionDialog from '@/components/DeleteSessionDialog.vue';

const dataSessions = ref([]);
const tab = ref();
const deleteSessionId = ref(-1);
const showDeleteDialog = ref(false);

onMounted(() => {
  loadAllSessions();
})

function deleteSession(id) {
  deleteSessionId.value = id;
  showDeleteDialog.value = true;
}

function loadAllSessions() {
  // Load in the session details from the API
  fetch('http://127.0.0.1:8000/api/datasessions/', {
    'headers': {'Authorization': 'Token 123456789abcdefg'}
  })
    .then(response => response.json())
    .then(data => dataSessions.value = data.results);
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
    <delete-session-dialog v-model="showDeleteDialog" :deleteId="deleteSessionId" @refreshDataSessions="console.log('emitted event heard by parrent')"/>
  </v-container>
</template>
