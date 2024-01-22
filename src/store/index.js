import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      selectedImages: [],
      isConfigLoaded: false,
      apiBaseUrl: '',
      dataSessionsUrl: '',
      archiveUrl: '',
    }
  },

  mutations: {
    // toggle image selection
    toggleImageSelection(state, image) {
      const index = state.selectedImages.findIndex(img => img.basefile_name === image.basefile_name)
      if (index >= 0) {
        state.selectedImages.splice(index, 1)
      } else {
        state.selectedImages.push(image)
      }
    },
    selectedImages(state, value) { 
      state.selectedImages = value
    },

    setIsConfigLoaded(state, value) {
      state.isConfigLoaded = value
    },

    setApiBaseUrl(state, url) {
      state.apiBaseUrl = url
    },

    setDataSessionsUrl(state, url) {
      state.dataSessionsUrl = url
    },

    setArchiveUrl(state, url) {
      state.archiveUrl = url
    }
  },

  actions: {
    toggleImageSelection({ commit }, image) {
      commit('toggleImageSelection', image)
    },
    // pass a new array of selected images
    setSelectedImages({ commit }, images) {
      commit('selectedImages', images)
    }
  },
  getters: {
    isSelected: (state) => (image) => {
      return state.selectedImages.some(selectedImage => selectedImage.basefile_name === image.basefile_name)
    },
    selectedImages: (state) => state.selectedImages
  }
})
