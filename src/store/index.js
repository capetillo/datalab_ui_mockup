import { createStore } from 'vuex'
import userData from './modules/userData'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
	modules: {
		userData
	},
	plugins: [createPersistedState({
		paths: ['userData'],
	})],
	state() {
		return {
			selectedImages: [],
			isConfigLoaded: false,
			datalabApiBaseUrl: '',
			datalabArchiveApiUrl: '',
			observationPortalUrl: '',
			projects: []
		}
	},

	mutations: {
		// toggle image selection
		toggleImageSelection(state, image) {
			const index = state.selectedImages.findIndex(img => img.basename === image.basename)
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

		setDatalabApiBaseUrl(state, url) {
			state.datalabApiBaseUrl = url
		},

		setDatalabArchiveUrl(state, url) {
			state.datalabArchiveApiUrl = url
		},
    
		setObservationPortalUrl(state, url) {
			state.observationPortalUrl = url
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
			return state.selectedImages.some(selectedImage => selectedImage.basename === image.basename)
		},
		selectedImages: (state) => state.selectedImages
	}
})
