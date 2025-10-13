// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./src/redux/store";

// Import your screens
import AdminDashboard from "./src/screens/AdminDashboard";
import DepartmentManagement from "./src/screens/DepartmentManagement";
import AdminLogin from "./src/screens/AdminLogin"; // optional

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AdminDashboard"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="DepartmentManagement" component={DepartmentManagement} />
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
