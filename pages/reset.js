import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,Text,StatusBar, TouchableWithoutFeedback,
  View,TouchableOpacity,TextInput,ImageBackground,Keyboard
} from 'react-native';
import firebase from 'react-native-firebase';
import { Formik } from "formik";
import * as Yup from "yup";
import * as Animatable from 'react-native-animatable';
import IP from '../config/IP';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import * as Colors from '../components/themes/colors';

const myvalidationSchema = Yup.object().shape({
	userEmail: Yup
		.string()
		.required("↑ Inserire la mail!")
	  	.email('↑ Email non corretta')
});

export default class Reset extends Component {
	
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
        	// alert(fcmToken);
        	this.setState({userToken: fcmToken});
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
					// redirect to profile page										
				}
				this.props.navigation.navigate("Home");
		})
		.catch((error)=>{alert(error); throw error;});
					
		Keyboard.dismiss();
	}
	
  	render() {
	
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

		<Formik
				initialValues={{userEmail:''}}
				onSubmit={values => this.askReset(values)}
				validationSchema={myvalidationSchema}
		>
		
		{({ values, errors, setFieldValue, touched, setFieldTouched, isValid, handleSubmit }) => (

		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<StatusBar backgroundColor='#000' translucent={false} barStyle='light-content' />
				
				<TouchableOpacity onPress={handleSubmit}>
					{ isValid ? 
					(<Animatable.Text animation="rubberBand" iterationCount="infinite" easing="linear" style={styles.pageName}>
							{'→Reset←'}
					</Animatable.Text>):
					<Text style={styles.pageName}>{'Reset'}</Text>}
				</TouchableOpacity>

				<View style={styles.inputForm}>
					<Icon style={styles.searchIcon} name="envelope" size={20} color={errors.userEmail && touched.userEmail ? Colors.primary : 'transparent'}  />		
					<TextInput
						placeholder="Inserisci Email"
						value={values.userEmail}
						style={{borderRadius: 25, width:180}}
						onChangeText={text => {text.trim(); setFieldValue("userEmail", text)}}
						onBlur={() => setFieldTouched("userEmail")}							
					/>
				</View>
				<View style={{height: 25, justifyContent: 'flex-start'}}>
						{(errors.userEmail && touched.userEmail ) && 
						<Text style={{color:Colors.primary, fontWeight:'bold'}}>{errors.userEmail}</Text>}
				</View>				

				<View style={{ height: 40 }}><Text>{}</Text></View>				 
				
		    </View>
		</TouchableWithoutFeedback>
		)}

		</Formik>

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

AppRegistry.registerComponent('Reset', () => Reset);
