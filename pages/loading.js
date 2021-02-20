/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet, ImageBackground } from 'react-native';
import { isSignedIn } from '../components/auth';
import * as Colors from '../components/themes/colors';
import LottieView from 'lottie-react-native';


export default class AuthLoading extends Component {  
 
  componentDidMount(){
    setTimeout(() => this.verify(), 3000);    
  }  

  verify() {
    isSignedIn()
      .then((user) => { this.props.navigation.navigate(user ? 'Drawer' : 'Auth'); })
      .catch(err => alert(`Errore: ${err}`));
  }
  
  render() {
    return (
      
      <ImageBackground
        source={require('../components/images/Background3.jpg')}
        style={styles.backgroundImage}
      >
        <StatusBar hidden = {true} />
        <View style={styles.container}>
          {/* <Text>Loading</Text>
          <ActivityIndicator size="large" /> */}
          <LottieView
            source={require('../components/images/data.json')}
            autoPlay
            loop={false}           
          />
        </View>

        <View style={{justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'black'}}>
          <Text style={{color: Colors.secondary, fontWeight: 'bold'}}>Copyright Graziano Spinelli 2019 ©</Text>
        </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
