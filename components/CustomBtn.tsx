import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomBtn = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      accessible={true}
      accessibilityRole="button"
      style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomBtn;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#127ACC',
    padding: 8,
    borderRadius: 5,
    marginVertical: 12,
  },
  buttonText: {
    color: 'white',
    textTransform: 'none', // Disable automatic capitalization
    fontSize: 19,
  },
});

