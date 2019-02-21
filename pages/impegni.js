import React, { Component } from 'react';
import { AppRegistry, View, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';

export default class JobScreen extends Component {

  static navigationOptions = {
        drawerLabel: "Offerte",
        drawerIcon: () =>(
        <Icon  name="briefcase" size={20} color={Colors.secondary} />),
  }


  render() {
    // const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <Text style={styles.pageName}>Offerte in Sospeso</Text>


      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageName: {
    margin: 10,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },


});


// AppRegistry.registerComponent('profile', () => profile);
