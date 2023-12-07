<script setup>
    import { useTheme } from 'vuetify'
    const theme = useTheme()
    function toggleTheme () {
        theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
</script>

<template>
    <v-switch label="Dark Mode" inset @change="toggleTheme()"></v-switch>
</template>