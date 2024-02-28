<script setup>
import { defineEmits, computed } from 'vue'
import { useStore } from 'vuex'
import ProjectSelector from './ProjectSelector.vue'

const store = useStore()
const emit = defineEmits(['update:selectedProject'])

const smallImageCache = computed(() => store.state.smallImageCache)

const groupedItems = computed(() => groupByProposalId(smallImageCache.value))

function groupByProposalId(items) {
	return items.reduce((acc, item) => {
		if (!acc[item.proposal_id]) {
			acc[item.proposal_id] = []
		}
		acc[item.proposal_id].push(item)
		return acc
	}, {})
}

console.log('grouped items:', groupedItems)

const selectProject = (projectTitle) => {
	emit('update:selectedProject', projectTitle)
}
</script>

<template>
  <div class="project_bar">
    <v-card class="h-auto w-20 ma-1 project_card">
      <p class="project_header">
        PROJECTS
      </p>
      <v-expansion-panels
        variant="accordion"
        class="accordion"
      >
        <ProjectSelector
          v-for="(project, index) in groupedItems"
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
