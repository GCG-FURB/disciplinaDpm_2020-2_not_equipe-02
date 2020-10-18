import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Dimensions, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.04
  });
  const [mapType, setMapType] = useState("standard");

  const onPressChangeLayoutMap = () => {
    setMapType(mapType=="standard" ? "satellite": "standard");
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      });

    })();
  }, []);

  let text = 'Waiting..';
  console.log(location);
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        region={region}
        mapType={mapType}
        showsUserLocation={true}
     />
    <Text>Latitude</Text>
    <TextInput
      style={styles.inputStyle}
      value={region.latitude.toString()}
    />
    <Text>Longitude</Text>
    <TextInput
      style={styles.inputStyle}
      value={region.longitude.toString()}
    />
    <Button
      onPress={onPressChangeLayoutMap}
      title="Trocar mapa"
      style={styles.buttonStyle}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: '70%'
  },
  inputStyle: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200
  },
  buttonStyle: {
    marginTop: 20
  }
});
