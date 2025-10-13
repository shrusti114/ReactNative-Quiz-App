import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'Admin/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import Dashboard from './src/screens/Dashboard';

import TopBar from './src/components/TopBar';
import BottomBar from './src/components/BottomBar';
import CardItem from './src/components/CardItem';
import CustomButton from './src/components/CustomButton';
import InputField from './src/components/InputField';
import Loader from './src/components/Loader';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Admin Login' }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ title: 'Admin Dashboard' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
