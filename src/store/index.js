import { fetchApiCall } from '@/utils/api'
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
			username: '',
			authToken: '',
			profile: [],
			projects: [],
			imageCache: []
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
		},

		cacheImages(state, imageData) {
			imageData.forEach(image => {
				const existingImageIndex = state.imageCache.findIndex(img => img.basename === image.basename)
				if (existingImageIndex === -1) {
					state.imageCache.push(image)
				} else {
					state.imageCache[existingImageIndex] = image
				}
			})
		},
	},

	actions: {
		toggleImageSelection({ commit }, image) {
			commit('toggleImageSelection', image)
		},

		// pass a new array of selected images
		setSelectedImages({ commit }, images) {
			commit('selectedImages', images)
		},

		async loadAndCacheImages({ state, commit }, { option }) {
			const baseUrl = this.state.datalabArchiveApiUrl + 'frames/'
			const imageUrl = option ? `${baseUrl}?${option}` : baseUrl
			const authHeaders = {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Token ${state.authToken}`,
			}
	
			const responseData = await fetchApiCall({ url: imageUrl, method: 'GET', headers: authHeaders })
			if (responseData && responseData.results) {
				commit('cacheImages', responseData.results)
			}
		}
	},
	getters: {
		isSelected: (state) => (image) => {
			return state.selectedImages.some(selectedImage => selectedImage.basename === image.basename)
		},

		selectedImages: (state) => state.selectedImages,

		firstLargeImage: (state) => {
			if (state.imageCache.length) {
				return state.imageCache[0].url
			}
		}
	}
})
