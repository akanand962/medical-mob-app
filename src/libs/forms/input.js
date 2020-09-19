import React from "react";
import { StyleSheet, TextInput } from "react-native";

const Input = props => {
  let templete = null;
  switch (props.type) {
    case "textinput":
      templete = (
        <TextInput {...props} style={[style.input, props.overrideStyle]} />
      );
      break;
    default:
      return templete;
  }
  return templete;
};

const style = StyleSheet.create({
    input:{
        width:'100%',
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        fontSize:20,
        padding:5,
        marginTop:10
    }
})
export default Input;
