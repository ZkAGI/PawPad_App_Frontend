// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StatusBar } from 'react-native';

// // Import screens
// import OnboardingScreen from './src/screens/OnboardingScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import SwapScreen from './src/screens/SwapScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <>
//       <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="Onboarding"
//           screenOptions={{
//             headerStyle: { backgroundColor: '#0a0a0a' },
//             headerTintColor: '#fff',
//             headerTitleStyle: { fontWeight: 'bold' },
//             contentStyle: { backgroundColor: '#0a0a0a' },
//           }}
//         >
//           <Stack.Screen 
//             name="Onboarding" 
//             component={OnboardingScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen 
//             name="Home" 
//             component={HomeScreen}
//             options={{ title: 'PawPad' }}
//           />
//           <Stack.Screen 
//             name="Swap" 
//             component={SwapScreen}
//             options={{ title: 'Cross-Chain Swap' }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </>
//   );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
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

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <VaultProvider>
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0a0a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
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
        <Stack.Screen name="Send" component={SendScreen} />
        <Stack.Screen name="Lending" component={LendingScreen} />
<Stack.Screen name="DarkPool" component={DarkPoolScreen} />
<Stack.Screen name="AgentDashboard" component={AgentDashboardScreen} />
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
          name="CreatingVault"
          component={CreatingVaultScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VaultSuccess"
          component={VaultSuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'PawPad' }}
        />
        <Stack.Screen
          name="VaultNameInput"
          component={VaultNameInputScreen}
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
          name="FundWallet"
          component={FundWalletScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Swap"
          component={SwapScreen}
          options={{ title: 'Cross-Chain Swap' }}
        />
        <Stack.Screen
  name="AgentSetup"
  component={AgentSetupScreen}
  options={{ headerShown: false }}
/>
        <Stack.Screen name="Recovery" component={RecoveryScreen} />
<Stack.Screen name="Backup" component={BackupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </VaultProvider>
  );
}

export default App;