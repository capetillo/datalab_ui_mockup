<script setup>
import { defineEmits, defineProps, ref, computed, onMounted, watch } from 'vue'
import ProjectSelector from './ProjectSelector.vue'

const searchQuery = ref('')
const emit = defineEmits(['selectedProject'])

const props = defineProps({
  projects: {
    type: Object,
    required: true
  }
})

// filtering projects by proposal_id
const filteredProjects = computed(() => {
  if (searchQuery.value) {
    const filtered = Object.entries(props.projects).reduce((acc, [key, projects]) => {
      const match = projects.some(project => project.proposal_id.toLowerCase().includes(searchQuery.value.toLowerCase()))
      if (match) {
        acc[key] = projects
      }
      return acc
    }, {})
    return filtered
  }
  return props.projects
})

const selectProject = (projects) => {
  console.log('bing')
  const proposalId = projects.map(p => p.proposal_id)
  emit('selectedProject', proposalId)
}

const selectFirstProject = () => {
  console.log('click')
  const allProjects = Object.values(props.projects)
  if (allProjects.length > 0 && allProjects[0].length > 0) {
    console.log('yes')
    const firstProject = allProjects[0][0]
    console.log('first project:', firstProject.proposal_id)
    selectProject([firstProject.proposal_id])
  }
}
onMounted(() => {
  const unwatch = watch(() => props.projects, (newValue) => {
    if (newValue && Object.keys(newValue).length > 0) {
      selectFirstProject()
      unwatch() // Unwatch immediately after selecting the first project
    }
  }, {
    immediate: true
  })
})

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
      />
      <v-expansion-panels
        variant="accordion"
        class="accordion"
      >
        <ProjectSelector
          v-for="(project, index) in filteredProjects"
          :key="index"
          :project="project"
          @click="selectProject(project)"
        />
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
  width: 15vw;
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
