<script setup>
import { fetchApiCall } from '@/utils/api';
const props = defineProps([ 'modelValue', 'deleteId'])
const emit = defineEmits(['update:modelValue', 'reloadSession'])

function closeDialog() { emit('update:modelValue', false)}

async function confirmDeleteSession() {
  if (props.deleteId != -1) {
    const url = 'http://127.0.0.1:8000/api/datasessions/' + props.deleteId
    fetchApiCall({url:url, method:'DELETE'})
    .then(function() {emit('reloadSession')})
    .then(function() {closeDialog()})
    .catch(error => console.error('Error:', error));
  }
  closeDialog()
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
      <v-card-title class="text-h5" color="red-lighten-1">
        Delete Session
      </v-card-title>
      <v-card-text>Are you sure you want to delete this Datalab Session? This operation is not reversible!</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
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
</template>
