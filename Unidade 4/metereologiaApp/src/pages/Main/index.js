import React, {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, Title, Form, Input, Submit, List} from './styles';
import api from '~/services/api';
import getRealm from '~/services/realm';
import Weather from '~/components/Weather';

export default function Main() {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [weathers, setWeathers] = useState([]);

  useEffect(() => {
    async function loadWeathers() {
      const realm = await getRealm();
      const data = realm.objects('Weather');
      setWeathers(data);
    }

    console.log(weathers);

    loadWeathers();
  }, []);

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
      const response = await api.get(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`);

      await saveForecast(response.data);
      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      setError(true);
      console.log(err);
    }
  }

  async function handlerRefreshWeatherForecast(weather) {
    const response = await api.get(`https://api.openweathermap.org/data/2.5/weather?q=${weather.name}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`);
    console.log(response);
    const data = await saveForecast(response.data);

    setWeathers(
      weathers.map((temp) => (temp.id === data.id ? data : temp)),
    );

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
            onRefresh={() => handlerRefreshWeatherForecast(item)}
          />
        )}
      /> 

    </Container>
  );
}
