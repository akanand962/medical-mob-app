import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import UpdateDetailsForm from "../components/updateDetails";
import Logo from "../components/logo";

class UpdateDetails extends React.Component {
  goNext = () => {
    this.props.navigation.navigate("App");
  };
  render() {
    return (
      <ScrollView style={styles.container}>
        <Logo />
        <View>
          <UpdateDetailsForm goNext={this.goNext} />
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

export default UpdateDetails;
