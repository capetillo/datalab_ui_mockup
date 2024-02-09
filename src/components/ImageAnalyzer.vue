<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['modelValue', 'image'])
const emit = defineEmits(['update:modelValue'])

function closeDialog() { 
	console.log('image prop:', props.image)
	emit('update:modelValue', false)
}

</script>
<template>
  <v-dialog
    :model-value="modelValue"
    fullscreen
  >
    <v-card>
      <v-img
        :src="hello"
        cover
      />
      <v-btn
        color="green-darken-1"
        variant="text"
        @click="closeDialog()"
      >
        Close
      </v-btn>
    </v-card>
  </v-dialog>
</template>
