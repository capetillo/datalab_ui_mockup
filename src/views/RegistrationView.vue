<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { fetchApiCall } from '@/utils/api'

const store = useStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)

// validation rule for vuetify components
// we can add rules here in the future for passwords
const rules = {
	required: value => !!value || 'Required.'
}

const storeToken = (data) => {
	const authToken = data.token
	if (authToken) {
		store.commit('setAuthToken', authToken)
		return authToken
	}
}

const handleError = (error) => {
	console.error('API call failed with error:', error)
	errorMessage.value = 'Failed to authenticate user'
}

const authenticateUser = async () => {
	const requestBody = {
		username: username.value,
		password: password.value
	}

	const authHeaders = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}

	try {
		await fetchApiCall({ url: store.state.observationPortalUrl + 'api-token-auth/', method: 'POST', body: requestBody, headers: authHeaders, successCallback: storeToken, failCallback: handleError })
	} catch (error) {
		handleError(error)
	}
}

const storeUser = (user) => {
	store.commit('setUsername', username.value)
	store.commit('setUserProfile', user)
	store.commit('setProjects', user.proposals)
	router.push({ name: 'ProjectView' })
}

const getUserProfile = async () => {
	await authenticateUser ()
	const token = store.state.authToken
	const authHeaders = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': `Token ${token}`,
	}
	try {
		await fetchApiCall({ url: store.state.observationPortalUrl + 'profile/', method: 'GET', headers: authHeaders, successCallback: storeUser, failCallback: handleError })
	} catch (error) {
		handleError(error)
	}
}

</script>

<template>
  <v-container>
    <v-form @submit.prevent="getUserProfile">
      <v-text-field
        v-model="username"
        label="Username"
        :rules="[rules.required]"
        required
      />

      <v-text-field
        v-model="password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required]"
        required
        @click:append="showPassword = !showPassword"
      />
      <v-btn
        type="submit"
        color="primary"
      >
        Login
      </v-btn>
      <div
        v-if="errorMessage"
        class="error-message"
      >
        {{ errorMessage }}
      </div>
    </v-form>
  </v-container>
</template>

<style scoped>
.error-message {
    color: red;
    margin-top: 10px;
}
</style>
