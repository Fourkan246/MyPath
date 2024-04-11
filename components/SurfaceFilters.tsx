export const sideWalk = require('../assets/sidewalk.json')


let surfaceList: Array<string | undefined> = []

// Get surface list from original geojson
for (let i = 0; i < sideWalk.features.length; i++) {
  surfaceList.push(sideWalk.features[i].properties.surface);
} 
// surfaceList = surfaceList.filter(item => (item !== undefined))
surfaceList = surfaceList.filter((item, index) => {
  return surfaceList.indexOf(item) === index
})

console.log(surfaceList)
export let surfaceData: Array<Object> = []

// Populate the surfaceData array
for (let i = 0; i < surfaceList.length; i++) {
  const data = {
    "type": "FeatureCollection",
    "features": sideWalk.features.filter((item) => {
      return item.properties.surface === surfaceList[i] && item.geometry.type !== "Point"
    })
  }
  surfaceData.push(data)
}

export let inclineData: Array<Object> = []

for (let i = 0; i < sideWalk.features.length; i++) {
  const data = {
    "type": "FeatureCollection",
    "features": [sideWalk.features[i]]
  }
  if (sideWalk.features[i].geometry.type === "LineString" && sideWalk.features[i].properties.incline !== undefined) inclineData.push(data);
}
