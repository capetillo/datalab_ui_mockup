<script setup>
    import { ref } from 'vue'
    const props = defineProps(['projectImageObjects', 'selectedImages', 'data'])

    // v-data-table setup variables
    let headers = ref([
        { title: 'Image Name', align: 'start', sortable: true, key: 'basefile_name'},
        { title: 'Time', align:'start', sortable: true, key: 'time'},
        { title: 'Object', align:'start', sortable: true, key: 'object'},
        { title: 'Image', align:'start', sortable: false, key: 'image'}
    ])
    let items = ref(props.data)
    let itemsPerPage = ref(15)
    let selected = ref([])
</script>

<template>
    <v-data-table
        :headers="headers"
        :items="items"
        v-model:items-per-page="itemsPerPage"
        show-select
        v-model="selected"
        item-value="basefile_name"
        density="compact"
        @update:modelValue="$emit('updateSelected', selected)"
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