import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import VaultShareAnimation from '../components/VaultShareAnimation';

const MXEExplanationScreen = () => {
  const [step, setStep] = useState(0);
  const navigation = useNavigation();

  const steps = [
    {
      title: 'Say hello to vault shares,\nyour new recovery method',
      animation: 'vault-shares-intro',
      description: 'No more writing down 12-24 word phrases',
    },
    {
      title: "They're split into different\nparts for increased\nsecurity, removing single-\npoint of failure",
      animation: 'vault-shares-split',
      description: 'Your private key never exists in one place',
    },
    {
      title: 'Each device in your vault\nholds one vault share',
      animation: 'device-shares',
      description: 'Multiple devices = Multiple security layers',
    },
    {
      title: 'Recover your vault even if\na device is lost or damaged',
      animation: 'recovery',
      description: 'Need only 2 of 3 shares to recover',
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigation.navigate('QuickSummary');
    }
  };

  const handleSkip = () => {
    navigation.navigate('QuickSummary');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              { backgroundColor: index <= step ? '#4ECDC4' : '#374151' },
            ]}
          />
        ))}
      </View>

      {/* Animation */}
      <View style={styles.animationContainer}>
        <VaultShareAnimation type={currentStep.animation} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.description}>{currentStep.description}</Text>
      </View>

      {/* Next button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  skipButton: {
    color: '#6B7280',
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    left: 24,
    backgroundColor: '#4ECDC4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
  },
});

export default MXEExplanationScreen;