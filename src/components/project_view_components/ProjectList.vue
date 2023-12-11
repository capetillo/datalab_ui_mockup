<script setup>
    import { ref } from 'vue'
    import ProjectImages from './ProjectImages.vue';
    import ProjectSelector from './ProjectSelector.vue';

    // TODO replace projects with an api call to the users projects
    const projects = ref([
        { projectTitle: 'project 1', projectDescription: 'things like site code, date, image id, etc can go in here'},
        { projectTitle: 'project 2', projectDescription: 'things like site code, date, image id, etc can go in here'},
        { projectTitle: 'project 3', projectDescription: 'things like site code, date, image id, etc can go in here'},
        { projectTitle: 'project 4', projectDescription: 'things like site code, date, image id, etc can go in here'},
        { projectTitle: 'project 5', projectDescription: 'things like site code, date, image id, etc can go in here'},
    ])
    // Reactive id of the project whose images should be on display
    let selectedProject = ref('no project selected')
</script>

<template>
    <v-container class="d-lg-flex">
        <!-- component for list of user's projects -->
        <v-card class="h-auto pa-6 ma-1" title="Projects">
            <v-expansion-panels variant="accordion">
                <ProjectSelector v-for='(project, index) in projects' :key="index" :project="project" @click="selectedProject = project.projectTitle"/>
            </v-expansion-panels>
        </v-card>
        <!-- component for display of project's images for selection and creation of new data sessions-->
        <project-images class="h-auto pa-6 ma-1" :selectedProject="selectedProject"/>
    </v-container>
</template>