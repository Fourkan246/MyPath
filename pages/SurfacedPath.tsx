import React from "react";
import { surfaceData } from "../components/SurfaceFilters";
import { View } from "react-native";
import { Polyline, Marker } from "react-native-maps";

const SurfacedPath = (props) => {
    var path = [];
    var colors = [];
    var pathFragment = []
    const surfaceColor = {
        'undefined': 'black',
        'concrete': 'blue',
        'paving_stones': 'grey',
        'bricks': 'red',
        'asphalt': 'purple'
    }

    let prevSurfaceType = undefined;
    let q = "";
    for (let i = 0; i < props.path.length; i++) {
        q += "point="+props.path[i].latitude+","+props.path[i].longitude+"&"
        let surfaceType = undefined;
        for (let j = 0; j < surfaceData.length; j++) {
            for (let k = 0; k < surfaceData[j].features.length; k++) {
                surfaceData[j].features[k].geometry.coordinates.forEach(element => {
                    if (element[0] === props.path[i].longitude && element[1] === props.path[i].latitude) {
                        surfaceType = surfaceData[j].features[k].properties.surface;
                    }
                })
            }
        }
        if (pathFragment.length === 0 || surfaceType === prevSurfaceType) {
            pathFragment.push(props.path[i]);
            prevSurfaceType = surfaceType
        } else {
            if (prevSurfaceType === undefined) colors.push('black');
            else colors.push(surfaceColor[prevSurfaceType])
            path.push(pathFragment);
            pathFragment = [props.path[i - 1], props.path[i]];
            prevSurfaceType = surfaceType
        }
    }
    console.log(q);
    path.push(pathFragment);
    if (prevSurfaceType === undefined) colors.push('black');
    else colors.push(surfaceColor[prevSurfaceType])
    console.log(colors)

    return (
        <View>
            {props.path.map((item, index) => {
                return (
                    
                    <Marker pinColor="red" coordinate={item}/>
                )
            })}
            {path.map((item, index) => {
                return (
                    <Polyline
                      coordinates={item}
                      strokeColor={colors[index]}
                      strokeWidth={6}
                    />
                )
            })}
        </View>
    )
}

export default SurfacedPath