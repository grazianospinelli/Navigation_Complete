/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import firebase from 'react-native-firebase';
import { Notification, NotificationOpen } from 'react-native-firebase';
import AuthLoading from './pages/loading';
import introTutorial from './pages/tutorial';
import Home from './pages/home';
import Login from './pages/login';
import Reset from './pages/reset';
import Privacy  from './pages/privacy';
import Terms  from './pages/termsandconditions';
import Register from './pages/register';
import Drawer from './drawer';


const AuthStack = createStackNavigator(
  {
    Home: { 
      screen: Home,
      navigationOptions: { header: null }
    },
    Login: { 
      screen: Login,
      navigationOptions: { header: null } 
    },
    Reset: { 
      screen: Reset,
      navigationOptions: { header: null } 
    },
    Register: { 
      screen: Register,
      navigationOptions: { header: null }  
    },
    Privacy: { 
      screen: Privacy,
      navigationOptions: { header: null }  
    },
    Terms: { 
      screen: Terms,
      navigationOptions: { header: null }  
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
  Tutorial: introTutorial,
  Drawer: AppStack,
  Auth: AuthStack,
},
{
  initialRouteName: 'Loading',
  // initialRouteName: 'Tutorial',
});

const Container = createAppContainer(AppNavigator);



export default class App extends Component {
  
  async componentDidMount(){

    
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        // user has permissions
    } else {
        // user doesn't have permission
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
            alert('No permission for notification');
        }
    }   

    // CLOSED APP
    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        if ((notification._data.message!==undefined)) {
            alert(notification._data.message);
            // console.log(notification);
        } else {                        
            console.log(notification);            
        }
        firebase.notifications().removeDeliveredNotification(notification.notificationId);
    }

    // Create the channel
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('My apps test channel');    
    firebase.notifications().android.createChannel(channel);
    firebase.messaging().subscribeToTopic('news1');

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // console.log("onNotificationDisplayed")
      if ((notification.body!==undefined)) {
        alert(notification.body);          
      }
      firebase.notifications().removeDeliveredNotification(notification.notificationId);  
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    
    // FOREGROUND
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
        // Process your notification as required
        // console.log('get Message');
        // console.log(notification);
        notification
            .android.setChannelId('test-channel')
            .android.setSmallIcon('ic_launcher');
        firebase.notifications()
            .displayNotification(notification);      
    });

    // BACKGROUND
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        
          if (notification.body!==undefined) {
              alert(notification.body);          
          } else {
              alert(notification._data.message); 
          }
        
        firebase.notifications().removeDeliveredNotification(notification.notificationId);
    });
  }  

  
  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
  }

 

  render() {
    return (
          <Container />
    );
  }
}
