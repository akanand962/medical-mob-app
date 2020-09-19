import React from "react";
import { Text, View, StyleSheet, Alert, Platform } from "react-native";
import { Spinner } from "reactstrap";
import Input from "../libs/forms/input";
import FormButton from "../libs/forms/button";
import ValidationRules from "../libs/forms/validateRules";
import { connect } from "react-redux";
import {
  signIn,
  signUp,
  signInWithFacebook,
  signInWithGoogle
} from "../store/actions/user_actions";
import { bindActionCreators } from "redux";
import { setItems } from "../libs/storage";
import COLOR from "../constants/Colors";


class LoginCoponent extends React.Component {
  state = {
    loading:false,
    type: "Login",
    action: "Login",
    disabledActionButton: false,
    actionMode: "New here? Create",
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
      },
      password: {
        value: "",
        valid: false,
        type: "textinput",
        rules: {
          isRequired: true,
          minLength: 6
        }
      },
      confirmPassword: {
        value: "",
        valid: false,
        type: "textinput",
        rules: {
          confirmPass: "password"
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
  confirmPassword = () => {
    return this.state.type !== "Login" ? (
      <Input
        placeholder="Confirm your password"
        placeholderTextColor="#cecece"
        type={this.state.form.confirmPassword.type}
        value={this.state.form.confirmPassword.value}
        onChangeText={value => this.updateInput("confirmPassword", value)}
        secureTextEntry
      />
    ) : null;
  };
  changeFormType = () => {
    this.setState({ hasErrors: false });
    const type = this.state.type;
    let newState = this.state;
    newState.type = type === "Login" ? "Register" : "Login";
    newState.action = type === "Login" ? "Register" : "Login";
    newState.actionMode =
      type === "Login" ? "Have an account?" : "New here? Create";
    this.setState(newState);
    this.setState({loading:true});
  };
  manageAccess = () => {
    if (!this.props.User.auth.uid) {
      let error = "";
      if (this.props.User.auth.error === "EMAIL_NOT_FOUND") {
        error = "email id is not valid";
      } else if (this.props.User.auth.error === "INVALID_PASSWORD") {
        error = "password is not valid";
      } else if (this.props.User.auth.error === "EMAIL_EXISTS") {
        error = "email is already exists";
      } else {
        console.log(this.props.User);
        error = this.props.User.auth.error || "Something went wrong, try again";
      }
      this.setState({
        hasErrors: true,
        error: error
      });
    } else {
      setItems(this.props.User.auth).then(() => {
        this.setState({ hasErrors: false });
        this.props.goNext();
      });
    }
  };
  submitUser = () => {
    let isFormValid = true;
    let formToSubmit = {};
    let formError = "";
    const formCopy = this.state.form;
    for (let key in formCopy) {
      if (this.state.type === "Login") {
        if (key !== "confirmPassword") {
          if (!formCopy[key].valid && isFormValid) {
            isFormValid = false;
            formError = key + " is not valid";
          } else {
            formToSubmit[key] = formCopy[key].value;
          }
        }
      } else {
        if (!formCopy[key].valid && isFormValid) {
          isFormValid = false;
          formError = key + " is not valid";
        } else {
          formToSubmit[key] = formCopy[key].value;
        }
      }
    }
    if (isFormValid) {
      this.setState({
        actionButtonDisabled: true
      });
      if (this.state.type === "Login") {
        this.props
          .signIn(formToSubmit)
          .then(res => {
            this.manageAccess();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.props
          .signUp(formToSubmit)
          .then(() => {
            this.manageAccess();
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else {
      this.setState({
        error: formError,
        hasErrors: true
      });
    }
  };
  showSocialLoginButton = () => {
    return this.state.type === "Login" ? (
      <View>
        
        <FormButton
          title="Sign in with Facebook"
          color={Platform.select({ ios: COLOR.white, android: COLOR.blue })}
          overrideStyle={{ backgroundColor: COLOR.blue }}
          onPress={this.facebookLogin}
        />
        <FormButton
          title="Sign in with Google"
          color={COLOR.red}
          color={Platform.select({ ios: COLOR.white, android: COLOR.red })}
          overrideStyle={{ backgroundColor: COLOR.red }}
          onPress={this.googleLogin}
          >
            {this.googleLogin ? <Spinner/>:"Sign in with Google"}
          </FormButton>

      </View>
    ) : null;
  };
  facebookLogin = () => {
    this.setState({ hasErrors: false });
    this.props
      .signInWithFacebook()
      .then(() => this.manageAccess())
      .catch(err => console.log(err));
  };
  googleLogin = async () => {
    this.setState({ hasErrors: false });
    this.props
      .signInWithGoogle()
      .then(() => this.manageAccess())
      .catch(err => console.log(err));
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
        <Input
          placeholder="Enter password"
          placeholderTextColor="#cecece"
          type={this.state.form.password.type}
          value={this.state.form.password.value}
          onChangeText={value => this.updateInput("password", value)}
          secureTextEntry
        />
        {this.confirmPassword()}
        {this.formHasError()}

        <FormButton
          title={this.state.action}
          onPress={this.submitUser}
          disabled={this.state.disabledActionButton}
          overrideStyle={{ backgroundColor: COLOR.primary }}
          color={Platform.select({ ios: COLOR.white, android: COLOR.primary })}
        />
        <FormButton
          title={this.state.actionMode}
          onPress={this.changeFormType}
        />
        <FormButton
          title="Forgot Password?"
          onPress={() => this.props.goToForgotPassword()}
        />
        {this.showSocialLoginButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#fff"
  },
  errorLabel: {
    color: "#f44336",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16
  }
});
const mapStateToProps = state => {
  return {
    User: state.User
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { signIn, signUp, signInWithFacebook, signInWithGoogle },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginCoponent);
