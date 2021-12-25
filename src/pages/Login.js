import React, { useState, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Context from '../store/Context';

export default function Login({ route, navigation }) {
  const { from = 'Home' } = route.params || {};
  // 密码输入框
  const $pwd = useRef(null);

  const { state, dispatch } = useContext(Context);

  const [email, onChangeEmail] = useState(null);
  const [password, onChangePWD] = useState(null);

  // 登录请求
  const request = async () => {
    const url = `${state.host}/api/v1/user/auth`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const { data, success } = res;
        if (!success) {
          return alert("用户名或密码错误");
        }
        const { token, username } = data;
        alert(`${username}: ${token}`);
        dispatch({
          type: 'SIGN_IN',
          payload: {
            token,
            username,
          }
        });
        AsyncStorage.setItem("userToken", token);
        navigation.replace(from, route.params);
      })
      .catch((e) => {
        // console.log(e);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.layout}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.logo}>暗号</Text>
            <Text style={styles.title}>登录</Text>
          </View>
          {/* 主内容 */}
          <View style={styles.main}>
            {/* 表单 */}
            <View style={styles.form}>
              <View style={styles.formItem}>
                <Text style={styles.label}>账户</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => onChangeEmail(text)}
                  value={email}
                  placeholder="手机号/Email"
                  returnKeyType="next"
                  clearButtonMode="while-editing"
                  onSubmitEditing={(e) => {
                    $pwd.current.focus();
                  }}
                />
              </View>
              <View style={styles.formItem}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                  textContentType="password"
                  style={styles.input}
                  onChangeText={(text) => onChangePWD(text)}
                  value={password}
                  secureTextEntry
                  ref={$pwd}
                />
              </View>
              <View style={styles.formItem}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={(e) => {
                    // alert(`${email}, ${password}`);
                    request();
                  }}
                >
                  <Text style={styles.btnText}>登录</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* 指示 */}
            <View style={styles.helper}>
              <Text style={styles.helperLabel}>还没有账户?</Text>
              <View style={styles.helperAction}>
                <Text
                  style={styles.helperText}
                  onPress={() => {
                    navigation.replace(from, route.params);
                  }}
                >
                  注册
                </Text>
                <Text style={styles.helperIcon}>→</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "stretch",
  },
  header: {
    flex: 1,
    paddingLeft: 32,
    paddingBottom: 32,
    backgroundColor: "rgb(24, 138, 107)",
    justifyContent: "flex-end",
  },
  bg: {
    width: "130%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  logo: {
    color: "#fff",
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 30,
  },
  main: {
    flex: 1,
    padding: 32,
    justifyContent: "space-between",
  },
  form: {},
  formItem: {
    marginBottom: 16,
  },
  label: {
    color: "rgb(149, 149, 149)",
    fontSize: 16,
  },
  input: {
    borderBottomColor: "rgb(190, 190, 190)",
    borderBottomWidth: 1,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
    color: "rgb(33, 33, 33)",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "rgb(25, 139, 109)",
    padding: 20,
    borderRadius: 6,
    marginTop: 8,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
  },
  helper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  helperLabel: {
    fontSize: 16,
    color: "#999",
  },
  helperAction: {
    flexDirection: "row",
  },
  helperText: {
    fontSize: 16,
    fontWeight: "500",
  },
  helperIcon: {},
});
