<script setup>
import { ref } from 'vue'
import OperationWizard from './OperationWizard.vue';

const emit = defineEmits(['addOperation'])

defineProps({
  operations: {
    type: Array,
    required: true
  }
})

const selectedOperation = ref(-1);
const showWizardDialog = ref(false);

function selectOperation(index) {
  if (index == selectedOperation.value) {
    selectedOperation.value = -1;
  }
  else {
    selectedOperation.value = index;
  }
}

function operationBtnColor(index) {
  if(index == selectedOperation.value){
    return 'indigo-lighten-1';
  }
  else {
    return 'light-grey-darken-1';
  }
}

</script>
<template>
  <h3>Operations</h3>
  <v-divider class="mb-6"></v-divider>
  <v-row v-for="(operation, index) in operations" :key="operation.id" align="center" justify="center" class="mb-2">
      <v-btn :color="operationBtnColor(index)" variant="outlined" @click="selectOperation(index)">{{ index }}: {{ operation.name }}</v-btn>
  </v-row>
  <v-divider class="mb-4 mt-4"></v-divider>
  <v-btn variant="flat" color="indigo-darken-2">Add Operation
    <v-dialog v-model="showWizardDialog" activator="parent" fullscreen transition="dialog-bottom-transition">
      <operation-wizard @close-wizard="showWizardDialog = false" @add-operation="emit('addOperation', $event); showWizardDialog = false;"></operation-wizard>
    </v-dialog>
  </v-btn>
</template>
