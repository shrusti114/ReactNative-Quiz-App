import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";

import store from "./src/redux/store";
import AdminLogin from "./src/screens/AdminLogin";
import AdminDashboard from "./src/screens/AdminDashboard";
import DepartmentManagement from "./src/screens/DepartmentManagement";
import SubjectManagement from "./src/screens/SubjectManagement";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AdminLogin"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="DepartmentManagement" component={DepartmentManagement} /> 
          <Stack.Screen name="SubjectManagement" component={SubjectManagement} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
