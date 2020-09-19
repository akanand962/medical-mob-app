import React, {useEffect, useState} from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';

import ContinueButton from '../../components/ContinueButton'
import PharmacyItem from '../../components/PharmacyItem'
import { PrescriptionStatus} from '../../models/Prescriptions'


import moment from 'moment'

import { addUserOrder } from "../../store/actions/order_actions";
import { getEmail } from "../../libs/storage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Colors from "../../constants/Colors";


class OrderConfirmationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploading: false,
            userEmail: "",
            imagePath: props.navigation.getParam('imagePath'),
            pharmacy: props.navigation.getParam('pharmacy'),
            orderType: props.navigation.getParam('orderType'),
            date: props.navigation.getParam('date'),
            comments: props.navigation.getParam('comments'),
            prescItem: {
                pharmacyId: null,
                dueDate: null,
                status: null,
                type: null,
                comments: null
            }
        };
    }
    componentDidMount() {
        getEmail()
            .then(email => {
                this.setState({
                    userEmail: email,
                    prescItem: {
                        pharmacyId: this.state.pharmacy.id,
                        dueDate: this.state.date,
                        status: PrescriptionStatus.ORDER_PLACED,
                        type: this.state.orderType,
                        comments: this.state.comments
                    }
                });
            })
            .catch(err => console.log(err));
    }



    onContinueHandler = () => {
        this.setState({
            isUploading: true
        })
        this.props.addUserOrder(this.state.prescItem, this.state.userEmail, this.state.imagePath)
        .then(() => {
            this.props.navigation.navigate({
                routeName: "OrderNumberScreen",
            });
            this.setState({
                isUploading: false
            })
        })
        .catch(function(error) {
            console.log("Error Adding Order: ", error);
        }); 
    }

    

    render() {
        return (

            <ScrollView>
                <View style={styles.container}>

                    <View>
                        <Text>Prescription:</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.imagePreview}>
                            <Image style={styles.image} source={{uri: this.state.imagePath}} />
                        </View>
                    </View>

                    <View>
                        <Text>Pharmacy:</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <PharmacyItem
                            name={this.state.pharmacy.locationName}
                            address={this.state.pharmacy.address}
                        />
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.rowContainer}>
                            <Text>Order Type: </Text>
                            <Text>{this.state.orderType}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text>Date: </Text>
                            <Text>{moment(this.state.date).format('MMMM Do YYYY, h:mm a')}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text>Comments: </Text>
                        </View>
                        <Text
                            multiline
                        >
                        {!!this.state.comments ? this.state.comments : "No Comments" /*if there aren't any comments, say no comments */}
                        </Text>
                    </View>

                    <View style={styles.continue}>
                        <ContinueButton onContinue={this.onContinueHandler}/>
                    </View>


                </View>
                <Modal animationType="fade" visible={this.state.isUploading}>
                    <View style={styles.modalContainer}>
                        <View>
                            <Text style={{fontSize: 18}}>Uploading Order...</Text>
                        </View>
                        <View>
                            <ActivityIndicator size={"large"} color={Colors.primary}/>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            
        )
    }
}

OrderConfirmationScreen.navigationOptions = navData => {
    return {
        headerTitle: "Confirm Order"
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    infoContainer: {
        width: "90%"
    },
    rowContainer: {
        flexDirection:'row',
        justifyContent: "space-between"
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    continue: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width:'90%',
        marginBottom: 10
    },
    modalContainer: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ addUserOrder }, dispatch);
};


export default connect(
    null,
    mapDispatchToProps
)(OrderConfirmationScreen);

//export default OrderConfirmationScreen