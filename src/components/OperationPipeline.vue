<script setup>
import { ref, defineEmits, defineProps} from 'vue'
import OperationWizard from './OperationWizard.vue'

const emit = defineEmits(['addOperation'])

defineProps({
	operations: {
		type: Array,
		required: true
	}
})

const selectedOperation = ref(-1)
const showWizardDialog = ref(false)

function selectOperation(index) {
	if (index == selectedOperation.value) {
		selectedOperation.value = -1
	}
	else {
		selectedOperation.value = index
	}
}

function operationBtnColor(index) {
	if(index == selectedOperation.value){
		return 'indigo-lighten-1'
	}
	else {
		return 'light-grey-darken-1'
	}
}

</script>
<template>
  <h3 class="operations">
    OPERATIONS
  </h3>
  <v-divider class="mb-6" />
  <v-row
    v-for="(operation, index) in operations"
    :key="operation.id"
    align="center"
    justify="center"
    class="mb-2"
  >
    <v-btn
      :color="operationBtnColor(index)"
      variant="outlined"
      @click="selectOperation(index)"
    >
      {{ index }}: {{ operation.name }}
    </v-btn>
  </v-row>
  <v-divider class="mb-4 mt-4" />
  <v-btn
    variant="flat"
    class="addop_button"
  >
    Add Operation
    <v-dialog
      v-model="showWizardDialog"
      activator="parent"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <operation-wizard
        @close-wizard="showWizardDialog = false"
        @add-operation="emit('addOperation', $event); showWizardDialog = false;"
      />
    </v-dialog>
  </v-btn>
</template>

<style scoped lang="scss">
.operations {
  color: $tan;
  letter-spacing: 0.05rem;
  font-size: 2rem;
}
.addop_button {
  width: 16rem;
  height: 4rem;
  font-size: 1.3rem;
  align-content: center;
  background-color: $light-blue;
  opacity: calc(1);
  font-weight: 700;
  color: white;
}
</style>
