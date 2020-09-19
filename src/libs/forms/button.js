import React from "react";
import { StyleSheet, Button, View, Platform } from "react-native";

const FormButton = props => (
  <View style={[styles.button, props.overrideStyle]}>
    <Button {...props} color={props.color} />
  </View>
);

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    marginTop: 10
  }
});
export default FormButton;
