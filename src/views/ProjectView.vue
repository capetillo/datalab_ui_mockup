<script setup>
import { ref, computed, onBeforeMount, onMounted, watch } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import ImageList from '@/components/Project/ImageList.vue'
import ImageGrid from '@/components/Global/ImageGrid.vue'
import CreateSessionDialog from '@/components/Project/CreateSessionDialog.vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from '@/stores/userData'
import { useThumbnailsStore } from '@/stores/thumbnails'
import { useConfigurationStore } from '@/stores/configuration'
import { useAlertsStore } from '@/stores/alerts'
import { fetchApiCall } from '@/utils/api'

const router = useRouter()
const userDataStore = useUserDataStore()
const thumbnailsStore = useThumbnailsStore()
const configurationStore = useConfigurationStore()
const alertsStore = useAlertsStore()

const showCreateSessionDialog = ref(false)
const imagesByProposal = ref({})
const selectedImagesByProposal = ref({})
const startDate =  ref(new Date(Date.now() - 24 * 3600 * 1000))
const endDate = ref(new Date(Date.now()))
const ra = ref(null)
const dec = ref(null)
const search = ref(null)

const selectedImages = computed(() => {
  // returns a list combining all the selected images in all projects to be used for a new data session
  return Object.keys(selectedImagesByProposal.value).reduce((acc, projectId) => {
    const proposalImages = imagesByProposal.value[projectId] ? imagesByProposal.value[projectId] : []
    const proposalSelectedImageIndexes = selectedImagesByProposal.value[projectId]
    return acc.concat(proposalSelectedImageIndexes.map(imageIndex => proposalImages[imageIndex]))
  }, [])
})

function selectImage(proposalIndex, imageIndex) {
  // accepts either a list of selected images or a single image index to toggle selection on
  const proposalSelectedImages = selectedImagesByProposal.value[proposalIndex]
  
  if(proposalSelectedImages.includes(imageIndex)){
    proposalSelectedImages.splice(proposalSelectedImages.indexOf(imageIndex), 1)
  } else {
    proposalSelectedImages.push(imageIndex)
  }
}

function deselectAllImages() {
  // clear the arrays per project in selectedImagesByProposal
  Object.keys(selectedImagesByProposal.value).forEach(projectId => {
    selectedImagesByProposal.value[projectId] = []
  })
}

async function loadProposals(option){
  // optimized load images for only open panels
  userDataStore.openProposals.forEach(async proposal => {

    const proposalID = userDataStore.proposals[proposal].id
    const baseUrl = configurationStore.datalabArchiveApiUrl + 'frames/'
    const timeStr = `start=${startDate.value.toISOString()}&end=${endDate.value.toISOString()}`

    
    option = option ? `${option}&${timeStr}` : timeStr
    option += ra.value && dec.value ? `&covers=POINT(${ra.value} ${dec.value})` : ''
    option += `&proposal_id=${proposalID}`
    option += '&include_thumbnails=true'

    const imageUrl = option ? `${baseUrl}?${option}` : baseUrl
    const responseData = await fetchApiCall({ url: imageUrl, method: 'GET' })

    if (responseData && responseData.results) {
      // Preload all the small thumbnails into the cache. The large thumbnails will be loaded on demand
      responseData.results.forEach((frame) => {
        frame.smallThumbUrl = ''
        frame.largeThumbUrl = ''
        frame.source = 'archive'
        for (const thumbnail of frame.thumbnails) {
          if (thumbnail.size === 'small') {
            frame.smallThumbUrl = thumbnail.url
          }
          else if (thumbnail.size === 'large') {
            frame.largeThumbUrl = thumbnail.url
          }
        }
        frame.smallCachedUrl = ref('')
        thumbnailsStore.cacheImage('small', configurationStore.archiveType, frame.smallThumbUrl, frame.basename).then((cachedUrl) => {
          frame.smallCachedUrl.value = cachedUrl
        })
      })
      // Add images to their proposal group
      imagesByProposal.value[proposalID] = responseData.results
    }
  })
}

watch(() => [startDate.value, endDate.value], async () => {
  // Watch filters that can be queried instantly without waiting for the rest of the input
  imagesByProposal.value = {}
  loadProposals('reduction_level=91')
})

watch(() => [ra.value, dec.value], async () => {
  // validate that ra and dec are numbers
  if(isNaN(ra.value) || isNaN(dec.value)){
    alertsStore.setAlert('warning', `RA and DEC must be numbers ${isNaN(ra.value) ? ra.value : ''} ${isNaN(dec.value) ? dec.value : ''}`)
  }
  // Watch filters that should wait/debounce for the user to finish typing
  else if(setTimeout(async () => {
    imagesByProposal.value = {}
    await loadProposals('reduction_level=91')
  }, 1700)){
    clearTimeout()
  }
})

watch(() => search.value, async () => {
  if(search.value){
    // Query the Simbad service API for ra and dec of the search value
    const url = `https://simbad2k.lco.global/${search.value}`
    fetchApiCall({url: url, method: 'GET', successCallback: (data)=> {
      if(!data.error){
        ra.value = data.ra_d
        dec.value = data.dec_d
      }
    }})
  }
  else{
    ra.value = null
    dec.value = null
  }
})

onBeforeMount(() => {
  if (!userDataStore.userIsAuthenticated) router.push({ name: 'Registration' })
})

onMounted(() => {
  loadProposals('reduction_level=91')
  // create selected images array for each project
  userDataStore.proposals.forEach(project => {
    selectedImagesByProposal.value[project.id] = []
  })
})

</script>

<template>
  <div class="proposal-filters">
    <v-date-input
      v-model="startDate"
      class="proposal-filter"
      :max="endDate"
      label="From"
      prepend-icon=""
      prepend-inner-icon="$calendar"
      :hide-actions="true"
      hide-details="auto"
    />
    <v-date-input
      v-model="endDate"
      class="proposal-filter"
      :max="new Date()"
      :min="startDate"
      label="To"
      prepend-icon=""
      prepend-inner-icon="$calendar"
      :hide-actions="true"
      hide-details="auto"
    />
    <v-text-field
      v-model="ra"
      class="proposal-filter"
      label="RA"
      clearable
    />
    <v-text-field
      v-model="dec"
      class="proposal-filter"
      label="DEC"
      clearable
    />
    <v-text-field
      v-model="search"
      class="proposal-filter"
      prepend-inner-icon="mdi-magnify"
      label="Sources"
      clearable
    />
    <v-switch
      v-model="userDataStore.gridToggle"
      color="var(--light-blue)"
      base-color="var(--light-blue)"
      prepend-icon="mdi-view-list"
      append-icon="mdi-image"
    />
  </div>
  <div class="proposal-images">
    <v-expansion-panels
      v-model="userDataStore.openProposals"
      variant="accordion"
      :multiple="true"
      bg-color="var(--metal)"
    >
      <v-expansion-panel
        v-for="project in userDataStore.proposals"
        :key="project.id"
        @click="loadProposals('reduction_level=91')"
      >
        <v-expansion-panel-title>
          <p>{{ project.title }}</p>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <image-grid
            v-if="userDataStore.gridToggle"
            :images="imagesByProposal[project.id]"
            :selected-images="selectedImagesByProposal[project.id]"
            :allow-selection="true"
            :column-span="5"
            @select-image="selectImage(project.id, $event)"
          />
          <image-list
            v-else
            :images="imagesByProposal[project.id]"
            :selected-images="selectedImagesByProposal[project.id]"
            @select-image="selectImage(project.id, $event)"
          />
          <div
            v-if="imagesByProposal[project.id]?.length == 0"
            class="no-images mt-5 d-flex flex-column justify-center align-center"
          >
            <v-icon
              icon="mdi-image-off"
              :size="100"
            />
            <h1>No Images Found</h1>
            <p>Try changing the date range or filters to see more images</p>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <div class="project-buttons">
    <v-btn
      :disabled="selectedImages.length == 0"
      class="project-button deselect_button"
      prepend-icon="mdi-trash-can-outline"
      text="Clear"
      @click="deselectAllImages"
    />
    <v-btn
      :disabled="selectedImages.length == 0"
      class="project-button add_button"
      :text=" selectedImages.length == 0 ? 'No Images' : `Add ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''}` "
      @click="showCreateSessionDialog=true"
    />
  </div>
  <create-session-dialog
    v-model="showCreateSessionDialog"
    :new-images="selectedImages"
  />
</template>
<style scoped>
.proposal-filters{
  display: flex;
  gap: 1rem;
  margin: 1rem;
  color: var(--tan);
}
.proposal-filter{
  height: 100%;
}
.v-expansion-panel-title p{
  color: var(--tan);
  font-weight: 700;
  font-size: 1.3rem;
}
.proposal-images {
  margin-left: 1rem;
  margin-right: 1rem;
  max-height: 70%;
  overflow-y: scroll;
}
.no-images{
  color: var(--tan);
}
.project-buttons {
  margin-bottom: 1rem;
  position: fixed;
  bottom: 0;
  right: 0;
  color: var(--tan);
}
.project-button {
  margin-right: 1rem;
  background-color: var(--light-blue);
  font-weight: 700;
  font-size: 1.3rem;
  margin-right: 1rem;
}
.project-button:disabled {
  opacity: calc(0.5);
}
.add_button {
  width: 14rem;
  height: 3rem;
  background-color: var(--light-blue);
}
.deselect_button {
  width: 10rem;
  height: 3rem;
  background-color: var(--cancel);
}
</style>
