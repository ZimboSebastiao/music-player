import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { name as appName } from "./app.json";

import Inicial from "./src/screens/Inicial";
import Music from "./src/screens/Music";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={estilos.containerSafe}>
        <StatusBar />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Music">
            <Stack.Screen
              name="Inicial"
              component={Inicial}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Music"
              component={Music}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

const estilos = StyleSheet.create({
  containerSafe: {
    flex: 1,
    backgroundColor: "#0e0d0d",
  },
});

AppRegistry.registerComponent(appName, () => App);
