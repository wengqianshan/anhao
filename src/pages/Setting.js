import React, { useContext } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

import Context from '../store/Context';

import { setHost } from '../utils/request';

export default function Setting() {

  const { state, dispatch } = useContext(Context);

  return (
    <View style={styles.layout}>
      <View style={styles.row}>
        <Text>当前 token: {state.userToken}</Text>
      </View>
      <View style={styles.row}>
        <Text>当前 host: {state.host}</Text>
      </View>
      <View style={styles.row}>
        <Button
          title="设置本地"
          onPress={() => {
            setHost("http://192.168.31.41:7000");
            dispatch({
              type: "SET_HOST",
              payload: {
                host: "http://192.168.31.41:7000",
              },
            });
          }}
        />
      </View>
      <View style={styles.row}>
        <Button
          title="设置线上"
          onPress={() => {
            setHost("https://wenglou.com");
            dispatch({
              type: "SET_HOST",
              payload: {
                host: "https://wenglou.com",
              },
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  row: {
    marginBottom: 12,
  }
});
