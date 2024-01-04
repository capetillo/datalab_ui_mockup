<script setup>
import { ref, defineEmits } from 'vue'
import ProjectSelector from './ProjectSelector.vue';

const projects = ref([
  { projectTitle: 'project 1', projectDescription: 'things like site code, date, image id, etc can go in here'},
  { projectTitle: 'project 2', projectDescription: 'things like site code, date, image id, etc can go in here'},
  { projectTitle: 'project 3', projectDescription: 'things like site code, date, image id, etc can go in here'},
  { projectTitle: 'project 4', projectDescription: 'things like site code, date, image id, etc can go in here'},
  { projectTitle: 'project 5', projectDescription: 'things like site code, date, image id, etc can go in here'},
])


const emit = defineEmits(['update:selectedProject'])

const selectProject = (projectTitle) => {
    emit('update:selectedProject', projectTitle)
}
</script>

<template>
    <div class="project-bar">
        <v-card class="h-auto w-20 pa-4 ma-1" title="Projects">
            <v-expansion-panels variant="accordion">
                <ProjectSelector
                    v-for="(project, index) in projects"
                    :key="index"
                    :project="project"
                    @click="selectProject(project.projectTitle)"
                    class="project-selector"
                />
            </v-expansion-panels>
        </v-card>
    </div>
</template>
