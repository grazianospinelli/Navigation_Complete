/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';

import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import AuthLoading from './pages/loading';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Drawer from './drawer';


const AuthStack = createStackNavigator(
  {
    Home: { screen: Home,
                navigationOptions: {
                  header: null
                }
    },
    Login: { screen: Login,
                navigationOptions: {
                  header: null
                } 
    },
    Register: { screen: Register,
                navigationOptions: {
                  header: null
                }  
    },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: { header: null },
  }
);

const AppStack = createStackNavigator({ Drawer: { screen: Drawer } });

const AppNavigator = createSwitchNavigator({
  Loading: AuthLoading,
  Drawer: AppStack,
  Auth: AuthStack,
},
{
  initialRouteName: 'Loading',
});

const Container = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
          <Container />
    );
  }
}
