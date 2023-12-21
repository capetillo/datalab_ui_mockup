<script setup>
// import { ref } from 'vue'
import OperationPipeline from './OperationPipeline.vue';

const emit = defineEmits(['reloadSession'])

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

function addOperation(operationDefinition) {
  // Create data operation in this session with input parameters specified from wizard
  fetch('http://127.0.0.1:8000/api/datasessions/' + props.data.id + '/operations/', {
    'method': 'POST',
    'body': JSON.stringify(operationDefinition),
    'headers': {
      'Authorization': 'Token 123456789abcdefg',
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(response => response.json())
    .then(function() {emit('reloadSession')})
    .catch(error => console.error('Error:', error));
}

</script>

<template>
  <v-container class="d-lg-flex">
    <v-row>
      <v-col cols="9">
        <!-- TODO: Place input/output view here -->
        <v-carousel>
          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
          ></v-carousel-item>
          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
          ></v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col cols="3" justify="center" align="center">
        <!-- The operations bar list goes here -->
        <operation-pipeline :operations="data.operations" @add-operation="addOperation">

        </operation-pipeline>
      </v-col>
    </v-row>
  </v-container>
</template>
