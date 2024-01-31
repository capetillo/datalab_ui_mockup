<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { fetchApiCall } from '@/utils/api'
import { useStore } from 'vuex'

const props = defineProps([ 'modelValue', 'deleteId'])
const emit = defineEmits(['update:modelValue', 'reloadSession'])
const store = useStore()

const authHeaders = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Token ${store.getters['userData/authToken']}`,
}

let showSnackBar = ref(false)
const datalabApiBaseUrl = store.state.datalabApiBaseUrl
const dataSessionsUrl = datalabApiBaseUrl + 'datasessions/'

function closeDialog() { 
	emit('update:modelValue', false)
	emit('reloadSession')
}

async function confirmDeleteSession() {
	const url = dataSessionsUrl + props.deleteId
	await fetchApiCall({url: url, method: 'DELETE', headers: authHeaders, successCallback: closeDialog, failCallback: () => {showSnackBar.value=true} })
}
</script>
<template>
  <!-- Shared dialog used to confirm deleting of sessions -->
  <v-dialog
    :model-value="modelValue"
    persistent
    width="auto"
  >
    <v-card>
      <v-card-title
        class="text-h5"
        color="red-lighten-1"
      >
        Delete Session
      </v-card-title>
      <v-card-text>Are you sure you want to delete this Datalab Session? This operation is not reversible!</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="closeDialog()"
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
  <v-snackbar
    v-model="showSnackBar"
    color="red"
    :timeout="2000"
  >
    Error: Item couldn't be deleted
  </v-snackbar>
</template>
