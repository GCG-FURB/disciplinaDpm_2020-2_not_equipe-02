import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Layout from '../components/bluetooth-list-layout';
import Empty from '../components/empty';
import Toggle from '../components/toggle';
import Subtitle from '../components/subtitle';
import Device from '../components/device';
// import BluetoothSerial from 'react-native-bluetooth-serial-next';

function BluetoothList(props) {
  const lista = [
    {
      name: 'Cristhian',
      key: '1'
    }, {
      name: 'Lara',
      key: '2'
  }]

  const renderEmpty = () => <Empty text='Não tem dispositivos'/>
  const renderItem = ({item}) => {
    return <Device {...item} iconLeft={require('../../icons/smartphone.png')} iconRight={require('../../icons/settings.png')}/>
  }

  return (
    <Layout title='Bluetooth'>
      <Toggle/>
      <Subtitle title='Lista de dispositivos'/>
      <FlatList
        data={lista}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
      />
    </Layout>
  );
}

export default BluetoothList;