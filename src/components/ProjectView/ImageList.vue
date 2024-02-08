<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { useStore } from 'vuex'

const props = defineProps(['data'])
const store = useStore()

// v-data-table setup variables
let headers = ref([
	{ title: 'IMAGE NAME', align: 'start', sortable: true, key: 'basename' },
	{ title: 'TIME', align: 'start', sortable: true, key: 'observation_date' },
	{ title: 'OBJECT', align: 'start', sortable: true, key: 'OBJECT' },
	{ title: 'IMAGE', align: 'start', sortable: false, key: 'url' },
])
let items = ref(props.data)
let itemsPerPage = ref(15)

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
    v-model="selected"
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="items"
    item-value="basename"
    :return-object="true"
    show-select
    density="compact"
    :hover="true"
    class="data_table"
    @update:model-value="select($event)"
  >
    <template #[`item.url`]="{ item }">
      <v-img
        :src="item.url"
        :alt="item.OBJECT"
        class="list_image"
        cover
        loading="lazy"
      />
    </template>
  </v-data-table>
</template>

<style scoped>
.data_table {
  margin-top: 2rem;
  padding-top: 0.5rem;
  font-family: 'Open Sans', sans-serif;
  letter-spacing: 0.05rem;
  color: rgb(233,205,155);
  font-size: 1.4rem;
  background-color: rgb(36, 44, 51);
}
.list_image{
  height: 8vh;
  width: 8vw;
}
@media (max-width: 1200px) {
  .data_table {
    font-size: 0.9rem;
    margin-top: 0.9rem;
    margin-left: 0.5rem;
  }
}
@media (max-width: 900px) {
  .list_image{
    width: 12vw;
  }
}
</style>
