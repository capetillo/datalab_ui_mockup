<script setup>
 defineProps(['project'])
</script>
<template>
    <v-expansion-panel
        :title = "project.projectTitle"
        :text = "project.projectDescription"
    ></v-expansion-panel>
</template>