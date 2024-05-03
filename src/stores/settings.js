import { defineStore } from 'pinia'
import { fetchApiCall } from '@/utils/api'
import { useThumbnailsStore } from './thumbnails'
import { useConfigurationStore } from './configuration'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', {
  state() {
    return {
      isColorblindMode: false,
      selectedImages: [],
      randomNumbers: [],
      lineLength: 1,
      imagesByProposal: {},
      startDate: new Date(Date.now() - 24 * 3600 * 1000),
      endDate: new Date(Date.now())
    }
  },
  getters: {
    isSelected: (state) => (image) => {
      return state.selectedImages.some(selectedImage => selectedImage.basename === image.basename)
    }
  },
  actions: {
    toggleColorblindMode() {
      this.isColorblindMode = !this.isColorblindMode
    },
    toggleImageSelection(image) {
      const index = this.selectedImages.findIndex(img => img.basename === image.basename)
      if (index >= 0) {
        this.selectedImages.splice(index, 1)
      } else {
        this.selectedImages.push(image)
      }
    },
    async loadAndCacheImages(proposal, option) {
      const thumbnailsStore = useThumbnailsStore()
      const configurationStore = useConfigurationStore()
      const baseUrl = configurationStore.datalabArchiveApiUrl + 'frames/'
      const timeStr = `start=${this.startDate.toISOString()}&end=${this.endDate.toISOString()}`
      option = option ? `${option}&${timeStr}` : timeStr
      option += '&proposal_id=' + proposal
      const imageUrl = option ? `${baseUrl}?${option}` : baseUrl
      console.log('Getting frames from: ' + imageUrl)
      const responseData = await fetchApiCall({ url: imageUrl, method: 'GET' })
      if (responseData && responseData.results) {
        // Preload all the small thumbnails into the cache. The large thumbnails will be loaded on demand
        responseData.results.forEach((frame) => {
          frame.smallCachedUrl = ref('')
          thumbnailsStore.cacheImage('small', configurationStore.archiveType, '', frame.basename).then((cachedUrl) => {
            frame.smallCachedUrl.value = cachedUrl
          })
        })
        this.imagesByProposal[proposal] = responseData.results
      }
    }
  },
})
