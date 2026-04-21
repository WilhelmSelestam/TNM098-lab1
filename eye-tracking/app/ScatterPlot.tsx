// "use client"

// import React, { useRef, useEffect, useState } from "react"
// import * as d3 from "d3"
// import { EyeFixationData } from "./page"

// interface ScatterPlotProps {
//   data: EyeFixationData[]
//   width?: number
//   height?: number
// }

// const colors = [
//   "#999999",
//   "#E69F00",
//   "#56B4E9",
//   "#009E73",
//   "#F0E442",
//   "#0072B2",
//   "#D55E00",
//   "#CC79A7",
// ]

// export default function ScatterPlot({
//   data,
//   width = 1200,
//   height = 640,
// }: ScatterPlotProps) {
//   const svgRef = useRef<SVGSVGElement>(null)

//   const [timeRange, setTimeRange] = useState({ min: 0, max: 0 })

//   useEffect(() => {
//     if (!svgRef.current || data.length === 0) return

//     const svg = d3.select(svgRef.current)
//     svg.selectAll("*").remove()

//     const margin = { top: 20, right: 20, bottom: 40, left: 50 }
//     const timelineHeight = 60
//     const timelineMargin = 40

//     const innerWidth = width - margin.left - margin.right
//     const innerHeight =
//       height - margin.top - margin.bottom - timelineHeight - timelineMargin

//     const maxX = 1569
//     const maxY = 933

//     const maxTime = 300000
//     const minTime = 0

//     setTimeRange({ min: minTime, max: maxTime })

//     const xScale = d3.scaleLinear().domain([0, maxX]).range([0, innerWidth])
//     const yScale = d3.scaleLinear().domain([0, maxY]).range([0, innerHeight])
//     const tScale = d3
//       .scaleLinear()
//       .domain([minTime, maxTime])
//       .range([0, innerWidth])

//     const gMain = svg
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`)

//     gMain.append("g").call(d3.axisTop(xScale))
//     gMain.append("g").call(d3.axisLeft(yScale))

//     const dots = gMain
//       .selectAll(".dot")
//       .data(data)
//       .enter()
//       .append("circle")
//       .attr("class", "dot")
//       .attr("cx", (d) => xScale(d.x))
//       .attr("cy", (d) => yScale(d.y))
//       .attr("r", (d) => Math.sqrt(Math.sqrt(d.duration)) * 1.5)
//       .attr("fill", (d) => colors[d.clusterLabel + 1])
//       .attr("opacity", 0.4)
//       .style("mix-blend-mode", "multiply")
//       .style("transition", "fill 0.1s, opacity 0.1s")

//     const gTimeline = svg
//       .append("g")
//       .attr(
//         "transform",
//         `translate(${margin.left},${margin.top + innerHeight + timelineMargin})`,
//       )

//     gTimeline
//       .append("g")
//       .attr("transform", `translate(0, ${timelineHeight})`)
//       .call(
//         d3
//           .axisBottom(tScale)
//           .tickFormat((d) => (Number(d) / 1000).toFixed(0) + "s"),
//       )

//     gTimeline
//       .selectAll(".t-dot")
//       .data(data)
//       .enter()
//       .append("rect")
//       // .attr("class", "t-dot")
//       .attr("width", 5)
//       .attr("height", 30)
//       .attr("x", (d) => tScale(d.timestamp))
//       .attr("y", timelineHeight / 2)
//       // .attr("cx", (d) => tScale(d.timestamp))
//       // .attr("cy", timelineHeight / 2)
//       // .attr("r", 2)
//       .attr("fill", (d) => colors[d.clusterLabel + 1])
//       .attr("opacity", 0.5)

//     const brush = d3
//       .brushX()
//       .extent([
//         [0, 0],
//         [innerWidth, timelineHeight],
//       ])
//       .on("brush end", (event) => {
//         const selection = event.selection

//         if (selection) {
//           const [selectedMin, selectedMax] = selection.map(tScale.invert)

//           setTimeRange({ min: selectedMin, max: selectedMax })

//           dots
//             // .attr("fill", (d) =>
//             //   d.timestamp >= selectedMin && d.timestamp <= selectedMax
//             //     ? "#3b82f6"
//             //     : "#e5e7eb",
//             // )
//             .attr("opacity", (d) =>
//               d.timestamp >= selectedMin && d.timestamp <= selectedMax
//                 ? 0.8
//                 : 0.1,
//             )
//             .style("mix-blend-mode", (d) =>
//               d.timestamp >= selectedMin && d.timestamp <= selectedMax
//                 ? "multiply"
//                 : "normal",
//             )
//         } else {
//           setTimeRange({ min: minTime, max: maxTime })
//           dots
//             .attr("fill", (d) => colors[d.clusterLabel + 1])
//             .attr("opacity", 0.4)
//             .style("mix-blend-mode", "multiply")
//         }
//       })

//     const brushGroup = gTimeline.append("g").attr("class", "brush").call(brush)

//     brushGroup
//       .select(".selection")
//       .attr("fill", "#3b82f6")
//       .attr("fill-opacity", 0.2)
//       .attr("stroke", "#2563eb")

//     brushGroup.call(brush.move, [tScale(minTime), tScale(maxTime)])
//   }, [data, width, height])

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-center p-4 rounded-xl shadow-sm border border-gray-200 bg-white">
//         <svg ref={svgRef} width={width} height={height}></svg>
//       </div>

//       <div className="flex justify-between items-center text-sm font-medium text-slate-600 px-4">
//         <p>Active Time Window:</p>
//         <p>
//           {(timeRange.min / 1000).toFixed(0)}s -{" "}
//           {(timeRange.max / 1000).toFixed(0)}s
//           <span className="ml-2 text-slate-400 font-normal">
//             ({((timeRange.max - timeRange.min) / 1000).toFixed(0)}s selected)
//           </span>
//         </p>
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

const colors = [
  "#999999",
  "#E69F00",
  "#56B4E9",
  "#009E73",
  "#F0E442",
  "#0072B2",
  "#D55E00",
  "#CC79A7",
]

export default function ScatterPlot({
  data,
  width = 1200,
  height = 640,
}: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [timeRange, setTimeRange] = useState({ min: 0, max: 280814 })

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

    const maxX = d3.max(data, (d) => d.x) || 1569
    const maxY = d3.max(data, (d) => d.y) || 933

    const maxTime = d3.max(data, (d) => d.timestamp) || 300000
    const minTime = d3.min(data, (d) => d.timestamp) || 0

    console.log(maxTime)

    setTimeRange({ min: minTime, max: maxTime })

    const xScale = d3.scaleLinear().domain([0, maxX]).range([0, innerWidth])
    const yScale = d3.scaleLinear().domain([0, maxY]).range([0, innerHeight])
    const tScale = d3
      .scaleLinear()
      .domain([minTime, maxTime])
      .range([0, innerWidth])

    const validData = data.filter((d) => d.clusterLabel >= 0)
    const clusterGroups = d3.group(validData, (d) => d.clusterLabel)
    const centroids = new Map<number, { x: number; y: number }>()

    clusterGroups.forEach((points, label) => {
      centroids.set(label, {
        x: d3.mean(points, (d) => d.x) || 0,
        y: d3.mean(points, (d) => d.y) || 0,
      })
    })

    // console.log(clusterGroups)

    // const defs = svg.append("defs")
    // defs
    //   .append("marker")
    //   .attr("id", "arrow")
    //   .attr("viewBox", "0 -5 10 10")
    //   .attr("refX", 22)
    //   .attr("refY", 0)
    //   .attr("markerWidth", 6)
    //   .attr("markerHeight", 6)
    //   .attr("orient", "auto")
    //   .append("path")
    //   .attr("d", "M0,-5L10,0L0,5")
    //   .attr("fill", "#475569")

    const gMain = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    gMain.append("g").call(d3.axisTop(xScale))
    gMain.append("g").call(d3.axisLeft(yScale))

    const gTransitions = gMain.append("g").attr("class", "transitions")

    const updateTransitions = (currentMin: number, currentMax: number) => {
      const rangeData = data
        .filter((d) => d.timestamp >= currentMin && d.timestamp <= currentMax)
        .sort((a, b) => a.timestamp - b.timestamp)

      const transitions = new Map<
        string,
        { source: number; target: number; count: number }
      >()
      let prevCluster = -1

      for (const point of rangeData) {
        const currCluster = point.clusterLabel

        if (
          currCluster >= 0 &&
          prevCluster >= 0 &&
          currCluster !== prevCluster
        ) {
          const key = `${prevCluster}->${currCluster}`
          if (!transitions.has(key)) {
            transitions.set(key, {
              source: prevCluster,
              target: currCluster,
              count: 0,
            })
          }
          transitions.get(key)!.count += 1
        }

        if (currCluster >= 0) prevCluster = currCluster
      }

      let linkData = Array.from(transitions.values())
      linkData = linkData.filter((d) => d.count >= 7)

      const maxCount = d3.max(linkData, (d) => d.count) || 1

      const widthScale = d3.scaleLinear().domain([1, maxCount]).range([1.5, 8])
      const opacityScale = d3
        .scaleLinear()
        .domain([1, maxCount])
        .range([0.3, 0.9])

      const paths = gTransitions
        .selectAll<SVGPathElement, any>("path")
        .data(linkData, (d) => `${d.source}-${d.target}`)

      paths
        .enter()
        .append("path")
        .merge(paths)
        .attr("d", (d) => {
          const s = centroids.get(d.source)
          const t = centroids.get(d.target)
          if (!s || !t) return ""

          const sx = xScale(s.x)
          const sy = yScale(s.y)
          const tx = xScale(t.x)
          const ty = yScale(t.y)

          const dx = tx - sx
          const dy = ty - sy
          const dr = Math.sqrt(dx * dx + dy * dy) * 1.5

          return `M${sx},${sy}A${dr},${dr} 0 0,1 ${tx},${ty}`
        })
        .attr("fill", "none")
        .attr("stroke", "#475569")
        .attr("stroke-width", (d) => widthScale(d.count))
        .attr("stroke-opacity", (d) => opacityScale(d.count))
      // .attr("marker-end", "url(#arrow)")

      paths.exit().remove()

      const centroidNodesData = Array.from(centroids.entries())
      const nodes = gTransitions
        .selectAll<SVGCircleElement, any>("circle.centroid")
        .data(centroidNodesData, (d) => d[0])

      // nodes
      //   .enter()
      //   .append("circle")
      //   .attr("class", "centroid")
      //   .merge(nodes)
      //   .attr("cx", (d) => xScale(d[1].x))
      //   .attr("cy", (d) => yScale(d[1].y))
      //   .attr("r", 12)
      //   .attr("fill", (d) => colors[d[0] + 1])
      //   .attr("stroke", "#fff")
      //   .attr("stroke-width", 2.5)

      nodes.exit().remove()
    }

    const dots = gMain
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", (d) => Math.sqrt(Math.sqrt(d.duration)) * 1.5)
      .attr("fill", (d) => colors[d.clusterLabel + 1])
      .attr("opacity", 0.4)

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

    gTimeline
      .selectAll(".t-dot")
      .data(data.filter((d) => d.clusterLabel > -1))
      .enter()
      .append("rect")
      .attr("width", 5)
      .attr("height", 30)
      .attr("x", (d) => tScale(d.timestamp))
      .attr("y", timelineHeight / 2)
      .attr("fill", (d) => colors[d.clusterLabel + 1])
      .attr("opacity", 0.8)

    // Brush Setup
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

          // Update the transitions to only show links in the selected timeframe
          updateTransitions(selectedMin, selectedMax)

          dots
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
          updateTransitions(minTime, maxTime)
          dots.attr("opacity", 0.4).style("mix-blend-mode", "multiply")
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

      <div className="flex items-center text-sm font-medium text-slate-600 px-4">
        <p>
          {"Active Time Window: "}
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
