import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>
        Say goodbye to{' '}
        <Text style={styles.highlight}>seed phrases</Text>
      </Text>
      
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => navigation.navigate('MXEExplanation')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  mainText: {
    fontSize: 36,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 48,
  },
  highlight: {
    color: '#4ECDC4',
  },
  continueButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#4F7FFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;