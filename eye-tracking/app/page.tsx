import fs from "fs"
import path from "path"
import ScatterPlot from "./ScatterPlot"
import { dbscan } from "./dbscan"
import { clustersDbscan } from "@turf/clusters-dbscan"

export interface EyeFixationData {
  timestamp: number
  fixationIndex: number
  duration: number
  gazePointIndex: number
  x: number
  y: number
}

export default async function Home() {
  let parsedData: EyeFixationData[] = []

  try {
    const fileContents = fs.readFileSync(
      "C:/Skola/TNM098-Avancerad_visuell_dataanalys/lab1/eye-tracking/public/EyeTrack-raw.tsv",
      "utf-8",
    )

    const lines = fileContents.trim().split("\n")

    parsedData = lines
      .map((line) => {
        const d = line.split("\t")
        return {
          timestamp: +d[0],
          fixationIndex: +d[1],
          duration: +d[2],
          gazePointIndex: +d[3],
          x: +d[4],
          y: +d[5],
        }
      })
      .filter((d) => !isNaN(d.x) && !isNaN(d.y))
  } catch (error) {
    console.error("Failed: ", error)
  }

  const dataset = parsedData.map((row) => {
    const x = row.x
    const y = row.y

    return [x, y]
  })

  // const result = dbscan(dataset)

  // var maxDistance = 100
  // var result = clustersDbscan(dataset, maxDistance)

  // console.log("hello ", result)

  return (
    <main className="min-h-screen bg-amber-50 text-slate-800 p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-4">
          {parsedData.length > 0 ? (
            <ScatterPlot data={parsedData} />
          ) : (
            <div className="flex items-center justify-center bg-red-50 rounded-xl border border-red-200">
              <span className="text-red-500 font-medium">
                Error loading dataset. Check server logs.
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
