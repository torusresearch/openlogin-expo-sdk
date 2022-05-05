import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import OpenLogin, { LoginProvider, Network } from "openlogin-expo-sdk";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import { URL } from "react-native-url-polyfill";
import * as WebBrowser from "expo-web-browser";

const scheme = "openloginexposdkexampleexpo";

const resolvedRedirectUrl =
  Constants.appOwnership == AppOwnership.Expo ||
  Constants.appOwnership == AppOwnership.Guest
    ? new URL(Linking.createURL("openlogin", {}))
    : new URL(Linking.createURL("openlogin", { scheme: scheme }));

export default function App() {
  const [key, setKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const login = async () => {
    try {
      const openlogin = new OpenLogin(WebBrowser, {
        clientId:
          "BC5bANkU4-fil7C5s1uKzRfF0VGqbuaxDQiLnQ8WgF7SEA32lGegAhu7dk4dZf3Rk397blIvfWytXwsRvs9dOaQ",
        network: Network.TESTNET,
      });
      const state = await openlogin.login({
        loginProvider: LoginProvider.GOOGLE,
        redirectUrl: resolvedRedirectUrl,
      });
      setKey(state.privKey || "no key");
    } catch (e) {
      console.error(e);
      setErrorMsg(String(e));
    }
  };
  return (
    <View style={styles.container}>
      <Text>Key: {key}</Text>
      <Text>Error: {errorMsg}</Text>
      <Text>Linking URL: {resolvedRedirectUrl.href}</Text>
      <Text>appOwnership: {Constants.appOwnership}</Text>
      <Text>executionEnvironment: {Constants.executionEnvironment}</Text>
      <Button title="Login with OpenLogin" onPress={login} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
