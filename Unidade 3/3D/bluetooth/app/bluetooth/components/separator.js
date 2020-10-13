import React from 'react';
import { View, StyleSheet } from 'react-native';

function Separator() {
  return (
    <View style={styles.separator}/>
  );
}

const styles = StyleSheet.create({
  separator: {
    flex: 1,
    borderTopWidth: 1,
    marginLeft: 60,
    marginRight: 25,
    borderColor: '#eceff1'
  }
});

export default Separator;



