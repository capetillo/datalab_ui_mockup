<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

const props = defineProps(["data"]);
const store = useStore();

// v-data-table setup variables
let headers = ref([
  { title: "Image Name", align: "start", sortable: true, key: "basename" },
  { title: "Time", align: "start", sortable: true, key: "observation_date" },
  { title: "Object", align: "start", sortable: true, key: "OBJECT" },
  { title: "Image", align: "start", sortable: false, key: "url" },
]);
let items = ref(props.data);
let itemsPerPage = ref(15);

// --- Selection Logic ---
let selected = ref([])

function select(selectedImageNames) {
  store.dispatch('setSelectedImages', selectedImageNames)
}

onMounted ( () => {
  selected.value = store.getters.selectedImages
})
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    item-value="basename"
    :return-object="true"
    show-select
    v-model="selected"
    @update:modelValue="select($event)"
    density="compact"
    :hover="true"
    v-model:items-per-page="itemsPerPage"
  >
    <template #[`item.url`]="{ item }">
      <v-img
        :src="item.url"
        :alt="item.OBJECT"
        height="50"
        width="200"
        cover
      >
      </v-img>
    </template>
  </v-data-table>
</template>
