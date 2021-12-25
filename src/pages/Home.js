import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import List from '../components/List';

import Context from '../store/Context';

export default function Home({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const { state, dispatch } = useContext(Context);

  return (
    <View style={styles.layout}>
      <View
        style={{
          ...styles.content,
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
        }}
      >
        {state.userToken ? (
          <View style={styles.nav}>
            <Text
              style={{ padding: 20 }}
              onPress={() => {
                navigation.navigate("Setting");
              }}
            >
              设置
            </Text>
            <Text
              style={{ padding: 20 }}
              onPress={() => {
                dispatch({
                  type: "SIGN_OUT",
                });
              }}
            >
              登出
            </Text>
          </View>
        ) : (
          <View style={styles.nav}>
            <Text
              style={{ padding: 20 }}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              登录
            </Text>
          </View>
        )}
        <List key={state.host} route={route} navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});
