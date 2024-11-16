<script setup>
import { defineProps, defineEmits } from 'vue'
import { deleteOperation } from '../../utils/api'
import DeleteDialog from '@/components/Global/DeleteDialog.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  operationId: {
    type: Number,
    required: true
  },
  sessionId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'itemWasDeleted'])

const DIALOG_TITLE = 'DELETE OPERATION'
const DIALOG_BODY = 'Are you sure you want to delete this Datalab Operation? This is not reversible!'

function itemDeleted(){
  emit('itemWasDeleted', props.operationId)
  emit('update:modelValue', false)
}

</script>
<template>
  <!-- Shared dialog used to confirm deleting of operations -->
  <delete-dialog
    :model-value="modelValue"
    :dialog-title="DIALOG_TITLE"
    :dialog-body="DIALOG_BODY"
    :on-delete="() => {deleteOperation(props.sessionId, props.operationId, itemDeleted)}"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<style scoped>
</style>
