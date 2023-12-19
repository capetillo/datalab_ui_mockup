<script setup>
// import { ref } from 'vue'
import OperationPipeline from './OperationPipeline.vue';

defineProps({
  data: {
    type: Object,
    required: true
  }
})

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
        <operation-pipeline :operations="data.operations">

        </operation-pipeline>
      </v-col>
    </v-row>
  </v-container>
</template>