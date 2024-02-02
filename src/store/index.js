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
			projects: [],
			largeImageCache: [],
			smallImageCache: []
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

		setImageCache(state, imageData) {
			imageData.forEach(image => {
				let imageArray
				image.RLEVEL === 95 ? imageArray = state.smallImageCache : imageArray = state.largeImageCache
				const existingImageIndex = imageArray.findIndex(img => img.basename === image.basename)
				if (existingImageIndex === -1) {
					imageArray.push(image)
				} else {
					imageArray[existingImageIndex] = image
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

		async loadAndCacheImages({ commit }, { option }) {
			const baseUrl = this.state.datalabArchiveApiUrl + 'frames/'
			const imageUrl = option ? `${baseUrl}?${option}` : baseUrl
	
			const responseData = await fetchApiCall({ url: imageUrl, method: 'GET' })
			if (responseData && responseData.results) {
				commit('setImageCache', responseData.results)
			}
		}
	},
	getters: {
		isSelected: (state) => (image) => {
			return state.selectedImages.some(selectedImage => selectedImage.basename === image.basename)
		},

		selectedImages: (state) => state.selectedImages,

		firstLargeImage: (state) => {
			if (state.largeImageCache.length) {
				return state.largeImageCache[0].url
			}
		}
	}
})
