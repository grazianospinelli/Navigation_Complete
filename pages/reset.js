import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet,
  Text, StatusBar, Keyboard,TouchableWithoutFeedback,
  View,TextInput,TouchableOpacity,
  ImageBackground
} from 'react-native';
import firebase from 'react-native-firebase';
import { Formik } from "formik";
import * as Yup from "yup";
import * as Animatable from 'react-native-animatable';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import IP from '../config/IP';
import * as Colors from '../components/themes/colors';

const myvalidationSchema = Yup.object().shape({	
	userEmail: Yup
		.string()
		.required("↑ Inserire la mail!")
	 	.email('↑ Email non corretta')	
});

export default class reret extends Component {
	
constructor(props){
	super(props)
	// this.state={		
	// 	userEmail:'', 	
	// }
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

	askReset = (values) =>{
		
		const {userEmail} = values;		
		const upperEmail = userEmail.toUpperCase();
	  		
		fetch(`${IP}/ask-reset-mail.php`,{
			method:'post',
			header:{
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body:JSON.stringify({
				// we will pass our input data to server
				email: upperEmail,				
			})
			
		})
		.then((response) => response.json())
		.then((responseJson)=>{
				if(responseJson == "OK"){
					alert("Ti è stata inviata una mail con le istruzioni per resettare la tua password!");
				}
				else{
					alert(responseJson);													
				}
				// redirect to home page		
				this.props.navigation.navigate("Home");
		})
		.catch((error)=>{alert(error); throw error;});
					
		Keyboard.dismiss();
	}

	render() {
			
		return (

			<ImageBackground 
				source={require('../components/images/barman.jpg')}
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
				initialValues={{userEmail:''}}
				// onSubmit={values => alert(JSON.stringify(values))}
				onSubmit={values => this.askReset(values)}
				validationSchema={myvalidationSchema}
			>
			
			{({ values, errors, setFieldValue, touched, setFieldTouched, isValid, handleSubmit }) => (

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
					<StatusBar backgroundColor='#000' translucent={false} barStyle='light-content' />

					<TouchableOpacity onPress={handleSubmit}>
						{ isValid ? 
						(<Animatable.Text animation="rubberBand" iterationCount="infinite" easing="ease-out" style={styles.pageName}>
								{'→Reset←'}
						</Animatable.Text>):
						<Text style={styles.pageName}>{'Reset'}</Text>}
					</TouchableOpacity>
		
					<View style={{height: 25, marginTop: '5%', justifyContent: 'flex-start'}}>
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{'Inserisci la mail con cui ti sei registrato:'}</Text>
					</View>

					<View style={styles.inputForm}>
					<Icon style={styles.searchIcon} name="envelope" size={20} color={errors.userEmail && touched.userEmail ? Colors.primary : Colors.grey1}  />		
					<TextInput
						placeholder="Inserisci la tua Email"
						style={{borderRadius: 25, width:220}}
						onChangeText={text => setFieldValue("userEmail", text.trim())}
						onBlur={() => setFieldTouched("userEmail")}
					/>
					</View>
		
					
					<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userEmail && touched.userEmail ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userEmail}</Text>}
					</View>			
					

					
			</View>
			</TouchableWithoutFeedback>
			)}

			</Formik>

			<View style={{ height: '30%' }}><Text>{}</Text></View>
							
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
		// marginTop: '15%',
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

AppRegistry.registerComponent('reset', () => reset);
