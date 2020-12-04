import React from 'react';
import {View} from 'react-native';
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
import Icon from 'react-native-vector-icons/FontAwesome';
export default function Weather({data, onRefresh}) {
  return (
    <Container>
      <Name>{data.name}</Name>
      <Description>{data.temp}</Description>
      <Refresh onPress={onRefresh}>
        <Icon name="refresh" color="#49c1ab" size={16} />
        <RefreshText>ATUALIZAR</RefreshText>
      </Refresh>
    </Container>
  );
}
