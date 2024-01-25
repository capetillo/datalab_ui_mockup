import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      selectedImages: [],
      isConfigLoaded: false,
      apiBaseUrl: '',
      archiveUrl: '',
      userProfileUrl: '',
      username: '',
      userPassword: '',
      authToken: '',
      projects: []
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

    setArchiveUrl(state, url) {
      state.archiveUrl = url
    },
    
    setUserProfileUrl(state, url) {
      state.userProfileUrl = url
    },

    setUsername(state, username) {
      state.username = username
    },

    setUserPassword(state, password) {
      state.userPassword = password
    },

    setAuthToken(state, token) {
      state.authToken = token
    },

    setProjects(state, projects) {
      for (const project of projects) {
        state.projects.push(project)
      }
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
