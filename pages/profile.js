/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import { Card, Button, Text } from 'react-native-elements';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import FireManager from '../components/firemanager.js';
import { onSignOut } from '../components/auth';
import * as Colors from '../components/themes/colors';

export default class ProfileScreen extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    drawerLabel: "Profilo",
    drawerIcon: () =>(
    <Icon  name="user" size={20} color={Colors.secondary} />
  )
}

  componentDidMount() {
    FireManager();
  }

//   componentWillUnmount() {
//     this.notificationDisplayedListener();
//     this.notificationListener();
//     this.notificationOpenedListener();
//   }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title="Graziano Spinelli">
          <View
            style={{
              backgroundColor: '#bcbec1',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: 40,
              alignSelf: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ color: 'white', fontSize: 28 }}>SG</Text>
          </View>
          
        </Card>
        
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
