import React from "react";
import { StyleSheet, View, Text } from "react-native";
export default function Start() {
  return (
    <View style={styles.layout}>
      <Text>
        Start
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
