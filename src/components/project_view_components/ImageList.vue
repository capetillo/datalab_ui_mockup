<script setup>
    import { ref } from 'vue'
    defineProps(['projectImageObjects', 'selectedImages'])

    // v-data-table setup variables
    let headers = ref([
        { title: 'Image Name', align: 'start', sortable: true, key: 'imageName'},
        { title: 'Time', align:'end', sortable: true, key: 'time'},
        { title: 'Object', align:'end', sortable: true, key: 'object'}
    ])
    let itemsPerPage = ref(20)
    let selected = ref([])
</script>
<template>
    <v-data-table
        :headers="headers"
        v-model:items-per-page="itemsPerPage"
        show-select
        v-model="selected"
        @update:selected="$emit('updateSelected', selected)"
    ></v-data-table>
</template>