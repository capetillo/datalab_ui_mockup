<script setup>
import { ref, onMounted } from "vue"
import OperationPipeline from "./OperationPipeline.vue"

const emit = defineEmits(["reloadSession"])
let images = ref([])

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

function addOperation(operationDefinition) {
	// Create data operation in this session with input parameters specified from wizard
	fetch("http://127.0.0.1:8000/api/datasessions/" + props.data.id + "/operations/", {
		"method": "POST",
		"body": JSON.stringify(operationDefinition),
		"headers": {
			"Authorization": "Token 123456789abcdefg",
			"Content-type": "application/json; charset=UTF-8"
		}
	})
		.then(response => response.json())
		.then(function() {emit("reloadSession")})
		.catch(error => console.error("Error:", error))
}

const getImages = async () => {
	try {
		const response = await fetch ("http://127.0.0.1:8000/api/datasessions/" + props.data.id, {
			method: "GET",
			headers: {
				"Authorization": "Token 123456789abcdefg",
				"Content-Type": "application/json; charset=UTF-8"
			}
		})

		if (!response.ok) {
			const errorData = await response.json()
			console.error("Error Response Data:", errorData)
			throw new Error("Bad request")
		}

		const data = await response.json()
		images.value = data.input_data
			.filter(img => !img.source.includes("archive"))
			.map(img => img.source)
	} catch (error) {
		console.log("Error getting images: ", error)
	}

}

onMounted(() => {
	getImages()
})

</script>

<template>
  <v-container class="d-lg-flex">
    <v-row>
      <v-col cols="9">
        <v-carousel v-if="images.length">
          <v-carousel-item
            v-for="(image, index) in images"
            :key="index"
            :src="require('../assets/' + image)"
            cover
          />
        </v-carousel>
      </v-col>
      <v-col
        cols="3"
        justify="center"
        align="center"
      >
        <!-- The operations bar list goes here -->
        <operation-pipeline
          :operations="data.operations"
          @add-operation="addOperation"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
