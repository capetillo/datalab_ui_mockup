import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      selectedImages: []
    }
  },
  mutations: {
    toggleImageSelection(state, image) {
      const index = state.selectedImages.findIndex(img => img.basefile_name === image.basefile_name)
      if (index >= 0) {
        state.selectedImages.splice(index, 1)
      } else {
        state.selectedImages.push(image)
      }
    }
  },
  actions: {
    toggleImageSelection({ commit }, image) {
      commit('toggleImageSelection', image)
    }
  },
  getters: {
    isSelected: (state) => (image) => {
      return state.selectedImages.some(selectedImage => selectedImage.basefile_name === image.basefile_name)
    },
    selectedImages: (state) => state.selectedImages
  }
})
