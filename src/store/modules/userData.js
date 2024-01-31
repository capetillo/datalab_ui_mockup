const state = {
	username: '',
	authToken: '',
	profile: [],
}

// getters
const getters = {
	username: state => state.username,
	authToken: state => state.authToken,
	profile: state => state.profile
}

// actions
const actions = {
	setUsername({ commit }, username) {
		commit('username', username)
	},

	setAuthToken({ commit }, authToken) {
		console.log('reached the userData store, setting auth token: ', authToken)
		commit('authToken', authToken)
	},

	setUserProfile({ commit }, userProfile) {
		commit('userProfile', userProfile)
	},
}

// mutations
const mutations = {
	username(state, username) {
		state.username = username
	},

	authToken(state, token) {
		state.authToken = token
	},

	userProfile(state, profile) {
		state.profile.push(profile)
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
