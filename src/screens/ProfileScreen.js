import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import FormButton from "../libs/forms/button";
import COLOR from "../constants/Colors";
import { removeItems } from "../libs/storage";
import * as firebase from "firebase";
import UpdateDetailsForm from "../components/updateDetails";
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
  }
  logOut = () => {
    removeItems()
      .then(() => {
        firebase.auth().signOut();
        this.props.navigation.navigate("Auth");
      })
      .catch(err => console.log(err));
  };
  goNext = () => {
    alert('your details are updated');
  };
  render() {
    return (
      <View style={styles.container}>
      <UpdateDetailsForm goNext={this.goNext} />
        <FormButton
          title="Sign out"
          onPress={this.logOut}
        />
      </View>
    );
  }
}

ProfileScreen.navigationOptions = navData => {
  return {
    headerTitle: "Profile Screen"
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 50,
  }
});

export default ProfileScreen;
