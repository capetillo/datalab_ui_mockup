<script setup>
import { ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { fetchApiCall } from '@/utils/api'
import lambdaLogo from '../assets/PTR-lambda.png'

const store = useStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)

onBeforeMount(() => {
  if (store.getters['userData/userIsAuthenticated']) router.push({ name: 'ProjectView' })
})

// validation rule for vuetify components
// we can add rules here in the future for passwords
const rules = {
  required: value => !!value || 'Required.'
}

const storeToken = async (data) => {
  const authToken = data.token
  if (authToken) {
    store.dispatch('userData/setAuthToken', authToken)
    await fetchApiCall({ url: store.state.observationPortalUrl + 'profile/', method: 'GET', successCallback: storeUser, failCallback: handleError })
  }
}

const handleError = (error) => {
  console.error('API call failed with error:', error)
  errorMessage.value = 'Failed to authenticate user'
}

const storeUser = (user) => {
  store.dispatch('userData/setUsername', username.value)
  store.dispatch('userData/setUserProfile', user)
  store.commit('setProjects', user.proposals)
  router.push({ name: 'ProjectView' })
}

const Login = async () => {
  const requestBody = {
    username: username.value,
    password: password.value
  }
  // store an auth token from login credentials
  await fetchApiCall({ url: store.state.observationPortalUrl + 'api-token-auth/', method: 'POST', body: requestBody, successCallback: storeToken, failCallback: handleError })
}

</script>

<template>
  <v-container class="registration-container">
    <v-card class="login-card pa-10">
      <div class="login-title">
        <img class="lambdaLogo" :src="lambdaLogo">
        <h1>Datalab</h1>
      </div>
      <v-form class="pt-7" @submit.prevent="Login">
        <v-text-field v-model="username" autocomplete="username" label="Username" :rules="[rules.required]" required />

        <v-text-field v-model="password" autocomplete="current-password" label="Password"
          :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required]" required @click:append="showPassword = !showPassword" />
        <v-btn type="submit" color="primary">
          Login
        </v-btn>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<style scoped>
.registration-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;

}

.login-card {
  width: 500px;
}

.lambdaLogo {
  height: 1.8em;
  margin-right: 10px;
}

.login-title {
  display: flex;
  align-items: center;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
