import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TopBar({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});
