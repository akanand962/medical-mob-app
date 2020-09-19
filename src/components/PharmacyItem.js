import React from 'react'
import {View, StyleSheet, TouchableOpacity, Text, Platform, Image} from 'react-native'
import FormButton from "../libs/forms/button";
import COLOR from "../constants/Colors";
import ImageIcon from "../assets/image/navigation.png";

const PharmacyItem = props => {
    const showButton=()=>{
        return props.show?( 
            <FormButton
            onPress={props.selectPharmacy}
            title="Select"
            color={Platform.select({ ios: COLOR.white, android: COLOR.secondary })}
            overrideStyle={{ backgroundColor: COLOR.primary }}           
          />     
        ):null;
    };
    const arrowImage= ()=>{
        return props.showImg?(
            <TouchableOpacity onPress={props.goToMap}>
              <Image source ={ImageIcon}
              style={{width:30,height:30,marginRight:5}}
             
             />
            </TouchableOpacity>
        ):null;
    };

    return (
        <TouchableOpacity
        onPress={props.onSelect}
        style={styles.pharmacyItem}
        disabled={!props.touchable}>
        
           <View style={{flexDirection:'column'}}>
            <View style={styles.nameContainer}>
                <Text style={styles.name}>{props.name}</Text>
            </View>
            <View style={styles.address}>
                <Text>{props.address}</Text>
            </View>
            </View>

            <View  >
            {arrowImage()}
            {showButton(props.show)}
            </View>
           
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    pharmacyItem: {
        margin: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:15,
        backgroundColor:'white',
        
    },
    nameContainer: {
        width:'80%',
        marginLeft:10
        
    },
    name: {       
        fontSize: 14,
        fontWeight:'bold',  
    },
    address: {
        width:'65%',
        marginLeft:10

    },
   
})

export default PharmacyItem