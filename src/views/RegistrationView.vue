<script setup>
import LogIn from '@/components/LogIn/LogIn.vue'
import { useStore } from 'vuex'

const store = useStore()
const profileBaseUrl = store.state.userProfileUrl

async function authenticateAndGetToken() {
    const authUrl = profileBaseUrl + 'api-token-auth/'
    const credentials = {
      username: store.state.username,
      password: store.state.userPassword
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
        throw new Error('Authentication failed')
    }
  } catch (error) {
      console.error('Error during authentication request:', error)
      throw error
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
        return data
        } catch (error) {
            console.error('ERROR:', error)
        }
    }
}


</script>

<template>
    <LogIn @credentialsSubmitted="getUser"/>
</template>
