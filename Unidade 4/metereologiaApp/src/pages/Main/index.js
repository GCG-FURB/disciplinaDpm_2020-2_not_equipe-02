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
          Geolocation.getCurrentPosition(
            async (position) => {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyA8dThs16mRcmgEuorMMnp0CuH22VQNriw`,
              );
              const json = await response.json();
              getWeather(json.results[0].address_components[3].long_name);
            },
            (error) => {
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

  async function saveForecast(params) {
    const data = {
      id: params.id,
      name: params.name,
      temp: Math.round(params.main.temp),
      icon: params.weather[0].icon,
    };

    const realm = await getRealm();
    realm.write(() => {
      realm.create('Weather', data, 'modified');
    });

    setWeathers(realm.objects('Weather'));
    return data;
  }

  async function handleCityWeatherForecast() {
    try {
      getWeather(input);
      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      setError(true);
      console.log(err);
    }
  }

  async function handlerRefreshWeatherForecast(city_name) {
    const data = getWeather(city_name);

    setWeathers(weathers.map((temp) => (temp.id === data.id ? data : temp)));
  }

  async function getWeather(city_name) {
    const response = await api.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`,
    );

    return await saveForecast(response.data);
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
