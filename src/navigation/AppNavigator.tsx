import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import VaultSetupScreen from '../screens/VaultSetupScreen';
import VaultCreationScreen from '../screens/VaultCreationScreen';
import HomeScreen from '../screens/HomeScreen';
import TEEWalletCreatedScreen from '../screens/TeeWalletCreatedScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0A1628' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="VaultSetup" component={VaultSetupScreen} />
        <Stack.Screen name="VaultCreation" component={VaultCreationScreen} />
        <Stack.Screen 
          name="TEEWalletCreated" 
          component={TEEWalletCreatedScreen}
          options={{
            gestureEnabled: false, // Prevent back swipe
          }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
