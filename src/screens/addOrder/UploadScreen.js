import React, {useState} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  TouchableOpacity, 
  TouchableNativeFeedback, 
  Platform,
} from 'react-native';

import ImagePicker from '../../components/imagePicker'
import Colors from '../../constants/Colors'
import ContinueButton from '../../components/ContinueButton'

const UploadScreen = props => {
  
  const [selectedImage, setSelectedImage] = useState();
  
  const imageTakenHandler = imagePath => {
    setSelectedImage(imagePath)
  }

  const onContinueHandler = () => {
    props.navigation.navigate({
      routeName: "SelectPharmacyScreen",
      params: {
        imagePath: selectedImage
      }
    })
  }

  return (
        <View style={styles.container}>
          <View style={styles.imagePicker}>
            <ImagePicker onImageTaken={imageTakenHandler}/>
          </View>
          <View style={styles.continue}>
            {selectedImage
              ? <ContinueButton onContinue={onContinueHandler}/>
              : null
            }
          </View>
        </View>
    )
}

UploadScreen.navigationOptions = (navData) => {
    return {
      headerTitle: 'Upload Screen'
    }
}

const styles = StyleSheet.create({
  container: {
    margin: 30,
    justifyContent:'center',
    alignItems:'center'
  },
  imagePicker: {
    height:'90%',
    width:'90%'
  },
  continue: { 
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '10%',
    width: '100%'
  },

});

export default UploadScreen