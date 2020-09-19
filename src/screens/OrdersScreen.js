import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  Text,
  ActivityIndicator
} from "react-native";
import { ListItem } from "../libs/forms/listItem";
import Colors from "../constants/Colors";
import { findUserOrders } from "../store/actions/order_actions";
import { getEmail } from "../libs/storage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class OrdersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      orders: []
    };
  }
  componentDidMount() {
    getEmail()
      .then(email => {
        if(email){
          this.getOrders(email);
        }
      })
      .catch(err => console.log(err));
  }

  getOrders = email => {
    this.props
      .findUserOrders(email)
      .then(() => {
        this.setState({
          loading: false,
          refreshing: false
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  };
  orderDetailHandler = itemId => {
    this.props.navigation.navigate("OrderDetailScreen", { itemId });
  };

  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          size="large"
          style={styles.infoContainer}
          color={Colors.primary}
        />
      );
    } else {
      if (this.props.Order.orders.length > 0) {
        return (
          <SafeAreaView style={styles.container}>
            <FlatList
              onRefresh={() => {
                this.setState({
                  refreshing: true
                });
                getEmail()
                  .then(email => {
                    this.getOrders(email);
                  })
                  .catch(err => console.log(err));
              }}
              refreshing={this.state.refreshing}
              data={this.props.Order.orders}
              renderItem={({ item }) => (
                <ListItem
                  item={item}
                  onPress={() => this.orderDetailHandler(item.id)}
                />
              )}
              keyExtractor={item => item.id}
            />
          </SafeAreaView>
        );
      } else {
        return (
          <View style={styles.infoContainer}>
            <Text style={styles.title}>No order found</Text>
          </View>
        );
      }
    }
  }
}

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: "Orders Screen"
  };
};

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent:'space-evenly',
    width: "100%"
  },
  title: {
    fontSize: 30
  }
});

const mapStateToProps = state => {
  return {
    Order: state.Order
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ findUserOrders }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersScreen);
