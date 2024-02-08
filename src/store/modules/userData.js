const state = {
	username: '',
	authToken: '',
	profile: [],
}

// getters
const getters = {
	username: state => state.username,
	authToken: state => state.authToken,
	profile: state => state.profile,
	userIsAuthenticated: (state) => {
		if(state.authToken) return true
		else return false
	}
}

// actions
const actions = {
	setUsername({ commit }, username) {
		commit('username', username)
	},

	setAuthToken({ commit }, authToken) {
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
