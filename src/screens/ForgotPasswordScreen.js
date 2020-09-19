import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from "react-native";
import FormButton from "../libs/forms/button";
import ForgotPasswordForm from "../components/forgotPassword";
import Logo from "../components/logo";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  goBack =() => {
    this.props.navigation.navigate("Login");
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <Logo />
        <View>
          <ForgotPasswordForm goBack={this.goBack} />
          <FormButton
            overrideStyle={{ marginTop: 20 }}
            title="Sign In"
            onPress={() => this.props.navigation.navigate("Login")}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 50
  }
});

export default ForgotPassword;
