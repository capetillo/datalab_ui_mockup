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
    <v-card class="h-auto w-20 ma-1">
      <p class="project_header">
        PROJECTS
      </p>
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
  padding: 2em 0;
  height: 20px;
}
.project_header { 
  letter-spacing: 0.1rem;
  font-size: 1.7rem;
  font-weight: 600;
  text-align: center;
  padding: 2rem;
  color: rgb(233,205,156)
}
@media (max-width: 1200px) {
  .project_bar {
    padding: 0.5rem 0;
    height: 70%;
  }
  .project_header { 
    letter-spacing: 0.1rem;
    font-size: 1.4rem;
    font-weight: 600;
    text-align: center;
    padding: 2rem;
    color: rgb(233,205,156)
  }
}
</style>
