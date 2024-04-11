import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { GeoCoordinates } from 'react-native-geolocation-service';
import RNMapView, { Circle, Marker, Polyline, Geojson } from 'react-native-maps';
import SurfaceLayer from './SurfaceLayer';
import InclineLayer from './InclineLayer';
import SurfacedPath from './SurfacedPath';
import { fetchInstruction } from '../components/TurnByTurn';

import {Provider} from "react-redux";
import {store} from "../App/store";

import { surfaceData, sideWalk } from '../components/SurfaceFilters';

interface MapViewProps {
  coords: GeoCoordinates | null;
  fromCoords: any | null;
  toCoords: any | null;
  focus: 'user' | 'source' | 'destination' | null;
  isSearching: boolean;
  overlay: 'none' | 'surface' | 'incline';
  inclineThreshold: Number;
}

// const sideWalk = require('../assets/sidewalk.geojson')
// const sidewalkJSON = JSON.parse(sidewalk);

const MapView = ({ coords, fromCoords, toCoords, focus, isSearching, overlay, inclineThreshold, sendInstructions }: MapViewProps ) => {
  const mapRef = useRef<RNMapView>(null);
  const [path, setPath] = useState(null);
  const [instructions, setInstructions] = useState(null);

  function calculatePath() {
    if (!fromCoords || !toCoords) return;

    let baseURL = 'https://mypathweb.csi.miamioh.edu/webapi/getSingleRoute?';
      baseURL += `srcLat=${fromCoords.latitude}&`;
      baseURL += `srcLon=${fromCoords.longitude}&`;
      baseURL += `destLat=${toCoords.latitude}&`;
      baseURL += `destLon=${toCoords.longitude}`;
      fetch(baseURL)
        .then(response => response.json())
        .then(data => {
          let newPath = [fromCoords];
          let newInstructions = fetchInstruction(data);
          for (let i = 0; i < data.nodeList.length; i++) {
            newPath.push({
              latitude: data.nodeList[i].latitute,
              longitude: data.nodeList[i].longtitude
            });
          }
          newPath.push(toCoords);
          setPath(newPath);
          sendInstructions(newInstructions);          
        })
        .catch((error) => {
          console.error(error);
        });
  }

  useEffect(() => {
    if (isSearching) {
      calculatePath();
    }

    if (!!coords && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      });
    }

    if (!!fromCoords && focus === 'source' && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: fromCoords.latitude,
          longitude: fromCoords.longitude,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      });
    }

    if (!!toCoords && focus === 'destination' && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: toCoords.latitude,
          longitude: toCoords.longitude,
        },
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 16,
      });
    }
  }, [coords, fromCoords, toCoords, isSearching]);

  return (
  <Provider store={store}>
    <View style={styles.centeredView}>
      <RNMapView
        ref={mapRef}
        initialCamera={{
          altitude: 15000,
          center: {
            latitude: 38.8937255,
            longitude: -77.0969761,
          },
          heading: 0,
          pitch: 0,
          zoom: 11,
        }}
        loadingEnabled
        loadingBackgroundColor="white"
        style={StyleSheet.absoluteFillObject}
        rotateEnabled={false}>
        
        {/* Surface Layer */}
        {overlay === 'surface' && (
          <SurfaceLayer/>
        )}

        {/* Incline Layer */}
        {overlay === 'incline' && (
          <InclineLayer threshold={inclineThreshold}/>
        )}

        {/* Source Marker */}
        {!!fromCoords && (
          <Marker pinColor='green' coordinate={fromCoords}/>
        )}

        {/* Destination Marker */}
        {!!toCoords && (
          <Marker pinColor='red' coordinate={toCoords}/>
        )}

        {/* Route */}
        {isSearching && !!path && (
          <Polyline
            coordinates={path}
            strokeColor="skyblue"
            strokeWidth={6}
          />
          // <SurfacedPath path={path}/>
        )}
        {!!coords && (
          <>
            <Marker
              anchor={{ x: 0.5, y: 0.6 }}
              coordinate={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
              flat
              style={{
                ...(coords.heading !== -1 && {
                  transform: [
                    {
                      rotate: `${coords.heading}deg`,
                    },
                  ],
                }),
              }}>
              <View style={styles.dotContainer}>
                <View style={[styles.arrow]} />
                <View style={styles.dot} />
              </View>
            </Marker>
            <Circle
              center={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
              radius={coords.accuracy}
              strokeColor="rgba(0, 150, 255, 0.5)"
              fillColor="rgba(0, 150, 255, 0.5)"
            />
          </>
        )}
      </RNMapView>
    </View>
  </Provider>
  );
};

export default MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: 'rgb(0, 120, 255)',
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 4,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgb(0, 120, 255)',
  },
});
