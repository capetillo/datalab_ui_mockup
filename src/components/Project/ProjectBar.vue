<script setup>
import { defineEmits, defineProps, ref, computed } from 'vue'
import ProjectSelector from './ProjectSelector.vue'

const searchQuery = ref('')
const emit = defineEmits(['selectedProject'])

const props = defineProps({
  projects: {
    type: Object,
    required: true
  }
})

const filteredProjects = computed(() => {
  if (searchQuery.value) {
    const filtered = Object.entries(props.projects).reduce((acc, [key, project]) => {
      if (project[0].proposal_id && project[0].proposal_id.includes(searchQuery.value)) {
        console.log('yes')
        acc[key] = project 
      }
      return acc
    }, {})
    return filtered
  }
  return props.projects
})

const selectProject = (projects) => {
  const proposalId = projects.map(p => p.proposal_id)
  emit('selectedProject', proposalId)
}
</script>

<template>
  <div class="project_bar">
    <v-card class="h-auto w-20 ma-1 project_card">
      <p class="project_header">
        PROJECTS
      </p>
      <v-text-field
        v-model="searchQuery"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Search for a project"
        variant="solo"
        hide-details
        single-line
        class="search_field"
      />
      <v-expansion-panels
        variant="accordion"
        class="accordion"
      >
        <!-- <div v-if="searchQuery.length"> -->
        <ProjectSelector
          v-for="(project, index) in filteredProjects"
          :key="index"
          :project="project"
          @click="selectProject(project)"
        />
        <!-- </div>
        <div v-else>
          <ProjectSelector
            v-for="(project, index) in props.projects"
            :key="index"
            :project="project"
            @click="selectProject(project)"
          />
        </div> -->
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<style scoped>
.project_bar {
  padding: 2em 1em;
}
.project_card {
  background-color: var(--metal);
}
.project_header { 
  letter-spacing: 0.1rem;
  font-size: 1.7rem;
  font-weight: 600;
  text-align: center;
  padding: 2rem;
  color: var(--tan);
}
@media (max-width: 1200px) {
  .project_bar {
    padding: 0.5rem 0;
    height: 70%;
  }
  .project_header { 
    font-size: 1.4rem;
  }
}
@media (max-width: 900px) {
  .project_header {
    font-size: 1.1rem;
    padding: 0.3rem 0;
  }
}
</style>
