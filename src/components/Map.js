
import React,{Component} from 'react';
import { StyleSheet, Text, View, Button ,ActivityIndicator,TouchableOpacity,Icon, Dimensions} from 'react-native';
import MapView ,{Marker}from 'react-native-maps';
import COLOR from "../constants/Colors";

export default class Map extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:true,
      latlng:0,
      region:{
              lat:37.7900352,
              lng:-122.4194,
              latitudeDelta: 0.0922,
             longitudeDelta: Dimensions.get("window").width/Dimensions.get("window").height*0.0122,
      },
      marker:{ 
          latitude:0,
          longitude:0,
          name:"",
      },  
    };   
    }
componentDidMount(){
  const pharmacyItem= this.props.navigation.getParam("pharmacyItem")
       if(pharmacyItem){
         const marker=this.state.marker;
         marker.latitude=pharmacyItem.lat;
         marker.longitude=pharmacyItem.lng; 
         marker.name=pharmacyItem.locationName;
            this.setState({marker,loading:false}) 
           // console.log(marker)  
            console.log(this.state);
                      }           
 }

  render (){
    if(this.state.loading){
      return(
        <ActivityIndicator/>
      )
    }else{
      return (  
        <MapView
        style={styles.map}
        region={this.state.region}
        //region={!this.state.marker ? this.state.region :null}
        mapType={"hybrid"}
        maxZoomLevel={30}
        minZoomLevel={1}
        zoomTapEnabled={true}
        showsUserLocation={true}
        showsCompass={true}
        >        
         <MapView.Marker 
          coordinate={this.state.marker}
          title={this.state.marker.name}
          pinColor={COLOR.secondary}
         />
        </MapView>  
      );
    }
}
}

const styles=StyleSheet.create({
  map:{
    flex:1,
    width:'100%',
    height:'100%',
    marginTop:'auto',
    marginBottom:'auto',
   position: 'relative',
  },
})
