<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup(_, { emit }) {
    const store = useStore()
    const email = ref('')
    const password = ref('')

    const onSubmit = () => {
      store.commit('setUsername', email.value)
      store.commit('setUserPassword', password.value)
      console.log(email.value, password.value)
      emit('credentialsSubmitted')
    }

    return {
      email,
      password,
      onSubmit
    }
  }
}
</script>

<template>
  <v-container>
    <v-form @submit.prevent="onSubmit">
      <v-text-field
        label="Email"
        v-model="email"
        required
      ></v-text-field>

      <v-text-field
        label="Password"
        v-model="password"
        type="password"
        required
      ></v-text-field>

      <v-btn type="submit" color="primary">Login</v-btn>
    </v-form>
  </v-container>
</template>
