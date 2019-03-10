import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,Text,StatusBar, TouchableWithoutFeedback,
  View,TouchableOpacity,TextInput,ImageBackground,Keyboard
} from 'react-native';
import firebase from 'react-native-firebase';
import md5 from 'md5';
import IP from '../config/IP';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Validate from '../components/validate.js'
import { onSignIn } from "../components/auth";
import * as Colors from '../components/themes/colors';


export default class login extends Component {
	
	constructor(props){
		super(props)
		this.state={
			userEmail:'',
			userPassword:'',
			stateReg: false,
			userToken:'',
			emailWarn:'',
			passWarn:''
		}
	}
	
	// static navigationOptions = ({navigation}) =>({
	// 	  title: 'Login',	
	// 	  headerRight:	
	// 	  <TouchableOpacity
	// 		onPress={() => navigation.navigate('Home')}
	// 		style={{margin:10,backgroundColor:'orange',padding:10}}>
	// 		<Text style={{color:'#ffffff'}}>Home</Text>
	// 	  </TouchableOpacity>
	// });  
	
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
		
		this.keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => { warn1 = Validate('email', this.state.userEmail); 
					warn2 = Validate('password', this.state.userPassword);
					this.setState({emailWarn: warn1, passWarn: warn2 });
					this.checkRegister()
			}
		);

  }

	componentWillUnmount() {
		this.keyboardDidHideListener.remove();
	}

	checkRegister = () => {
		const {emailWarn, passWarn} = this.state;
		console.log(this.state);
		if (emailWarn || passWarn) {this.setState({stateReg: false})} else {{this.setState({stateReg: true}) }}
	}

	login = () =>{
		
		const {userEmail,userToken,userPassword} = this.state;
		const emailWarn = Validate('email', this.state.userEmail)
		const passWarn = Validate('password', this.state.userPassword)
		
		this.setState({
			emailWarn: emailWarn,
			passWarn: passWarn
		})

		const md5Password = md5(userPassword);
		const upperEmail = userEmail.toUpperCase();
	  
  		if (!emailWarn && !passWarn) {
		
		
			fetch(`${IP}/login.php`,{
				method:'post',
				header:{
					'Accept': 'application/json',
					'Content-type': 'application/json'
				},
				body:JSON.stringify({
					// we will pass our input data to server
					email: upperEmail,
					password: md5Password,
					token: userToken
				})
				
			})
			.then((response) => response.json())
			.then((responseJson)=>{
					if(responseJson == "KO"){
						alert("Dettagli Errati o Errore di Connessione");
					}else{
						alert("Login effettuato con successo");
						const UUID = responseJson.uuid;
						const userName = responseJson.name;
						// alert(UUID+' '+userName);
						onSignIn(this.upperEmail,this.md5Password,UUID,userName);
						// redirect to profile page
						this.props.navigation.navigate("Drawer");
						
					}
			})
			.catch((error)=>{alert(error); throw error;});
			
		}
				
		Keyboard.dismiss();
	}
	
  render() {

	const { navigate } = this.props.navigation;
	return(
	<ImageBackground 
		source={require('../components/images/maid.jpg')}
		style={styles.backgroundImage}>

		<View style={{justifyContent: 'flex-start',	alignItems: 'flex-start'}}>
			<TouchableOpacity
				onPress={() => {this.props.navigation.navigate("Home")}}>
				<Icon style={{ padding: 10 }} name="arrow-left" padding={15} size={25} color={Colors.primary} />
			</TouchableOpacity>
		</View>

		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<StatusBar backgroundColor='#000' translucent={false} barStyle='light-content' />
				
				<TouchableOpacity onPress={this.login}>
					<Text style={styles.pageName}>{this.state.stateReg ? '→Entra←' : 'Entra'}</Text>
				</TouchableOpacity>

				<View style={styles.inputForm}>
						<Icon style={styles.searchIcon} name="envelope" size={20} color={this.state.emailWarn ? Colors.primary : 'transparent'}  />		
						<TextInput
							placeholder="Inserisci Email"
							style={{borderRadius: 25, width:180}}
							onChangeText={userEmail => { userEmail.trim(); this.setState({userEmail})}}
							onBlur={() => { warn = Validate('email', this.state.userEmail); this.setState({emailWarn: warn}); this.checkRegister()}}
						/>
				</View>
				<Text style={{color:Colors.primary, marginBottom: 15}}>{this.state.emailWarn}</Text>
		
				<View style={styles.inputForm}>	
						<Icon style={styles.searchIcon} name="lock" size={20} color={this.state.passWarn ? Colors.primary : 'transparent'} />
						<TextInput
							placeholder="Inserisci Password"
							secureTextEntry={true}
							style={{borderRadius: 25, width:180}}
							onChangeText={userPassword => { userPassword.trim(); this.setState({userPassword})}}
							onBlur={() => { warn = Validate('password', this.state.userPassword); this.setState({passWarn: warn}); this.checkRegister()}}
						/>
				</View>
				<Text style={{color:Colors.primary}}>{this.state.passWarn}</Text>

				<View style={{ height: 40 }}><Text>{}</Text></View>

				 {/* 
				 	SINTASSI DA UTILIZZARE CON FORMIK
				 	<TextInput
						value={values.email}
						onChangeText={handleChange('email')}
						onBlur={() => setFieldTouched('email')}
						placeholder="E-mail"
					/>
					{touched.email && errors.email &&
						<Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
					}
					<TextInput
						value={values.password}
						onChangeText={handleChange('password')}
						placeholder="Password"
						onBlur={() => setFieldTouched('password')}
						secureTextEntry={true}
					/>
					{touched.password && errors.password &&
						<Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
					} */}
				
		    </View>
		</TouchableWithoutFeedback>

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
	pageName:{
		marginBottom: 40,
		color: Colors.primary,
		fontFamily: 'Wildemount Rough',
		fontSize: 80,		
	},
	inputForm: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: 40,
		width:250,
		margin:1,
		borderRadius: 25, 
		backgroundColor: 'rgba(255,255,255,0.4)',
	},

	searchIcon: {
		padding: 10,
		margin: 0,
	},	

});

AppRegistry.registerComponent('login', () => login);
