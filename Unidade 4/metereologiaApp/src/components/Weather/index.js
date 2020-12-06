import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Container, Name, Description, Refresh, RefreshText} from './styles';
import Images from './img/index';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});
export default function Weather({data, onRefresh}) {
  console.log(data.icon);
  return (
    <Container>
      <Name>{data.name}</Name>
      <Description>{`${data.temp}°C`}</Description>
      <Image style={styles.image} source={Images['a' + data.icon]} />
      <Refresh onPress={onRefresh}>
        <Icon name="refresh" color="#49c1ab" size={16} />
        <RefreshText>ATUALIZAR</RefreshText>
      </Refresh>
    </Container>
  );
}
