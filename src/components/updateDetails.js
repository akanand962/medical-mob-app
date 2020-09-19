import React from "react";
import { Text, View, StyleSheet,Platform } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Input from "../libs/forms/input";
import FormButton from "../libs/forms/button";
import COLOR from "../constants/Colors";
import ValidationRules from "../libs/forms/validateRules";
import {
  updateUserDetails,
  findUserInDatabase
} from "../store/actions/user_actions";
import { getEmail } from "../libs/storage";
class UpdateDetailsCoponent extends React.Component {
  state = {
    type: "update",
    action: "Submit",
    hasErrors: false,
    email: "",
    error: "Something went wrong, try again",
    form: {
      healthCardNumber: {
        value: "",
        valid: false,
        type: "textinput",
        rules: {
          isRequired: true,
          isHealthCardNumber: true
        }
      },
      address: {
        value: "",
        valid: false,
        type: "textinput",
        rules: {
          isRequired: true
        }
      }
    }
  };
  componentDidMount() {
    getEmail()
      .then(email => {
        this.setState({ email });
        this.getUser(email);
      })
      .catch(err => console.log(err));
  }
  getUser = email => {
    findUserInDatabase(email)
      .then(user => {
        if (user.exists) {
          if (user.data().healthCardNumber) {
            this.updateInput("healthCardNumber", user.data().healthCardNumber);
          }
          if (user.data().address) {
            this.updateInput("address", user.data().address);
          }
        }
      })
      .catch(console.log);
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
    if (!this.state.form.healthCardNumber.valid) {
      this.setState({
        error: "Health card number is not valid",
        hasErrors: true
      });
    } else if (!this.state.form.address.valid) {
      this.setState({
        error: "Address is not valid",
        hasErrors: true
      });
    } else {
      this.setState({ hasErrors: false });
      this.props
        .updateUserDetails({
          healthCardNumber: this.state.form.healthCardNumber.value,
          address: this.state.form.address.value,
          email: this.state.email
        })
        .then(() => this.props.goNext())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <View>
        <Input
          placeholder="Enter health card number"
          placeholderTextColor="#cecece"
          type={this.state.form.healthCardNumber.type}
          value={this.state.form.healthCardNumber.value}
          autoCapitalize={"none"}
          onChangeText={value => this.updateInput("healthCardNumber", value)}
        />
        <Input
          placeholder="Enter address"
          placeholderTextColor="#cecece"
          type={this.state.form.address.type}
          value={this.state.form.address.value}
          autoCapitalize={"none"}
          autoCorrect={false}
          multiline
          numberOfLines={6}
          overrideStyle={{
            height: 150,
            borderWidth: 1,
            borderColor: "#cecece"
          }}
          onChangeText={value => this.updateInput("address", value)}
        />
        {this.formHasError()}
        <FormButton
          title={this.state.action}
          onPress={this.submitUser}
          color={Platform.select({ios:COLOR.white,android:COLOR.primary})}
           overrideStyle={{ backgroundColor: COLOR.primary }}
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
  return bindActionCreators({ updateUserDetails }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateDetailsCoponent);
