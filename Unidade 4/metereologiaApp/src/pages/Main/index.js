import React, {useState, useEffect} from 'react';
import {Keyboard, PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, Title, Form, Input, Submit, List} from './styles';
import api from '~/services/api';
import getRealm from '~/services/realm';
import Weather from '~/components/Weather';
import Geolocation from 'react-native-geolocation-service';

export default function Main() {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [weathers, setWeathers] = useState([]);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    async function loadWeathers() {
      const realm = await getRealm();
      const data = realm.objects('Weather');
      setWeathers(data);

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted) {
          console.log('You can use the ACCESS_FINE_LOCATION');

          Geolocation.getCurrentPosition(
            async (position) => {
              console.log(position);
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyA8dThs16mRcmgEuorMMnp0CuH22VQNriw`,
              );
              const json = await response.json();
              handlerRefreshWeatherForecast(json.results[0].address_components[3].long_name);
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } else {
          console.log('ACCESS_FINE_LOCATION permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }

    loadWeathers();
  }, []);

  async function getLocationUser() {
    await Geolocation.getCurrentPosition(
      (info) => {
        setPosition({
          longitude: info.coords.longitude,
          latitude: info.coords.latitude,
        });
        console.log(position);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  async function saveForecast(params) {
    const data = {
      id: params.id,
      name: params.name,
      temp: params.main.temp,
    };

    console.log(data);

    const realm = await getRealm();
    realm.write(() => {
      realm.create('Weather', data, 'modified');
    });

    return data;
  }

  async function handleCityWeatherForecast() {
    try {
      console.log(input);
      const response = await api.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`,
      );

      await saveForecast(response.data);
      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      setError(true);
      console.log(err);
    }
  }

  async function handlerRefreshWeatherForecast(name) {
    const response = await api.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`,
    );
    console.log(response);
    const data = await saveForecast(response.data);

    setWeathers(weathers.map((temp) => (temp.id === data.id ? data : temp)));
  }

  return (
    <Container>
      <Title>Weather App</Title>
      <Form>
        <Input
          value={input}
          error={error}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Procurar cidades..."
        />
        <Submit onPress={handleCityWeatherForecast}>
          <Icon name="add" size={22} color="#FFF"></Icon>
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={weathers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({item}) => (
          <Weather
            data={item}
            onRefresh={() => handlerRefreshWeatherForecast(item.name)}
          />
        )}
      />
    </Container>
  );
}
