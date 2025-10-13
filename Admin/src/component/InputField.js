import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function InputField({ placeholder, value, onChangeText, secureTextEntry = false }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
  },
});
