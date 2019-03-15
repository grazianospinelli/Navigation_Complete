import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Colors from '../components/themes/colors';
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from 'react-native-image-picker';
import PhotoUpload from 'react-native-photo-upload';


export default class PhotoScreen extends Component {
  
  state = {
    avatarSource: null,    
  };

  constructor(props) {
    super(props);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  static navigationOptions = {
    drawerLabel: "Scatta Foto",
    drawerIcon: () =>(
    <Icon  name="ios-camera" size={30} color={Colors.secondary} />
    )
  }


  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  

  render() {
    return (
      <View style={styles.container}>
      
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View
            style={[
              styles.avatar,
              styles.avatarContainer,
              { marginBottom: 20 },
            ]}
          >
            {this.state.avatarSource === null ? (
              <Text>Select a Photo</Text>
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>

        <PhotoUpload
                    // onPhotoSelect={avatar => {
                    //   if (avatar) {
                    //     // Inviare l'immagine al server remoto
                    //     console.log('Image base64 string: ', avatar)
                    //   }
                    // }}
                  >
                    <Image style={styles.avatar} source={{uri: 'http://192.106.234.90/FcmExample/Profiles/profile-placeholder.png' }}/>                  
        </PhotoUpload>

        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "white",
    // marginBottom:10,
    alignSelf:'center',
    // position: 'absolute',
    // marginTop:130
    marginTop: 40
  },

});