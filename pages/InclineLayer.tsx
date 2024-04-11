import React from "react";
import { Geojson } from "react-native-maps";
import { inclineData } from "../components/SurfaceFilters";
import { View } from "react-native";

const InclineLayer = (props) => {
    return (
        <View>
            {inclineData.map((item, index) => {
                return (
                    <Geojson
                        key={index}
                        geojson={item}
                        strokeColor={parseFloat(item.features[0].properties.incline) <= props.threshold ? 'green' : 'red'}
                        fillColor={parseFloat(item.features[0].properties.incline) <= props.threshold ? 'green' : 'red'}
                        strokeWidth={2}
                    />
                )
            })}
        </View>
    )
}

export default InclineLayer