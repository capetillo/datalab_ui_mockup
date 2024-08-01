<!-- eslint-disable vue/require-prop-types -->
<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import FilterBadge from '@/components/Global/FilterBadge.vue'

const store = useSettingsStore()
// eslint-disable-next-line no-unused-vars
const props = defineProps(['data'])

// v-data-table setup variables
let headers = ref([
  { title: 'IMAGE NAME', align: 'start', sortable: true, key: 'basename' },
  { title: 'TIME', align: 'start', sortable: true, key: 'observation_date' },
  { title: 'FILTER', align: 'start', sortable: true, key: 'FILTER' },
  { title: 'IMAGE', align: 'start', sortable: false, key: 'url' },
])
let itemsPerPage = ref(15)

// --- Selection Logic ---
let selected = ref([])

function select(selectedImageNames) {
  store.selectedImages = selectedImageNames
}

onMounted ( () => {
  selected.value = store.selectedImages
})

</script>

<template>
  <v-data-table
    v-model="selected"
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="data"
    item-value="basename"
    :return-object="true"
    show-select
    :hover="true"
    class="data_table"
    @update:model-value="select($event)"
  >
    <template #[`item.FILTER`]="{ item }">
      <filter-badge
        v-if="item.FILTER"
        :filter="item.FILTER"
      />
    </template>
    <template #[`item.url`]="{ item }">
      <v-img
        :src="item.smallCachedUrl"
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
  color: var(--tan);
  font-size: 1.4rem;
  background-color: var(--metal);
  overflow-y: scroll;
  max-height: 80vh;
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
