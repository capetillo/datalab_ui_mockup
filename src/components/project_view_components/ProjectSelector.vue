<script setup>
 const props = defineProps(['project'])
</script>
<template>
    <v-expansion-panel
        :title = "props.project.projectTitle"
        :text = "props.project.projectDescription"
    ></v-expansion-panel>
</template>