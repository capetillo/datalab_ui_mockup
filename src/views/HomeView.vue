<script setup>
    import { useRouter } from 'vue-router'
    const router = useRouter()
</script>
<template>
    <v-card class="ma-2 pa-6">
        <v-card-item>
            <v-card-title>
                <v-icon
                icon="mdi-lambda"
                start
                ></v-icon>
                Data Lab
            </v-card-title>
            <p class="ma-2">
                Datalab is a tool to process your images captured on photon ranch. If you don't have a
                data session yet click on 'new' to get started.
            </p>
            <v-btn variant="flat" prepend-icon="mdi-image-edit" @click="router.push({ name: 'DataSessions' })">DataSessions</v-btn>
            <v-btn variant="flat" prepend-icon="mdi-plus-box" @click="router.push({ name: 'ProjectView' })">New</v-btn>
        </v-card-item>
    </v-card>
</template>