<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { fetchApiCall } from '../../utils/api'
import { useStore } from 'vuex'

const props = defineProps([ 'modelValue', 'deleteId'])
const emit = defineEmits(['update:modelValue', 'reloadSession'])
const store = useStore()

let showSnackBar = ref(false)
const datalabApiBaseUrl = store.state.datalabApiBaseUrl
const dataSessionsUrl = datalabApiBaseUrl + 'datasessions/'

function closeDialog() { 
	emit('update:modelValue', false)
	emit('reloadSession')
}

async function confirmDeleteSession() {
	const url = dataSessionsUrl + props.deleteId
	await fetchApiCall({url: url, method: 'DELETE', successCallback: closeDialog, failCallback: () => {showSnackBar.value=true} })
}
</script>
<template>
  <!-- Shared dialog used to confirm deleting of sessions -->
  <v-dialog
    :model-value="modelValue"
    persistent
    width="auto"
  >
    <v-card class="delete-card">
      <v-card-title
        class="text-h5"
      >
        <p class="delete-session-text">
          DELETE SESSION
        </p>
      </v-card-title>
      <v-card-text>
        <p class="delete-text">
          Are you sure you want to delete this Datalab Session? This operation is not reversible!
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          class="close-btn"
          variant="text"
          @click="closeDialog()"
        >
          Go Back
        </v-btn>
        <v-btn
          class="delete-btn"
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

<style scoped>
.delete-card {
  background-color: var(--metal);
}
.delete-session-text {
  color: var(--cancel);
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 0.1rem;
  font-weight: 600;
  font-size: 1.3rem;
}
.delete-text {
  color: var(--tan);
  font-family: 'Open Sans', sans-serif;
  font-size: 1.2rem;
}
.close-btn {
  color: var(--light-blue);
  font-size: 1rem;
}
.delete-btn {
  color: var(--cancel);
  font-size: 1rem;
}
</style>
