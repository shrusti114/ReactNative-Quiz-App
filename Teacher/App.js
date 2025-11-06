import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import store from "../Teacher/src/redux/storec";
import TeacherLogin from "./src/screens/TeacherLogin";
import TeacherDashboard from "./src/screens/TeacherDashboard"; // ✅ you can create this

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TeacherLogin"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="TeacherLogin" component={TeacherLogin} />
          <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
