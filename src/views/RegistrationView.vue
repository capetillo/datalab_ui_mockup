<script setup>
import LogIn from '@/components/LogIn/LogIn.vue'
import { useStore } from 'vuex'

const store = useStore()

async function authenticateAndGetToken() {
    const authUrl = store.state.userProfileUrl
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
            console.log('datatoken:', data.token)
            return data.token
      } else {
          console.error('Authentication failed:', data)
          throw new Error('Authentication failed')
      }
  } catch (error) {
      console.error('Error during authentication request:', error)
      throw error
  }

// async function getUserProfile() {
//     const token = await authenticateAndGetToken()

//     if (token) {
//         const profileUrl = 
//     }

// }

}

</script>

<template>
    <LogIn @credentialsSubmitted="authenticateAndGetToken"/>
</template>
