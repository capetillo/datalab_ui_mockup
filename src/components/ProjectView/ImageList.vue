<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

const props = defineProps(["data"]);
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
    item-value="basefile_name"
    :return-object="true"
    show-select
    v-model="selected"
    @update:modelValue="select($event)"
    density="compact"
    :hover="true"
    v-model:items-per-page="itemsPerPage"
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
