import React from 'react';
import { View, StyleSheet } from 'react-native';

interface VaultShareAnimationProps {
  type: string;
}

const VaultShareAnimation: React.FC<VaultShareAnimationProps> = ({ type }) => {
  // Placeholder for animations
  return (
    <View style={styles.container}>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 150,
    height: 150,
    backgroundColor: '#1a1a1a',
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
});

export default VaultShareAnimation;