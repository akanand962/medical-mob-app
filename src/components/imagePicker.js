import React, {useState} from 'react'
import {View, Text, StyleSheet, Image, Alert} from 'react-native'
import FormButton from '../libs/forms/button'
import Colors from '../constants/Colors'

import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

const ImgPicker = props => {
    
    const [pickedImage, setPickedImage] = useState();

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient Permissions',
                'You need to accept camera permission',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync({ // this opens camera
            allowsEditing: true,
            //aspect: [16, 9],
            quality: 0.5,
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        if(!image.cancelled) {
            setPickedImage(image.uri);
            props.onImageTaken(image.uri);
        }
    };

    const chooseFromGalleryHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //aspect: [16,9],
            quality: 0.5
        })

        if(!image.cancelled) {
            setPickedImage(image.uri);
            props.onImageTaken(image.uri);
        }

    }

    return (
        <View style={styles.imagePicker}>
            <View style={styles.imagePreview}>
                {!pickedImage 
                    ? (<Text>No image picked yet</Text>)  //checks if image is picked or not
                    : (<Image style={styles.image} source={{ uri: pickedImage }} />)
                }
            </View>
            <FormButton
                title='Take Image'
                color={Colors.primary}
                onPress={takeImageHandler}
            />
            <FormButton
                title='Choose from gallery'
                color={Colors.primary}
                onPress={chooseFromGalleryHandler}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center',
        marginBottom: 15,
    },
    imagePreview: {
        width: '100%',
        height: 300,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: "contain"
    }
})

export default ImgPicker