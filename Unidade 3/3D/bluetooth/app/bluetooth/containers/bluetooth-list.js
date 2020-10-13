import React, { useEffect, useState, Component } from 'react';
import {FlatList} from 'react-native';
import Layout from '../components/bluetooth-list-layout';
import Empty from '../components/empty';
import Toggle from '../components/toggle';
import Subtitle from '../components/subtitle';
import Device from '../components/device';
import BleManager from 'react-native-ble-manager';
import {
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Button,
} from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class BluetoothList extends React.Component {
  componentDidMount() {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permissão para localizar o Bluetooth',
        message: 'Obrigatório para o Bluetooth',
        buttonNeutral: 'Depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permitido');
    } else {
      console.log('Negado');
    }
  }

  render() {
    const lista = [];
    const renderEmpty = () => <Empty text="Não tem dispositivos" />;
    const renderItem = ({item}) => {
      return (
        <Device
          {...item}
          iconLeft={require('../../icons/smartphone.png')}
          iconRight={require('../../icons/settings.png')}
        />
      );
    };

    const discoverPeripherals = () => {
      alert('Iniciado pareamento');
      BleManager.start({showAlert: false});
      BleManager.scan([], 10, true);

      bleManagerEmitter.addListener('BleManagerStopScan', () => {
        BleManager.getDiscoveredPeripherals([])
          .then((devices) => {
            console.log(devices);
            alert(`Número de dispositivos encontrados ${devices.length}`);
          })
          .catch((error) => {
            console.log('error fail: ', error);
          });
      });
    };

    return (
      <Layout title="Bluetooth">
        <Subtitle title="Lista de dispositivos" />
        <Button title="Parear dispositivos" onPress={discoverPeripherals} />
        <FlatList
          data={lista}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
        />
      </Layout>
    );
  }
}
