import React from 'react'
import {View, Button, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform} from 'react-native'

import {MaterialIcons} from '@expo/vector-icons'
import Colors from '../constants/Colors'

let TouchableCmp = TouchableOpacity;
if(Platform.OS === 'android' && Platform.Version >= 21){
    TouchableCmp = TouchableNativeFeedback
}

const AddPrescCard = props => {
    return (
        
        <View style={{...props.style, ...styles.container}}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>ADD PRESCRIPTION</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableCmp onPress={props.onAddPress} useForeground> 
                    <View style={styles.button}>
                        <MaterialIcons name={'note-add'} size={40} color={Colors.secondary}/>  
                    </View>
                </TouchableCmp>
            </View>
        </View> 
    
    )
}


const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        marginVertical: 20,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,
    },
    textContainer: {
        height:'20%',
        justifyContent: 'center'
    },
    text: {
        fontSize: 18
    },
    buttonContainer: {
        height: '80%',
        justifyContent: 'center',
        
    },
    button: {
        borderColor: Colors.secondary,
        borderWidth: 3,
        borderRadius: 35,
        width: 70,
        height: 70,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    }

})

export default AddPrescCard
