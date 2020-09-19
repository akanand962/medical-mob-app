import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,  
  TouchableOpacity, 
  TouchableNativeFeedback, 
  Platform,
} from 'react-native';

import Colors from '../constants/Colors'

import {AntDesign} from '@expo/vector-icons'

const ContinueButton = props => {

    let TouchableCmp = TouchableOpacity;
    if(Platform.OS === 'android' && Platform.Version >= 21){
        TouchableCmp = TouchableNativeFeedback
    }
  
    return (
      <TouchableCmp 
        useForeground
        onPress={props.onContinue}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Continue</Text>
          </View>
          <View style={styles.iconContainer}>
            <AntDesign name={"arrowright"} size={30}/>
          </View>
        </View>
      </TouchableCmp>
    )
  }

  const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        margin: 10,
        borderColor: Colors.primary,
        borderWidth: 2,
        borderRadius: 20,
        overflow: "hidden"
    },
    textContainer: {
        marginHorizontal: 5,
    },
    text: {
        fontSize: 18
    },
      
    iconContainer: {
        marginHorizontal: 5,
    }
    
  })

  export default ContinueButton