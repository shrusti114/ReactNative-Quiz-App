import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BottomBar({ items = [], onPressItem }) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  button: { padding: 10 },
  text: { color: '#fff', fontSize: 16 },
});
