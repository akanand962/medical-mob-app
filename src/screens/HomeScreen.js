import React from "react";

import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView,Platform} from "react-native";

import AddPrescCard from "../components/AddPrescCard";
import {ListItem} from "../libs/forms/listItem";
import Colors from "../constants/Colors";
import { registerForPushNotifications } from "../store/actions/user_actions";
import {findUserOrders} from "../store/actions/order_actions"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getEmail, removeItems } from "../libs/storage";
import { Notifications } from "expo";


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      loading: true,
      refreshing: false,
      orders: [],
      topOrders: []
    }
  }
  componentDidMount() {
    getEmail()
      .then(email => {
        if (email) {
           this.getOrders(email);
          this.props
            .registerForPushNotifications(email)
            .catch(err => console.log(err));
        } else {
          removeItems().then(() => this.props.navigation.navigate("Auth"));
        }
      })
      .catch(err => {
        console.log(err);
      });
    this._notificationSubscription = Notifications.addListener(
      this.handleNotification
    );
  }
   getOrders = email => {
    this.props
      .findUserOrders(email)
      .then(() => {
        const topThree = [];
        topThree.push(...this.props.Order.orders.slice(0,3))
        this.setState({
          loading: false,
          refreshing: false,
          topOrders: topThree
        });
        
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  };
  handleNotification = notification => {
    if (notification.data.orderId) {
      this.props.navigation.navigate("OrderDetailScreen", {
        itemId: notification.data.orderId
      });
    }
  };
  addPressHandler = () => {
    if(this.state.refreshing === true){
      this.setState({
        refreshing: false
      })
    }
    this.props.navigation.navigate("UploadScreen");
  };

  orderDetailHandler = itemId => {
    this.props.navigation.navigate("OrderDetailScreen", { itemId });
  };

  render() {
    if(this.state.loading) {
      return (
        <View style={styles.container}>
          <AddPrescCard style={styles.cardStyle} onAddPress={this.addPressHandler}/>
          <Text>Recent Orders:</Text>
          <ActivityIndicator
            size="large"
            style={styles.infoContainer}
            color={Colors.primary}
          />
        </View>
      );
    }
    else {
      if(this.props.Order.orders.length > 0){
        return (
          <View style={styles.container}>
            <AddPrescCard style={styles.cardStyle} onAddPress={this.addPressHandler} />
            <Text>Recent Orders:</Text>
            <View style={styles.listContainer}>
              <FlatList
                onRefresh={()=>{
                  this.setState({
                    refreshing: true
                  })
                  getEmail()
                    .then(email => {
                      this.getOrders(email);
                    })
                    .catch(err => console.log(err));
                }}
                refreshing={this.state.refreshing}
                data={
                  //console.log(this.state.topOrders)
                  this.state.topOrders  //get the top 3 orders
                }
                renderItem={({ item }) => (
                  <ListItem
                    item={item}
                    onPress={() => this.orderDetailHandler(item.id)}
                  />
                )}
                keyExtractor={item => item.id}
              />
            </View>

          </View>
        );
      }
      else {
        return(
          <View style={styles.container}>
            <AddPrescCard style={styles.cardStyle} onAddPress={this.addPressHandler} />
            <Text>Recent Orders:</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>No order found</Text>
            </View>
          </View>
        )
      }
    } 
  }
}

HomeScreen.navigationOptions = navData => {
  return {
    headerTitle: "Home Screen"
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center"
  },
  listContainer: {
    flex:1,
    backgroundColor: Colors.white,
    justifyContent:'space-evenly',
    width: "100%"
  },
  cardStyle: {
    width: "80%",
    height: "30%"
  },
  title: {
    fontSize: 30
  },
  infoContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center"
  }

});

const mapStateToProps = state => {
  return {
    User: state.User,
    Order: state.Order
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ registerForPushNotifications,findUserOrders }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);

