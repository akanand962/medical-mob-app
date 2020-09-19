import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from "react-native";

import Logo from "../components/logo";
import LoginForm from "../components/loginComponent";
import { setItems, getRefreshToken } from "../libs/storage";
import { connect } from "react-redux";
import { autoSignIn } from "../store/actions/user_actions";
import { bindActionCreators } from "redux";
class AuthComponent extends React.Component {
  constructor(props) {
    super(props);
    // console.disableYellowBox = true;
    this.state = {
      loading: true
    };
  }
  componentDidMount() {
    getRefreshToken().then(refreshToken => {
      if (refreshToken == null) {
        this.setState({ loading: false });
      } else {
        this.props
          .autoSignIn(refreshToken)
          .then(() => {
            if (!this.props.User.auth.token) {
              this.setState({ loading: false });
            } else {
              setItems(this.props.User.auth).then(() => this.goNext());
            }
          })
          .catch(err => console.log(err));
      }
    });
  }

  goNext = () => {
    if (this.props.User.auth.isNewUser) {
      this.props.navigation.navigate("UpdateUser");
    } else {
      this.props.navigation.navigate("App");
    }
  };
  goToForgotPassword = () => {
    this.props.navigation.navigate("ForgotPassword");
  };
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          <Logo />
          <LoginForm
            goNext={this.goNext}
            goToForgotPassword={this.goToForgotPassword}
          />
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 50
  },
  loading: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
const mapStateToProps = state => {
  return {
    User: state.User
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ autoSignIn }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
