<script setup>
import { filterToColor } from '@/utils/common'

const props = defineProps({
  filter: {
    type: String,
    required: true
  }
})

</script>
<template>
  <p
    class="filter-badge"
    :style="{ backgroundColor: filterToColor(props.filter) }"
  >
    {{ props.filter }}
  </p>
</template>
<style scoped>
.filter-badge {
  border-radius: 5px;
  color: var(--tan);
  padding: 5px 10px;
  display: inline-block;
}
</style>
