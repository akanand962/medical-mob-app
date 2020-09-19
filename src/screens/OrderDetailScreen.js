import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator
} from "react-native";
import COLOR from "../constants/Colors";
import { connect } from "react-redux";
import moment from "moment";
import { getEmail } from "../libs/storage";
import Colors from "../constants/Colors";
import Input from "../libs/forms/input";
import FormButton from "../libs/forms/button";
import {
  findOrder,
  updateOrder,
  sendNotification
} from "../store/actions/order_actions";
import { bindActionCreators } from "redux";
import { firebase } from "../libs/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
class OrderDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      item: null,
      email: null,
      userComment: ""
    };
  }
  componentDidMount() {
    getEmail().then(email => this.setState({ email }));
    const itemId = this.props.navigation.getParam("itemId");
    if (itemId) {
      this.props
        .findOrder(itemId)
        .then(() => {
          if (this.props.Order.success) {
            this.setState({
              item: this.props.Order.order,
              loading: false
            });
          }
        })
        .catch(err => console.log(err));
    } else {
      this.setState({
        loading: false
      });
    }
  }
  updateInput = value => {
    this.setState({ userComment: value });
  };
  updateComments = () => {
    if (this.state.userComment.trim().length > 0) {
      this.setState({ loading: true });
      const order = this.state.item;
      if (order.comments) {
        order.comments.push({
          message: this.state.userComment,
          createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
          createdBy: this.state.email
        });
      } else {
        order.comments = [
          {
            message: this.state.userComment,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            createdBy: this.state.email
          }
        ];
      }
      this.props.updateOrder(order).then(() => {
        this.setState({ loading: false });
        if (this.props.Order.success) {
          sendNotification({
            pharmacyId: this.state.item.pharmacyId,
            orderId: this.props.navigation.getParam("itemId"),
            message: this.state.userComment.trim()
          });
          order.id = this.props.navigation.getParam("itemId");
          this.setState({ item: order, userComment: "" });
        } else {
          alert("failed to add order comments");
        }
      });
    }
  };
  render() {
    console.log(this.state.item);
    if (this.state.loading) {
      return (
        <ActivityIndicator
          size="large"
          style={styles.Indicator}
          color={Colors.primary}
        />
      );
    } else {
      return this.state.item ? (
        <ScrollView style={styles.container}>
          <KeyboardAwareScrollView enableOnAndroid={true} >
            {this.state.item.imageCloudPath ? (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: this.state.item.imageCloudPath }}
                  style={styles.image}
                />
              </View>
            ) : null}
           
            <View style={styles.item}>
              <Text style={styles.itemText}>Order No.</Text>
              <Text style={styles.itemText}>{this.state.item.refNo}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemText}>Order Date</Text>
              <Text style={styles.itemText}>
                {this.state.item.orderDate !== null
                  ? moment(this.state.item.orderDate).format("LT")
                  : ""}
              </Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemText}>Status </Text>
              <Text style={styles.itemText}>{this.state.item.status}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemText}>Delivery type</Text>
              <Text style={styles.itemText}>
                {" "}
                {this.state.item.type == "pickup"
                  ? "Pick up from Pharmacy"
                  : "Home delivery"}
              </Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemText}>Due Date</Text>
              <Text style={styles.itemText}>
                {this.state.item.dueDate !==null
                  ? moment(this.state.item.dueDate).format("LTS" )
                  : ""}
              </Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemText}>Finish Date</Text>
              <Text style={styles.itemText}>
                {this.state.item.finishDate !== null
                  ? moment(this.state.item.finishDate).format(
                      "DD/MM/YYYY hh:mm a"
                    )
                  : "Not completed"}
              </Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemText}>Extracted Text</Text>
              <Text style={styles.itemText}>
                {this.state.item.extractedText}
              </Text>
            </View>
            <Text style={{ fontSize: 25, margin: 10 }}>Comments</Text>
            {this.state.item.comments && this.state.item.comments.length > 0 ? (
              <View style={styles.comments}>
                <View style={styles.commentsList}>
                  {this.state.item.comments.map((comment, index) => (
                    <View key={index}>
                      <View
                        style={
                          comment.createdBy === this.state.email
                            ? styles.sender
                            : styles.receiver
                        }
                      >
                        <Text
                          style={
                            comment.createdBy === this.state.email
                              ? styles.senderText
                              : styles.receiverText
                          }
                        >
                          {comment.message}
                        </Text>
                        <Text
                          style={
                            comment.createdBy === this.state.email
                              ? styles.senderTime
                              : styles.receiverTime
                          }
                        >
                          {moment(comment.createdAt.toDate()).format(
                            "DD/MM/YYYY h:mm a"
                          )}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              null
            )}
            <View style={{ marginBottom: 20 }}>
              <Input
                placeholder="add your comments"
                placeholderTextColor="#cecece"
                type="textinput"
                multiline
                value={this.state.userComment}
                onChangeText={this.updateInput}
                autoCorrect={false}
              />
              <FormButton
                title="Send"
                onPress={this.updateComments}
                overrideStyle={{
                  backgroundColor: COLOR.primary,
                  margin: 20
                }}
                color={Platform.select({
                  ios: COLOR.white,
                  android: COLOR.primary
                })}
              />
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      ) : (
        <Text style={styles.info}>No order found</Text>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  Indicator: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    flexDirection: "row",
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  imagePreview: {
    width: "100%",
    height: 300,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  itemText: {
    flex: 1,
    fontSize: 16
  },
  info: {
    color: COLOR.red,
    fontSize: 25
  },
  comments: {
    borderWidth: 1,
    borderColor: Colors.grey,
    marginBottom: 10
  },
  commentsList: {
    padding: 10
  },
  sender: {
    textAlign: "right",
    backgroundColor: Colors.primary,
    marginBottom: 5,
    borderRadius: 10,
    padding: 5,
    marginLeft: 50
  },
  receiver: {
    textAlign: "left",
    backgroundColor: Colors.grey,
    marginBottom: 5,
    borderRadius: 10,
    padding: 5,
    marginRight: 50
  },
  senderText: {
    fontSize: 20,
    color: Colors.white
  },
  receiverText: {
    fontSize: 20
  },
  senderTime: {
    color: Colors.white,
    textAlign: "right"
  },
  receiverTime: {
    textAlign: "right"
  }
});

const mapStateToProps = state => {
  return {
    Order: state.Order
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ findOrder, updateOrder }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetailScreen);
