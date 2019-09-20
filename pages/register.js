import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text, StatusBar, Keyboard,TouchableWithoutFeedback,
  View,TextInput,TouchableOpacity,
  ImageBackground
} from 'react-native';
import md5 from 'md5';
import uuidv4 from 'uuid/v4';
import firebase from 'react-native-firebase';
import { Formik } from "formik";
import * as Yup from "yup";
import * as Animatable from 'react-native-animatable';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import IP from '../config/IP';
import * as Colors from '../components/themes/colors';

const myvalidationSchema = Yup.object().shape({
	userName: Yup
		.string()
		.required("↑ Inserire il nome!")
		.min(2,"↑ Nome non valido")
		.max(30,"↑ Nome troppo Lungo"),
	userEmail: Yup
		.string()
		.required("↑ Inserire la mail!")
	  	.email('↑ Email non corretta'),
	userPassword: Yup
		.string()
		.required("↑ Inserire la Password!")
		.min(8,"↑ Password deve essere almeno 8 caratteri")
});

export default class register extends Component {
	
constructor(props){
	super(props)
	this.state={
		userName:'',
		userEmail:'', 
		userPassword:'',		
		userToken:'',			
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
			
	}

	userRegister = (values) =>{				
		const {userName,userEmail,userPassword} = values;
		const userToken = this.state.userToken;
		const md5Password = md5(userPassword);
		const upperEmail = userEmail.toUpperCase();
		const myuuid = uuidv4();
				
		fetch(`${IP}/register.php`, {
			method: 'POST',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				uuid: myuuid,
				name: userName,
				email: upperEmail,
				password: md5Password
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {alert(responseJson);})
		.catch((error) => {alert(error)});

		fetch(`${IP}/RegisterDevice.php`, {
			method: 'POST',
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({
				uuid: myuuid,
				token: userToken,
				email: upperEmail})
			})
		.then((response) => response.json())
		.then((responseData) => {alert(responseData); this.props.navigation.navigate("Home");})
		.catch((err) => {alert(err)});		
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

			<Formik
				initialValues={{userName:'',userEmail:'',userPassword:''}}
				// onSubmit={values => alert(JSON.stringify(values))}
				onSubmit={values => this.userRegister(values)}
				validationSchema={myvalidationSchema}
			>
			
			{({ values, errors, setFieldValue, touched, setFieldTouched, isValid, handleSubmit }) => (

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
					<StatusBar backgroundColor='#000' translucent={false} barStyle='light-content' />

					<TouchableOpacity onPress={handleSubmit}>
						{ isValid ? 
						(<Animatable.Text animation="rubberBand" iterationCount="infinite" easing="ease-out" style={styles.pageName}>
								{'→Registrati←'}
						</Animatable.Text>):
						<Text style={styles.pageName}>{'Registrati'}</Text>}
					</TouchableOpacity>

					<View style={styles.inputForm}>	
					<Icon style={styles.searchIcon} name="user" size={20} color={errors.userName && touched.userName ? Colors.primary : 'transparent'}  />			
					<TextInput
						placeholder="Inserisci il Nome"
						style={{borderRadius: 25, width:220}}	
						underlineColorAndroid="transparent"
						value={values.userName}
						onChangeText={text => setFieldValue("userName", text)}
						onBlur={() => setFieldTouched("userName")}													
					/>
					</View>

					<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userName && touched.userName ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userName}</Text>}
					</View>
					

					<View style={styles.inputForm}>
					<Icon style={styles.searchIcon} name="envelope" size={20} color={errors.userEmail && touched.userEmail ? Colors.primary : 'transparent'}  />		
					<TextInput
						placeholder="Inserisci la tua Email"
						style={{borderRadius: 25, width:220}}
						onChangeText={text => { text.trim(); setFieldValue("userEmail", text)}}
						onBlur={() => setFieldTouched("userEmail")}
					/>
					</View>
		
					
					<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userEmail && touched.userEmail ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userEmail}</Text>}
					</View>
					
					<View style={styles.inputForm}>	
					<Icon style={styles.searchIcon} name="lock" size={20} color={errors.userPassword && touched.userPassword ? Colors.primary : 'transparent'} />
					<TextInput
						placeholder="Inserisci la Password"
						secureTextEntry={true}
						style={{borderRadius: 25, width:220}}
						onChangeText={text => { text.trim(); setFieldValue("userPassword", text)}}
						onBlur={() => setFieldTouched("userPassword") }
					/>
					</View>

					<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userPassword && touched.userPassword ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userPassword}</Text>}
					</View>

					
			</View>
			</TouchableWithoutFeedback>
			)}

			</Formik>

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
		margin: 1,
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
		fontSize: 55,		
	},

	searchIcon: {
		padding: 10,
		// margin: 10,
	},	

  
});

AppRegistry.registerComponent('register', () => register);
