<script setup>
import { ref, defineEmits, defineProps} from 'vue'
import OperationWizard from './OperationWizard.vue'

const emit = defineEmits(['addOperation'])

defineProps({
	operations: {
		type: Array,
		required: true
	},
	images: {
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
		return 'selected'
	}
	else {
		return 'not-selected'
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
      :class="operationBtnColor(index)"
      variant="outlined"
      class="operation_button"
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
        :images="images"
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
  font-weight: 700;
  color: white;
}
.operation_button {
  width: 12rem;
  height: 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-style: none;
}
.selected {
  background-color:$light-blue
}
.not-selected{
  background-color: $light-gray;
  color: $metal;
}
@media (max-width: 1200px) {
  .operations {
    font-size: 1.3rem;
  }
  .addop_button {
    font-size: 1rem;
    height: 5vh;
  }
  .operation_button {
    width: 13vw;
    height: 4.5vh;
    font-size: 0.8rem;
  }
}
@media (max-width: 900px) {
  .operations {
    font-size: 1.2rem;
  }
  .addop_button {
    font-size: 0.9rem;
    height: 4vh;
  }
  .operation_button {
    width: 15vw;
    height: 3vh;
    font-size: 0.7rem;
  }
}
</style>
