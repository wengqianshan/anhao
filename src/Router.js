import React, { useEffect, useContext, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Context from './store/Context';
import { setHost } from './utils/request';
import IconFont from "./iconfont";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Setting from './pages/Setting';

const Stack = createStackNavigator();

export default function Router() {

  const { state, dispatch } = useContext(Context);

  const [ready, setReady] = useState(false);

  // 在入口读取本地 token
  useEffect(() => {
    const init = async () => {
      let token;
      let host;
      try {
        token = await AsyncStorage.getItem("userToken");
        host = (await AsyncStorage.getItem("host")) || state.host;
        setHost(host);
      } catch(e) {
      }
      dispatch({
        type: "INIT_CONFIG",
        payload: {
          token,
          host,
        },
      });
      setReady(true);
    };
    init();
  }, []);

  if (!ready) {
    return <Text>初始化中</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={({ navigation, route }) => ({
            title: route.params.title,
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <IconFont color="#eee" size={24} name="back" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
