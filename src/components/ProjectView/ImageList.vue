<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { ref, onMounted } from "vue"
import { useStore } from "vuex"

const props = defineProps(["data"])
const store = useStore()

// v-data-table setup variables
let headers = ref([
	{ title: "Image Name", align: "start", sortable: true, key: "basefile_name" },
	{ title: "Time", align: "start", sortable: true, key: "time" },
	{ title: "Object", align: "start", sortable: true, key: "object" },
	{ title: "Image", align: "start", sortable: false, key: "image" },
])
let items = ref(props.data)
let itemsPerPage = ref(15)

// --- Selection Logic ---
let selected = ref([])

function select(selectedImageNames) {
	store.dispatch("setSelectedImages", selectedImageNames)
}

onMounted ( () => {
	selected.value = store.getters.selectedImages
})
</script>

<template>
  <v-data-table
    v-model="selected"
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="items"
    item-value="basefile_name"
    :return-object="true"
    show-select
    density="compact"
    :hover="true"
    @update:model-value="select($event)"
  >
    <!-- TODO change src to fetch image from url-->
    <template #[`item.image`]="{ item }">
      <v-img
        :src="require('@/assets/' + item.image)"
        :alt="item.basefile_name"
        height="50"
        width="200"
        cover
      />
    </template>
  </v-data-table>
</template>
