import React from 'react';
import {View, Image} from 'react-native';
import {
  Container,
  Name,
  Description,
  Stats,
  Stat,
  StatCount,
  Refresh,
  RefreshText,
} from './styles';
import Images from './img/index';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Weather({data, onRefresh}) {
  console.log(data.icon);
  return (
    <Container>
      <Name>{data.name}</Name>
      <Description>{data.temp}</Description>
      <Image source={Images['a' + data.icon]} />
      <Refresh onPress={onRefresh}>
        <Icon name="refresh" color="#49c1ab" size={16} />
        <RefreshText>ATUALIZAR</RefreshText>
      </Refresh>
    </Container>
  );
}
