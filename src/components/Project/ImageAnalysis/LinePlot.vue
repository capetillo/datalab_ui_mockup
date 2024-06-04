<script setup>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'

const svg = ref(null)

const props = defineProps(['yAxisLuminosity', 'xAxisArcsecs'])

// Setting dimensions and margins for the plot
const margin = { top: 20, right: 20, bottom: 70, left: 80 },
  svgWidth = 700,
  svgHeight = 480,
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom

// Configuring linear scales for positioning data points
let x = d3.scaleLinear().range([0, width])
let y = d3.scaleLinear().range([height, 0])
let svgElement


// Mapping an array of data points to an SVG path
const line = d3.line()
// index of each point for x
  .x((d, i) => x((i / (props.yAxisLuminosity.length - 1)) * props.xAxisArcsecs))
  // value for y
  .y(d => y(d))


const updateAxes = () => {
  const maxX = props.xAxisArcsecs
  // Add 5% to the largest number from the randomNumbers array to buffer the plot
  const maxY = d3.max(props.yAxisLuminosity) * 1.05

  x.domain([0, maxX])
  y.domain([0, maxY])

  svgElement.select('.x.axis').call(d3.axisBottom(x))
  svgElement.select('.y.axis').call(d3.axisLeft(y))

  updatePlot()
}

const updatePlot = () => {
  // Clearing the existing line before drawing a new one
  svgElement.selectAll('.line').remove()
  // Getting new data points and drawing a new line
  svgElement.append('path')
    .datum(props.yAxisLuminosity)
    .attr('class', 'line')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
}

watch(() => [props.yAxisLuminosity, props.xAxisArcsecs], () => {
  updateAxes()
})

onMounted(() => {
  svgElement = d3.select(svg.value)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const xAxis = svgElement.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)

  const yAxis = svgElement.append('g')
    .attr('class', 'y axis')

  updateAxes()

  // Labeling and styling axes
  xAxis.append('text')
    .attr('class', 'axis-label')
    .attr('x', width / 2)
    .attr('y', margin.bottom)
    .attr('fill', 'var(--tan)')
    .style('font-size', '16px')
    .style('font-family', 'Open Sans, sans-serif')
    .style('text-anchor', 'middle')
    .text('Arcseconds')

  yAxis.append('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left)
    .attr('x', -(height / 2))
    .attr('dy', '1em')
    .attr('fill', 'var(--tan)')
    .style('font-size', '16px')
    .style('font-family', 'Open Sans, sans-serif')
    .style('text-anchor', 'middle')
    .text('Luminosity')
  
})
</script>

<template>
  <div class="svg-wrapper">
    <svg
      ref="svg"
      class="line-plot"
      :width="svgWidth"
      :height="svgHeight"
    />
  </div>
</template>

<style scoped> 
.line-plot {
  color: var(--tan);
  font-family: 'Open Sans', sans-serif;
}
.axis-label {
  color: var(--tan);
}
@media (max-width: 1200px) {
.svg-wrapper {
  margin-left: -18%;
}
.line-plot {
  background-color: var(--dark-blue);
  transform: scale(0.7);
}
}
@media (max-width: 900px) {
.svg-wrapper {
  margin-top: -7%;
  padding-left: 15%;
}
.line-plot {
  background-color: var(--dark-blue);
  transform: scale(0.8);
}
}
</style>
