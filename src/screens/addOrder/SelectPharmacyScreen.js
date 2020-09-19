import React, { useState,Fragment } from 'react'
import {
    View, Image, TouchableOpacity,
    Text,
    StyleSheet,
    FlatList,
    Modal,
    Dimensions,
    Alert,
    Switch,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native'
//import {ImageIcon} from '../../assets/image/index.js';


import { PHARMACIES } from '../../data/dummy-data'
import { PrescriptionTypes } from '../../models/Prescriptions'

import PharmacyItem from '../../components/PharmacyItem'
import ContinueButton from '../../components/ContinueButton'

import FormButton from '../../libs/forms/button'
import FormInput from '../../libs/forms/input'
import Colors from '../../constants/Colors'

import moment from 'moment'
import DateTimePicker from "react-native-modal-datetime-picker"
import { StackNavigator } from 'react-navigation';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;



const SelectPharmacyScreen = props => {

    goToMap =()=>{
        props.navigation.navigate('Map', {pharmacyItem});
        console.log(pharmacyItem);
    }

    //passing imagePath through to next screen
    const imagePath = props.navigation.getParam('imagePath');
    //

    const pharmacies = PHARMACIES;
    const defaultPharmacy = pharmacies[0];
    const currentDate = new Date();

    const [pharmacySelected, setPharmacySelected] = useState(false);
    const [pharmacyItem, setPharmacyItem] = useState(defaultPharmacy);

    const [orderType, setOrderType] = useState(PrescriptionTypes.PICKUP)

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showDateTime, setShowDateTime] = useState(false);

    const [comments, setComments] = useState('')



    const onSelectItemHandler = (itemID) => {
        let item = PHARMACIES.find(item => item.id === itemID)
        //console.log(item)
        setPharmacyItem(item)
        setPharmacySelected(false)
    }

    const onSelectDateTime = () => {
        setShowDateTime(true)
    }

    const onConfirmDate = (date) => {
        if (date < currentDate) {  
            Alert.alert("Invalid Time", "Can't select time earlier than the current time", [{ text: "Okay" }])
        }
        else {
            setSelectedDate(date)
        }
        setShowDateTime(false)
    }

    const onSwitchValueHandler = (type, value) => {
        if (!value) {
            if (type === PrescriptionTypes.DELIVERY) {
                setOrderType(PrescriptionTypes.PICKUP)
            }
            else {
                setOrderType(PrescriptionTypes.DELIVERY)
            }
        }
        else {
            setOrderType(type)
        }
    }

    const onContinueHandler = () => {
        props.navigation.navigate({
            routeName: "OrderConfirmationScreen",
            params: {
                imagePath: imagePath,
                pharmacy: pharmacyItem,
                orderType: orderType,
                date: selectedDate,
                comments: comments
            }
        })
    }

const selectPharmacy =()=>{
    alert("no selection")
}
       
    
    return (

        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={{ flex: 1, alignItems: 'center', backgroundColor: pharmacySelected ? 'rgba(0,0,0,0.5)' : null }}>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Select a Pharmacy</Text>
                    </View>

                    <View style={styles.locationContainer}>
                        <PharmacyItem
                            name={pharmacyItem.locationName}
                            address={pharmacyItem.address}
                            touchable
                            onSelect={() => {
                                setPharmacySelected(true)
                            }}  
                            showImg={true}                                                     
                            show={false}  
                            goToMap={goToMap}                         
                        />                                              
                    </View>

                    <Modal visible={pharmacySelected} transparent={true} animationType="slide">
                        <View style={styles.listContainer}>
                            <FlatList
                                data={pharmacies}
                                keyExtractor={item => item.id}
                                renderItem={itemData =>  
                                        <PharmacyItem 
                                        //selectPharmacy={selectPharmacy(itemData.item.id)}
                                        //touchable
                                            selectPharmacy={() => {
                                                onSelectItemHandler(itemData.item.id)
                                            }}
                                            name={itemData.item.locationName} 
                                            address={itemData.item.address}  
                                            show={true}                                                                     
                                        />  
                                                                                                                                      
                                }
                            />
                        </View>
                    </Modal>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Select Delivery/Pickup</Text>
                        <View style={styles.switchContainer}>

                            <View style={styles.switchContent}>
                                <View>
                                    <Text>Pickup</Text>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Switch
                                        value={orderType === PrescriptionTypes.PICKUP ? true : false}
                                        thumbColor="#fafafa"
                                        trackColor={{ false: "#fafafa", true: Colors.secondary }}
                                        onValueChange={value => {
                                            onSwitchValueHandler(PrescriptionTypes.PICKUP, value)
                                        }}
                                        style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}  //make switch bigger
                                    />
                                </View>
                            </View>

                            <View style={styles.switchContent}>
                                <View>
                                    <Text>Delivery</Text>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Switch
                                        value={orderType === PrescriptionTypes.DELIVERY ? true : false}
                                        thumbColor="#fafafa"
                                        trackColor={{ false: "#fafafa", true: Colors.secondary }}
                                        onValueChange={value => {
                                            onSwitchValueHandler(PrescriptionTypes.DELIVERY, value)
                                        }}
                                        style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} //make switch bigger
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>{orderType === PrescriptionTypes.PICKUP ? 'Pickup' : 'Delivery'}</Text>
                        </View>
                    </View>

                    <View style={styles.titleContainer}>

                        <Text style={styles.titleText}>Select Date/Time</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>{moment(selectedDate).format('MMMM Do YYYY,')}</Text>
                            <Text style={styles.infoText}>{moment(selectedDate).format('h:mm a')}</Text>
                        </View>

                        <FormButton
                            title="Change Date/Time"
                            onPress={() => {
                                onSelectDateTime();
                            }}
                        />
                        <DateTimePicker
                            isVisible={showDateTime}
                            mode="datetime"
                            date={selectedDate}
                            minimumDate={currentDate}
                            is24Hour={true}
                            locale="en_GB"
                            onConfirm={date => {
                                onConfirmDate(date);
                            }}
                            onCancel={() => {
                                setShowDateTime(false)
                            }}
                        />

                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Comments</Text>
                        <View style={styles.infoContainer}>
                            <FormInput
                                placeholder="Enter comments"
                                placeholderTextColor="#cecece"
                                type="textinput"
                                value={comments}
                                keyboardType={"default"}
                                autoCapitalize={"sentences"}
                                onChangeText={value => setComments(value)}
                                multiline
                                numberOfLines={3}
                                autoCorrect
                                maxHeight={80}
                            />
                        </View>

                    </View>

                    <View style={styles.continue}>
                        <ContinueButton onContinue={onContinueHandler} />
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
    },
    titleText: {
        fontSize: 18
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.secondary,
        marginVertical: 20,
        width: '100%',
    },
    infoText: {
        fontSize: 26,
        color: Colors.secondary
    },
    timeText: {
        fontSize: 26
    },
    locationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    listContainer: {
        
        backgroundColor: '#fafafa',
        width: windowWidth * 0.8,
        height: windowHeight * 0.7,
        alignSelf: 'center',
        top: windowHeight * 0.15,
        borderRadius: windowHeight * 0.03,
        alignItems: 'center',  
        
    },
    switchContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    switchContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        margin: 20
    },
    continue: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '90%',
        marginBottom: 10
    },
    
})

export default SelectPharmacyScreen