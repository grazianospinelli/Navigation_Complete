import React, { Component } from 'react';
import {
  AppRegistry,WebView,
  StyleSheet,View,TouchableOpacity
} from 'react-native';
import firebase from 'react-native-firebase';
import IP from '../config/IP';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';


export default class privacy extends Component {
	
	constructor(props){
		super(props)
		this.state={			
		}
	}
	
	componentDidMount = async () => {
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

        const fcmToken = await firebase.messaging().getToken()
        if (fcmToken) {
        	// alert(fcmToken);
        	this.setState({userToken: fcmToken});
        }

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        	if (fcmToken) {this.setState({userToken: fcmToken})}
		})  
	}

	
		
  	render() {

	return (
		<View style = {styles.container}>			

			<View style={{justifyContent: 'flex-start',	alignItems: 'flex-start'}} >
				<TouchableOpacity
					style={{justifyContent: 'flex-start',	alignItems: 'flex-start'}}
					onPress={() => {this.props.navigation.navigate("Register")}}>
					<Icon style={{ padding: 10 }} name="arrow-left" padding={15} size={25} color={Colors.primary} />
				</TouchableOpacity>
			</View>

			<WebView source = {{ uri: 'https://www.extrastaff.it/privacy.htm' }} />	
		   
		</View>
	 )
	

  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
 
	},	
 });

AppRegistry.registerComponent('privacy', () => privacy);
