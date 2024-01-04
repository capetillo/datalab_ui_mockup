<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const props = defineProps(["projectImageObjects", "selectedImages", "data"]);
const store = useStore();

// v-data-table setup variables
let headers = ref([
  { title: "Image Name", align: "start", sortable: true, key: "basefile_name" },
  { title: "Time", align: "start", sortable: true, key: "time" },
  { title: "Object", align: "start", sortable: true, key: "object" },
  { title: "Image", align: "start", sortable: false, key: "image" },
]);
let items = ref(props.data);
let itemsPerPage = ref(15);

// selected images logic
function selectRow(item) {
  store.dispatch("toggleImageSelection", item);
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    @click="selectRow(item)"
    v-model:items-per-page="itemsPerPage"
    show-select
    item-value="basefile_name"
    density="compact"
  >
    <!-- TODO change src to fetch image from url-->
    <template #[`item.image`]="{ item }">
      <v-img
        :src="require('@/assets/' + item.image)"
        :alt="item.basefile_name"
        height="72"
        width="128"
        cover
      >
      </v-img>
    </template>
  </v-data-table>
</template>
