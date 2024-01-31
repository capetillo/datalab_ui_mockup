import { createStore } from 'vuex'

export default createStore({
	state() {
		return {
			selectedImages: [],
			isConfigLoaded: false,
			datalabApiBaseUrl: '',
			datalabArchiveApiUrl: '',
			observationPortalUrl: '',
			username: '',
			authToken: '',
			profile: [],
			projects: [],
			largeImages: []
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

		setUsername(state, username) {
			state.username = username
		},

		setAuthToken(state, token) {
			state.authToken = token
		},

		setUserProfile(state, profile) {
			state.profile.push(profile)
		},

		setProjects(state, projects) {
			for (const project of projects) {
				state.projects.push(project)
			}
		},

		setLargeImages(state, images) {
			state.largeImages = images
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

		selectedImages: (state) => state.selectedImages,

		firstLargeImage: (state) => {
			if (state.largeImages.length) {
				return state.largeImages[0].url
			}
		}
	}
})
