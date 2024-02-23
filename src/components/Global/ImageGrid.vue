<script setup>
import { defineProps, ref, defineEmits, defineExpose } from 'vue'
import { fetchApiCall, handleError } from '../../utils/api'

const props = defineProps({
	data: {
		type: Object,
		required: true
	},
	columnSpan: {
		type: Number,
		required: true
	}
})

const emit = defineEmits(['imageClicked'])

let images = ref([])

const saveImages = (data) => {
	const results = data.results
	if (results.length) {
		images.value.push(data.results[0])
	}
}

const getImages = async () => {
	const responseData = props.data
	const inputData = responseData.input_data
	for (const data of inputData) {
		const basename = data.basename
		const url =  `https://datalab-archive.photonranch.org/frames/?basename_exact=${basename}-small`
		await fetchApiCall({url: url, method: 'GET', successCallback: saveImages, failCallback: handleError})
	}
}

const onImageClick = (image) => {
	emit('imageClicked', image)
}

defineExpose({ getImages })
</script>

<template>
  <v-row v-if="images.length">
    <v-col
      v-for="image of images"
      :key="image.basename"
      :cols="columnSpan"
    >
      <v-img
        :src="image.url"
        :alt="image.basename"
        cover
        aspect-ratio="1"
        @click="onImageClick(image)" 
      />
    </v-col>
  </v-row>
</template>
