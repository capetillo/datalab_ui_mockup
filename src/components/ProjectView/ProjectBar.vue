<script setup>
import { ref, defineEmits } from 'vue'
import ProjectSelector from './ProjectSelector.vue'

const projects = ref([
	{ projectTitle: 'PROJECT 1', projectDescription: 'things like site code, date, image id, etc can go in here'},
	{ projectTitle: 'PROJECT 2', projectDescription: 'things like site code, date, image id, etc can go in here'},
	{ projectTitle: 'PROJECT 3', projectDescription: 'things like site code, date, image id, etc can go in here'},
	{ projectTitle: 'PROJECT 4', projectDescription: 'things like site code, date, image id, etc can go in here'},
	{ projectTitle: 'PROJECT 5', projectDescription: 'things like site code, date, image id, etc can go in here'},
])


const emit = defineEmits(['update:selectedProject'])

const selectProject = (projectTitle) => {
	emit('update:selectedProject', projectTitle)
}
</script>

<template>
  <div class="project_bar">
    <v-card
      class="projects_title h-auto w-20 ma-1"
      title="PROJECTS"
    >
      <v-expansion-panels variant="accordion">
        <ProjectSelector
          v-for="(project, index) in projects"
          :key="index"
          :project="project"
          @click="selectProject(project.projectTitle)"
        />
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<style scoped>
.project_bar {
  padding-top: 2em;
}
</style>
