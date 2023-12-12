<script setup>
    import { useTheme } from 'vuetify'
    import { ref } from 'vue'

    const theme = useTheme()
    let label = ref('Light Mode')

    function toggleTheme () {
        theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
        label.value = label.value == 'Light Mode' ? 'Dark Mode' : 'Light Mode'
    }
</script>

<template>
    <v-switch :label=label inset @change="toggleTheme()"></v-switch>
</template>