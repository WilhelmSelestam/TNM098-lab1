// "use client"

// import React, { useRef, useEffect } from "react"
// import * as d3 from "d3"
// import { FixationData } from "./page"

// interface ScatterPlotProps {
//   data: FixationData[]
//   width?: number
//   height?: number
// }

// export default function ScatterPlot({
//   data,
//   width = 960,
//   height = 640,
// }: ScatterPlotProps) {
//   const svgRef = useRef<SVGSVGElement>(null)

//   useEffect(() => {
//     if (!svgRef.current || data.length === 0) return

//     const svg = d3.select(svgRef.current)
//     svg.selectAll("*").remove()

//     const margin = { top: 20, right: 20, bottom: 30, left: 50 }
//     const innerWidth = width - margin.left - margin.right
//     const heightMain = height - 120 - margin.top - margin.bottom
//     const heightTimeline = 80
//     const totalHeight =
//       heightMain + heightTimeline + margin.top * 2 + margin.bottom * 2

//     svg
//       .attr("width", innerWidth + margin.left + margin.right)
//       .attr("height", totalHeight)

//     const mainChart = svg
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`)

//     const timelineChart = svg
//       .append("g")
//       .attr(
//         "transform",
//         `translate(${margin.left},${margin.top + heightMain + margin.bottom + margin.top})`,
//       )

//     const maxX = 1569
//     const maxY = 933
//     const timeExtent = d3.extent(data, (d) => d.timestamp) as [number, number]

//     const xScale = d3.scaleLinear().domain([0, maxX]).range([0, innerWidth])
//     const yScale = d3.scaleLinear().domain([0, maxY]).range([0, heightMain])
//     const timeScale = d3.scaleLinear().domain(timeExtent).range([0, innerWidth])

//     mainChart.append("g").call(d3.axisTop(xScale))
//     mainChart.append("g").call(d3.axisLeft(yScale))

//     timelineChart
//       .append("g")
//       .attr("transform", `translate(0,${heightTimeline})`)
//       .call(
//         d3
//           .axisBottom(timeScale)
//           .tickFormat((d) => (Number(d) / 1000).toFixed(1) + "s"),
//       )

//     const dots = mainChart
//       .selectAll(".dot")
//       .data(data)
//       .enter()
//       .append("circle")
//       .attr("class", "dot")
//       .attr("cx", (d) => xScale(d.x))
//       .attr("cy", (d) => yScale(d.y))
//       .attr("r", (d) => Math.sqrt(Math.sqrt(d.duration)) * 1.5)
//       .style("fill", "#3b82f6")
//       .style("opacity", 0.4)
//       .style("mix-blend-mode", "multiply")
//       .style("transition", "fill 0.2s, opacity 0.2s, stroke 0.2s")

//     timelineChart
//       .selectAll(".timeline-dot")
//       .data(data)
//       .enter()
//       .append("circle")
//       .attr("class", "timeline-dot")
//       .attr("r", 2)
//       .attr("cx", (d) => timeScale(d.timestamp))
//       .attr("cy", heightTimeline / 2)
//       .style("fill", "#9ca3af")
//       .style("opacity", 0.5)

//     // Setup the Brush
//     const brush = d3
//       .brushX()
//       .extent([
//         [0, 0],
//         [innerWidth, heightTimeline],
//       ])
//       .on("brush end", brushed)

//     const brushGroup = timelineChart
//       .append("g")
//       .attr("class", "brush")
//       .call(brush)

//     // Style the brush selection directly to avoid needing external CSS
//     brushGroup
//       .select(".selection")
//       .style("fill", "#3b82f6")
//       .style("fill-opacity", 0.2)
//       .style("stroke", "#2563eb")
//       .style("stroke-width", "1px")

//     // Initialize the brush extent to the middle 30%
//     const startBrushTime =
//       timeExtent[0] + (timeExtent[1] - timeExtent[0]) * 0.35
//     const endBrushTime = timeExtent[0] + (timeExtent[1] - timeExtent[0]) * 0.65
//     brushGroup.call(brush.move, [
//       timeScale(startBrushTime),
//       timeScale(endBrushTime),
//     ])

//     // The Brush Filtering Logic
//     function brushed(event: d3.D3BrushEvent<unknown>) {
//       const selection = event.selection as [number, number] | null

//       if (selection) {
//         // Map pixel boundaries back to timestamp values
//         const [timeMin, timeMax] = selection.map(timeScale.invert)

//         // Update dot styling based on time range
//         dots
//           .style("fill", (d) =>
//             d.timestamp >= timeMin && d.timestamp <= timeMax
//               ? "#3b82f6"
//               : "#e5e7eb",
//           )
//           .style("opacity", (d) =>
//             d.timestamp >= timeMin && d.timestamp <= timeMax ? 0.4 : 0.05,
//           )
//       } else {
//         // Reset to default if brush is cleared
//         dots.style("fill", "#3b82f6").style("opacity", 0.4)
//       }
//     }
//   }, [data, width, height])

//   return (
//     <div className="flex flex-col items-center p-4 rounded-xl shadow-sm border border-gray-200">
//       <h2 className="mb-2 text-slate-800 font-sans">Gaze Point Analysis</h2>
//       <p className="mb-6 text-slate-500 text-sm font-sans">
//         Drag the timeline brush below to filter gaze points by recording
//         timestamp.
//       </p>
//       <div className="overflow-x-auto">
//         <svg ref={svgRef}></svg>
//       </div>
//     </div>
//   )
// }

"use client"

import React, { useRef, useEffect, useState } from "react"
import * as d3 from "d3"
import { EyeFixationData } from "./page"

interface ScatterPlotProps {
  data: EyeFixationData[]
  width?: number
  height?: number
}

export default function ScatterPlot({
  data,
  width = 960,
  height = 640,
}: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const [timeRange, setTimeRange] = useState({ min: 0, max: 0 })

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const timelineHeight = 60
    const timelineMargin = 40

    const innerWidth = width - margin.left - margin.right
    const innerHeight =
      height - margin.top - margin.bottom - timelineHeight - timelineMargin

    const maxX = 1569
    const maxY = 933

    const maxTime = 300000
    const minTime = 0

    setTimeRange({ min: minTime, max: maxTime })

    const xScale = d3.scaleLinear().domain([0, maxX]).range([0, innerWidth])
    const yScale = d3.scaleLinear().domain([0, maxY]).range([0, innerHeight])
    const tScale = d3
      .scaleLinear()
      .domain([minTime, maxTime])
      .range([0, innerWidth])

    const gMain = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    gMain.append("g").call(d3.axisTop(xScale))
    gMain.append("g").call(d3.axisLeft(yScale))

    const dots = gMain
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", (d) => Math.sqrt(Math.sqrt(d.duration)) * 1.5)
      .attr("fill", "#3b82f6")
      .attr("opacity", 0.4)
      .style("mix-blend-mode", "multiply")
      .style("transition", "fill 0.1s, opacity 0.1s")

    const gTimeline = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${margin.top + innerHeight + timelineMargin})`,
      )

    gTimeline
      .append("g")
      .attr("transform", `translate(0, ${timelineHeight})`)
      .call(
        d3
          .axisBottom(tScale)
          .tickFormat((d) => (Number(d) / 1000).toFixed(0) + "s"),
      )

    // gTimeline
    //   .selectAll(".t-dot")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "t-dot")
    //   .attr("cx", (d) => tScale(d.timestamp))
    //   .attr("cy", timelineHeight / 2)
    //   .attr("r", 2)
    //   .attr("fill", "#9ca3af")
    //   .attr("opacity", 0.3)

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [innerWidth, timelineHeight],
      ])
      .on("brush end", (event) => {
        const selection = event.selection

        if (selection) {
          const [selectedMin, selectedMax] = selection.map(tScale.invert)

          setTimeRange({ min: selectedMin, max: selectedMax })

          dots
            .attr("fill", (d) =>
              d.timestamp >= selectedMin && d.timestamp <= selectedMax
                ? "#3b82f6"
                : "#e5e7eb",
            )
            .attr("opacity", (d) =>
              d.timestamp >= selectedMin && d.timestamp <= selectedMax
                ? 0.8
                : 0.1,
            )
            .style("mix-blend-mode", (d) =>
              d.timestamp >= selectedMin && d.timestamp <= selectedMax
                ? "multiply"
                : "normal",
            )
        } else {
          setTimeRange({ min: minTime, max: maxTime })
          dots
            .attr("fill", "#3b82f6")
            .attr("opacity", 0.4)
            .style("mix-blend-mode", "multiply")
        }
      })

    const brushGroup = gTimeline.append("g").attr("class", "brush").call(brush)

    brushGroup
      .select(".selection")
      .attr("fill", "#3b82f6")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "#2563eb")

    brushGroup.call(brush.move, [tScale(minTime), tScale(maxTime)])
  }, [data, width, height])

  return (
    <div className="space-y-4">
      <div className="flex justify-center p-4 rounded-xl shadow-sm border border-gray-200 bg-white">
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>

      <div className="flex justify-between items-center text-sm font-medium text-slate-600 px-4">
        <p>Active Time Window:</p>
        <p>
          {(timeRange.min / 1000).toFixed(0)}s -{" "}
          {(timeRange.max / 1000).toFixed(0)}s
          <span className="ml-2 text-slate-400 font-normal">
            ({((timeRange.max - timeRange.min) / 1000).toFixed(0)}s selected)
          </span>
        </p>
      </div>
    </div>
  )
}
