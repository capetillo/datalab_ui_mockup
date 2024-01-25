<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const profileBaseUrl = store.state.userProfileUrl

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)

const rules = {
    required: value => !!value || 'Required.'
}

async function authenticateAndGetToken() {
    const authUrl = profileBaseUrl + 'api-token-auth/'
    const credentials = {
      username: username.value,
      password: password.value
  }

  try {
    const response = await fetch(authUrl, {
        method: 'POST',
        headers: { 
        'Content-Type': 'application/json',
    },
        body: JSON.stringify(credentials)
    })

    const data = await response.json()
    if (response.ok) {
        store.commit('setAuthToken', data.token)
        return data.token
    } else {
        console.error('Authentication failed:', data)
        errorMessage.value = 'Authentication failed. Please try again.'
    }
  } catch (error) {
      console.error('Error during authentication request:', error)
      errorMessage.value = 'Error during authentication request. Please try again with the right authentication.'
  }
}

async function getUser() {
    const token = await authenticateAndGetToken()
    const profileUrl = profileBaseUrl + 'profile/'

    if (token) {
        try {
            const response = await fetch(profileUrl, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
            },
        })
        const data = await response.json()
        store.commit('setProjects', data.proposals)
        router.push({ name: 'ProjectView' })
        } catch (error) {
            console.error('Error:', error)
            errorMessage.value = 'Oops, there was an unexpected error logging in. Please try again, and if the problem persists, you are on your own.'
        }
    }
}

const onSubmit = () => {
    store.commit('setUsername', username.value)
}

</script>

<template>
    <v-container>
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        label="Username"
        v-model="username"
        :rules="[rules.required]"
        required
    ></v-text-field>

      <v-text-field
        label="Password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        :rules="[rules.required]"
        required
    ></v-text-field>
        <v-btn type="submit" color="primary" @click="getUser">Login</v-btn>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </v-form>
  </v-container>
</template>

<style scoped>
.error-message {
    color: red;
    margin-top: 10px;
}
</style>
