import React from 'react';
import { Image,View,Text} from 'react-native';
// import COLOR from '../constants/Colors';
import image from '../assets/logo.png';
// import appName from '../constants/Strings';
const Logo = () =>(
        <View style={{alignItems:'center'}}>
            {/* <Text style={{fontSize:30,marginBottom:20,color:COLOR.primary}}> {appName.title}</Text> */}
            <Image
            source={image}
            resizeMode={'center'}
            style={{
                width:"100%"
            }}
             />
        </View>
)

export default Logo;