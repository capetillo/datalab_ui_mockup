<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['modelValue', 'image'])
const emit = defineEmits(['update:modelValue'])

function closeDialog() { 
	emit('update:modelValue', false)
	console.log(props.image)
}

</script>
<template>
  <v-dialog
    :model-value="modelValue"
    fullscreen
  >
    <v-card class="pa-6">
      <v-toolbar>
        <v-spacer />
        <a
          :href="image.url"
          :download="image.basename"
          target="_blank"
          style="text-decoration:none"
        >
          <v-btn
            icon="mdi-download"
          />
        </a>
        <v-btn
          icon="mdi-close"
          @click="closeDialog()"
        />
      </v-toolbar>
      <img
        class="image"
        :src="image.url"
      >
    </v-card>
  </v-dialog>
</template>
<style scoped>
.image{
	object-fit: contain
}
</style>
