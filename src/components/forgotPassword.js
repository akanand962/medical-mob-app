import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Input from "../libs/forms/input";
import FormButton from "../libs/forms/button";
import COLOR from "../constants/Colors";
import ValidationRules from "../libs/forms/validateRules";
import { sendResetPasswordMail } from "../store/actions/user_actions";

class ForgotPasswordCoponent extends React.Component {
  state = {
    type: "Forgot",
    action: "Submit",
    hasErrors: false,
    error: "Something went wrong",
    form: {
      email: {
        value: "",
        valid: false,
        type: "textinput",
        rules: {
          isRequired: true,
          isEmail: true
        }
      }
    }
  };
  formHasError = () => {
    return this.state.hasErrors ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorLabel}> {this.state.error}</Text>
      </View>
    ) : null;
  };
  updateInput = (name, value) => {
    this.setState({
      hasErrors: false
    });
    let formCopy = this.state.form;
    formCopy[name].value = value;
    formCopy[name].valid = ValidationRules(
      value,
      formCopy[name].rules,
      formCopy
    );
    this.setState({
      form: formCopy
    });
  };
  submitUser = () => {
    if (!this.state.form.email.valid) {
      this.setState({
        error: "Email is not valid",
        hasErrors: true
      });
    } else {
      this.setState({ hasErrors: false });
      this.forgotPassword();
    }
  };
  forgotPassword = () => {
    this.props
      .sendResetPasswordMail({ email: this.state.form.email.value })
      .then(() => {
        if (this.props.User.info.success) {
          alert(this.props.User.info.message);
        } else {
          this.setState({
            error: this.props.User.info.message,
            hasErrors: true
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <View>
        <Input
          placeholder="Enter email"
          placeholderTextColor="#cecece"
          type={this.state.form.email.type}
          value={this.state.form.email.value}
          keyboardType={"email-address"}
          autoCapitalize={"none"}
          onChangeText={value => this.updateInput("email", value)}
        />
        {this.formHasError()}
        <FormButton
          title={this.state.action}
          onPress={this.submitUser}
          overrideStyle={{ backgroundColor: COLOR.primary, marginTop: 20 }}
          color={Platform.select({ios:COLOR.white,android:COLOR.primary})}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  errorContainer: {
    marginTop: 30,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f44336"
  },
  errorLabel: {
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20
  }
});
const mapStateToProps = state => {
  return {
    User: state.User
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ sendResetPasswordMail }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordCoponent);
