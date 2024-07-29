<script setup>
import { computed } from 'vue'
const props = defineProps({
  filter: {
    type: String,
    required: true
  }
})

const badgeColor = computed(() => {
  switch (props.filter) {
  case 'R': case 'rp':
    return 'red'
  case 'V': case 'gp':
    return 'green'
  case 'B':
    return 'blue'
  default:
    return 'var(--metal)'
  }
})
</script>
<template>
  <p
    class="filter-badge"
    :style="{ backgroundColor: badgeColor}"
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
