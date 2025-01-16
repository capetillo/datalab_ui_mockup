<script setup>
import OperationNode from '@/components/DataSession/OperationGraph/OperationNode.vue'
import ImagesNode from '@/components/DataSession/OperationGraph/ImagesNode.vue'
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core'
import { nextTick, ref, watch } from 'vue'
import _ from 'lodash'
import { useLayout } from '@/components/DataSession/OperationGraph/useLayout.js'


const props = defineProps({
  operations: {
    type: Array,
    required: true
  },
  images: {
    type: [Array, Boolean],
    default: false
  },
  sessionId: {
    type: Number,
    required: true
  },
  selectedOperation: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  }
})

const nodes = ref([])
const edges = ref([])
const { layout } = useLayout()
const emit = defineEmits(['selectOperation', 'closeGraph'])

function selectOperation(index) {
  emit('selectOperation', Number(index))
}

const { fitView, onPaneReady } = useVueFlow({id: 'operations-pipeline-vue-flow'})

function getEdgeProps(source, target) {
  if(target == props.selectedOperation.toString()) {
    return {style: { stroke: 'violet', strokeWidth: '2px' }, animated: true}
  }
  else if(source == props.selectedOperation.toString()) {
    return {style: { stroke: 'green', strokeWidth: '2px' }, animated: true}
  }
  else {
    return {style: { stroke: 'lightgrey', strokeWidth: '1px' }, animated: false}
  }
}

function nodeUpdate() {
  // This is called when nodes and edges have been created to lay them out
  nodes.value = layout(nodes.value, edges.value)
  // Examples show letting VueFlow have a cycle after layout before calling fitView, not sure why
  nextTick(() =>{
    fitView()
  })
}

function updateNodesAndEdges() {
  if (props.active) {
    nodes.value = []
    edges.value = []
    let edgeIds = new Set()
    // Build a map of output images to the operation id they are generated from
    // This is basically deriving the graph relationships from the linear nodes
    // It maps output image basenames to the operation index, which is then used
    // to map future operations input images to the previous operation index as an edge
    let outputImageToOperation = {}
    props.operations.forEach((operation, index) => {
      if (operation.output && operation.output.output_files){
        operation.output.output_files.forEach(outputFile => {
          outputImageToOperation[outputFile.basename] = index
        })
      }
    })

    // Use that map to create edges between operation nodes linking operations that use other
    // operations outputs as inputs
    props.operations.forEach((operation, index) => {
      nodes.value.push({
        id: index.toString(),
        type: 'operation',
        data: operation,
        position: {x: 0, y: 50}  // Initial position must be provided or layout freaks out
      })
    })
    props.operations.forEach((operation, index) => {
      Object.values(operation.input_data).forEach(inputParam => {
        if (_.isArray(inputParam)) {
          inputParam.forEach(inputValue => {
            if (inputValue.basename && inputValue.basename in outputImageToOperation) {
              let edgeId = 'e' + outputImageToOperation[inputValue.basename] + '->' + index
              if (!edgeIds.has(edgeId)) {
                edges.value.push({
                  id: edgeId,
                  source: outputImageToOperation[inputValue.basename].toString(),
                  target: index.toString(),
                  type: 'smoothstep',
                  ...getEdgeProps(outputImageToOperation[inputValue.basename].toString(), index.toString())
                })
                // A Set of edgeIds is used to make sure we don't double create edges
                edgeIds.add(edgeId)
              }
            }
          })
        }
      })
    })
    // Must let VuewFlow have a cycle to setup initial positions of nodes before laying out
    nextTick(() =>{
      nodeUpdate()
    })
  }
}

watch(() => props.operations, () => {
  // Whenever operations are updated, re-create the nodes and edges and lay them out
  updateNodesAndEdges()
}, { immediate: false }
)

watch(() => props.selectedOperation, () => {
  if(props.selectedOperation == -1) {
    // Set all edges to grey
    edges.value.forEach(edge => {
      if(edge.style.stroke != 'lightgrey') {
        edge.style = { stroke: 'lightgrey', strokeWidth: '1px' }
        edge.animated = false
      }
    })
  }
  else {
    // Color the incoming and outgoing edges from the selected operation node
    edges.value.forEach(edge => {
      const edgeProps = getEdgeProps(edge.source, edge.target)
      edge.style = edgeProps.style
      edge.animated = edgeProps.animated
    })
  }
})

onPaneReady(() => {
  updateNodesAndEdges()
})

</script>
<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :nodes-draggable="false"
    :snap-to-grid="true"
    :elements-selectable="false"
    id='operations-pipeline-vue-flow'
    class="operation-pipeline-node-flow"
  >
    <template #node-operation="item">
      <OperationNode :id="item.id" :selected-id="props.selectedOperation" :data="item.data" @select-operation="selectOperation(item.id)"/>
    </template>
    <template #node-images="item">
      <ImagesNode :id="item.id" :data="item.data"/>
    </template>
    <Panel position='top-right'>
      <v-btn title='Close Graph' density='default' icon='mdi-close' @click="emit('closeGraph')"/>
    </Panel>
  </VueFlow>
</template>
<style>

</style>