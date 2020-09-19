import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import moment from "moment";
export const Item = props => (
  <View style={[styles.item, props.overrideStyle]}>
    <Text style={styles.title}>{props.title}</Text>
    {props.value ? <Text style={styles.subtitle}>{props.value}</Text> : null}
  </View>
);

export const ListItem = props => (
  <TouchableOpacity {...props}>
    <View style={[styles.listItem, props.overrideStyle]}>
     <Item title="Order Date" value={new Date(props.item.orderDate).toString()} />
      <Item title="Order No." value={props.item.refNo} />
      <Item title="Status" value={props.item.status} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  item: {
    flex: 1,
  },
  title: {
    fontSize: 16
  }
});
