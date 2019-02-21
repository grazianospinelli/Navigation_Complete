import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text, StatusBar, Keyboard,TouchableWithoutFeedback,
  View,TextInput,TouchableOpacity,
  ImageBackground
} from 'react-native';
import md5 from 'md5';
import firebase from 'react-native-firebase';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import IP from '../config/IP';
import Validate from '../components/validate.js'
import * as Colors from '../components/themes/colors';



export default class register extends Component {
	
	constructor(props){
		super(props)
		this.state={
			userName:'',
			userEmail:'', 
			userPassword:'',
			stateReg: false,
			userToken:'',
			nameWarn: '',
			emailWarn:'',
			passWarn:'',
			checkWarn:''
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
        	this.setState({userToken: fcmToken})
        }

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        	if (fcmToken) {this.setState({userToken: fcmToken})}
		})
		
		this.keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => { warn1 = Validate('email', this.state.userEmail); 
					warn2 = Validate('password', this.state.userPassword);
					warn3 = Validate('notEmpty', this.state.userName);
					this.setState({emailWarn: warn1, passWarn: warn2, nameWarn: warn3 });
					this.checkRegister()
			}
		);
        
    }

	componentWillUnmount() {
		this.keyboardDidHideListener.remove();
	}
	
	checkRegister = () => {
		const {emailWarn, passWarn, nameWarn} = this.state;
		console.log(this.state);
		if (emailWarn || passWarn || nameWarn) {this.setState({stateReg: false})} else {{this.setState({stateReg: true}) }}
	}

	userRegister = () =>{
				
		const {userName,userEmail,userToken,userPassword} = this.state;
		
		const nameWarn = Validate('notEmpty', this.state.userName)
		const emailWarn = Validate('email', this.state.userEmail)
		const passWarn = Validate('password', this.state.userPassword)
		

		// Imposta le variabili dello stato globale usando le variabili appena calcolate
		this.setState({
			nameWarn: nameWarn,
			emailWarn: emailWarn,
			passWarn: passWarn
		})
		
		const md5Password = md5(userPassword);
		const upperEmail = userEmail.toUpperCase();
		
  		if (!emailWarn && !passWarn && !nameWarn) {
				
			fetch(`${IP}/register.php`, {
				method: 'post',
				header:{
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				body:JSON.stringify({
					name: userName,
					email: upperEmail,
					password: md5Password
				})
				
			})
			.then((response) => response.json())
			.then((responseJson) => {alert(responseJson);})
			.catch((error) => {alert(error);});

			fetch(`${IP}/RegisterDevice.php`, {
				method: 'POST',
				headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					token: userToken,
					email: upperEmail})
				})
			.then((response) => response.json())
			.then((responseData) => {alert(responseData); this.props.navigation.navigate("Home");})
			.catch((err) => { alert(err); });
		}
		
		Keyboard.dismiss();
		
	}
	
  	render() {
			
			return (

				<ImageBackground 
					source={require('../components/images/chef.jpg')}
					style={styles.backgroundImage}
            	>
				<View style={{flex: 0, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
					<TouchableOpacity
						style={{alignItems: 'center'}}
						onPress={() => {this.props.navigation.navigate("Home")}}>
						<Icon style={{ padding: 10 }} name="arrow-left" size={25} color={Colors.primary} />
					</TouchableOpacity>
				</View>

					
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.container}>
				<StatusBar backgroundColor='#000' translucent={false} barStyle='light-content' />

						<TouchableOpacity onPress={this.userRegister}>
							<Text style={styles.pageName}>{this.state.stateReg ? '→Registrati←' : 'Registrati'}</Text>
						</TouchableOpacity>
				

						<View style={styles.inputForm}>	
						<Icon style={styles.searchIcon} name="user" size={20} color={this.state.nameWarn ? Colors.primary : 'transparent'}  />			
						<TextInput
							placeholder="Inserisci il Nome"
							style={{borderRadius: 25, width:220}}	
							underlineColorAndroid="transparent"
							onChangeText= {userName => this.setState({userName})}
							onBlur={() => { warn = Validate('notEmpty', this.state.userName); this.setState({nameWarn: warn}); this.checkRegister()}}						
						/>
						</View>
						
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{this.state.nameWarn}</Text>

						<View style={styles.inputForm}>
						<Icon style={styles.searchIcon} name="envelope" size={20} color={this.state.emailWarn ? Colors.primary : 'transparent'}  />		
						<TextInput
							placeholder="Inserisci la tua Email"
							style={{borderRadius: 25, width:220}}
							onChangeText={userEmail => { userEmail.trim(); this.setState({userEmail})}}
							onBlur={() => { warn = Validate('email', this.state.userEmail); this.setState({emailWarn: warn}); this.checkRegister()}}
						/>
						</View>
			
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{this.state.emailWarn}</Text>
						
						<View style={styles.inputForm}>	
						<Icon style={styles.searchIcon} name="lock" size={20} color={this.state.passWarn ? Colors.primary : 'transparent'} />
						<TextInput
							placeholder="Inserisci la Password"
							secureTextEntry={true}
							style={{borderRadius: 25, width:220}}
							onChangeText={userPassword => { userPassword.trim(); this.setState({userPassword})}}
							onBlur={() => { warn = Validate('password', this.state.userPassword); this.setState({passWarn: warn}); this.checkRegister()}}
						/>
						</View>

						<Text style={{color: Colors.primary, fontWeight:'bold'}}>{this.state.passWarn}</Text>

				</View>
				</TouchableWithoutFeedback>
				<View style={{ height: 20 }}><Text>{}</Text></View>
								
				</ImageBackground>
		
			);
    }
}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#F5FCFF',
	},

	backgroundImage: {
		flex: 1,
		justifyContent: 'center',
		resizeMode: 'cover', // or 'stretch'
	},

	inputForm: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		//backgroundColor: 'transparent',
		width:280,
		height: 40,
		margin:1,
		borderRadius: 25, 
		//borderWidth:1,
		//borderColor: 'gray',
		backgroundColor: 'rgba(255,255,255,0.4)',
	},
	
	pageName:{
		marginBottom: 30,
		justifyContent: 'flex-start',
		alignItems: 'center',
		color: Colors.primary,
		fontFamily: 'Wildemount Rough',
		fontSize: 50,		
	},

	searchIcon: {
		padding: 10,
		margin: 10,
	},	

  
});

AppRegistry.registerComponent('register', () => register);
