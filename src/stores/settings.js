import { defineStore } from 'pinia'
import { fetchApiCall } from '@/utils/api'
import { useThumbnailsStore } from './thumbnails'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', {
  state() {
    return {
      isColorblindMode: false,
      selectedImages: [],
      isConfigLoaded: false,
      datalabApiBaseUrl: '',
      datalabArchiveApiUrl: '',
      observationPortalUrl: '',
      projects: [],
      largeImageCache: [],
      smallImageCache: []
    }
  },
  getters: {
    isSelected: (state) => (image) => {
      return state.selectedImages.some(selectedImage => selectedImage.basename === image.basename)
    },
    // given an image basename, fetches the large res of that image
    getLargeImageFromBasename: (state) => (imageBasename) => {
      imageBasename = imageBasename.replace('-small', '')
      const largeImage = state.largeImageCache.find(obj => obj.basename.replace('-large', '') == imageBasename)
      if(largeImage){
        return largeImage
      }
      else{
        console.warn('warn: no large image found with basename:', imageBasename)
        return null
      }
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
    async loadAndCacheImages(option) {
      const thumbnailsStore = useThumbnailsStore()
      const baseUrl = this.datalabArchiveApiUrl + 'frames/'
      const imageUrl = option ? `${baseUrl}?${option}` : baseUrl
	
      const responseData = await fetchApiCall({ url: imageUrl, method: 'GET' })
      if (responseData && responseData.results) {
        // Preload all the small thumbnails into the cache. The large thumbnails will be loaded on demand
        responseData.results.forEach((frame) => {
          if (option === 'reduction_level=95'){
            frame.cachedUrl = ref('')
            thumbnailsStore.cacheImage('small', 'ptr', frame.url, frame.basename).then((cachedUrl) => {
              frame.cachedUrl.value = cachedUrl
            })
          }
        })
        if (option === 'reduction_level=95') {
          this.smallImageCache = responseData.results
        }
        else {
          this.largeImageCache = responseData.results
        }
      }
    }
  },
})