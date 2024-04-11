import React from "react";
import { Geojson } from "react-native-maps";
import { surfaceData } from "../components/SurfaceFilters";
import { View } from "react-native";

const SurfaceLayer = () => {
    const colors = ["grey", "blue", "red", "black", "purple"]

    return (
        <View>
            {surfaceData.map((item, index) => {
                return (
                    <Geojson
                        key={index}
                        geojson={item}
                        strokeColor={colors[index]}
                        fillColor={colors[index]}
                        strokeWidth={2}
                    />
                )
            })}
        </View>
    )
}

export default SurfaceLayer