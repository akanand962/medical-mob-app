import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, BackHandler } from "react-native";
import ContinueButton from "../../components/ContinueButton";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { sendNotification } from "../../store/actions/order_actions";
import { useSelector } from "react-redux";

const OrderNumberScreen = props => {
  const orderArray = useSelector(state => state.Order.orders);
  const orderItem = orderArray.pop();
  console.log("ORDER ITEM: ");
  console.log(orderItem);

  ///disable android back button on this screen
  useEffect(() => {
    const backListner = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => {
      backListner.remove();
    };
  }, [onBackPress]);
  const onBackPress = () => {
    return true;
  };
  ///

  const onContinueHandler = () => {
    props.navigation.navigate("HomeScreen");
    sendNotification({
      pharmacyId: orderItem.pharmacyId,
      orderId:orderItem.id,
      message: "you have a new order"
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <AntDesign
          name={"checkcircle"}
          size={70}
          color={Colors.confirmationColor}
        />
      </View>
      <View>
        <Text style={styles.confirmedText}>Order Confirmed !</Text>
        <Text>Order Number: # {orderItem.refNo}</Text>
      </View>
      <View style={styles.continue}>
        <ContinueButton onContinue={onContinueHandler} />
      </View>
    </View>
  );
};

OrderNumberScreen.navigationOptions = navData => {
  return {
    headerTitle: "Order Uploaded",
    headerLeft: null
  };
};

const styles = StyleSheet.create({
  container: {
    margin: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  continue: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "90%",
    marginBottom: 10
  },
  confirmedText: {
    fontSize: 20
  }
});

export default OrderNumberScreen;
