import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Dimensions, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.04
  });
  const [mapType, setMapType] = useState("standard");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const onPressChangeLayoutMap = () => {
    setMapType(mapType=="standard" ? "satellite": "standard");
  };
  const onDragEnd = (location) => {
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001
    });

    setLatitude(location.latitude.toString());
    setLongitude(location.longitude.toString());
  }

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

      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
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
      >
        <Marker draggable
        coordinate={region}
        onDragEnd={(e) => onDragEnd(e.nativeEvent.coordinate)}
        />
    </MapView>
    <Text>Latitude</Text>
    <TextInput
      style={styles.inputStyle}
      onChangeText={(text) => onDragEnd(text)}
      value={latitude}
    />
    <Text>Longitude</Text>
    <TextInput
      style={styles.inputStyle}
      onChangeText={(text) => setLongitude(text)}
      value={longitude}
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
