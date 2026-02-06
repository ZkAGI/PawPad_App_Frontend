// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StatusBar } from 'react-native';
// import { RootStackParamList } from './src/types/navigation';

// // Import screens
// import OnboardingScreen from './src/screens/OnboardingScreen';
// import MXEExplanationScreen from './src/screens/MXEExplanationScreen';
// import QuickSummaryScreen from './src/screens/QuickSummaryScreen';
// import ChainSelectionScreen from './src/screens/ChainSelectionScreen';
// import EmailInputScreen from './src/screens/EmailInputScreen';
// import CreatingVaultScreen from './src/screens/CreatingVaultScreen';
// import VaultSuccessScreen from './src/screens/VaultSuccessScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import SwapScreen from './src/screens/SwapScreen';
// import VaultNameInputScreen from './src/screens/VaultNameInputScreen';
// import AgentPreferencesScreen from './src/screens/AgentPreferencesScreen';
// import AgentCreatingScreen from './src/screens/AgentCreatingScreen';
// import AgentDashboardScreen from './src/screens/AgentDashboardScreen';
// import FundWalletScreen from './src/screens/FundWalletScreen';
// import { VaultProvider } from './src/context/VaultContext';
// import RecoveryScreen from './src/screens/RecoveryScreen';
// import BackupScreen from './src/screens/BackupScreen';
// import SendScreen from './src/screens/SendScreen';
// import LendingScreen from './src/screens/LendingScreen';
// import DarkPoolScreen from './src/screens/DarkPoolScreen';
// import AgentSetupScreen from './src/screens/AgentSetupScreen';
// import CreatingSeedlessVaultScreen from './src/screens/CreatingSeedlessVaultScreen';
// import RecoverSeedlessVaultScreen from './src/screens/RecoverSeedlessVaultScreen';
// import TEESetupScreen from './src/screens/TeeSetupScreen';
// import RecoverTEEWalletScreen from './src/screens/RecoverTEEWalletScreen';
// import TEELoginScreen from './src/screens/TeeLoginScreen';

// const Stack = createNativeStackNavigator<RootStackParamList>();

// function App() {
//   return (
//     <VaultProvider>
//     <NavigationContainer>
//       <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
//       <Stack.Navigator
//         initialRouteName="Onboarding"
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: '#0a0a0a',
//           },
//           headerTintColor: '#fff',
//           headerTitleStyle: {
//             fontWeight: '600',
//           },
//         }}
//       >
//         <Stack.Screen
//           name="Onboarding"
//           component={OnboardingScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MXEExplanation"
//           component={MXEExplanationScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="QuickSummary"
//           component={QuickSummaryScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="Send" component={SendScreen}  options={{ headerShown: false }}/>
//         <Stack.Screen name="Lending" component={LendingScreen} options={{ headerShown: false }}/>
// <Stack.Screen name="DarkPool" component={DarkPoolScreen} options={{ headerShown: false }}/>
// <Stack.Screen name="AgentDashboard" component={AgentDashboardScreen} options={{ headerShown: false }}/>
//         <Stack.Screen
//           name="ChainSelection"
//           component={ChainSelectionScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="EmailInput"
//           component={EmailInputScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="CreatingVault"
//           component={CreatingVaultScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="VaultSuccess"
//           component={VaultSuccessScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="VaultNameInput"
//           component={VaultNameInputScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="AgentPreferences"
//           component={AgentPreferencesScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="AgentCreating"
//           component={AgentCreatingScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="FundWallet"
//           component={FundWalletScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Swap"
//           component={SwapScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="CreatingSeedlessVault"
//           component={CreatingSeedlessVaultScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="RecoverSeedlessVault"
//           component={RecoverSeedlessVaultScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen 
//   name="TEELogin" 
//   component={TEELoginScreen} 
//   options={{ headerShown: false }} 
// />
//         <Stack.Screen 
//   name="RecoverTEEWallet" 
//   component={RecoverTEEWalletScreen} 
//   options={{ headerShown: false }}
// />
//         <Stack.Screen 
//   name="TEESetup" 
//   component={TEESetupScreen} 
//   options={{ headerShown: false }}
// />
//         <Stack.Screen
//           name="AgentSetup"
//           component={AgentSetupScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="Recovery" component={RecoveryScreen} />
//         <Stack.Screen name="Backup" component={BackupScreen} options={{ headerShown: false }}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//     </VaultProvider>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './src/types/navigation';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import MXEExplanationScreen from './src/screens/MXEExplanationScreen';
import QuickSummaryScreen from './src/screens/QuickSummaryScreen';
import ChainSelectionScreen from './src/screens/ChainSelectionScreen';
import EmailInputScreen from './src/screens/EmailInputScreen';
import CreatingVaultScreen from './src/screens/CreatingVaultScreen';
import VaultSuccessScreen from './src/screens/VaultSuccessScreen';
import HomeScreen from './src/screens/HomeScreen';
import SwapScreen from './src/screens/SwapScreen';
import VaultNameInputScreen from './src/screens/VaultNameInputScreen';
import AgentPreferencesScreen from './src/screens/AgentPreferencesScreen';
import AgentCreatingScreen from './src/screens/AgentCreatingScreen';
import AgentDashboardScreen from './src/screens/AgentDashboardScreen';
import FundWalletScreen from './src/screens/FundWalletScreen';
import { VaultProvider } from './src/context/VaultContext';
import RecoveryScreen from './src/screens/RecoveryScreen';
import BackupScreen from './src/screens/BackupScreen';
import SendScreen from './src/screens/SendScreen';
import LendingScreen from './src/screens/LendingScreen';
import DarkPoolScreen from './src/screens/DarkPoolScreen';
import AgentSetupScreen from './src/screens/AgentSetupScreen';
import CreatingSeedlessVaultScreen from './src/screens/CreatingSeedlessVaultScreen';
import RecoverSeedlessVaultScreen from './src/screens/RecoverSeedlessVaultScreen';
import TEESetupScreen from './src/screens/TeeSetupScreen';
import RecoverTEEWalletScreen from './src/screens/RecoverTEEWalletScreen';
import TEELoginScreen from './src/screens/TeeLoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ════════════════════════════════════════════════════════════════════════════
// SPLASH SCREEN (shown while checking for existing wallet)
// ════════════════════════════════════════════════════════════════════════════
const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color="#33E6BF" />
  </View>
);

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#02111B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ════════════════════════════════════════════════════════════════════════════
// APP COMPONENT
// ════════════════════════════════════════════════════════════════════════════
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Onboarding');

  useEffect(() => {
    checkExistingWallet();
  }, []);

  const checkExistingWallet = async () => {
    try {
      // Check if user has an existing TEE wallet
      const teeWallet = await AsyncStorage.getItem('tee_wallet');
      
      if (teeWallet) {
        const wallet = JSON.parse(teeWallet);
        // Has TEE wallet → Go to Login screen
        if (wallet?.tee?.uid || wallet?.vault_id) {
          console.log('[App] Found existing TEE wallet, redirecting to login');
          setInitialRoute('TEELogin');
        } else {
          // Wallet data incomplete → Go to onboarding
          console.log('[App] Wallet data incomplete, showing onboarding');
          setInitialRoute('Onboarding');
        }
      } else {
        // Check for other wallet types
        const activeWalletType = await AsyncStorage.getItem('active_wallet_type');
        
        if (activeWalletType === 'seedless') {
          // Has seedless wallet → Could add SeedlessLoginScreen here
          console.log('[App] Found seedless wallet');
          setInitialRoute('Onboarding'); // Or a seedless login screen
        } else {
          // No wallet → Show onboarding
          console.log('[App] No wallet found, showing onboarding');
          setInitialRoute('Onboarding');
        }
      }
    } catch (error) {
      console.error('[App] Error checking wallet:', error);
      setInitialRoute('Onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  // Show splash screen while checking
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <VaultProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#02111B" />
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#02111B',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          {/* ════════════════════════════════════════════════════════════════ */}
          {/* ONBOARDING FLOW */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MXEExplanation"
            component={MXEExplanationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QuickSummary"
            component={QuickSummaryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChainSelection"
            component={ChainSelectionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EmailInput"
            component={EmailInputScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VaultNameInput"
            component={VaultNameInputScreen}
            options={{ headerShown: false }}
          />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* TEE WALLET FLOW */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <Stack.Screen
            name="TEELogin"
            component={TEELoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TEESetup"
            component={TEESetupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RecoverTEEWallet"
            component={RecoverTEEWalletScreen}
            options={{ headerShown: false }}
          />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* SEEDLESS WALLET FLOW */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <Stack.Screen
            name="CreatingSeedlessVault"
            component={CreatingSeedlessVaultScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RecoverSeedlessVault"
            component={RecoverSeedlessVaultScreen}
            options={{ headerShown: false }}
          />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* VAULT CREATION */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <Stack.Screen
            name="CreatingVault"
            component={CreatingVaultScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VaultSuccess"
            component={VaultSuccessScreen}
            options={{ headerShown: false }}
          />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* MAIN APP */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Send"
            component={SendScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Swap"
            component={SwapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FundWallet"
            component={FundWalletScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Lending"
            component={LendingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DarkPool"
            component={DarkPoolScreen}
            options={{ headerShown: false }}
          />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* AGENT */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <Stack.Screen
            name="AgentSetup"
            component={AgentSetupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AgentPreferences"
            component={AgentPreferencesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AgentCreating"
            component={AgentCreatingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AgentDashboard"
            component={AgentDashboardScreen}
            options={{ headerShown: false }}
          />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* BACKUP & RECOVERY */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <Stack.Screen
            name="Recovery"
            component={RecoveryScreen}
          />
          <Stack.Screen
            name="Backup"
            component={BackupScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </VaultProvider>
  );
}

export default App;