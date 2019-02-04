import React from "react";
import { Text, View, StyleSheet } from "react-native";

const Header = () => (
  <View style={{ flexDirection: "row" }}>
    <Text style={[styles.header, { color: "#E64C3C" }]}>c</Text>
    <Text style={[styles.header, { color: "#E57E31" }]}>o</Text>
    <Text style={[styles.header, { color: "#F1C431" }]}>l</Text>
    <Text style={[styles.header, { color: "#68CC73" }]}>o</Text>
    <Text style={[styles.header, { color: "#3998DB" }]}>r</Text>
    <Text style={styles.header}>blinder</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 55,
    color: "#ecf0f1",
    fontFamily: "dogbyte"
  }
});

export { Header };
